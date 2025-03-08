'use client'
import '../app/globals.css'
import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import 'bootstrap/dist/css/bootstrap.min.css';
import AppNavBar from "./components/navbar/app.navbar";
import AppFooter from "./components/footer/app.footer";
import { Container } from 'react-bootstrap';
import { AuthProvider } from '@/hooks/useAuth';
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
  const excludedPaths = ["/login", "/forgotpassword"];

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <title>Mầm Non Yêu Thương</title>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          {!excludedPaths.includes(pathname) && <AppNavBar />}
          <Container>
            {children}
          </Container>
          {!excludedPaths.includes(pathname) && <AppFooter />}
        </AuthProvider>
      </body>
    </html>
  );
}