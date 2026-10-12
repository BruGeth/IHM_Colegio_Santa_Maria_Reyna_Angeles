import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { levels } from '../services/mockData';

interface NivelProps {
  levelKey: 'inicial' | 'primaria' | 'secundaria';
}

export const Nivel: React.FC<NivelProps> = ({ levelKey }) => {
  const level = levels[levelKey];

  if (!level) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <section className="pageHero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Inicio</Link> / {level.name}
          </div>
          <h1>{level.name}</h1>
          <p className="lead">{level.summary}</p>
        </div>
      </section>

      <section className="section">
        <div className="container twocol">
          <div>
            <div className="eyebrow">Una etapa para descubrir</div>
            <h2>{level.title}</h2>
            <p className="prose">{level.intro}</p>
            <div className="levelMeta">
              <span className="pill">{level.age}</span>
              <span className="pill">Formación en valores</span>
            </div>
            <div className="actions">
              <Link
                to={`/contacto?motivo=${encodeURIComponent(level.name)}`}
                className="btn"
              >
                Consultar por {level.name} →
              </Link>
              <Link to={`/galeria?nivel=${levelKey}`} className="inlineLink">
                Vida escolar ↗
              </Link>
            </div>
          </div>
          <figure>
            <img
              className="widePhoto"
              src={`/assets/${level.image}`}
              alt={`Actividad del archivo institucional de ${level.name}`}
            />
            <figcaption className="source">
              Archivo fotográfico del colegio · fecha no especificada.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="eyebrow">Nuestra propuesta educativa</div>
          <h2>Lo que acompaña su aprendizaje</h2>
          <div className="bulletCards">
            {level.features.map(([title, desc], i) => (
              <article key={i} className="bullet">
                <b>0{i + 1}</b>
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
          <p className="source">
            Síntesis de la{' '}
            <a
              href={`https://www.santamra.edu.pe/${levelKey}.html`}
              target="_blank"
              rel="noopener noreferrer"
            >
              propuesta publicada por el colegio ↗
            </a>
            . Consulta con la institución los detalles vigentes.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Resolvemos tus dudas</h2>
          <div className="faq">
            <details>
              <summary>¿Cómo solicito información de {level.name}?</summary>
              <p>
                Completa la consulta de demostración en Contacto. Para una
                gestión oficial, utiliza los canales publicados en el sitio del
                colegio.
              </p>
            </details>
            <details>
              <summary>¿Dónde encuentro los requisitos de ingreso?</summary>
              <p>
                La institución debe confirmar requisitos, vacantes y costos.
                Accede al contacto oficial para obtener información actualizada.
              </p>
            </details>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="ctaBand">
            <div>
              <div className="eyebrow">Estamos cerca de tu familia</div>
              <h2>Conversemos sobre su educación.</h2>
              <p>
                Encuentra información y orientación para la etapa que estás
                buscando.
              </p>
            </div>
            <Link to="/contacto" className="btn">
              Solicitar información →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

