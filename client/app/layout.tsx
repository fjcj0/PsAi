import type { Metadata } from "next";
import { ReactNode } from 'react';
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "./context/UserContext";
export const metadata: Metadata = {
  title: "PsAI",
  description: "AI chat using typescript",
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <AuthProvider>
        <body>
          <Toaster />
          {children}
        </body>
      </AuthProvider>
    </html>
  );
}