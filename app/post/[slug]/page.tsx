import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/ArticlePage";
import { blogPostBySlug, blogPosts } from "@/lib/blog-data";
import { mainSiteUrl } from "@/lib/seo";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogPosts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPostBySlug[slug];
  if (!post) return { title: "Artigo não encontrado" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: mainSiteUrl(`/post/${slug}`) },
    openGraph: {
      type: "article",
      locale: "pt_BR",
      siteName: "Integrada Neuropsicologia",
      url: mainSiteUrl(`/post/${slug}`),
      title: post.title,
      description: post.excerpt,
      images: [{ url: "/og.png", width: 1731, height: 909, alt: post.title }],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt, images: ["/og.png"] },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPostBySlug[slug];
  if (!post) notFound();
  return <ArticlePage post={post} />;
}
