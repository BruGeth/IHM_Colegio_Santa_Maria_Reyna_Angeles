import React, { useState, useEffect } from 'react';
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
  const [successResult, setSuccessResult] = useState<{ id: string } | null>(
    null
  );
  const [serverError, setServerError] = useState<string | null>(null);

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
      errs.name = 'Escribe un nombre de al menos 3 caracteres.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Escribe un correo válido.';
    }
    if (phone.trim() && !/^[0-9 +()\-]{6,14}$/.test(phone.trim())) {
      errs.phone = 'Revisa el formato del teléfono.';
    }
    if (!topic) {
      errs.topic = 'Selecciona un motivo.';
    }
    if (message.trim().length < 12 || message.trim().length > 1000) {
      errs.message = 'Escribe entre 12 y 1000 caracteres.';
    }
    if (!consent) {
      errs.consent = 'Confirma el uso de datos de prueba.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await createContact({
        name,
        email,
        phone,
        topic,
        message,
        consent,
      });
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
  };

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
            <h3>¿Cómo podemos orientarte?</h3>
            <p>
              Completa tu consulta con datos de prueba. Recibirás un código de
              seguimiento y podrás verla en la intranet de administración.
            </p>

            {successResult ? (
              <div
                className="success"
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
              <form onSubmit={handleSubmit} noValidate>
                <div className="formGrid">
                  {/* NOMBRE */}
                  <div className="field">
                    <label htmlFor="name">Nombre completo *</label>
                    <input
                      id="name"
                      type="text"
                      autoComplete="name"
                      maxLength={80}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={errors.name ? 'invalid' : ''}
                      aria-invalid={Boolean(errors.name)}
                    />
                    {errors.name && <span className="error">{errors.name}</span>}
                  </div>

                  {/* EMAIL */}
                  <div className="field">
                    <label htmlFor="email">Correo electrónico *</label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      maxLength={120}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={errors.email ? 'invalid' : ''}
                      aria-invalid={Boolean(errors.email)}
                    />
                    {errors.email && (
                      <span className="error">{errors.email}</span>
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
                    />
                    {errors.phone && (
                      <span className="error">{errors.phone}</span>
                    )}
                  </div>

                  {/* MOTIVO */}
                  <div className="field">
                    <label htmlFor="topic">Motivo de consulta *</label>
                    <select
                      id="topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className={errors.topic ? 'invalid' : ''}
                      aria-invalid={Boolean(errors.topic)}
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
                      <span className="error">{errors.topic}</span>
                    )}
                  </div>

                  {/* MENSAJE */}
                  <div className="field full">
                    <label htmlFor="message">Tu consulta *</label>
                    <textarea
                      id="message"
                      maxLength={1000}
                      placeholder="Cuéntanos qué información necesitas"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className={errors.message ? 'invalid' : ''}
                      aria-invalid={Boolean(errors.message)}
                    ></textarea>
                    <span className="help">
                      Entre 12 y 1000 caracteres. Usa información ficticia.
                    </span>
                    {errors.message && (
                      <span className="error">{errors.message}</span>
                    )}
                  </div>

                  {/* CONSENT CHECKBOX */}
                  <div className="field full checkfield">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      aria-invalid={Boolean(errors.consent)}
                    />
                    <label htmlFor="terms">
                      Entiendo que mis datos de prueba se guardarán en este
                      entorno académico. Esta consulta no se envía al colegio.
                    </label>
                  </div>
                  {errors.consent && (
                    <span className="error full">{errors.consent}</span>
                  )}

                  {serverError && (
                    <div className="notice full">{serverError}</div>
                  )}

                  <div className="full">
                    <button
                      className="btn"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? 'Registrando…'
                        : 'Registrar consulta →'}
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
    </>
  );
};

