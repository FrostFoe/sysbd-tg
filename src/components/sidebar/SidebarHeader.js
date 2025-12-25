"use client";

import { useUI } from "@/context/UIContext";
import { useAuth } from "@/context/AuthContext";
import { 
  Menu, Search, ArrowLeft, Bookmark, Archive, Users, Settings, Sun, Moon, LogOut 
} from "lucide-react";
import { useState } from "react";

export default function SidebarHeader({ searchQuery, setSearchQuery }) {
  const { 
    darkMode, toggleDarkMode, sidebarView, setSidebarView, setActiveFolder 
  } = useUI();
  const { logout } = useAuth();
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);

  return (
    <header className="p-3 flex flex-col gap-2 shrink-0 relative">
      <div className="flex gap-3 items-center w-full">
        {sidebarView !== 'main' ? (
          <button 
            onClick={() => setSidebarView('main')}
            className="p-2 rounded-full hover:bg-hover transition"
          >
            <ArrowLeft className="w-6 h-6 text-gray-500" />
          </button>
        ) : (
          <button
            onClick={() => setIsMainMenuOpen(!isMainMenuOpen)}
            className={`p-2 rounded-full transition ${isMainMenuOpen ? 'bg-hover text-accent' : 'text-gray-500 hover:bg-hover'}`}
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        <div className={`flex-1 rounded-full flex items-center px-4 py-2 border focus-within:border-accent transition group bg-input border-input`}>
          <Search className="w-5 h-5 text-gray-400 group-focus-within:text-accent" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="bg-transparent border-none outline-none text-sm ml-2 w-full placeholder-gray-500 text-primary"
          />
        </div>
      </div>

      {/* Main Menu Dropdown */}
      {isMainMenuOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsMainMenuOpen(false)} />
          <div className={`absolute top-14 left-4 rounded-xl shadow-xl border w-64 py-2 z-50 animate-in fade-in zoom-in duration-150 origin-top-left flex flex-col bg-surface border-default`}>
            <button 
              onClick={() => { setSidebarView('main'); setActiveFolder('Saved'); setIsMainMenuOpen(false); }}
              className="flex items-center gap-4 px-4 py-2.5 transition hover:bg-hover"
            >
              <Bookmark className="w-5 h-5 text-gray-500" /> Saved Messages
            </button>
            <button 
              onClick={() => { setSidebarView('archived'); setIsMainMenuOpen(false); }}
              className="flex items-center gap-4 px-4 py-2.5 transition hover:bg-hover"
            >
              <Archive className="w-5 h-5 text-gray-500" /> Archived Chats
            </button>
            <button 
              onClick={() => { setSidebarView('contacts'); setIsMainMenuOpen(false); }}
              className="flex items-center gap-4 px-4 py-2.5 transition hover:bg-hover"
            >
              <Users className="w-5 h-5 text-gray-500" /> Contacts
            </button>
            <button 
              onClick={() => { setSidebarView('settings'); setIsMainMenuOpen(false); }}
              className="flex items-center gap-4 px-4 py-2.5 transition hover:bg-hover"
            >
              <Settings className="w-5 h-5 text-gray-500" /> Settings
            </button>
            <button 
              onClick={toggleDarkMode}
              className="flex items-center gap-4 px-4 py-2.5 transition hover:bg-hover"
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-500" />}
              {darkMode ? "Light Mode" : "Night Mode"}
            </button>
            <div className="h-px bg-border-default my-1" />
            <button 
              onClick={logout}
              className={`flex items-center gap-4 px-4 py-2.5 transition text-red-500 hover:bg-hover`}
            >
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
        </>
      )}
    </header>
  );
}
