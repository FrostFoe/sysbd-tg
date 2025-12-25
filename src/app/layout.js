import { AuthProvider } from "@/context/AuthContext";
import { UIProvider } from "@/context/UIContext";
import GlobalModals from "@/components/GlobalModals";
import { Inter } from "next/font/google";
import "./app.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Telegram Clone - Appwrite",
  description: "A real-time chat application built with Next.js and Appwrite",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/appwrite.svg" />
      </head>
      <body className={`${inter.className} bg-gray-50 text-gray-900 transition-colors duration-200 dark:bg-[#0f0f0f] dark:text-white`}>
        <AuthProvider>
          <UIProvider>
            {children}
            <GlobalModals />
          </UIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
