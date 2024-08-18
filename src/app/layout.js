import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/component/Sidebar";
import News from "@/component/News";

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
              <div><Sidebar/></div>
              <div className="bg-blue-500">   {children}</div>
              <div><News/></div>

        </div>
     </body>
    </html>
  );
}
