import type { Metadata } from "next";
import { Big_Shoulders, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const bigShoulders = Big_Shoulders({
  variable: "--font-shoulders",
  weight: ["600", "800"],
  subsets: ["latin"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

const TITULO = "Pictex — Tu apartamento, listo para entregar";
const DESCRIPCION =
  "Pintura express de apartamentos en Bogotá con máquina de aspersión profesional. Listo en 24-48 horas.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://pictex.vercel.app"),
  title: TITULO,
  description: DESCRIPCION,
  openGraph: {
    title: TITULO,
    description: DESCRIPCION,
    url: "/",
    siteName: "Pictex",
    locale: "es_CO",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: TITULO }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO,
    description: DESCRIPCION,
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${bigShoulders.variable} ${plexSans.variable}`}>
      <body>
        <div className="bg-plans" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
