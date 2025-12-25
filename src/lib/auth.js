import { ID, Query } from "appwrite";
import { account, databases } from "./appwrite";

const DATABASE_ID = "chat_db";
const COLLECTION_PROFILES_ID = "profiles";

export const authService = {
  // Signup: Create account + Create profile document
  signup: async (email, password, username) => {
    try {
      console.log("Starting signup for:", email);
      // 1. Create Appwrite Account
      const userAccount = await account.create(ID.unique(), email, password, username);
      console.log("Account created:", userAccount.$id);
      
      // 2. Create Session (Login immediately)
      await account.createEmailPasswordSession(email, password);
      console.log("Session created");

      // 3. Create Profile in Database
      try {
        await databases.createDocument(
          DATABASE_ID,
          COLLECTION_PROFILES_ID,
          userAccount.$id,
          {
            userId: userAccount.$id,
            username: username,
            createdAt: new Date().toISOString(),
          }
        );
        console.log("Profile document created");
      } catch (dbError) {
        console.error("Failed to create profile document:", dbError);
        // We don't throw here so the user can still be "logged in", 
        // but we should ideally handle this in the UI
      }

      return userAccount;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  },

  // Login
  login: async (email, password) => {
    try {
      return await account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      return await account.deleteSession("current");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  },

  // Get current user + profile data
  getCurrentUser: async () => {
    try {
      const user = await account.get();
      if (user) {
        try {
          // Fetch profile details
          const profile = await databases.getDocument(
            DATABASE_ID,
            COLLECTION_PROFILES_ID,
            user.$id
          );
          return { ...user, ...profile };
        } catch (profileError) {
          console.warn("User has no profile document yet:", profileError.message);
          // Return user even without profile to avoid redirect loops
          return { ...user, username: user.name || "User" };
        }
      }
      return null;
        } catch (error) {
          return null;
        }
      },
    
      // Search for users by username
      searchUsers: async (searchTerm) => {
        try {
          const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_PROFILES_ID,
            [Query.contains("username", searchTerm), Query.limit(10)]
          );
          return response.documents;
        } catch (error) {
          console.error("User search failed", error);
          return [];
        }
      },
    };
    