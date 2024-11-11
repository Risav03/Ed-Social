import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/utils/Providers";
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const metadata: Metadata = {
  title: "Ed-Soc",
  description: "Assignment for House of Ed-Tech",
  openGraph: {
    title: "Ed-Soc",
  description: "Assignment for House of Ed-Tech",
    url: 'https://ed-social.vercel.app/',
    siteName: 'Ed-Soc',
    images: [
      {
        url: 'https://ed-social.vercel.app/og.png', // Must be an absolute URL
        width: 800,
        height: 600,
      },
      {
        url: 'https://ed-social.vercel.app/og.png', // Must be an absolute URL
        width: 1800,
        height: 1600,
        alt: 'My custom alt',
      },
    ]
  }
}

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
