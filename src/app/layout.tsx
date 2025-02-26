'use client'
import './globals.css'
import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppNavBar from "./components/navbar/app.navbar";
import AppFooter from "./components/footer/app.footer";
import { Container } from 'react-bootstrap';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const excludedPaths = ["/login", "/register", "/forgotpassword"];

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {!excludedPaths.includes(pathname) && <AppNavBar />}
        <Container>
          {children}
        </Container>
        {!excludedPaths.includes(pathname) && <AppFooter />}
      </body>
    </html>
  );
}