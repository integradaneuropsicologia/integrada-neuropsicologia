import { LeadForm } from "@/components/LeadForm";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { blogPosts } from "@/lib/blog-data";

export function BlogPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="simple-hero blog-hero">
          <span className="eyebrow">Conteúdo confiável</span>
          <h1>Informação para entender e agir.</h1>
          <p>Leituras sobre neuropsicologia, saúde mental e estratégias para a vida real.</p>
        </section>
        <section className="blog-grid">
          {blogPosts.map((post, index) => (
            <article key={post.title}>
              <div className={`post-art post-art-${(index % 3) + 1}`}><span>{post.category}</span></div>
              <div className="post-copy">
                <span className="post-meta">Conteúdo educativo • {post.readTime}</span>
                <h2>{post.title}</h2><p>{post.excerpt}</p>
                <Link href={`/post/${post.slug}`} className="text-link">Ler conteúdo <span aria-hidden="true">→</span></Link>
              </div>
            </article>
          ))}
        </section>
        <LeadForm />
      </main>
      <SiteFooter />
    </>
  );
}
