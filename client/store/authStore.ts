import { create } from "zustand";
import axios from "axios";

axios.defaults.withCredentials = true;

const API_URL = "/api/auth";

interface AuthState {
    isAuth: boolean | null;
    isLoading: boolean;
    user: any;
    fetchUser: () => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuth: null,
    isLoading: false,
    user: null,

    fetchUser: async () => {
        set({ isLoading: true });
        try {
            const res = await axios.get(`${API_URL}/success`, { withCredentials: true });
            if (res.data?.user) {
                set({ user: res.data.user, isAuth: true });
            } else {
                set({ user: null, isAuth: false });
            }
        } catch (error) {
            set({ user: null, isAuth: false });
        } finally {
            set({ isLoading: false });
        }
    },

    logout: async () => {
        try {
            await axios.get(`${API_URL}/logout`, { withCredentials: true });
            set({ user: null, isAuth: false });
        } catch (error) {
            console.error(error);
        }
    },
}));
