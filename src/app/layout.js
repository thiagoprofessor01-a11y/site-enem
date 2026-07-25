import "./globals.css";
import Navbar from "@/components/Navbar";
import { SITE } from "@/lib/config";

export const metadata = {
  title: SITE.nome,
  description: SITE.descricao,
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen antialiased">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
