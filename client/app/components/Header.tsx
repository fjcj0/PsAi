"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";
import React from "react";
const Header = () => {
    const { fetchUser, user, isAuth, logout } = useAuthStore();
    useEffect(() => {
        fetchUser();
    }, [user]);
    const handleGoogleSignIn = () => {
        window.location.href =
            process.env.NODE_ENV === "development"
                ? "http://localhost:5205/api/auth/google"
                : "/api/auth/google";
    };
    const [displayInfo, setDisplayInfo] = useState(false);
    const handleLogout = async () => {
        await logout();
    };
    return (
        <div className="w-full flex items-center justify-between px-20 py-6">
            <Image
                src={"/earthlogo.png"}
                alt="earthlogo"
                width={110}
                height={110}
                className="rounded-full"
            />
            {isAuth && user ? (
                <div className="relative flex flex-col items-center justify-center">
                    <button type="button" className="relative"
                        onClick={() => setDisplayInfo(!displayInfo)}>
                        <Image src={user.image} alt={user.displayName} width={50} height={50}
                            className="rounded-full" />
                    </button>
                    {displayInfo && <div className="absolute flex flex-col items-center justify-center gap-3 p-5 bg-white rounded-md
                    w-[8rem] top-full my-2">
                        <p>{user.displayName}</p>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 duration-300 text-white px-4 py-2 rounded-lg font-bold">
                            Logout
                        </button>
                    </div>}
                </div>
            ) : (
                <button
                    onClick={handleGoogleSignIn}
                    className="text-white flex flex-row items-center justify-center gap-1 font-bold bg-blue-700 px-5 py-3 rounded-lg hover:bg-blue-900 duration-300"
                >
                    <Image src={'/google.png'} alt="google logo" width={30} height={30} /> Sign in with Google
                </button>
            )}
        </div>
    );
};
export default Header;