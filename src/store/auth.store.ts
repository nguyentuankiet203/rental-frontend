import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

interface AuthState {
  user: any;
  token: string | null;
  setAuth: (user: any, token: string) => void;
  loadUser: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  setAuth: (user, token) => {
    localStorage.setItem("token", token);
    set({ user, token });
  },

  loadUser: () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded: any = jwtDecode(token);
    set({ user: decoded, token });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },

}));