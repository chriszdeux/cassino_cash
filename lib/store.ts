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
  user: UserData | null;
  setBalance: (balance: number) => void;
  updateBalance: (amount: number) => void;
  setUser: (user: UserData | null) => void;
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
      user: null,
      setBalance: (balance) => set({ balance }),
      updateBalance: (amount) => set((state) => ({ balance: state.balance + amount })),
      setUser: (user) => set({ user }),
    }),
    {
      name: 'casino-storage',
      storage: createJSONStorage(() => secureStorage),
    }
  )
)
