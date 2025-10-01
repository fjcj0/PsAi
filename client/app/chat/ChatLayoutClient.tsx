"use client";
import { ReactNode, useState, useEffect } from "react";
import Slider from "./components/Slider";
import Header from "../components/Header";
import useSlideStore from "@/store/slideStore";
export default function ChatLayoutClient({ children }: { children: ReactNode }) {
    const [mounted, setMounted] = useState(false);
    const { isSlideOpen } = useSlideStore();
    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) return null;
    return (
        <main className="w-screen min-h-[100vh] bg-black flex flex-row">
            <Slider />
            <div
                className={`absolute right-0 h-full duration-300 ${isSlideOpen ? "md:w-[calc(100%-18rem)]" : "md:w-[calc(100%-5rem)]"
                    }`}
            >
                <div className="h-[18%]">
                    <Header />
                </div>
                <div className="flex flex-col justify-between items-center h-[82%]">
                    {children}
                </div>
            </div>
        </main>
    );
}