import { create } from "zustand";
import axios from "axios";
import { MessageStore } from "@/type";
axios.defaults.withCredentials = true;
const API_URL = "/api/message";
export const useMessageStore = create<MessageStore>((set) => ({
    conversationsUser: [],
    messagesInConversation: [],
    isLoadingMessages: false,
    isLoadingAi: false,
    isLoadingConversations: false,
    getConversations: async (userId: string) => {
        set({ isLoadingConversations: true });
        try {
            const res = await axios.get(`${API_URL}/conversations?userId=${userId}`, { withCredentials: true });
            set({ conversationsUser: res.data?.conversations || [] });
        } catch (error) {
            console.error("Failed to fetch conversations:", error);
            set({ conversationsUser: [] });
        } finally {
            set({ isLoadingConversations: false });
        }
    },
    deleteConversation: async (userId: string, conversationId: string) => {
        set({ isLoadingConversations: true });
        try {
            await axios.delete(`${API_URL}/delete-conversation/${userId}/${conversationId}`, { withCredentials: true });
        } catch (error) {
            console.error("Failed to delete conversation:", error);
        } finally {
            set({ isLoadingConversations: false });
        }
    },
    getMessages: async (userId: string, conversation: string) => {
        try {

        } catch (error) {


        }
    },
    sendMessage: async (userId: string, message: string, conversation: string | null, image: File | null) => {
        try {

        } catch (error) {


        }
    },
}));