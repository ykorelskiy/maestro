'use client';

export default function WordCloud() {
  const words = [
    { text: 'сексуальность', size: 'lg', r: '-2deg' },
    { text: 'БДСМ', size: 'md', r: '3deg' },
    { text: 'хочу', size: 'sm', r: '-1deg' },
    { text: 'контроль', size: 'lg', r: '4deg' },
    { text: 'подчинение', size: 'md', r: '-3deg' },
    { text: 'доминирование', size: 'md', r: '1deg' },
    { text: 'стыд', size: 'lg', r: '-4deg' },
    { text: 'нельзя', size: 'sm', r: '2deg' },
    { text: 'полиамория', size: 'md', r: '-4deg' },
    { text: 'влечение', size: 'lg', r: '3deg' },
    { text: 'моногамия', size: 'md', r: '2deg' },
    { text: 'стыдно', size: 'sm', r: '-2deg' },
    { text: 'фантазии', size: 'md', r: '-2deg' },
    { text: 'границы', size: 'lg', r: '-1deg' },
    { text: 'опасно', size: 'sm', r: '1deg' },
    { text: 'фетиш', size: 'md', r: '3deg' },
    { text: 'власть', size: 'lg', r: '4deg' },
    { text: 'не такой', size: 'sm', r: '-3deg' },
    { text: 'ролевые игры', size: 'md', r: '1deg' },
    { text: 'доверие', size: 'lg', r: '-3deg' },
    { text: 'слишком сложно', size: 'sm', r: '3deg' },
    { text: 'kink', size: 'md', r: '-1deg' },
    { text: 'выгорание', size: 'lg', r: '2deg' },
    { text: 'rimming', size: 'md', r: '-3deg' },
    { text: 'страх', size: 'sm', r: '-4deg' },
    { text: 'безопасность', size: 'lg', r: '-4deg' },
    { text: 'fisting', size: 'md', r: '3deg' },
    { text: 'вина', size: 'sm', r: '4deg' },
    { text: 'близость', size: 'lg', r: '1deg' },
    { text: 'сквирт', size: 'md', r: '-4deg' },
    { text: 'тревога', size: 'sm', r: '-2deg' },
    { text: 'игрушки', size: 'md', r: '-2deg' },
    { text: 'уязвимость', size: 'lg', r: '-2deg' },
    { text: 'разные темпы', size: 'sm', r: '2deg' },
    { text: 'bondage', size: 'md', r: '1deg' },
    { text: 'одиночество', size: 'sm', r: '4deg' },
    { text: 'impact play', size: 'md', r: '-4deg' },
    { text: 'желание', size: 'lg', r: '3deg' },
    { text: 'wax play', size: 'md', r: '2deg' },
    { text: 'скука в постели', size: 'sm', r: '-1deg' },
    { text: 'шибари', size: 'md', r: '-1deg' },
    { text: 'дистанция', size: 'md', r: '4deg' },
    { text: 'ревность', size: 'md', r: '-3deg' },
    { text: 'после родов', size: 'sm', r: '3deg' },
    { text: 'зависимость', size: 'md', r: '1deg' },
    { text: 'после расставания', size: 'sm', r: '-3deg' },
    { text: 'измена', size: 'md', r: '-2deg' },
    { text: 'асексуальность', size: 'md', r: '3deg' },
    { text: 'либидо', size: 'md', r: '-4deg' },
    { text: 'оргазм', size: 'md', r: '2deg' }
  ];

  return (
    <section id="requests">
      <div className="section-container">
        <h2>С чем ко мне</h2>
        <div className="word-cloud">
          {words.map((word, i) => (
            <span
              key={i}
              className={`word-cloud__word word-cloud__word--${word.size}`}
              style={{ '--r': word.r } as React.CSSProperties}
            >
              <span className="word-cloud__inner">{word.text}</span>
            </span>
          ))}
        </div>

        <div className="requests-not-box">
          <h3 className="requests-not-title">С чем не ко мне</h3>
          <p className="requests-not-text">
            Я не работаю с острыми психиатрическими состояниями, суицидальными мыслями,
            психозами, химическими зависимостями и медицинскими запросами. В этих случаях
            нужен профильный специалист: психиатр, психотерапевт, нарколог или врач.
          </p>
          <p className="requests-not-text">
            Я также не работаю с запросом «почините мне партнёра». Работать можно только
            с тем человеком, который сам пришёл и готов смотреть на свою часть ситуации.
          </p>
        </div>
      </div>
    </section>
  );
}
