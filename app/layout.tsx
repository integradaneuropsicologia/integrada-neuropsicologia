import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const requestedHost = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const host = requestedHost && /^[a-z0-9.-]+(?::\d+)?$/i.test(requestedHost) ? requestedHost : "integradaneuropsicologia.com.br";
  const requestedProtocol = requestHeaders.get("x-forwarded-proto");
  const protocol = requestedProtocol === "http" || requestedProtocol === "https" ? requestedProtocol : (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  return {
    metadataBase: new URL(origin),
    title: { default: "Integrada Neuropsicologia", template: "%s | Integrada Neuropsicologia" },
    description: "Avaliação neuropsicológica e psicoterapia em Curitiba e on-line, com atendimento humanizado e laudos claros.",
    icons: { icon: "/assets/logo.png", shortcut: "/assets/logo.png", apple: "/assets/logo.png" },
    openGraph: { type: "website", locale: "pt_BR", siteName: "Integrada Neuropsicologia", title: "Integrada Neuropsicologia", description: "Avaliando o presente, transformando o futuro.", images: [{ url: `${origin}/og.png`, alt: "Integrada Neuropsicologia — avaliando o presente, transformando o futuro" }] },
    twitter: { card: "summary_large_image", title: "Integrada Neuropsicologia", description: "Avaliando o presente, transformando o futuro.", images: [`${origin}/og.png`] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
