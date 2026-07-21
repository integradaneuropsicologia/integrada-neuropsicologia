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
    title: { default: "Avaliação Neuropsicológica On-line para Adultos | Integrada Neuropsicologia", template: "%s | Integrada Neuropsicologia" },
    description: "Avaliação neuropsicológica on-line para adultos que querem compreender dificuldades de foco, memória e organização, com triagem responsável e orientação clara.",
    icons: { icon: "/assets/logo.png", shortcut: "/assets/logo.png", apple: "/assets/logo.png" },
    openGraph: { type: "website", locale: "pt_BR", siteName: "Integrada Neuropsicologia", title: "Avaliação Neuropsicológica On-line para Adultos", description: "Entenda o que está por trás das dificuldades de foco, memória e organização.", images: [{ url: `${origin}/og.png`, alt: "Avaliação neuropsicológica on-line para adultos — Integrada Neuropsicologia" }] },
    twitter: { card: "summary_large_image", title: "Avaliação Neuropsicológica On-line para Adultos", description: "Entenda o que está por trás das dificuldades de foco, memória e organização.", images: [`${origin}/og.png`] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
