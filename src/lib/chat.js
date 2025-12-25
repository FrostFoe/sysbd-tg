import { ID, Query } from "appwrite";
import { databases, client } from "./appwrite";

const DATABASE_ID = "chat_db";
const COLLECTION_CHATS_ID = "chats";
const COLLECTION_MESSAGES_ID = "messages";

// Helper to safely parse JSON
const safeParse = (str) => {
  try {
    return str ? JSON.parse(str) : null;
  } catch (e) {
    return null;
  }
};

// Helper to format documents (JSON parse complex fields)
const formatMessage = (doc) => ({
  ...doc,
  reactions: safeParse(doc.reactions) || [],
  options: safeParse(doc.options) || [],
  gameState: safeParse(doc.gameState),
});

export const chatService = {
  // Get all chats for current user
  getChats: async (userId) => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_CHATS_ID,
        [Query.contains("members", userId), Query.orderDesc("$createdAt")]
      );
      
      const docs = response.documents;
      // Add BotFather and Saved Messages if they don't exist in the list
      if (!docs.find(d => d.$id === 'botfather')) {
         docs.unshift({ $id: 'botfather', name: 'BotFather', type: 'bot', members: [userId], createdAt: new Date().toISOString() });
      }
      if (!docs.find(d => d.$id === 'saved_messages')) {
         docs.unshift({ $id: 'saved_messages', name: 'Saved Messages', type: 'private', members: [userId], createdAt: new Date().toISOString() });
      }

      return docs;
    } catch (error) {
      console.error("Error fetching chats:", error);
      throw error;
    }
  },

  createPrivateChat: async (userId, targetId, name) => {
    return await databases.createDocument(
      DATABASE_ID,
      COLLECTION_CHATS_ID,
      ID.unique(),
      {
        type: "private",
        members: [userId, targetId],
        name: name,
        createdAt: new Date().toISOString()
      }
    );
  },

  updateChat: async (chatId, data) => {
    return await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_CHATS_ID,
      chatId,
      data
    );
  },

  deleteChat: async (chatId) => {
    return await databases.deleteDocument(
      DATABASE_ID,
      COLLECTION_CHATS_ID,
      chatId
    );
  },

  // Get messages for a specific chat
  getMessages: async (chatId) => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_MESSAGES_ID,
        [Query.equal("chatId", chatId), Query.orderAsc("$createdAt"), Query.limit(100)]
      );
      return response.documents.map(formatMessage);
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  },

  // Send a text message
  sendMessage: async (chatId, senderId, text, type = "text", extras = {}) => {
    try {
      const payload = {
        chatId,
        senderId,
        text,
        type,
        createdAt: new Date().toISOString(),
        ...extras
      };

      // Stringify complex objects
      if (payload.reactions) payload.reactions = JSON.stringify(payload.reactions);
      if (payload.options) payload.options = JSON.stringify(payload.options);
      if (payload.gameState) payload.gameState = JSON.stringify(payload.gameState);
      if (payload.expiresAt) payload.expiresAt = String(payload.expiresAt);

      const doc = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_MESSAGES_ID,
        ID.unique(),
        payload
      );
      return formatMessage(doc);
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  // Update a message (for Games, Polls, etc)
  updateMessage: async (messageId, data) => {
    try {
      const payload = { ...data };
      if (payload.reactions) payload.reactions = JSON.stringify(payload.reactions);
      if (payload.options) payload.options = JSON.stringify(payload.options);
      if (payload.gameState) payload.gameState = JSON.stringify(payload.gameState);

      const doc = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_MESSAGES_ID,
        messageId,
        payload
      );
      return formatMessage(doc);
    } catch (error) {
      console.error("Error updating message:", error);
      throw error;
    }
  },

  // Delete a message
  deleteMessage: async (messageId) => {
    try {
      return await databases.deleteDocument(
        DATABASE_ID,
        COLLECTION_MESSAGES_ID,
        messageId
      );
    } catch (error) {
      console.error("Error deleting message:", error);
      throw error;
    }
  },

  // Send a media message (image or video)
  sendMediaMessage: async (chatId, senderId, fileId, fileUrl, type) => {
    try {
      const doc = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_MESSAGES_ID,
        ID.unique(),
        {
          chatId,
          senderId,
          fileId,
          fileUrl,
          type, // "image" or "video"
          createdAt: new Date().toISOString(),
        }
      );
      return formatMessage(doc);
    } catch (error) {
      console.error("Error sending media message:", error);
      throw error;
    }
  },

  // Send a Game message
  sendGameMessage: async (chatId, senderId) => {
    return await chatService.sendMessage(chatId, senderId, "", "game", {
      gameState: {
        board: Array(9).fill(null),
        xIsNext: true,
        winner: null
      }
    });
  },

  // Send a Poll message
  sendPollMessage: async (chatId, senderId, question, options) => {
    return await chatService.sendMessage(chatId, senderId, "", "poll", {
      question,
      options: options.map((text, i) => ({ id: i, text, votes: 0, voted: false }))
    });
  },

  // Subscribe to messages in a chat
  subscribeToMessages: (chatId, callback) => {
    const unsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${COLLECTION_MESSAGES_ID}.documents`,
      (response) => {
        // Only trigger for documents in this specific chat
        if (response.payload.chatId !== chatId) return;

        // Handle Delete and Create/Update events
        if (response.events.includes("databases.*.collections.*.documents.*.delete")) {
           callback({ ...response.payload, $deleted: true });
        } else if (
          response.events.includes("databases.*.collections.*.documents.*.create") || 
          response.events.includes("databases.*.collections.*.documents.*.update")
        ) {
          callback(formatMessage(response.payload));
        }
      }
    );
    return unsubscribe;
  },
};
