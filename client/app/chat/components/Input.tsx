"use client";
import React, { useState } from "react";
import { Image as ImageIcon, Send, X as XIcon } from "lucide-react";
import { useMessage } from "../../context/MessageContext";
import Image from "next/image";
import { useMessageStore } from "@/store/messageStore";
import { useAuth } from "@/app/context/UserContext";
import Loading from "@/app/animations/Loading";

const Input = () => {
    const { user } = useAuth();
    const { message, setMessage, conversation, setConversation } = useMessage();
    const { sendMessageToAi, isLoadingAi } = useMessageStore();
    const [preview, setPreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => setPreview(null);

    const onSendMessage = () => {
        if (!user || (!message.trim() && !preview)) return;
        sendMessageToAi(user._id, message, conversation ?? undefined, setConversation, preview || undefined);
        setMessage("");
        removeImage();
    };

    return (
        <div className="relative w-full flex flex-row px-3 py-4 rounded-xl justify-between text-white/30 bg-slate-700/20">
            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                type="text"
                className="w-[60%] bg-transparent text-sm outline-none placeholder:text-white/30 placeholder:text-sm"
                placeholder="Ask us anything..."
            />
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="image-upload" />
            <div className="flex flex-row gap-3 items-center">
                <label htmlFor="image-upload" className="hover:text-white cursor-pointer">
                    <ImageIcon size={20} />
                </label>
                <button disabled={isLoadingAi} type="button" onClick={onSendMessage} className="hover:text-white duration-300">
                    {isLoadingAi ? <Loading /> : <Send size={20} />}
                </button>
            </div>
            {preview && (
                <div className="absolute bottom-full mb-2">
                    <div className="relative">
                        <Image src={preview} alt="preview" width={100} height={100} className="rounded-xl" />
                        <button onClick={removeImage} className="absolute top-1 right-1 rounded-full w-6 h-6 bg-white flex items-center justify-center hover:bg-white/10">
                            <XIcon size={15} color="black" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Input;
