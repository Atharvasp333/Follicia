"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AuthModal from "@/components/AuthModal";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import axios from "axios";

interface DbUser {
  id: string;
  email: string;
  name: string | null;
  firebaseUid: string;
  hairType: string | null;
  porosity: string | null;
  scalpCondition: string | null;
  imageUrl: string | null;
}

interface AuthModalContextType {
  openModal: () => void;
  closeModal: () => void;
  isAuthModalOpen: boolean;
  currentUser: User | null;
  dbUser: DbUser | null;
  isLoading: boolean;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const openModal = () => setIsAuthModalOpen(true);
  const closeModal = () => setIsAuthModalOpen(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Sync with Neon DB
        try {
          const res = await axios.post('/api/auth/sync-user', {
            firebaseUid: user.uid,
            email: user.email,
            name: user.displayName,
            imageUrl: user.photoURL,
          });
          if (res.data.success) {
            setDbUser(res.data.user);
          }
        } catch (error) {
          console.error("Failed to sync user with DB", error);
        }
      } else {
        setDbUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthModalContext.Provider value={{ openModal, closeModal, isAuthModalOpen, currentUser, dbUser, isLoading }}>
      {children}
      <AuthModal isOpen={isAuthModalOpen} onClose={closeModal} />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
}
