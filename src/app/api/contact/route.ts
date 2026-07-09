import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

function parseContact(info: string) {
  const trimmed = info.trim();

  // Регулярное выражение для проверки электронной почты
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (emailRegex.test(trimmed)) {
    return {
      method: 'email',
      info: trimmed,
    };
  }

  // Иначе трактуем как Telegram
  let telegramHandle = trimmed;
  
  // Очищаем от t.me ссылки
  telegramHandle = telegramHandle.replace(/^(https?:\/\/)?(www\.)?t\.me\//i, '');
  
  // Убираем ведущую собачку @
  if (telegramHandle.startsWith('@')) {
    telegramHandle = telegramHandle.substring(1);
  }

  return {
    method: 'telegram',
    info: telegramHandle,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { client_name, contact_input, subject, message } = body;

    // Валидация входных данных
    if (!client_name || !client_name.trim()) {
      return NextResponse.json(
        { message: 'Пожалуйста, заполните имя.' },
        { status: 400 }
      );
    }

    if (!contact_input || !contact_input.trim()) {
      return NextResponse.json(
        { message: 'Пожалуйста, укажите Telegram или Email для связи.' },
        { status: 400 }
      );
    }

    // Парсим контактные данные
    const parsedContact = parseContact(contact_input);

    // Дополнительная валидация
    if (parsedContact.method === 'email') {
      // Уже проверено регулярным выражением в parseContact
    } else {
      // Валидация Telegram имени (от 5 символов, буквы, цифры, подчеркивания)
      if (parsedContact.info.length < 3) {
        return NextResponse.json(
          { message: 'Имя пользователя Telegram должно содержать не менее 3 символов.' },
          { status: 400 }
        );
      }
    }

    // Сохранение в Supabase
    const { error } = await supabase.from('contact_requests').insert([
      {
        client_name: client_name.trim(),
        contact_info: parsedContact.info,
        contact_method: parsedContact.method,
        subject: subject || 'other',
        message: message ? message.trim() : null,
      },
    ]);

    if (error) {
      console.error('Supabase save error:', error);
      return NextResponse.json(
        { message: 'Не удалось сохранить запись в базу данных.' },
        { status: 500 }
      );
    }

    // Заглушка для последующей отправки в Telegram
    console.log('\n=========================================');
    console.log('[TELEGRAM NOTIFICATION STUB]');
    console.log(`👤 Имя: ${client_name}`);
    console.log(`📞 Связь: ${parsedContact.method === 'telegram' ? 'Telegram' : 'Email'}`);
    console.log(`📝 Контакт: ${parsedContact.info}`);
    console.log(`🎯 Тема: ${subject}`);
    console.log(`💬 Сообщение: ${message || 'отсутствует'}`);
    console.log('=========================================\n');

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('API Contact route error:', err);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера при обработке запроса.' },
      { status: 500 }
    );
  }
}
