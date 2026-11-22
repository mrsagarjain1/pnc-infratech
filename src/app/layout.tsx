import type { Metadata, Viewport } from "next";
import { DM_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Preloader } from "@/components/Preloader";
import { MagneticCursor } from "@/components/MagneticCursor";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PNC Infratech Limited — National Infrastructure & Expressways",
    template: "%s | PNC Infratech Limited",
  },
  description:
    "PNC Infratech Limited (Est. 1999, ISO 9001:2015 DNV Certified): India’s front-ending EPC, DBFOT, and HAM infrastructure developer across expressways, highways, major river bridges, airport runways, dedicated rail corridors, water supply, and industrial estates.",
};

export const viewport: Viewport = {
  themeColor: "#f0f1fa",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-alabaster text-obsidian">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Preloader />
        <MagneticCursor />
        <SmoothScrollProvider>
          <Navbar />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
