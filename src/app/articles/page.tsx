import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { supabase } from '@/lib/supabaseClient';

interface Article {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  created_at: string;
}

export default async function ArticlesListPage() {
  let dbArticles: Article[] = [];
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, slug, subtitle, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (!error && data) {
      dbArticles = data as Article[];
    }
  } catch (err) {
    console.error('Failed to fetch articles:', err);
  }

  return (
    <>
      <Navigation />
      <div style={{ paddingTop: '120px', minHeight: '100vh', paddingBottom: '80px' }}>
        <div className="section-container">
          <Link href="/" className="btn-back" style={{ display: 'inline-block', marginBottom: '40px', padding: '0', textDecoration: 'none' }}>
            ← На главную
          </Link>
          <h1 className="hero-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', marginBottom: '20px', lineHeight: 1.1 }}>
            Все <br />
            <span className="text-accent">тексты</span>
          </h1>
          <p className="articles-subtitle" style={{ marginBottom: '60px' }}>
            Размышления, разборы и статьи о внутренних механизмах нашей психики.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {dbArticles.length > 0 ? (
              dbArticles.map((article) => (
                <div key={article.id} className="article-card">
                  <Link href={`/articles/${article.slug}`} style={{ textDecoration: 'none' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>{article.title}</h3>
                    <p style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: '1.6' }}>
                      {article.subtitle}
                    </p>
                    <span style={{ fontSize: '11px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '16px', display: 'inline-block' }}>
                      Читать разбор →
                    </span>
                  </Link>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--muted)', fontStyle: 'italic', fontSize: '15px' }}>
                Раздел статей пока наполняется. Скоро здесь появятся новые публикации.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
