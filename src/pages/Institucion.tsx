import React from 'react';
import { Link } from 'react-router-dom';

export const Institucion: React.FC = () => {
  return (
    <>
      <section className="pageHero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Inicio</Link> / Somos Santa María
          </div>
          <h1>Somos Santa María</h1>
          <p className="lead">
            Una comunidad educativa en La Perla, Callao, con una propuesta que
            integra aprendizaje y formación en valores.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container twocol">
          <div>
            <div className="eyebrow">Nuestra identidad</div>
            <h2>
              Aprender con sentido.
              <br />
              Crecer con valores.
            </h2>
            <p className="prose">
              Santa María Reyna de los Ángeles ofrece Inicial, Primaria y
              Secundaria. Su propuesta pública reconoce a cada estudiante como
              una persona en desarrollo, con posibilidades de cambio y mejora.
            </p>
            <p className="prose">
              El aprendizaje constructivista, la creatividad y la formación
              humana y cristiana orientan su mensaje educativo.
            </p>
            <a
              className="inlineLink"
              href="https://www.santamra.edu.pe/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Leer la presentación institucional ↗
            </a>
          </div>
          <img
            className="widePhoto"
            src="/assets/foto22.jpg"
            alt="Comunidad de Santa María participando en una actividad cívica"
          />
        </div>
      </section>

      <section className="section alt">
        <div className="container twocol">
          <article className="panel">
            <div className="eyebrow">Propósito educativo</div>
            <h2>Formación integral</h2>
            <p>
              Desarrollar herramientas para aprender y acompañar la construcción
              de la personalidad, con respeto por la persona y su crecimiento.
            </p>
          </article>
          <article className="panel">
            <div className="eyebrow">Una mirada al futuro</div>
            <h2>Personas que participan</h2>
            <p>
              Fortalecer conocimientos y valores para afrontar desafíos y
              participar de manera responsable en la comunidad.
            </p>
          </article>
        </div>
        <div className="container">
          <p className="source">
            Síntesis editorial de la información institucional; no reemplaza la
            misión o visión oficial.{' '}
            <a
              href="https://www.santamra.edu.pe/mision-y-vision.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Consultar el documento del colegio ↗
            </a>
            .
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="eyebrow">Lo que orienta la propuesta</div>
          <h2>Conocimiento, convivencia y comunidad</h2>
          <div className="bulletCards">
            <article className="bullet">
              <b>01</b>
              <h3>Aprendizaje activo</h3>
              <p>Observar, cuestionar, resolver problemas y tomar decisiones.</p>
            </article>
            <article className="bullet">
              <b>02</b>
              <h3>Formación en valores</h3>
              <p>
                Promover el respeto y el desarrollo personal con una orientación
                cristiana.
              </p>
            </article>
            <article className="bullet">
              <b>03</b>
              <h3>Acompañamiento familiar</h3>
              <p>
                Comunicación entre docentes y familias sobre los avances del
                aprendizaje.
              </p>
            </article>
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
