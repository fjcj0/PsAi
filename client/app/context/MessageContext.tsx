import React, { createContext, useState, useContext, ReactNode } from 'react';

interface MessageContextType {
    message: string;
    image: string | null;
    conversation: string | null;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    setImage: React.Dispatch<React.SetStateAction<string | null>>; // fix here
    setConversation: React.Dispatch<React.SetStateAction<string | null>>;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

interface MessageProviderProps {
    children: ReactNode;
}

export const MessageProvider: React.FC<MessageProviderProps> = ({ children }) => {
    const [message, setMessage] = useState<string>('');
    const [image, setImage] = useState<string | null>(null); // fix here
    const [conversation, setConversation] = useState<string | null>(null);

    return (
        <MessageContext.Provider
            value={{ message, setMessage, image, setImage, conversation, setConversation }}
        >
            {children}
        </MessageContext.Provider>
    );
};

export const useMessage = (): MessageContextType => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error('useMessage must be used within a MessageProvider');
    }
    return context;
};
