'use client'

import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
import { usePathname } from "next/navigation";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppNavBar from "./components/app.navbar";
import AppFooter from "./components/app.footer";
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
  const pathname = usePathname(); // Lấy đường dẫn hiện tại
  const excludedPaths = ["/login", "/register"];
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AppNavBar></AppNavBar>
        <Container>
          {children}
        </Container>
        {!excludedPaths.includes(pathname) && <AppFooter /> && <AppFooter></AppFooter>}
        <AppFooter></AppFooter>
      </body>
    </html>
  );
}
