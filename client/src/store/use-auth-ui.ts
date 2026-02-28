import { create } from 'zustand';

interface AuthUIState {
  isLoginModalOpen: boolean;
  isAuthLoading: boolean;
  authError: string | null;
  setLoginModalOpen: (isOpen: boolean) => void;
  setAuthLoading: (isLoading: boolean) => void;
  setAuthError: (error: string | null) => void;
  reset: () => void;
}

export const useAuthUI = create<AuthUIState>((set) => ({
  isLoginModalOpen: false,
  isAuthLoading: false,
  authError: null,
  setLoginModalOpen: (isOpen) => set({ isLoginModalOpen: isOpen }),
  setAuthLoading: (isLoading) => set({ isAuthLoading: isLoading }),
  setAuthError: (error) => set({ authError: error }),
  reset: () => set({ isLoginModalOpen: false, isAuthLoading: false, authError: null }),
}));
