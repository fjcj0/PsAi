import { ReactNode } from "react";
import Slider from "./components/Slider";
import Header from "../components/Header";
export const metadata = {
    title: "Chat",
    description: "Chat page",
};
export default function ChatLayout({ children }: { children: ReactNode }) {
    return (
        <main className="w-screen min-h-[100vh] bg-black flex flex-row">
            <Slider />
            <div className={`absolute right-0 w-[calc(100%-18rem)] h-full`}>
                <div className="border-b-2 border-white/10 h-[18%]">
                    <Header />
                </div>
                <div className="flex flex-col justify-between items-center h-[82%]  ">
                    {children}
                </div>
            </div>
        </main>
    );
}