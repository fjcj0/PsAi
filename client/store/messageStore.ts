import { create } from "zustand";
import axios from "axios";
import { MessageStore, MessageType } from "@/type";
import { socket } from "@/utils/socket";
axios.defaults.withCredentials = true;
const API_URL = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/message`;
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
                conversationsUser: state.conversationsUser.filter((conv) => conv._id !== conversationId),
            }));
        } catch (error) {
            console.log("Failed to delete conversation:", error);
        } finally {
            set({ isLoadingConversations: false });
        }
    },
    getMessages: async (userId: string, conversationId: string) => {
        set({ isLoadingMessages: true });
        try {
            const res = await axios.get(`${API_URL}/get-messages/${userId}/${conversationId}`);
            set({ messagesInConversation: res.data?.messages || [] });
        } catch (error) {
            console.log("Failed to fetch messages:", error);
            set({ messagesInConversation: [] });
        } finally {
            set({ isLoadingMessages: false });
        }
    },
    sendMessageToAi: (userId, message, conversationId?, setConversation?, imageBase64?) => {
        if (!userId || (!message?.trim() && !imageBase64)) return;
        const tempId = `temp-${Date.now()}`;
        const userMessage: MessageType = {
            _id: tempId,
            conversationId: conversationId || null,
            userId,
            role: "user",
            content: message || "",
            imageUrl: imageBase64 || null,
        };
        set((state) => ({
            messagesInConversation: [...state.messagesInConversation, userMessage],
            isLoadingAi: true,
        }));
        socket.off("receiveMessage");
        socket.off("errorMessage");
        socket.on("receiveMessage", (data) => {
            const { message: msg, conversation } = data;

            if (conversation) {
                set((state) => ({
                    conversationsUser: [conversation, ...state.conversationsUser],
                    messagesInConversation: state.messagesInConversation.map((m) =>
                        m._id === tempId
                            ? { ...m, _id: msg._id, conversationId: conversation._id }
                            : m
                    ),
                }));
                if (setConversation) setConversation(conversation._id);
            }
            if (msg.role === "ai") {
                set((state) => ({
                    messagesInConversation: [...state.messagesInConversation, msg],
                    isLoadingAi: false,
                }));
            }
        });
        socket.on("errorMessage", (err) => {
            console.log("AI Error:", err);
            set({ isLoadingAi: false });
        });

        socket.emit("sendMessageToAi", { userId, message, conversation: conversationId, imageBase64 });
    },
}));