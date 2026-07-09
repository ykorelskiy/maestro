'use client';

import { useState, useEffect } from 'react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [clientName, setClientName] = useState('');
  const [contactInput, setContactInput] = useState('');
  const [subject, setSubject] = useState<'consultation' | 'question' | 'other'>('consultation');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Восстановление данных из localStorage при открытии
  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      setSuccess(false);
      const savedName = localStorage.getItem('maestro_client_name');
      const savedContact = localStorage.getItem('maestro_contact_info');
      if (savedName) setClientName(savedName);
      if (savedContact) setContactInput(savedContact);
    }
  }, [isOpen]);

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

  if (!isOpen) return null;

  return (
    <div className={`contact-modal-overlay ${isOpen ? 'is-active' : ''}`} onClick={onClose}>
      <div className="contact-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="contact-modal-close" onClick={onClose} aria-label="Закрыть">
          ×
        </button>

        {success ? (
          <div className="contact-modal-success">
            <h4>Заявка принята</h4>
            <p>
              Спасибо за ваше обращение. <br />
              Я свяжусь с вами в ближайшее время.
            </p>
            <button
              type="button"
              className="btn btn-accent frame shimmer"
              style={{ marginTop: '24px', width: '100%' }}
              onClick={onClose}
            >
              Отлично
            </button>
          </div>
        ) : (
          <>
            <h3>Связаться</h3>
            <p className="desc">
              Заполните форму ниже. Я рассмотрю ваш запрос и отвечу в течение 24 часов.
            </p>

            <form onSubmit={handleSubmit} className="contact-modal-form">
              <div className="contact-form-row">
                <label htmlFor="modal_name">Ваше имя</label>
                <input
                  type="text"
                  id="modal_name"
                  className="contact-form-input"
                  placeholder="Имя или никнейм"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="contact-form-row">
                <label htmlFor="modal_contact">Telegram или E-mail</label>
                <input
                  type="text"
                  id="modal_contact"
                  className="contact-form-input"
                  placeholder="@username, t.me/username или name@email.com"
                  value={contactInput}
                  onChange={(e) => setContactInput(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="contact-form-row">
                <label>Тема обращения</label>
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

              <div className="contact-form-row">
                <label htmlFor="modal_message">Сообщение / Запрос</label>
                <textarea
                  id="modal_message"
                  className="contact-form-input contact-form-textarea"
                  placeholder="Опишите кратко суть вашего обращения..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              {errorMsg && <div className="contact-modal-error">{errorMsg}</div>}

              <div className="contact-modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Отмена
                </button>
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
