import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import { SITE } from "@/lib/config";

export const metadata = {
  metadataBase: new URL("https://www.meuenem.online"),
  title: `${SITE.nome} — Estudos para o ENEM`,
  description: SITE.descricao,
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
    <html lang="pt-BR">
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
