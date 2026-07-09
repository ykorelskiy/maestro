'use client';

import { useState, useEffect, useRef } from 'react';

interface BookingData {
  client_name: string;
  contact_method: 'telegram' | 'email';
  contact_info: string;
  request_areas: string[];
  has_clinical_conditions: boolean | null;
  work_on_self: boolean | null;
  request_details: string;
}

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  
  // Booking Form State
  const [showForm, setShowForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BookingData>({
    client_name: '',
    contact_method: 'telegram',
    contact_info: '',
    request_areas: [],
    has_clinical_conditions: null,
    work_on_self: null,
    request_details: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Split name MAESTRO.
  const nameText = 'MAESTRO.';
  const letters = nameText.split('');
  
  const vectors = [
    { x: 0, y: -90, r: -15 },
    { x: -70, y: -60, r: 25 },
    { x: 80, y: -50, r: -20 },
    { x: -40, y: 70, r: 35 },
    { x: 60, y: 65, r: -30 },
    { x: -80, y: -30, r: 20 },
    { x: 40, y: 80, r: 10 },
    { x: 0, y: 0, r: 0 },
  ];

  // Intersection Observer for Section visibility
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  // Scatter Animation on Hover
  const handleMouseEnter = () => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 1000px)').matches;
    if (isReduced || isMobile || !nameRef.current || !cardRef.current) return;

    nameRef.current.classList.add('is-scattered');
    const spans = nameRef.current.querySelectorAll('.contacts-letter');
    const cardWidth = cardRef.current.offsetWidth || 480;
    const scale = cardWidth / 480;

    spans.forEach((span, idx) => {
      const el = span as HTMLElement;
      const v = vectors[idx] || { x: 0, y: 0, r: 0 };
      el.style.transitionDelay = `${idx * 30}ms`;
      el.style.transform = `translateX(${v.x * scale}px) translateY(${v.y * scale}px) rotate(${v.r}deg)`;
    });
  };

  const handleMouseLeave = () => {
    if (!nameRef.current) return;

    nameRef.current.classList.remove('is-scattered');
    const spans = nameRef.current.querySelectorAll('.contacts-letter');
    spans.forEach((span) => {
      const el = span as HTMLElement;
      el.style.transitionDelay = '';
      el.style.transform = '';
    });
  };

  const handleAreaChange = (area: string) => {
    setFormData((prev) => {
      const areas = prev.request_areas.includes(area)
        ? prev.request_areas.filter((a) => a !== area)
        : [...prev.request_areas, area];
      return { ...prev, request_areas: areas };
    });
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!formData.client_name.trim() || !formData.contact_info.trim()) {
        setSubmitError('Пожалуйста, заполните имя и контактные данные.');
        return;
      }
      setSubmitError(null);
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setSubmitError(null);
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: formData.client_name,
          contact_method: formData.contact_method,
          contact_info: formData.contact_info,
          request_details: formData.request_details,
          screening_passed: !formData.has_clinical_conditions && formData.work_on_self,
          answers_json: {
            request_areas: formData.request_areas,
            has_clinical_conditions: formData.has_clinical_conditions,
            work_on_self: formData.work_on_self,
          },
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Ошибка отправки заявки');
      }

      setSubmitSuccess(true);
    } catch (err: any) {
      setSubmitError(err.message || 'Что-то пошло не так. Попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      client_name: '',
      contact_method: 'telegram',
      contact_info: '',
      request_areas: [],
      has_clinical_conditions: null,
      work_on_self: null,
      request_details: '',
    });
    setCurrentStep(1);
    setSubmitError(null);
    setSubmitSuccess(false);
    setShowForm(false);
  };

  const isScreeningFailed =
    formData.has_clinical_conditions === true || formData.work_on_self === false;

  return (
    <section id="contacts" className="contacts-section" ref={sectionRef}>
      <div className="contacts-bg-orb contacts-bg-orb--1"></div>
      <div className="contacts-bg-orb contacts-bg-orb--2"></div>

      <div className="contacts-inner">
        <div className="contacts-text-col">
          <h2 className="contacts-title">
            <span className="contacts-title-word">Связаться</span>
          </h2>
          <div className="contacts-paragraphs">
            <p className="contacts-p">
              Если вы хотите обсудить запрос, уточнить формат работы или понять, ваш ли это случай,
              — напишите мне или заполните форму записи.
            </p>
            <p className="contacts-p">
              Консультации проходят онлайн. Очные встречи возможны редко и только по предварительной
              договорённости.
            </p>
            <p className="contacts-p">
              Я отвечу честно: берусь ли я за такой запрос, в каком формате возможна работа и если нет
              — к какому специалисту лучше обратиться.
            </p>
          </div>
          <div className="contacts-response-line">
            <span className="contacts-status-dot"></span>
            <span className="contacts-response-text">Отвечаю обычно в течение 24 часов</span>
          </div>
          <div className="contacts-confidential">
            <svg
              className="contacts-lock-icon"
              width="12"
              height="14"
              viewBox="0 0 12 14"
              fill="none"
              aria-hidden="true"
            >
              <rect x="2" y="7" width="8" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
              <path d="M4 7V5a2 2 0 0 1 4 0v2" stroke="currentColor" strokeWidth="1.2" fill="none" />
            </svg>
            <span>Конфиденциально</span>
          </div>
        </div>

        <div className="contacts-cards-col">
          {!showForm ? (
            <div
              className="contacts-visit-card"
              id="contactsVisitCard"
              ref={cardRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* Bevel and design elements */}
              <div className="contacts-wave" aria-hidden="true"></div>
              <div className="contacts-bevel" aria-hidden="true"></div>
              <div className="contacts-grain" aria-hidden="true"></div>

              {/* Resting state content */}
              <div className="contacts-resting">
                <div className="contacts-name" ref={nameRef}>
                  {letters.map((char, i) => (
                    <span
                      key={i}
                      className={`contacts-letter ${char === '.' ? 'is-dot' : ''}`}
                    >
                      {char === '.' ? '·' : char}
                    </span>
                  ))}
                </div>
                <div className="contacts-icons-rest">
                  <svg
                    className="contacts-icon-big"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21.5 2.5L2.5 10.5L10.5 13.5L13.5 21.5L21.5 2.5Z" />
                    <path d="M10.5 13.5L14.5 9.5" />
                  </svg>
                  <svg
                    className="contacts-icon-big"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M22 4L12 13L2 4" />
                  </svg>
                </div>
              </div>

              {/* Hover content (Clickable links) */}
              <div className="contacts-hover-content">
                <a
                  href="https://t.me/Maaeesstro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contacts-contact-row"
                  data-row="0"
                >
                  <span className="contacts-contact-icon-wrap">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21.5 2.5L2.5 10.5L10.5 13.5L13.5 21.5L21.5 2.5Z" />
                      <path d="M10.5 13.5L14.5 9.5" />
                    </svg>
                  </span>
                  <span className="contacts-contact-text">@Maaeesstro</span>
                </a>
                <a
                  href="mailto:maestro.fisting@gmail.com"
                  className="contacts-contact-row"
                  data-row="1"
                >
                  <span className="contacts-contact-icon-wrap">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M22 4L12 13L2 4" />
                    </svg>
                  </span>
                  <span className="contacts-contact-text">maestro.fisting@gmail.com</span>
                </a>

                {/* Booking Form button */}
                <button
                  type="button"
                  className="btn shimmer frame"
                  style={{ marginTop: '24px', width: '100%', fontSize: '11px', padding: '10px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowForm(true);
                  }}
                >
                  ЗАПОЛНИТЬ ФОРМУ ЗАПИСИ
                </button>
              </div>
            </div>
          ) : (
            /* Immersive Brutalist Booking Form */
            <div className="contacts-visit-card booking-form-container">
              <div className="contacts-bevel" aria-hidden="true"></div>
              <div className="contacts-grain" aria-hidden="true"></div>

              <div className="booking-form-header">
                <h3>Запись на консультацию</h3>
                <button type="button" className="booking-close-btn" onClick={resetForm}>
                  ×
                </button>
              </div>

              {submitSuccess ? (
                <div className="booking-success">
                  <p>Заявка отправлена успешно.</p>
                  <p className="subtitle">Я свяжусь с вами в течение 24 часов.</p>
                  <button type="button" className="btn frame shimmer" onClick={resetForm}>
                    Готово
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="booking-form-steps">
                  {/* STEP 1: CONTACT DETAILS */}
                  {currentStep === 1 && (
                    <div className="booking-step">
                      <span className="step-number">Шаг 1 из 4</span>
                      <h4>Ваши контакты</h4>
                      <div className="input-group">
                        <label htmlFor="client_name">Как к вам обращаться?</label>
                        <input
                          type="text"
                          id="client_name"
                          className="brutalist-input"
                          placeholder="Имя или никнейм"
                          value={formData.client_name}
                          onChange={(e) =>
                            setFormData({ ...formData, client_name: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="input-group">
                        <label>Предпочтительный способ связи:</label>
                        <div className="radio-group">
                          <button
                            type="button"
                            className={`brutalist-btn-choice ${formData.contact_method === 'telegram' ? 'active' : ''}`}
                            onClick={() => setFormData({ ...formData, contact_method: 'telegram' })}
                          >
                            Telegram
                          </button>
                          <button
                            type="button"
                            className={`brutalist-btn-choice ${formData.contact_method === 'email' ? 'active' : ''}`}
                            onClick={() => setFormData({ ...formData, contact_method: 'email' })}
                          >
                            Email
                          </button>
                        </div>
                      </div>
                      <div className="input-group">
                        <label htmlFor="contact_info">
                          {formData.contact_method === 'telegram' ? 'Telegram Username' : 'Электронная почта'}
                        </label>
                        <input
                          type="text"
                          id="contact_info"
                          className="brutalist-input"
                          placeholder={formData.contact_method === 'telegram' ? '@username' : 'name@example.com'}
                          value={formData.contact_info}
                          onChange={(e) =>
                            setFormData({ ...formData, contact_info: e.target.value })
                          }
                          required
                        />
                      </div>
                      {submitError && <div className="booking-error-msg">{submitError}</div>}
                      <div className="booking-buttons">
                        <button type="button" className="btn frame shimmer" onClick={handleNextStep}>
                          Далее
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: REQUEST AREAS */}
                  {currentStep === 2 && (
                    <div className="booking-step">
                      <span className="step-number">Шаг 2 из 4</span>
                      <h4>Направления запроса</h4>
                      <p className="step-description">Выберите сферы, которые вас интересуют (можно несколько):</p>
                      <div className="checkbox-grid">
                        {['Сексуальность', 'Динамика власти/контроля', 'Отношения', 'Исследование фантазий', 'Стыд/уязвимость', 'Другое'].map((area) => (
                          <button
                            key={area}
                            type="button"
                            className={`brutalist-checkbox ${formData.request_areas.includes(area) ? 'checked' : ''}`}
                            onClick={() => handleAreaChange(area)}
                          >
                            <span className="checkbox-box"></span>
                            <span className="checkbox-label">{area}</span>
                          </button>
                        ))}
                      </div>
                      <div className="booking-buttons">
                        <button type="button" className="btn-back" onClick={handlePrevStep}>
                          Назад
                        </button>
                        <button type="button" className="btn frame shimmer" onClick={handleNextStep}>
                          Далее
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: SCREENING */}
                  {currentStep === 3 && (
                    <div className="booking-step">
                      <span className="step-number">Шаг 3 из 4</span>
                      <h4>Важные вопросы (Скрининг)</h4>
                      
                      <div className="input-group">
                        <label>
                          Имеются ли у вас острые психиатрические состояния, клинические диагнозы,
                          суицидальные мысли или химические зависимости?
                        </label>
                        <div className="radio-group">
                          <button
                            type="button"
                            className={`brutalist-btn-choice ${formData.has_clinical_conditions === true ? 'active' : ''}`}
                            onClick={() => setFormData({ ...formData, has_clinical_conditions: true })}
                          >
                            Да, имеются
                          </button>
                          <button
                            type="button"
                            className={`brutalist-btn-choice ${formData.has_clinical_conditions === false ? 'active' : ''}`}
                            onClick={() => setFormData({ ...formData, has_clinical_conditions: false })}
                          >
                            Нет, отсутствуют
                          </button>
                        </div>
                      </div>

                      <div className="input-group" style={{ marginTop: '20px' }}>
                        <label>Вы записываетесь для работы над собой или хотите «починить» партнера?</label>
                        <div className="radio-group">
                          <button
                            type="button"
                            className={`brutalist-btn-choice ${formData.work_on_self === true ? 'active' : ''}`}
                            onClick={() => setFormData({ ...formData, work_on_self: true })}
                          >
                            Работа над собой
                          </button>
                          <button
                            type="button"
                            className={`brutalist-btn-choice ${formData.work_on_self === false ? 'active' : ''}`}
                            onClick={() => setFormData({ ...formData, work_on_self: false })}
                          >
                            Починить партнёра
                          </button>
                        </div>
                      </div>

                      {isScreeningFailed ? (
                        <div className="booking-screening-warning">
                          <p>⚠️ <strong>Внимание</strong></p>
                          <p>
                            К сожалению, я не работаю с острыми клиническими состояниями,
                            зависимостями или запросами об изменении других людей. Наша работа в таком
                            случае не принесет результата. Рекомендую обратиться к профильному врачу или
                            семейному терапевту.
                          </p>
                        </div>
                      ) : null}

                      <div className="booking-buttons">
                        <button type="button" className="btn-back" onClick={handlePrevStep}>
                          Назад
                        </button>
                        {!isScreeningFailed && (formData.has_clinical_conditions !== null && formData.work_on_self !== null) && (
                          <button type="button" className="btn frame shimmer" onClick={handleNextStep}>
                            Далее
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* STEP 4: REQUEST DETAILS & SUBMIT */}
                  {currentStep === 4 && (
                    <div className="booking-step">
                      <span className="step-number">Шаг 4 из 4</span>
                      <h4>Детали запроса</h4>
                      <div className="input-group">
                        <label htmlFor="request_details">Опишите ваш запрос в свободной форме (необязательно):</label>
                        <textarea
                          id="request_details"
                          className="brutalist-textarea"
                          rows={4}
                          placeholder="С какими мыслями или трудностями вы пришли..."
                          value={formData.request_details}
                          onChange={(e) =>
                            setFormData({ ...formData, request_details: e.target.value })
                          }
                        />
                      </div>
                      
                      {submitError && <div className="booking-error-msg">{submitError}</div>}

                      <div className="booking-buttons">
                        <button type="button" className="btn-back" disabled={isSubmitting} onClick={handlePrevStep}>
                          Назад
                        </button>
                        <button type="submit" className="btn frame shimmer btn-primary" disabled={isSubmitting}>
                          {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
