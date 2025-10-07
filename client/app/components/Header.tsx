"use client";
import { useState } from "react";
import { useAuth } from "../context/UserContext";
import Image from "next/image";
import React from "react";
import { useAuthStore } from "@/store/authStore";
const Header = () => {
    const { user, isAuth, logout, loading } = useAuth();
    const [displayInfo, setDisplayInfo] = useState(false);
    const { fetchUser } = useAuthStore();
    const handleGoogleSignIn = async () => {
        const width = 500;
        const height = 600;
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;
        const popup = window.open(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/google`,
            "google-login",
            `width=${width},height=${height},top=${top},left=${left}`
        );
        const interval = setInterval(async () => {
            try {
                if (!popup || popup.closed) {
                    clearInterval(interval);
                    await fetchUser();
                    window.location.href = "/chat";
                }
            } catch (err) {
                console.log(err);
            }
        }, 500);
    };
    const handleLogout = async () => {
        await logout();
        window.location.href = "/";
    };

    return (
        <div className="w-full flex items-center justify-between px-20 py-3">
            <Image
                src="/earthlogo.png"
                alt="earthlogo"
                width={80}
                height={80}
                className="rounded-full"
                priority
            />

            {loading ? (
                <div className="p-5">Loading...</div>
            ) : isAuth && user ? (
                <div className="relative flex flex-col items-center justify-center">
                    <button
                        type="button"
                        className="relative"
                        onClick={() => setDisplayInfo(!displayInfo)}
                    >
                        <Image
                            src={user.image || "/default-avatar.png"}
                            alt={user.displayName || "User"}
                            width={50}
                            height={50}
                            className="rounded-full"
                        />
                    </button>
                    {displayInfo && (
                        <div className="absolute flex flex-col items-center justify-center gap-3 p-5 bg-white rounded-md w-[8rem] top-full my-2 shadow-lg">
                            <p>{user.displayName}</p>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 hover:bg-red-700 duration-300 text-white px-4 py-2 rounded-lg font-bold"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <button
                    onClick={handleGoogleSignIn}
                    className="text-white flex flex-row items-center justify-center gap-1 font-bold bg-blue-700 px-5 py-3 rounded-lg hover:bg-blue-900 duration-300"
                >
                    <Image src="/google.png" alt="google logo" width={30} height={30} />
                    Sign in with Google
                </button>
            )}
        </div>
    );
};
export default Header;