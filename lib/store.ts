import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import CryptoJS from 'crypto-js'

const SECRET_KEY = "neon-casino-secret-key-v1"

interface UserData {
  id: string;
  username: string;
  email: string;
}

interface CasinoState {
  balance: number;
  savedBalance: number;
  user: UserData | null;
  volume: number;
  isMuted: boolean;
  setBalance: (balance: number) => void;
  setSavedBalance: (balance: number) => void;
  updateBalance: (amount: number) => void;
  setUser: (user: UserData | null) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
}

const secureStorage = {
  getItem: (name: string) => {
    const str = localStorage.getItem(name);
    if (!str) return null;
    try {
      const bytes = CryptoJS.AES.decrypt(str, SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted || null;
    } catch (e) {
      console.error("Local storage decrypt failed", e);
      return null;
    }
  },
  setItem: (name: string, value: string) => {
    const encrypted = CryptoJS.AES.encrypt(value, SECRET_KEY).toString();
    localStorage.setItem(name, encrypted);
  },
  removeItem: (name: string) => localStorage.removeItem(name),
}

export const useCasinoStore = create<CasinoState>()(
  persist(
    (set) => ({
      balance: 0,
      savedBalance: 0,
      user: null,
      volume: 0.5,
      isMuted: false,
      setBalance: (balance) => set({ balance }),
      setSavedBalance: (balance) => set({ savedBalance: balance }),
      updateBalance: (amount) => set((state) => ({ balance: state.balance + amount })),
      setUser: (user) => set({ user }),
      setVolume: (volume) => set({ volume }),
      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
    }),
    {
      name: 'casino-storage',
      storage: createJSONStorage(() => secureStorage),
    }
  )
)
