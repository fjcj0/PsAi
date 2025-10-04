"use client";
import React from 'react';
import { Image as ImageIcon, Send, X as XIcon } from 'lucide-react';
import { useMessage } from '../../context/MessageContext';
import Image from 'next/image';

const Input = () => {
    const { message, setMessage, image, setImage } = useMessage();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    const removeImage = () => {
        setImage(null);
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
                <button type="button" className="hover:text-white duration-300">
                    <Send size={20} />
                </button>
            </div>

            {image && (
                <div className="absolute bottom-full mb-2">
                    <div className="relative">
                        <Image
                            src={image}
                            alt="image"
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