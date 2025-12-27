"use client";

import { createContext, useContext, useState, useEffect } from "react";

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [accentColor, setAccentColor] = useState("#3390ec");
  const [activeFolder, setActiveFolder] = useState("All");
  const [sidebarView, setSidebarView] = useState("main"); // main, contacts, settings, archived
  const [viewingStory, setViewingStory] = useState(null);
  const [activeCall, setActiveCall] = useState(null); // { type: 'audio' | 'video', user: {} }
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isDrawingOpen, setIsDrawingOpen] = useState(false);
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);
  const [unlockedFolders, setUnlockedFolders] = useState([]);
  const [lockModalOpen, setLockModalOpen] = useState(false);
  const [targetFolder, setTargetFolder] = useState(null);
  const [forwardState, setForwardState] = useState({ isOpen: false, messageId: null, messageText: "" });
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);

  const [folders, setFolders] = useState([
    { id: "All", name: "All", type: "all", locked: false },
    { id: "Personal", name: "Personal", type: "private", locked: true },
    { id: "Work", name: "Work", type: "group", locked: false },
  ]);

  // Persistence
  useEffect(() => {
    const savedDark = localStorage.getItem("darkMode") === "true";
    const savedAccent = localStorage.getItem("accentColor") || "#3390ec";
    setDarkMode(savedDark);
    setAccentColor(savedAccent);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      localStorage.setItem("darkMode", !prev);
      return !prev;
    });
  };

  const updateAccentColor = (color) => {
    setAccentColor(color);
    localStorage.setItem("accentColor", color);
  };

  return (
    <UIContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        accentColor,
        updateAccentColor,
        activeFolder,
        setActiveFolder,
        sidebarView,
        setSidebarView,
        viewingStory,
        setViewingStory,
        activeCall,
        setActiveCall,
        isQRModalOpen,
        setIsQRModalOpen,
        isDrawingOpen,
        setIsDrawingOpen,
        isPollModalOpen,
        setIsPollModalOpen,
        folders,
        setFolders,
        unlockedFolders,
        setUnlockedFolders,
        lockModalOpen,
        setLockModalOpen,
        targetFolder,
        setTargetFolder,
        forwardState,
        setForwardState,
        isNewFolderModalOpen,
        setIsNewFolderModalOpen,
      }}
    >
      <div className={darkMode ? "dark" : ""}>{children}</div>
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);
