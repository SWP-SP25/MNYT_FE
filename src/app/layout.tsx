'use client'
import '../app/globals.css'
import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import 'bootstrap/dist/css/bootstrap.min.css';
import AppNavBar from "./components/navbar/app-navbar";
import AppFooter from "./components/footer/app-footer";
import Providers from './providers'
import { AuthProvider } from '@/hooks/useAuth'


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
  const excludedPaths = ["/login", "/register", "/forgotpassword", '/admin',"/admin/account-manager","/admin/blog-manager","/admin/pregnacy-standard-config","/admin/schedule-template-config"];

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <title>Mầm Non Yêu Thương</title>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <AuthProvider>
            {!excludedPaths.includes(pathname) && <AppNavBar />}
            <main style={{
              // Kiểm tra xem đường dẫn hiện tại có nằm trong excludedPaths không
              // Nếu có, không áp dụng các thuộc tính maxWidth, margin, và padding
              // Nếu không, áp dụng các thuộc tính để căn giữa và giới hạn chiều rộng
              ...(excludedPaths.includes(pathname) ? {} : { maxWidth: '1200px', margin: '0 auto', padding: '0 20px' })
            }}>
              {children}
            </main>
            {!excludedPaths.includes(pathname) && <AppFooter />}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}