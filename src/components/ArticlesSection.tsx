import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

interface Article {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  content: string;
  tags: string[];
}

export default async function ArticlesSection() {
  let dbArticles: Article[] = [];
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(3);

    if (!error && data) {
      dbArticles = data as Article[];
    }
  } catch (err) {
    console.error('Failed to fetch articles from Supabase:', err);
  }

  const staticArticles = [
    {
      title: (
        <>
          <span className="text-accent">Желание</span> и{' '}
          <span className="text-accent">стыд</span>
        </>
      ),
      text: (
        <>
          Почему человеку бывает трудно признать собственное{' '}
          <span className="text-accent">желание</span> — даже перед самим собой. О том, как{' '}
          <span className="text-accent">стыд</span> маскируется под мораль, рациональность и «я
          просто не такой».
        </>
      ),
    },
    {
      title: (
        <>
          <span className="text-accent">Контроль</span> как форма защиты
        </>
      ),
      text: (
        <>
          <span className="text-accent">Контроль</span> часто выглядит как сила. Но иногда за ним
          стоит не <span className="text-accent">власть</span>, а страх снова оказаться беспомощным.
          Где проходит граница между осознанным управлением и защитной бронёй.
        </>
      ),
    },
    {
      title: (
        <>
          <span className="text-accent">Власть</span>,{' '}
          <span className="text-accent">доверие</span> и БДСМ
        </>
      ),
      text: (
        <>
          БДСМ не начинается с атрибутики. Он начинается с договора, внимания,{' '}
          <span className="text-accent">ответственности</span> и понимания того, что{' '}
          <span className="text-accent">власть</span> без{' '}
          <span className="text-accent">контроля</span> над собой быстро превращается в насилие.
        </>
      ),
    },
  ];

  const hasDbArticles = dbArticles.length > 0;

  return (
    <section id="articles">
      <div className="section-container">
        <h2>Разборы и тексты</h2>
        <p className="articles-subtitle">
          Заметки о сексуальности, власти, контроле, стыде, близости и тех внутренних механизмах,
          которые редко видны с первого взгляда.
        </p>

        {hasDbArticles ? (
          dbArticles.map((article) => (
            <div key={article.id} className="article-card">
              <Link href={`/articles/${article.slug}`}>
                <h3>{article.title}</h3>
              </Link>
              <p>{article.subtitle || article.content.substring(0, 180) + '...'}</p>
            </div>
          ))
        ) : (
          staticArticles.map((article, idx) => (
            <div key={idx} className="article-card">
              <h3>{article.title}</h3>
              <p>{article.text}</p>
            </div>
          ))
        )}

        <Link href="/articles" className="btn-all-articles">
          Все статьи
        </Link>
      </div>
    </section>
  );
}
