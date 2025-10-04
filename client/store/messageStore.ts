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
            const res = await axios.get(`${API_URL}/conversations?userId=${userId}`);
            set({ conversationsUser: res.data?.conversations || [] });
        } catch (error) {
            console.log("Failed to fetch conversations:", error);
            set({ conversationsUser: [] });
        } finally {
            set({ isLoadingConversations: false });
        }
    },
    deleteConversation: async (userId: string, conversationId: string) => {
        set({ isLoadingConversations: true });
        try {
            await axios.delete(`${API_URL}/delete-conversation/${userId}/${conversationId}`);
            set((state) => ({
                conversationsUser: state.conversationsUser.filter(
                    (conv) => conv._id !== conversationId
                ),
            }));
        } catch (error) {
            console.error("Failed to delete conversation:", error);
        } finally {
            set({ isLoadingConversations: false });
        }
    },
    getMessages: async (userId: string, conversationId: string) => {
        set({ isLoadingMessages: true });
        try {
            const res = await axios.get(`${API_URL}/get-messages/${userId}/${conversationId}`);
            console.log("Messages response:", res.data);
            set({ messagesInConversation: res.data?.messages || [] });
        } catch (error) {
            console.log("Failed to fetch messages:", error);
            set({ messagesInConversation: [] });
        } finally {
            set({ isLoadingMessages: false });
        }
    },
    sendMessage: async (userId: string, message: string, conversation: string | null, image: File | null) => {
        try {

        } catch (error) {
            console.log("Failed to send message:", error);
        }
    },
}));
