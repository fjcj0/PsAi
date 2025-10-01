import { ReactNode } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
export const metadata = {
    title: "Home",
    description: "This is home page",
};
export default function HomeLayout({ children }: { children: ReactNode }) {
    return (
        <main className="w-screen min-h-[100vh] bg-black">
            <Header />
            {children}
            <Footer />
        </main>
    );
}