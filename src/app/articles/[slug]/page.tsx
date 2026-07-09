import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { supabase } from '@/lib/supabaseClient';

interface Article {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  content: string;
  created_at: string;
  tags: string[];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;

  let article: Article | null = null;
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (!error && data) {
      article = data as Article;
    }
  } catch (err) {
    console.error('Error fetching article:', err);
  }

  if (!article) {
    notFound();
  }

  return (
    <>
      <Navigation />
      <div style={{ paddingTop: '120px', minHeight: '100vh', paddingBottom: '80px' }}>
        <article className="section-container" style={{ maxWidth: '720px' }}>
          <Link href="/articles" className="btn-back" style={{ display: 'inline-block', marginBottom: '40px', padding: '0', textDecoration: 'none' }}>
            ← Все статьи
          </Link>
          
          <h1 className="hero-title" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', marginBottom: '16px', lineHeight: '1.2' }}>
            {article.title}
          </h1>
          
          <p className="articles-subtitle" style={{ fontSize: '18px', color: 'var(--muted)', marginBottom: '32px', fontStyle: 'italic' }}>
            {article.subtitle}
          </p>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '40px', flexWrap: 'wrap' }}>
            {article.tags?.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: '11px',
                  border: '1px solid var(--border)',
                  color: 'var(--accent)',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <div
            style={{
              color: 'var(--text)',
              fontSize: '16px',
              lineHeight: '1.85',
              whiteSpace: 'pre-wrap',
              fontFamily: 'var(--inter)'
            }}
          >
            {article.content}
          </div>
        </article>
      </div>
    </>
  );
}
