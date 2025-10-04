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
export interface ConversationType {
    _id: string;
    conversation: string;
}
export interface MessageStore {
    conversationsUser: ConversationType[];
    messagesInConversation: any[];
    isLoadingMessages: boolean;
    isLoadingAi: boolean;
    isLoadingConversations: boolean;
    getConversations: (userId: string) => Promise<void>;
    deleteConversation: (userId: string, conversationId: string) => Promise<void>;
    getMessages: (userId: string, conversationId: string) => Promise<void>;
}