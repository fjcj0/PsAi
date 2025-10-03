"use client";
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import React, { useEffect, useRef, useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Edit } from 'lucide-react';
import Input from './components/Input';

const Page: React.FC = () => {
    const router = useRouter();
    const { fetchUser, user, isAuth, editUser } = useAuthStore();

    const [newDisplayName, setNewDisplayName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [previewImage, setPreviewImage] = useState<string>('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    useEffect(() => {
        if (isAuth === false) {
            router.push('/');
        }
    }, [isAuth, router]);

    useEffect(() => {
        if (user) {
            setNewDisplayName(user.displayName || '');
            setEmail(user.email || '');
            setPreviewImage(user.image || '');
        }
    }, [user]);

    if (!isAuth) return null;

    const handleCameraClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            if (!user) return;
            try {
                await editUser({
                    userId: user._id,
                    newDisplayName,
                    newProfilePicture: file,
                });
                alert('Profile updated successfully!');
            } catch (error) {
                console.error(error);
                alert('Failed to update profile.');
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    return (
        <div className="w-screen h-screen bg-black flex items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 bg-slate-400/10 p-5 rounded-xl gap-10 w-[90%]">
                <div className="flex items-center justify-center">
                    <h1 className="text-4xl font-bold text-white text-center">
                        Edit Your{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-500/80 to-white">
                            PsAi
                        </span>{' '}
                        Here
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-500/80 to-white">
                            {user?.displayName || ''}
                        </span>
                    </h1>
                </div>
                <div className="w-full flex flex-col items-start justify-start gap-y-4">
                    <div className="w-full flex flex-col items-center justify-center gap-4">
                        <div className="relative">
                            {previewImage ? (
                                <Image
                                    src={previewImage}
                                    alt={user?.displayName || "User Image"}
                                    width={80}
                                    height={80}
                                    className="rounded-full"
                                />
                            ) : (
                                <div className="w-32 h-32 bg-gray-500 rounded-full" />
                            )}
                            <button
                                type="button"
                                onClick={handleCameraClick}
                                className="absolute top-[2.5rem] left-1/2 transform w-[5rem] flex items-center justify-center -translate-x-1/2 bg-white/10 rounded-b-full p-2 hover:bg-gray-300 transition duration-300"
                            >
                                <Camera className="w-5 h-6 text-black" />
                            </button>

                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>

                    <div className="w-full grid grid-cols-1 gap-3">
                        <Input
                            type="text"
                            isActive={true}
                            placeholder="Enter new display name..."
                            text={newDisplayName}
                            setText={setNewDisplayName}
                        />
                        <Input
                            type="email"
                            isActive={false}
                            placeholder="Email....."
                            text={email}
                            setText={setEmail}
                        />
                    </div>

                    <div className="w-full flex items-center justify-center">
                        <button
                            type="button"

                            className="flex flex-row gap-2 items-center justify-center bg-black/10 text-white/50 hover:text-white hover:bg-black/50 duration-300 px-7 py-3 font-bold rounded-lg"
                        >
                            <Edit size={20} />
                            Edit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;