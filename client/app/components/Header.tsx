"use client";
import { useState } from "react";
import { useAuth } from "../context/UserContext";
import Image from "next/image";
import React from "react";
const Header = () => {
    const { user, isAuth, logout, loading } = useAuth();
    const [displayInfo, setDisplayInfo] = useState(false);
    const handleGoogleSignIn = () => {
        window.location.href =
            process.env.NODE_ENV === "development"
                ? "http://localhost:5205/api/auth/google"
                : "/api/auth/google";
    };
    const handleLogout = async () => {
        await logout();
    };
    return (
        <div className="w-full flex items-center justify-between px-20 py-3">
            <Image
                src={"/earthlogo.png"}
                alt="earthlogo"
                width={80}
                height={80}
                className="rounded-full"
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
                            src={user?.image || "/default-avatar.png"}
                            alt={user?.displayName || "User"}
                            width={50}
                            height={50}
                            className="rounded-full"
                        />
                    </button>
                    {displayInfo && (
                        <div className="absolute flex flex-col items-center justify-center gap-3 p-5 bg-white rounded-md w-[8rem] top-full my-2 shadow-lg">
                            <p>{user?.displayName}</p>
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
                    <Image src={"/google.png"} alt="google logo" width={30} height={30} />{" "}
                    Sign in with Google
                </button>
            )}
        </div>
    );
};
export default Header;