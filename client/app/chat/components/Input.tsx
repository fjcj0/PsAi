"use client";
import React, { useState } from 'react';
import { Image as ImageIcon, Send, X as XIcon } from 'lucide-react';
import { useMessage } from '../../context/MessageContext';
import Image from 'next/image';
import { useMessageStore } from '@/store/messageStore';
import { useAuth } from '@/app/context/UserContext';
const Input = () => {
    const { user } = useAuth();
    const { message, setMessage, conversation } = useMessage();
    const { sendMessage } = useMessageStore();
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) setPreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };
    const removeImage = () => {
        setPreview(null);
        setFile(null);
    };
    const onSendMessage = async () => {
        try {

        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="relative w-full flex flex-row px-3 py-4 rounded-xl justify-between text-white/30 bg-slate-700/20">
            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                type="text"
                className="w-[60%] bg-transparent text-sm outline-none placeholder:text-white/30 placeholder:text-sm"
                placeholder="Ask us anything in your mind...."
            />
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
            />
            <div className="flex flex-row gap-3 items-center">
                <label htmlFor="image-upload" className="hover:text-white cursor-pointer">
                    <ImageIcon size={20} />
                </label>
                <button
                    type="button"
                    onClick={onSendMessage}
                    className="hover:text-white duration-300"
                >
                    <Send size={20} />
                </button>
            </div>
            {preview && (
                <div className="absolute bottom-full mb-2">
                    <div className="relative">
                        <Image
                            src={preview}
                            alt="preview"
                            width={100}
                            height={100}
                            className="rounded-xl"
                        />
                        <div className="absolute top-1 right-1">
                            <button
                                onClick={removeImage}
                                className="rounded-full flex items-center justify-center w-[1.5rem] h-[1.5rem] bg-white hover:bg-white/10 duration-300 hover:text-white"
                            >
                                <XIcon size={15} color="black" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Input;