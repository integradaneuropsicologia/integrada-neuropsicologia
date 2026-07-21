import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function NotFound() {
  return <><SiteHeader /><main><section className="simple-hero"><span className="eyebrow">Página não encontrada</span><h1>Vamos voltar ao caminho certo.</h1><p>O endereço pode ter mudado. A página inicial reúne todos os serviços, checklists e conteúdos.</p><div style={{ marginTop: 28 }}><Link href="/" className="button button-green">Voltar ao início</Link></div></section></main><SiteFooter /></>;
}
