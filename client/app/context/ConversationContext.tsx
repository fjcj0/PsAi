import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ConversationContentType {
    conversation: string | null;
    setConversation: React.Dispatch<React.SetStateAction<string | null>>;
}

const ConversationContext = createContext<ConversationContentType | undefined>(undefined);

interface ConversationProviderProps {
    children: ReactNode;
}

export const MessageProvider: React.FC<ConversationProviderProps> = ({ children }) => {
    const [conversation, setConversation] = useState<string | null>('');

    return (
        <ConversationContext.Provider value={{ conversation, setConversation }}>
            {children}
        </ConversationContext.Provider>
    );
};

export const useConversation = (): ConversationContentType => {
    const context = useContext(ConversationContext);
    if (!context) {
        throw new Error('useMessage must be used within a MessageProvider');
    }
    return context;
};