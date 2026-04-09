import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Ví Quản Lý Dòng Tiền',
  description: 'Hệ thống quản lý tài chính cá nhân',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        {/* Fix khoảng trắng tai thỏ và lỗi zoom trên iPhone */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${inter.className} antialiased bg-[#f1f5f9] text-slate-900`}>
        {/* Bọc trực tiếp khung giao diện ở đây để Vercel build thumbnail được luôn */}
        <div className="min-h-[100dvh] w-full flex justify-center items-center bg-[#f1f5f9]">
          <div className="w-full max-w-md bg-white h-[100dvh] md:h-[90vh] md:max-h-[850px] md:rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col md:border-[2px] md:border-slate-900">
            <main className="flex-1 overflow-y-auto scrollbar-hide relative z-10 flex flex-col bg-[#fcfcfd]">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}