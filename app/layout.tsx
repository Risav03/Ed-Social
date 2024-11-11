import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/utils/Providers";
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  title: "Ed-Soc",
  description: "Educational Social Media",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`font-poppins antialiased `}
      >
        <Providers>
        <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss={false}
              draggable
              pauseOnHover
              theme="dark"
              transition={Slide}
            />
        {children}
        </Providers>
      </body>
    </html>
  );
}
