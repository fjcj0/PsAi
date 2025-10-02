"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useMessage } from "../../context/MessageContext";
import { useAuthStore } from "@/store/authStore";
type Message = {
    role: "user" | "ai";
    content: string;
    image: string;
};
const Messages = () => {
    const avatars = ['/logoman.png', '/logowoman.png', '/Morgan.png', '/earthlogo.png'];
    const { message, image, conversation } = useMessage();
    const [messages, setMessages] = useState<Message[] | null>(null);
    const { user } = useAuthStore();
    const msgs: Message[] = [
        { role: "user", content: "What is API?", image: '' },
        { role: "ai", content: "An API (Application Programming Interface) allows different software applications to communicate with each other.", image: '/earthlogo.png' },
        { role: "user", content: "Can you give an example of an API?", image: '/Morgan.png' },
        { role: "ai", content: "Sure! The Google Maps API lets developers integrate maps and location services into their apps.", image: '/logowoman.png' },
        { role: "user", content: "How do I use the Google Maps API?", image: '' },
        { role: "ai", content: "You can use it by signing up for an API key on the Google Cloud Platform and following the documentation to embed maps or request location data.", image: '/earthlogo.png' },
        { role: "user", content: "Can AI generate images too?", image: '/Morgan.png' },
        { role: "ai", content: "Yes! AI models can generate images from text prompts using tools like DALL·E or Stable Diffusion.", image: '/logowoman.png' },
        { role: "user", content: "That's amazing! Can you show me a cat picture?", image: '' },
        { role: "ai", content: "I can't generate images here directly, but I can guide you to AI tools where you can create one.", image: '/earthlogo.png' },
    ];
    useEffect(() => {
        setMessages(msgs);
    }, []);
    return (
        <div className="w-full flex flex-col gap-4 px-4 py-6">
            {messages === null ? (
                <div className="w-full flex flex-col items-center justify-center gap-5 text-center px-4">
                    <h1 className="text-5xl font-bold text-white">
                        Hello {user?.displayName ? user.displayName : 'Jack'} To
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-500/80 to-white">
                            PsAi
                        </span>
                    </h1>
                    <p className="text-sm text-white/70 leading-relaxed max-w-2xl">
                        Ask anything — we’re here to help you. Whether it’s coding, design, or problem-solving,
                        just type your question below and we’ll get started right away.
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-6 w-full">
                    {messages.map((msg, idx) => {
                        const isUser = msg.role === "user";
                        const avatarSrc = isUser ? user?.image ? user?.image : avatars[0] : avatars[3];
                        return (
                            <div
                                key={idx}
                                className={`flex flex-col gap-3 ${isUser ? "items-end" : "items-start"}`}
                            >
                                {msg.image && (
                                    <Image
                                        src={msg.image}
                                        width={150}
                                        height={150}
                                        alt="message image"
                                        className={`rounded-lg mb-2 ${isUser ? "self-end" : "self-start"}`}
                                    />
                                )}
                                <div className={`flex items-start ${isUser ? "flex-row-reverse" : "flex-row"} gap-2`}>
                                    <Image
                                        src={avatarSrc}
                                        width={40}
                                        height={40}
                                        alt={msg.role}
                                        className="rounded-full"
                                    />
                                    <div className={`p-3 rounded-xl ${isUser ? "bg-blue-500 text-white" : "bg-gray-800 text-white"} max-w-xs`}>
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
export default Messages;