import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import News from "@/components/News";
import SeesionWrapper from "@/components/SeesionWrapper";
import CommentModal from "../components/CommentModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NEXT X",
  description: "x clone created by nextjs and tailwind",
};

export const dynamic = 'force-dynamic'

export default function RootLayout({ children }) {
  return (
    <SeesionWrapper>
      <html lang="en">
        <body className={inter.className}>
          <div className="flex justify-between max-w-6xl mx-auto">
            {/* Sidebar */}
            <div className="hidden sm:inline-flex h-screen sticky top-0">
              <Sidebar />
            </div>

            {/* Main Content */}
            <div className="w-2xl flex-1 overflow-y-auto">
              {children}
            </div>

            {/* News Section */}
            <div className="hidden lg:flex flex-col p-3 h-screen border-l w-[24rem]">
              <div className="py-2 bg-white sticky top-0">
                <input
                  className="bg-gray-100 border border-gray-200 w-full rounded-3xl px-4 py-2 text-sm"
                  type="text"
                  placeholder="Search.."
                />
              </div>
              <News />
            </div>
          </div>
          <CommentModal/>
        </body>
      </html>
    </SeesionWrapper>
  );
}
