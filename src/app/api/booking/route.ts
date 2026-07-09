import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      client_name,
      contact_method,
      contact_info,
      request_details,
      screening_passed,
      answers_json,
    } = body;

    // Валидация входных данных
    if (!contact_method || !contact_info || !client_name) {
      return NextResponse.json(
        { message: 'Не заполнены обязательные поля (Имя, способ связи, контактные данные).' },
        { status: 400 }
      );
    }

    // Сохранение в Supabase
    const { data, error } = await supabase.from('bookings').insert([
      {
        client_name,
        contact_method,
        contact_info,
        request_details,
        screening_passed,
        answers_json,
      },
    ]).select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { message: 'Не удалось сохранить запись в базу данных.' },
        { status: 500 }
      );
    }

    // Отправка уведомления в Telegram (если настроено)
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (
      botToken &&
      chatId &&
      botToken !== 'your_bot_token_here' &&
      chatId !== 'your_chat_id_here'
    ) {
      const tgText = `🔔 *Новая запись на сессию!*\n\n` +
        `👤 *Имя / Никнейм:* ${client_name}\n` +
        `📞 *Связь:* ${contact_method === 'telegram' ? 'Telegram' : 'Email'}\n` +
        `📝 *Контакты:* \`${contact_info}\`\n` +
        `✅ *Прошел скрининг:* ${screening_passed ? 'Да' : 'Нет'}\n` +
        `📋 *Выбранные сферы:* ${answers_json?.request_areas?.join(', ') || 'нет'}\n` +
        `💬 *Детали запроса:* ${request_details || 'не указаны'}`;

      try {
        const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: tgText,
            parse_mode: 'Markdown',
          }),
        });

        if (!tgRes.ok) {
          console.error('Telegram bot API error:', await tgRes.text());
        }
      } catch (tgErr) {
        console.error('Telegram fetch failed:', tgErr);
      }
    }

    return NextResponse.json({ success: true, booking: data });
  } catch (err: any) {
    console.error('Request handler error:', err);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера при обработке заявки.' },
      { status: 500 }
    );
  }
}
