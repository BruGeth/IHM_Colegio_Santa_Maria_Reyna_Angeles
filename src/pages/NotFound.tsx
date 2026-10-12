import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound: React.FC = () => {
  return (
    <section className="notfound">
      <h1>Página no encontrada</h1>
      <p>La dirección no corresponde a una sección del portal.</p>
      <Link to="/" className="btn" style={{ marginTop: '20px' }}>
        Volver al inicio
      </Link>
    </section>
  );
};
