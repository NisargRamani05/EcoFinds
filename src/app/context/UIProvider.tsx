'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context data
interface UIContextType {
  isLoginModalOpen: boolean;
  isSignUpModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openSignUpModal: () => void;
  closeSignUpModal: () => void;
}

// Create the context with a default value
const UIContext = createContext<UIContextType | undefined>(undefined);

// Create the provider component
export function UIProvider({ children }: { children: ReactNode }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  // When opening one modal, ensure the other is closed.
  const openLoginModal = () => {
    setIsSignUpModalOpen(false);
    setIsLoginModalOpen(true);
  };
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const openSignUpModal = () => {
    setIsLoginModalOpen(false);
    setIsSignUpModalOpen(true);
  };
  const closeSignUpModal = () => setIsSignUpModalOpen(false);

  return (
    <UIContext.Provider value={{
      isLoginModalOpen,
      isSignUpModalOpen,
      openLoginModal,
      closeLoginModal,
      openSignUpModal,
      closeSignUpModal
    }}>
      {children}
    </UIContext.Provider>
  );
}

// Create a custom hook for easy access to the context
export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}