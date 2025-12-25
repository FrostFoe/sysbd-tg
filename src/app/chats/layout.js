"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUI } from "@/context/UIContext";
import { chatService } from "@/lib/chat";
import { useRouter, useParams } from "next/navigation";
import { Archive, Plus, Trash2, VolumeX, Edit2 } from "lucide-react";

import SidebarHeader from "@/components/sidebar/SidebarHeader";
import StoriesBar from "@/components/sidebar/StoriesBar";
import FoldersBar from "@/components/sidebar/FoldersBar";
import ChatList from "@/components/sidebar/ChatList";
import ContactsView from "@/components/sidebar/ContactsView";
import SettingsView from "@/components/sidebar/SettingsView";

export default function ChatsLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const { 
    accentColor, activeFolder, folders, sidebarView, setSidebarView 
  } = useUI();
  
  const { chatId: activeChatId } = useParams();
  const [chats, setChats] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);
  const [chatContextMenu, setChatContextMenu] = useState({ visible: false, x: 0, y: 0, chatId: null });
  const router = useRouter();

  const loadChats = useCallback(async () => {
    if (!user) return;
    try {
      const data = await chatService.getChats(user.$id);
      setChats(data);
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  }, [user]);

  // Global Search Logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 2 && user) {
        setIsSearching(true);
        const { authService } = await import("@/lib/auth");
        const results = await authService.searchUsers(searchQuery);
        // Filter out current user and existing chats
        setSearchResults(results.filter(r => r.userId !== user.$id));
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, user?.$id]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      loadChats();
    }
  }, [user, loading, router, loadChats]);

  const filteredChats = useMemo(() => {
    let list = chats;
    if (sidebarView === 'archived') {
       list = list.filter(c => c.isArchived);
    } else {
       list = list.filter(c => !c.isArchived);
    }
    const currentFolder = folders.find(f => f.id === activeFolder);
    if (currentFolder) {
      if (currentFolder.type === 'private') list = list.filter(c => c.members?.length === 2);
      if (currentFolder.type === 'group') list = list.filter(c => c.members?.length > 2);
    }
    if (searchQuery) {
      list = list.filter(c => c.name?.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return list;
  }, [chats, activeFolder, folders, searchQuery, sidebarView]);

  const handleStartChat = async (targetUserId, name) => {
     try {
        const existing = chats.find(c => c.members.includes(targetUserId));
        if (existing) router.push(`/chats/${existing.$id}`);
        else {
           const newChat = await chatService.createPrivateChat(user?.$id, targetUserId, name);
           setChats(p => [newChat, ...p]);
           router.push(`/chats/${newChat.$id}`);
        }
        setSidebarView('main');
     } catch (e) { console.error(e); }
  };

  const handleChatContextMenu = (e, chatId) => {
    e.preventDefault();
    setChatContextMenu({ visible: true, x: e.clientX, y: e.clientY, chatId });
  };

  const handleChatAction = async (action) => {
    const id = chatContextMenu.chatId;
    if (!id || id === 'botfather' || id === 'saved_messages') {
       setChatContextMenu({ ...chatContextMenu, visible: false });
       return;
    }
    
    try {
      if (action === 'archive') await chatService.updateChat(id, { isArchived: true });
      if (action === 'unarchive') await chatService.updateChat(id, { isArchived: false });
      if (action === 'delete') {
         await chatService.deleteChat(id);
         setChats(p => p.filter(c => c.$id !== id));
         if (activeChatId === id) router.push('/chats');
      }
      loadChats();
    } catch (e) { console.error(e); }
    setChatContextMenu({ ...chatContextMenu, visible: false });
  };

  useEffect(() => {
    const h = () => setChatContextMenu(p => ({ ...p, visible: false }));
    window.addEventListener('click', h);
    return () => window.removeEventListener('click', h);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-[#0f0f0f]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden dark:bg-[#0f0f0f] dark:text-white" style={{ "--accent-color": accentColor }}>
      {/* Sidebar */}
      <div className={`w-full md:w-[380px] lg:w-[420px] h-full flex flex-col z-20 border-r bg-white dark:bg-[#212121] border-gray-200 dark:border-black ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
        <SidebarHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {sidebarView === 'main' && (
          <div className="px-3 pb-2 shrink-0">
            <StoriesBar />
            <FoldersBar />
          </div>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-[#212121]">
          {searchQuery.length >= 2 && (
            <div className="flex flex-col border-b border-gray-100 dark:border-gray-800">
              <div className="px-4 py-2 text-xs font-bold text-accent uppercase bg-gray-50 dark:bg-[#1c1c1d]">Global Search Results</div>
              {isSearching ? (
                <div className="p-4 text-center text-gray-400 text-xs">Searching for users...</div>
              ) : searchResults.length === 0 ? (
                <div className="p-4 text-center text-gray-400 text-xs">No users found matching "@{searchQuery}"</div>
              ) : (
                searchResults.map((result) => (
                  <button 
                    key={result.$id} 
                    onClick={() => handleStartChat(result.userId, result.username)}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-[#2c2c2e] transition w-full"
                  >
                    <div className="shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-500">
                        {result.username?.[0]?.toUpperCase()}
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-sm dark:text-white">@{result.username}</div>
                      <div className="text-xs text-gray-500">Click to start chat</div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          {sidebarView === 'main' || sidebarView === 'archived' ? (
            <ChatList chats={filteredChats} fetching={fetching} onContextMenu={handleChatContextMenu} />
          ) : sidebarView === 'contacts' ? (
            <ContactsView onStartChat={handleStartChat} />
          ) : sidebarView === 'settings' ? (
            <SettingsView />
          ) : null}
        </div>

        {sidebarView === 'main' && (
          <button className="absolute bottom-6 right-6 w-14 h-14 bg-accent text-white rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition z-10">
            <Edit2 className="w-6 h-6" />
          </button>
        )}

        {chatContextMenu.visible && (
          <div className="fixed z-[100] w-48 bg-white dark:bg-[#212121] rounded-xl shadow-xl border border-gray-100 dark:border-black py-2 animate-in fade-in scale-in duration-100 origin-top-left" style={{ top: chatContextMenu.y, left: chatContextMenu.x }}>
            <button onClick={() => handleChatAction(sidebarView === 'archived' ? 'unarchive' : 'archive')} className="flex items-center gap-4 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left text-sm dark:text-white">
              {sidebarView === 'archived' ? <Plus size={16}/> : <Archive size={16}/>} 
              {sidebarView === 'archived' ? 'Unarchive' : 'Archive'}
            </button>
            <button onClick={() => handleChatAction('mute')} className="flex items-center gap-4 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left text-sm dark:text-white"><VolumeX size={16}/> Mute</button>
            <button onClick={() => handleChatAction('delete')} className="flex items-center gap-4 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left text-sm text-red-500"><Trash2 size={16}/> Delete Chat</button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col relative bg-[#0e1621] ${!activeChatId ? 'hidden md:flex' : 'flex'}`}>
        {children}
      </div>
    </div>
  );
}
