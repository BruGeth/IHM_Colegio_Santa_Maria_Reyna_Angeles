import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="sitefooter">
      <div className="container footgrid">
        <div>
          <Link to="/" className="brand footerbrand">
            <img
              src="/assets/logo.png"
              width="50"
              height="52"
              alt="Escudo del colegio"
            />
            <span>
              <strong>Santa María</strong>
              <small>Reyna de los Ángeles</small>
            </span>
          </Link>
          <p>
            Aprendizaje, valores y acompañamiento en cada etapa de la vida
            escolar.
          </p>
          <span className="footerlabel">
            Inicial · Primaria · Secundaria
          </span>
        </div>

        <div>
          <h3>El colegio</h3>
          <Link to="/institucion">Nuestra propuesta</Link>
          <Link to="/galeria">Vida escolar</Link>
          <Link to="/contacto">Consultas e información</Link>
          <Link to="/intranet">Intranet académica</Link>
        </div>

        <div>
          <h3>Encuéntranos</h3>
          <p>
            Urb. Santa Luisa, Calle Ucayali 195
            <br />
            La Perla, Callao, Perú
          </p>
          <a
            href="https://www.santamra.edu.pe/contactenos.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Consultar canales oficiales ↗
          </a>
        </div>
      </div>

      <div className="container legal">
        <span>© 2026 · Proyecto académico independiente</span>
        <span>
          Contenido y fotografías del archivo público del colegio. No es un
          canal oficial.
        </span>
      </div>
    </footer>
  );
};
