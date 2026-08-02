import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import SentinelaSessao from "@/modules/auth/SentinelaSessao";
import { SITE } from "@/lib/config";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata = {
  metadataBase: new URL("https://www.meuenem.online"),
  title: `${SITE.nome} — Estudos para o ENEM`,
  description: SITE.descricao,
  icons: { icon: "/icone-meuenem.png" },
  openGraph: {
    title: `${SITE.nome} — Estudos para o ENEM`,
    description: SITE.descricao,
    url: "https://www.meuenem.online",
    siteName: SITE.nome,
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieBanner />
        <SentinelaSessao />
      </body>
    </html>
  );
}
