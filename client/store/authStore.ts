import { create } from "zustand";
import axios, { AxiosError } from "axios";
import { AuthState, EditUserProps } from "@/type";
axios.defaults.withCredentials = true;
const API_URL = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth`;
export const useAuthStore = create<AuthState>((set) => ({
    isAuth: null,
    isLoading: false,
    user: null,
    error: undefined,
    fetchUser: async () => {
        set({ isLoading: true });
        try {
            const res = await axios.get(`${API_URL}/success`, { withCredentials: true });
            if (res.data?.user) {
                set({ user: res.data.user, isAuth: true });
            } else {
                set({ user: null, isAuth: false });
            }
        } catch (err) {
            const error = err as AxiosError;
            if (error.response?.status === 401) {
                console.log("Session expired, clearing frontend state");
                set({ user: null, isAuth: false });
            } else {
                console.log(error.message);
                set({ error: error.message });
            }
        } finally {
            set({ isLoading: false });
        }
    },
    logout: async () => {
        try {
            await axios.get(`${API_URL}/logout`, { withCredentials: true });
            set({ user: null, isAuth: false });
        } catch (err) {
            const error = err as AxiosError;
            console.log("Logout error:", error.message);
            set({ user: null, isAuth: false });
        }
    },
    editUser: async ({ userId, newDisplayName, newProfilePicture }: EditUserProps) => {
        set({ isLoading: true, error: undefined });
        try {
            const formData = new FormData();
            formData.append("userId", userId);
            if (newDisplayName) formData.append("newDisplayName", newDisplayName);
            if (newProfilePicture) formData.append("newProfilePicture", newProfilePicture);
            const response = await axios.post(`${API_URL}/edit-user`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
            set({ user: response.data.user, isLoading: false });
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            const message = error.response?.data?.message || error.message;
            set({ error: message, isLoading: false });
            console.log("Edit user error:", message);
            throw new Error(message);
        }
    },
}));