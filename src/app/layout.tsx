'use client'
import '../app/globals.css'
import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import 'bootstrap/dist/css/bootstrap.min.css';
import AppNavBar from "./components/navbar/app-navbar";
import AppFooter from "./components/footer/app-footer";
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
  const excludedPaths = ["/authenticate",
    "/admin",
    "/admin/blog",
    "/admin/account",
    "/admin/schedule-template",
    "/admin/membership-plan",
    "/admin/preganacy-standard",
    "/admin/membership-sale"
  ];

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <title>Mầm Non Yêu Thương</title>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          {!excludedPaths.includes(pathname) && <AppNavBar />}
          <main style={{
            // Áp dụng một layout thống nhất với padding nhỏ hơn ở hai bên
            maxWidth: '100%',  // Sử dụng toàn bộ chiều rộng màn hình
            padding: '0 12px', // Padding nhỏ ở hai bên
            margin: '0 auto'   // Giữ container ở giữa
          }}>
            {children}
          </main>
          {!excludedPaths.includes(pathname) && <AppFooter />}
        </AuthProvider>
      </body>
    </html>
  );
}