import React from 'react';
import { Link } from 'react-router-dom';
import { levels, galleryData } from '../services/mockData';

export const Inicio: React.FC = () => {
  const previewPhotos = galleryData.slice(0, 3);

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="container heroGrid">
          <div>
            <div className="eyebrow">Santa María · La Perla, Callao</div>
            <h1>
              Aprendemos hoy.
              <br />
              <em>
                Crecemos para
                <br />
                la vida.
              </em>
            </h1>
            <p className="lead">
              Una educación que une conocimiento, valores y acompañamiento.
              Descubre la propuesta de Santa María Reyna de los Ángeles para
              cada etapa escolar.
            </p>
            <div className="actions">
              <Link to="/institucion" className="btn">
                Conoce nuestro colegio →
              </Link>
              <Link to="/contacto" className="btn secondary">
                Solicitar información
              </Link>
            </div>
            <div className="heroMeta">
              Inicial, Primaria y Secundaria · Una misma comunidad
            </div>
          </div>

          <figure className="heroPhoto">
            <img
              src="/assets/foto12.jpg"
              alt="Estudiantes del colegio compartiendo en un espacio al aire libre"
              fetchPriority="high"
            />
            <figcaption className="photoCaption">
              <strong>Una comunidad que aprende junta.</strong>
              <span>Fotografía del archivo público del colegio</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* QUICKBAR */}
      <section className="quickbar">
        <div className="container quickgrid">
          <Link to="/institucion">
            <span className="quickicon" aria-hidden="true">
              ⌂
            </span>
            <span>
              <strong>Conoce Santa María</strong>
              <small>Identidad y propuesta educativa</small>
            </span>
            <span className="quickarrow" aria-hidden="true">
              ↗
            </span>
          </Link>
          <Link to="/contacto">
            <span className="quickicon" aria-hidden="true">
              ✉
            </span>
            <span>
              <strong>Información para familias</strong>
              <small>Da el siguiente paso con nosotros</small>
            </span>
            <span className="quickarrow" aria-hidden="true">
              ↗
            </span>
          </Link>
          <Link to="/intranet">
            <span className="quickicon" aria-hidden="true">
              ▦
            </span>
            <span>
              <strong>Intranet académica</strong>
              <small>Cursos, actividades y calificaciones</small>
            </span>
            <span className="quickarrow" aria-hidden="true">
              ↗
            </span>
          </Link>
        </div>
      </section>

      {/* NIVELES */}
      <section className="section">
        <div className="container">
          <div className="sectionHead">
            <div>
              <div className="eyebrow">Cada etapa tiene su propio camino</div>
              <h2>Un lugar para aprender y crecer</h2>
              <p className="sectionIntro">
                Acompañamos el desarrollo personal y el aprendizaje desde los
                primeros descubrimientos hasta los nuevos desafíos.
              </p>
            </div>
            <Link to="/contacto" className="inlineLink">
              Encuentra tu nivel →
            </Link>
          </div>

          <div className="cards">
            {Object.entries(levels).map(([key, level]) => (
              <article key={key} className="card">
                <img
                  src={`/assets/${level.image}`}
                  loading="lazy"
                  alt={`Actividad escolar del nivel ${level.name}`}
                />
                <div className="cardBody">
                  <div className="label">{level.age}</div>
                  <h3>{level.name}</h3>
                  <p>{level.summary}</p>
                  <Link to={`/${key}`} className="inlineLink">
                    Conocer {level.name}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROPUESTA / IDENTIDAD */}
      <section className="section alt">
        <div className="container twocol">
          <img
            className="widePhoto"
            src="/assets/foto33.jpg"
            loading="lazy"
            alt="Actividad de convivencia en el patio escolar"
          />
          <div>
            <div className="eyebrow">Más que un espacio de aprendizaje</div>
            <h2>Una educación que empieza con las personas.</h2>
            <p className="prose">
              La propuesta publicada por el colegio combina aprendizaje
              significativo con formación humana y cristiana. La participación
              de las familias acompaña el crecimiento de sus estudiantes.
            </p>
            <ul className="detailList">
              <li>Aprender observando, preguntando y resolviendo.</li>
              <li>Desarrollar la creatividad y convivir con respeto.</li>
              <li>Crecer con acompañamiento y valores.</li>
            </ul>
            <Link to="/institucion" className="inlineLink">
              Nuestra identidad →
            </Link>
          </div>
        </div>
      </section>

      {/* GALERIA PREVIEW */}
      <section className="section">
        <div className="container">
          <div className="sectionHead">
            <div>
              <div className="eyebrow">Vida escolar</div>
              <h2>Momentos que nos unen</h2>
            </div>
            <Link to="/galeria" className="inlineLink">
              Explorar la galería →
            </Link>
          </div>

          <div className="gallery">
            {previewPhotos.map((photo, index) => (
              <Link
                key={index}
                to={`/galeria?nivel=${photo.category}`}
                className="photo"
              >
                <img
                  src={`/assets/${photo.image}`}
                  loading="lazy"
                  alt={photo.desc}
                />
                <span className="photoInfo">
                  <em aria-hidden="true">↗</em>
                  <strong>{photo.title}</strong>
                  <small>
                    {levels[photo.category].name} · Archivo institucional
                  </small>
                </span>
              </Link>
            ))}
          </div>
          <p className="source">
            Fotografías del archivo público institucional. No representan un
            calendario actual de actividades.
          </p>
        </div>
      </section>

      {/* CTA */}
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

