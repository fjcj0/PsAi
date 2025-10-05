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
    const cleanBase64Image = (base64: string) => {
        if (!base64) return null;
        const regex = /^data:(image\/[a-zA-Z]+);base64,(data:image\/[a-zA-Z]+;base64,)?/;
        return base64.replace(regex, "data:$1;base64,");
    };
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) setPreview(cleanBase64Image(reader.result as string));
            };
            reader.readAsDataURL(file);
        }
    };
    const removeImage = () => setPreview(null);
    const onSendMessage = () => {
        if (!user || (!message.trim() && !preview)) return;
        sendMessageToAi(
            user._id,
            message,
            conversation ?? undefined,
            setConversation,
            preview || undefined
        );
        setMessage("");
        removeImage();
    };
    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSendMessage();
        }
    };
    return (
        <div className="relative w-full flex flex-row px-3 py-4 rounded-xl justify-between text-white/30 bg-slate-700/20">
            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full overflow-y-auto resize-none bg-transparent text-sm outline-none placeholder:text-white/30 p-2 rounded-lg"
                placeholder="Ask us anything..."
            />
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="image-upload" />
            <div className="flex flex-row gap-3 items-center">
                <label htmlFor="image-upload" className="hover:text-white cursor-pointer">
                    <ImageIcon size={20} />
                </label>
                <button
                    disabled={isLoadingAi}
                    type="button"
                    onClick={onSendMessage}
                    className="hover:text-white duration-300"
                >
                    {isLoadingAi ? <Loading /> : <Send size={20} />}
                </button>
            </div>
            {preview && (
                <div className="absolute bottom-full mb-2 z-50">
                    <div className="relative">
                        <Image
                            src={preview}
                            alt="preview"
                            width={100}
                            height={100}
                            className="rounded-xl"
                            unoptimized
                        />
                        <button
                            onClick={removeImage}
                            className="absolute top-1 right-1 rounded-full w-6 h-6 bg-white flex items-center justify-center hover:bg-white/10"
                        >
                            <XIcon size={15} color="black" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Input;