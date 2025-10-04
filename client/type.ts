export interface buttonProps {
    title: String;
    style: String;
    type: String;
    icon: String;
};
export interface homeProps {
    title: String;
    paragraph: String;
    logo: String;
}
export interface contentProps {
    title: String;
    paragraph: String;
    background: string;
    reverse: boolean;
    titleButtonOne: String;
    titleButtonTwo: String;
}
export interface inputSettingProps {
    type: string;
    placeholder: string;
    isActive: boolean;
    text: string;
    setText: (value: string) => void;
}
export interface AuthState {
    isAuth: boolean | null;
    isLoading: boolean;
    user: any;
    error?: string;
    fetchUser: () => Promise<void>;
    logout: () => Promise<void>;
    editUser: (props: EditUserProps) => Promise<void>;
}
export type EditUserProps = {
    userId: string;
    newDisplayName?: string | null;
    newProfilePicture?: File | null;
};
export type AuthContextType = {
    user: any;
    isAuth: null | boolean;
    loading: boolean;
    logout: () => Promise<void>;
    editUser: (data: EditUserProps) => Promise<void>;
};
export interface User {
    displayName?: string;
    email?: string;
    image?: string;
}
export interface MessageType {
    _id: string;
    conversationId?: string | null;
    userId: string;
    role: "user" | "ai";
    content: string;
    createdAt: string;
    updatedAt: string;
    image?: string;
}
export interface ConversationType {
    _id: string;
    userId: string;
    conversation: string;
    createdAt: string;
    updatedAt: string;
}
export interface MessageStore {
    conversationsUser: ConversationType[];
    messagesInConversation: MessageType[];
    isLoadingMessages: boolean;
    isLoadingAi: boolean;
    isLoadingConversations: boolean;
    getConversations: (userId: string) => void;
    deleteConversation: (userId: string, conversationId: string) => void;
    getMessages: (userId: string, conversationId: string) => void;
    sendMessageToAi: (
        userId: string,
        message: string,
        conversationId?: string,
        setConversation?: (id: string) => void
    ) => void;
}
