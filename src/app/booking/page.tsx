'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BookingPage() {
  const [clientName, setClientName] = useState('');
  const [contactInput, setContactInput] = useState('');
  const [subject, setSubject] = useState<'consultation' | 'question' | 'other'>('consultation');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Восстановление данных из localStorage при монтировании
  useEffect(() => {
    const savedName = localStorage.getItem('maestro_client_name');
    const savedContact = localStorage.getItem('maestro_contact_info');
    if (savedName) setClientName(savedName);
    if (savedContact) setContactInput(savedContact);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: clientName,
          contact_input: contactInput,
          subject,
          message,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Ошибка при отправке');
      }

      // Сохраняем в localStorage при успехе
      localStorage.setItem('maestro_client_name', clientName);
      localStorage.setItem('maestro_contact_info', contactInput);

      setSuccess(true);
      
      // Очищаем форму (кроме сохраненных контактов)
      setMessage('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Произошла ошибка. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="booking-page-wrap">
      <div className="noise" aria-hidden="true" />
      <div className="booking-page-card">
        {success ? (
          <div className="contact-modal-success">
            <h4>Заявка принята</h4>
            <p>
              Спасибо за ваше обращение. <br />
              Я свяжусь с вами в ближайшее время.
            </p>
            <Link
              href="/"
              className="btn btn-accent frame shimmer"
              style={{ marginTop: '24px', width: '100%', textAlign: 'center', display: 'block' }}
            >
              Вернуться на главную
            </Link>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="contact-modal-form" style={{ marginTop: '10px', flex: 1 }}>
              <div className="contact-form-row-group">
                <div className="contact-form-row">
                  <label htmlFor="booking_name" className={clientName.trim() ? 'is-filled' : 'is-empty'}>Ваше имя</label>
                  <input
                    type="text"
                    id="booking_name"
                    className="contact-form-input"
                    placeholder="Имя или никнейм"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="contact-form-row">
                  <label htmlFor="booking_contact" className={contactInput.trim() ? 'is-filled' : 'is-empty'}>Telegram или E-mail</label>
                  <input
                    type="text"
                    id="booking_contact"
                    className="contact-form-input"
                    placeholder="@username, t.me/username или name@email.com"
                    value={contactInput}
                    onChange={(e) => setContactInput(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="contact-form-row">
                <label className="is-filled">Тема обращения</label>
                <div className="subject-buttons">
                  <button
                    type="button"
                    className={`subject-btn ${subject === 'consultation' ? 'is-active' : ''}`}
                    onClick={() => setSubject('consultation')}
                    disabled={isSubmitting}
                  >
                    Консультация
                  </button>
                  <button
                    type="button"
                    className={`subject-btn ${subject === 'question' ? 'is-active' : ''}`}
                    onClick={() => setSubject('question')}
                    disabled={isSubmitting}
                  >
                    Вопрос
                  </button>
                  <button
                    type="button"
                    className={`subject-btn ${subject === 'other' ? 'is-active' : ''}`}
                    onClick={() => setSubject('other')}
                    disabled={isSubmitting}
                  >
                    Другое
                  </button>
                </div>
              </div>

              <div className="contact-form-row" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="booking_message" className={message.trim() ? 'is-filled' : 'is-empty'}>Сообщение / Запрос</label>
                <textarea
                  id="booking_message"
                  className="contact-form-input contact-form-textarea"
                  style={{ flex: 1 }}
                  placeholder="Опишите кратко суть вашего обращения..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              {errorMsg && <div className="contact-modal-error">{errorMsg}</div>}

              <div className="contact-modal-actions" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="/" className="btn-cancel" style={{ textDecoration: 'none', display: 'inline-block' }}>
                  На главную
                </Link>
                <button
                  type="submit"
                  className="btn btn-accent frame shimmer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Отправка...' : 'Отправить'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
