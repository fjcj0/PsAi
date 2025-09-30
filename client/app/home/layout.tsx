import { ReactNode } from "react";
export const metadata = {
    title: "Home",
    description: "This is home page",
};
export default function HomeLayout({ children }: { children: ReactNode }) {
    return (
        <main>
            {children}
        </main>
    );
}