import "./globals.css";
import Script from "next/script";
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
  other: {
    "facebook-domain-verification": "5w1ma4p9gv89lid6rhjk1dois4r7el",
  },
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
      <head>
        {/* Meta Pixel Code */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
// Trava: init + PageView disparam uma única vez por carregamento,
// mesmo que este script seja avaliado mais de uma vez (hidratação/StrictMode).
if(!window.__meuenemPixel){window.__meuenemPixel=1;
fbq('init', '1888470902537217');
fbq('track', 'PageView');}`}
        </Script>
        {/* End Meta Pixel Code */}
      </head>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1888470902537217&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieBanner />
        <SentinelaSessao />
      </body>
    </html>
  );
}
