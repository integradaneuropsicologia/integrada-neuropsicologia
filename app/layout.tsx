import type { Metadata } from "next";
import { HOME_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: HOME_DESCRIPTION,
  applicationName: SITE_NAME,
  category: "Saúde",
  creator: SITE_NAME,
  publisher: SITE_NAME,
  referrer: "origin-when-cross-origin",
  verification: { google: "WQqzIuO-fBHkrlX9jhelg58ubDCZEmVNLFnbivLY9os" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: { icon: "/assets/logo.png", shortcut: "/assets/logo.png", apple: "/assets/logo.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
