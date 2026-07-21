import Link from "next/link";
import { LeadForm } from "@/components/LeadForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { BlogPost } from "@/lib/blog-data";
import { whatsappUrl } from "@/lib/site-data";

export function ArticlePage({ post }: { post: BlogPost }) {
  return (
    <>
      <SiteHeader />
      <main>
        <article className="article">
          <header className="article-header">
            <Link href="/blog" className="article-back">← Voltar ao blog</Link>
            <span className="eyebrow">{post.category}</span>
            <h1>{post.title}</h1>
            <p className="article-intro">{post.intro}</p>
            <div className="article-meta"><span>Conteúdo educativo da Integrada</span><span>{post.readTime}</span></div>
          </header>
          <div className="article-body">
            {post.sections.map((section) => (
              <section key={section.title}>
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.bullets && <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}
              </section>
            ))}
            <aside className="article-note"><strong>Conteúdo educativo</strong><p>Este texto não substitui avaliação individual nem estabelece diagnóstico. Se houver sofrimento ou prejuízo na rotina, procure orientação profissional.</p></aside>
            <div className="article-cta"><div><span className="eyebrow">Precisa de orientação?</span><h2>Transforme dúvida em um próximo passo claro.</h2></div><a className="button button-green" href={whatsappUrl(`Olá! Li o artigo “${post.title}” e gostaria de orientação.`)} target="_blank" rel="noreferrer">Falar com a equipe</a></div>
          </div>
        </article>
        <LeadForm />
      </main>
      <SiteFooter />
    </>
  );
}
