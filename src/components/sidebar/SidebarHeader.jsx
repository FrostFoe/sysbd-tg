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
            <ArrowLeft className="w-6 h-6 text-muted hover:text-primary" />
          </button>
        ) : (
          <button
            onClick={() => setIsMainMenuOpen(!isMainMenuOpen)}
            className={`p-2 rounded-full transition ${isMainMenuOpen ? 'bg-hover text-accent' : 'text-muted hover:bg-hover hover:text-primary'}`}
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        <div className={`flex-1 rounded-full flex items-center px-4 py-2 border focus-within:border-accent transition group bg-input border-input`}>
          <Search className="w-5 h-5 text-muted group-focus-within:text-accent" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="bg-transparent border-none outline-none text-sm ml-2 w-full placeholder-muted text-primary"
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
              className="flex items-center gap-4 px-4 py-2.5 transition hover:bg-hover text-primary"
            >
              <Bookmark className="w-5 h-5 text-muted" /> Saved Messages
            </button>
            <button 
              onClick={() => { setSidebarView('archived'); setIsMainMenuOpen(false); }}
              className="flex items-center gap-4 px-4 py-2.5 transition hover:bg-hover text-primary"
            >
              <Archive className="w-5 h-5 text-muted" /> Archived Chats
            </button>
            <button 
              onClick={() => { setSidebarView('contacts'); setIsMainMenuOpen(false); }}
              className="flex items-center gap-4 px-4 py-2.5 transition hover:bg-hover text-primary"
            >
              <Users className="w-5 h-5 text-muted" /> Contacts
            </button>
            <button 
              onClick={() => { setSidebarView('settings'); setIsMainMenuOpen(false); }}
              className="flex items-center gap-4 px-4 py-2.5 transition hover:bg-hover text-primary"
            >
              <Settings className="w-5 h-5 text-muted" /> Settings
            </button>
            <button 
              onClick={toggleDarkMode}
              className="flex items-center gap-4 px-4 py-2.5 transition hover:bg-hover text-primary"
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-muted" />}
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
