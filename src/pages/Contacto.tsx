import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { createContact } from '../services/dataService';

export const Contacto: React.FC = () => {
  const [searchParams] = useSearchParams();
  const motivoParam = searchParams.get('motivo') || '';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [successResult, setSuccessResult] = useState<{ id: string } | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const reviewBtnRef = useRef<HTMLButtonElement>(null);
  const editBtnRef = useRef<HTMLButtonElement>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'Contacto | Santa María';
    const h1 = document.querySelector('h1');
    if (h1) {
      h1.tabIndex = -1;
      h1.focus();
    }
  }, []);

  useEffect(() => {
    if (
      motivoParam &&
      [
        'Inicial',
        'Primaria',
        'Secundaria',
        'Información institucional',
        'Otro',
      ].includes(motivoParam)
    ) {
      setTopic(motivoParam);
    }
  }, [motivoParam]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (name.trim().length < 3) {
      errs.name = 'Nombre: escribe al menos 3 caracteres.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Correo: usa un formato como familia@example.com.';
    }
    if (phone.trim() && !/^[0-9 +()\-]{6,14}$/.test(phone.trim())) {
      errs.phone = 'Teléfono: usa entre 6 y 14 caracteres, solo números y signos de teléfono.';
    }
    if (!topic) {
      errs.topic = 'Motivo: selecciona una opción de la lista.';
    }
    if (message.trim().length < 12 || message.trim().length > 1000) {
      errs.message = 'Consulta: escribe entre 12 y 1000 caracteres.';
    }
    if (!consent) {
      errs.consent = 'Confirmación: marca la casilla para indicar que son datos de prueba.';
    }

    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setTimeout(() => {
        summaryRef.current?.focus();
      }, 50);
      return false;
    }
    return true;
  };

  const handleStartReview = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;
    setShowReviewDialog(true);
    setTimeout(() => {
      editBtnRef.current?.focus();
    }, 50);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const res = await createContact({
        name,
        email,
        phone,
        topic,
        message,
        consent,
      });
      setShowReviewDialog(false);
      setSuccessResult(res);
      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setConsent(false);
      setErrors({});
    } catch (err: any) {
      setServerError(
        err?.message || 'Ocurrió un error al registrar la consulta.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSuccessResult(null);
    setServerError(null);
    setErrors({});
    setShowReviewDialog(false);
  };

  const errorEntries = Object.entries(errors);

  return (
    <>
      <section className="pageHero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Inicio</Link> / Contacto
          </div>
          <h1>Conversemos</h1>
          <p className="lead">
            Encuentra el canal adecuado para conocer la propuesta educativa o
            resolver tus dudas.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container formWrap">
          <article className="panel">
            <div className="eyebrow">Información para familias</div>
            <h2>¿Cómo podemos orientarte?</h2>
            <p>
              Completa tu consulta con datos de prueba. Recibirás un código de
              seguimiento y podrás verla en la intranet de administración.
            </p>

            {successResult ? (
              <div
                className="a11y-status"
                role="status"
                aria-live="polite"
                style={{ marginTop: '24px' }}
              >
                <strong>Tu consulta quedó registrada.</strong>
                <p>
                  Código de seguimiento: <b>{successResult.id}</b>. Está
                  disponible en la bandeja de Consultas del administrador. No se
                  ha enviado ningún mensaje al colegio.
                </p>
                <button
                  type="button"
                  className="btn secondary"
                  onClick={handleReset}
                  style={{ marginTop: '16px' }}
                >
                  Registrar otra consulta
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleStartReview}
                noValidate
                aria-describedby="contactSteps"
              >
                <p className="a11y-help" id="contactSteps">
                  Paso 1 de 2. Completa los campos marcados con asterisco (*).
                  Después podrás revisar y confirmar tu consulta. Usa datos
                  ficticios.
                </p>

                {errorEntries.length > 0 && (
                  <div
                    className="a11y-summary"
                    tabIndex={-1}
                    ref={summaryRef}
                    role="alert"
                    aria-labelledby="summaryTitle"
                  >
                    <h3 id="summaryTitle" style={{ margin: '0 0 8px 0' }}>
                      Revisa {errorEntries.length}{' '}
                      {errorEntries.length === 1 ? 'campo' : 'campos'} antes de
                      continuar
                    </h3>
                    <p>Corrige los datos indicados y vuelve a registrar la consulta.</p>
                    <ul>
                      {errorEntries.map(([fieldId, errMsg]) => (
                        <li key={fieldId}>
                          <a
                            href={`#${fieldId}`}
                            onClick={(e) => {
                              e.preventDefault();
                              const el = document.getElementById(fieldId);
                              el?.focus();
                            }}
                          >
                            {errMsg}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="formGrid">
                  {/* NOMBRE */}
                  <div className="field">
                    <label htmlFor="name">Nombre completo *</label>
                    <input
                      id="name"
                      type="text"
                      autoComplete="name"
                      maxLength={80}
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={errors.name ? 'invalid' : ''}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? 'nameErr' : undefined}
                    />
                    {errors.name && (
                      <span className="a11y-error" id="nameErr">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  {/* EMAIL */}
                  <div className="field">
                    <label htmlFor="email">Correo electrónico *</label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      maxLength={120}
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={errors.email ? 'invalid' : ''}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'emailErr' : undefined}
                    />
                    {errors.email && (
                      <span className="a11y-error" id="emailErr">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  {/* TELEFONO */}
                  <div className="field">
                    <label htmlFor="phone">Teléfono (opcional)</label>
                    <input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      maxLength={14}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={errors.phone ? 'invalid' : ''}
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={errors.phone ? 'phoneErr' : undefined}
                    />
                    {errors.phone && (
                      <span className="a11y-error" id="phoneErr">
                        {errors.phone}
                      </span>
                    )}
                  </div>

                  {/* MOTIVO */}
                  <div className="field">
                    <label htmlFor="topic">Motivo de consulta *</label>
                    <select
                      id="topic"
                      required
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className={errors.topic ? 'invalid' : ''}
                      aria-invalid={Boolean(errors.topic)}
                      aria-describedby={errors.topic ? 'topicErr' : undefined}
                    >
                      <option value="">Selecciona un motivo</option>
                      {[
                        'Inicial',
                        'Primaria',
                        'Secundaria',
                        'Información institucional',
                        'Otro',
                      ].map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    {errors.topic && (
                      <span className="a11y-error" id="topicErr">
                        {errors.topic}
                      </span>
                    )}
                  </div>

                  {/* MENSAJE */}
                  <div className="field full">
                    <label htmlFor="message">Tu consulta *</label>
                    <textarea
                      id="message"
                      required
                      minLength={12}
                      maxLength={1000}
                      placeholder="Cuéntanos qué información necesitas"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className={errors.message ? 'invalid' : ''}
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={`messageHelp ${errors.message ? 'messageErr' : ''}`.trim()}
                    ></textarea>
                    <span className="help" id="messageHelp">
                      Entre 12 y 1000 caracteres. Usa información ficticia.
                    </span>
                    {errors.message && (
                      <span className="a11y-error" id="messageErr">
                        {errors.message}
                      </span>
                    )}
                  </div>

                  {/* CONSENT CHECKBOX */}
                  <div className="field full checkfield">
                    <input
                      id="terms"
                      type="checkbox"
                      required
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      aria-invalid={Boolean(errors.consent)}
                      aria-describedby={errors.consent ? 'termsErr' : undefined}
                    />
                    <label htmlFor="terms">
                      Entiendo que mis datos de prueba se guardarán en este
                      entorno académico. Esta consulta no se envía al colegio. *
                    </label>
                  </div>
                  {errors.consent && (
                    <span className="a11y-error full" id="termsErr">
                      {errors.consent}
                    </span>
                  )}

                  {serverError && (
                    <div className="a11y-summary full" role="alert">
                      {serverError}
                    </div>
                  )}

                  <div className="full">
                    <button
                      ref={submitBtnRef}
                      className="btn"
                      type="submit"
                    >
                      Revisar consulta (Paso 1 de 2) →
                    </button>
                  </div>
                </div>
              </form>
            )}
          </article>

          <aside>
            <div className="eyebrow">Visítanos</div>
            <h2>Estamos en La Perla.</h2>
            <div className="contactItem">
              <small>Dirección publicada por el colegio</small>
              <strong>
                Urb. Santa Luisa, Calle Ucayali 195
                <br />
                La Perla, Callao, Perú
              </strong>
            </div>
            <div className="contactItem">
              <small>Referencia de ubicación</small>
              <strong>
                Entre Av. Haya de la Torre y Av. Pacífico, cuadra 4
              </strong>
            </div>
            <div className="contactItem">
              <small>Contacto oficial</small>
              <a
                className="inlineLink"
                href="https://www.santamra.edu.pe/contactenos.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver teléfonos y correo vigentes ↗
              </a>
            </div>
            <div className="mapCard">
              <div>
                <strong>Santa María Reyna de los Ángeles</strong>
                <p>Calle Ucayali 195 · La Perla</p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Colegio+Santa+Maria+Reyna+de+los+Angeles+Ucayali+195+La+Perla+Callao"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Buscar ubicación en Google Maps ↗
                </a>
              </div>
            </div>
            <p className="source">
              Ubicación basada en el sitio público del colegio. Para matrícula,
              costos y vacantes, consulta directamente con la institución.
            </p>
          </aside>
        </div>
      </section>

      {/* DIÁLOGO ACCESIBLE DE REVISIÓN Y CONFIRMACIÓN (PASO 2 DE 2) */}
      {showReviewDialog && (
        <dialog
          className="a11y-review"
          open
          aria-labelledby="reviewTitle"
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setShowReviewDialog(false);
              submitBtnRef.current?.focus();
            }
          }}
        >
          <h2 id="reviewTitle">Revisa tu consulta</h2>
          <p>
            Paso 2 de 2. Confirma los datos ficticios antes de registrarlos. La
            consulta se guarda en el entorno de demostración.
          </p>
          <dl>
            <dt>Nombre:</dt>
            <dd>{name}</dd>
            <dt>Correo:</dt>
            <dd>{email}</dd>
            {phone && (
              <>
                <dt>Teléfono:</dt>
                <dd>{phone}</dd>
              </>
            )}
            <dt>Motivo:</dt>
            <dd>{topic}</dd>
            <dt>Consulta:</dt>
            <dd>{message}</dd>
          </dl>

          {serverError && (
            <div className="a11y-error" role="alert" style={{ marginBottom: '14px' }}>
              {serverError}
            </div>
          )}

          <div className="actions">
            <button
              ref={reviewBtnRef}
              type="button"
              className="primary"
              disabled={isSubmitting}
              onClick={handleConfirmSubmit}
            >
              {isSubmitting ? 'Registrando…' : 'Confirmar registro'}
            </button>
            <button
              ref={editBtnRef}
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                setShowReviewDialog(false);
                submitBtnRef.current?.focus();
              }}
            >
              Volver a editar
            </button>
          </div>
        </dialog>
      )}
    </>
  );
};
