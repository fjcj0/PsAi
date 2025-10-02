import React, { createContext, useState, useContext, ReactNode } from 'react';

interface MessageContextType {
    message: string;
    image: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    setImage: React.Dispatch<React.SetStateAction<string>>;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

interface MessageProviderProps {
    children: ReactNode;
}

export const MessageProvider: React.FC<MessageProviderProps> = ({ children }) => {
    const [message, setMessage] = useState<string>('');
    const [image, setImage] = useState<string>('');

    return (
        <MessageContext.Provider value={{ message, setMessage, image, setImage }}>
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