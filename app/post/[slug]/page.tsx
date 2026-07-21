import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/ArticlePage";
import { blogPostBySlug, blogPosts } from "@/lib/blog-data";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogPosts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPostBySlug[slug];
  if (!post) return { title: "Artigo não encontrado" };
  return { title: post.title, description: post.excerpt, openGraph: { title: post.title, description: post.excerpt, type: "article" } };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPostBySlug[slug];
  if (!post) notFound();
  return <ArticlePage post={post} />;
}
