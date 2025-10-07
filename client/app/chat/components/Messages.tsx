"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useMessage } from "../../context/MessageContext";
import { useAuthStore } from "@/store/authStore";
import { useMessageStore } from "@/store/messageStore";
import Loading from "@/app/animations/Loading";
type Message = {
    role: "user" | "ai";
    content: string;
    image?: string;
    imageUrl?: string | null;
};
const formatContent = (content: string) => {
    if (!content) return null;
    let cleanedText = content.replace(/(\*\*|`)/g, '');
    cleanedText = cleanedText.replace(/(^|\n)(cpp|```cpp)/g, '$1<br />$2');
    cleanedText = cleanedText.replace(/}/g, '<br>}');
    const lines = cleanedText.split(/\n/);
    const highlightComments = (text: string) => {
        return text
            .replace(/(\/\/.*)/g, '<span style="color: green;">$1</span><br />')
            .replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color: green;">$1</span><br />');
    };
    return lines.map((line, idx) => {
        const trimmed = line.trim();
        const isNumberedList = /^\d+\.\s/.test(trimmed);
        const isCode = /^cpp/.test(trimmed);
        if (isNumberedList) {
            return (
                <div key={idx} style={{ marginBottom: '1em' }}>
                    <span dangerouslySetInnerHTML={{ __html: highlightComments(trimmed) }} />
                </div>
            );
        }
        if (isCode) {
            return (
                <pre
                    key={idx}
                    style={{
                        background: '#1e1e1e',
                        color: '#fff',
                        padding: '10px',
                        borderRadius: '8px',
                        overflowX: 'auto',
                    }}
                >
                    <span dangerouslySetInnerHTML={{ __html: highlightComments(trimmed) }} />
                </pre>
            );
        }
        return (
            <span key={idx}>
                <span dangerouslySetInnerHTML={{ __html: highlightComments(trimmed) }} />
                <br />
            </span>
        );
    });
};
const Messages = () => {
    const avatars = ["/logoman.png", "/logowoman.png", "/Morgan.png", "/earthlogo.png"];
    const { conversation } = useMessage();
    const [messages, setMessages] = useState<Message[]>([]);
    const { user } = useAuthStore();
    const { getMessages, messagesInConversation, isLoadingMessages, isLoadingAi } = useMessageStore();
    const [loadingMain, setLoadingMain] = useState(false);
    useEffect(() => {
        setLoadingMain(true);
        const timer = setTimeout(() => setLoadingMain(false), 3000);
        return () => clearTimeout(timer);
    }, []);
    useEffect(() => {
        if (conversation && user?._id) getMessages(user._id, conversation);
        else setMessages([]);
    }, [conversation, user?._id, getMessages]);

    useEffect(() => setMessages(messagesInConversation), [messagesInConversation]);
    if (!conversation) {
        return loadingMain ? (
            <div className="flex justify-center items-center h-full"><Loading /></div>
        ) : (
            <div className="w-full flex flex-col items-center justify-center gap-5 text-center px-4 py-6">
                <h1 className="text-5xl font-bold text-white">
                    Hello {user?.displayName || "Jack"} To{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-500/80 to-white">PsAi</span>
                </h1>
                <p className="text-sm text-white/70 leading-relaxed max-w-2xl">
                    Ask anything — we’re here to help you. Whether it’s coding, design, or problem-solving, just type your question below.
                </p>
                <div className="grid lg:grid-cols-4 grid-cols-2 gap-10">
                    {avatars.map((avatar, index) => (
                        <Image
                            key={index}
                            src={avatar}
                            alt="avatar"
                            width={250}
                            height={250}
                            className="rounded-xl border-[0.5px] border-white hover:scale-110 duration-300"
                        />
                    ))}
                </div>
            </div>
        );
    }
    return (
        <div className="w-full h-screen flex flex-col gap-4 px-4 py-6 scrollbar-hide overflow-y-auto">
            {isLoadingMessages ? (
                <div className="flex justify-center py-10"><Loading /></div>
            ) : messages.length === 0 ? (
                <p className="text-white/50 text-sm text-center">No messages yet. Start the conversation!</p>
            ) : (
                <div className="flex flex-col gap-6 w-full">
                    {messages.map((msg, idx) => {
                        const isUser = msg.role === "user";
                        const avatarSrc = isUser ? user?.image || avatars[0] : avatars[3];
                        const msgImage = msg.image || msg.imageUrl;
                        return (
                            <div key={idx} className={`flex flex-col gap-3 ${isUser ? "items-end" : "items-start"}`}>
                                {msgImage && msgImage !== "false" && msgImage !== "" && (
                                    <Image
                                        src={msgImage}
                                        width={150}
                                        height={150}
                                        alt="message image"
                                        className={`rounded-lg mb-2 ${isUser ? "self-end" : "self-start"}`}
                                        unoptimized
                                    />
                                )}
                                {msg.content && (
                                    <div className={`flex items-start ${isUser ? "flex-row-reverse" : "flex-row"} gap-2`}>
                                        <Image src={avatarSrc} width={40} height={40} alt={msg.role} className="rounded-full" />
                                        <div className={`p-3 rounded-xl ${isUser ? "bg-blue-500 text-white lg:w-[50%] w-[100%]" : "bg-gray-800 text-white lg:w-[50%] w-[100%]"}`}>
                                            {formatContent(msg?.content)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    {isLoadingAi && (
                        <div className="flex flex-col items-start mt-2">
                            <div className="flex flex-row gap-2 items-center">
                                <Image src={avatars[3]} width={40} height={40} alt="ai" className="rounded-full" />
                                <Loading />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
export default Messages;