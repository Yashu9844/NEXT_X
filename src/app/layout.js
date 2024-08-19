import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import News from "@/components/News";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NEXT X",
  description: "x clone created by nextjs and tailwind",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex justify-between max-w-6xl mx-auto">
              <div className="hidden sm:inline  border-r h-screen"><Sidebar/></div>
              <div  >   {children}</div>
              <div className="lg:flex-col p-3  h-screen border-l lg:flex w-[24rem] hidden">
                <div className="py-2 bg-white sticky top-0">
                  <input className="bg-gray-100 border border-gray-200 w-full rounded-3xl px-4 py-2 text-sm" type="text" placeholder="Search.."></input>
                </div>
                
                <News/></div>

        </div>
     </body>
    </html>
  );
}
