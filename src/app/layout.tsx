import "~/styles/globals.css";

import { type Metadata, type Viewport } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "sonner";

import { ThemeProvider } from "~/components/theme-provider";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  metadataBase: new URL("https://injecoes.seoft.app"),
  applicationName: "Injeções",
  title: {
    default: "Injeções",
    template: "%s | Injeções",
  },
  description:
    "Gerenciamento AntiVEGF: prescrições e aplicações intravítreas com eficiência.",
  keywords: [
    "AntiVEGF",
    "injeções intravítreas",
    "oftalmologia",
    "retina",
    "prescrições",
    "gestão clínica",
    "ranibizumabe",
    "bevacizumabe",
    "aflibercepte",
  ],
  authors: [{ name: "Injeções" }],
  creator: "Injeções",
  publisher: "Injeções",
  generator: "Next.js",
  category: "Saúde",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Injeções — Gerenciamento AntiVEGF",
    title: "Injeções",
    description:
      "Gerenciamento AntiVEGF: prescrições e aplicações intravítreas com eficiência.",
    locale: "pt_BR",
    images: [
      { url: "/logo.jpg" },
      { url: "/android-chrome-512x512.png", width: 512, height: 512 },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Injeções",
    description:
      "Gerenciamento AntiVEGF: prescrições e aplicações intravítreas com eficiência.",
    images: ["/logo.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#000000" },
      { rel: "manifest", url: "/site.webmanifest" },
    ],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${geist.variable}`} suppressHydrationWarning>
      <body className="bg-background min-h-screen font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCReactProvider>
            <div className="relative flex min-h-screen flex-col">
              <div className="flex-1">{children}</div>
            </div>
            <Toaster />
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
