import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <>
      <a className="skip" href="#main">
        Saltar al contenido
      </a>

      <div className="topline">
        <div className="container">
          <span>La Perla, Callao · Educación con valores</span>
          <a
            href="https://www.santamra.edu.pe/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Sitio oficial del colegio ↗
          </a>
        </div>
      </div>

      <header className="sitehead">
        <div className="container headinner">
          <Link to="/" className="brand" aria-label="Santa María, ir al inicio">
            <img
              src="/assets/logo.png"
              width="50"
              height="52"
              alt="Escudo de Santa María"
            />
            <span>
              <strong>Santa María</strong>
              <small>Reyna de los Ángeles</small>
            </span>
          </Link>

          <button
            id="menuToggle"
            className="menuToggle"
            aria-expanded={isOpen}
            aria-controls="siteNav"
            onClick={toggleMenu}
            aria-label="Abrir o cerrar menú de navegación"
          >
            ☰ <span>Menú</span>
          </button>

          <nav
            id="siteNav"
            className={isOpen ? 'open' : ''}
            aria-label="Navegación principal"
          >
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Inicio
            </NavLink>
            <NavLink
              to="/institucion"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Nosotros
            </NavLink>
            <NavLink
              to="/inicial"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Inicial
            </NavLink>
            <NavLink
              to="/primaria"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Primaria
            </NavLink>
            <NavLink
              to="/secundaria"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Secundaria
            </NavLink>
            <NavLink
              to="/galeria"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Galería
            </NavLink>
            <NavLink
              to="/contacto"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Contacto
            </NavLink>
            <Link to="/intranet" className="navcta">
              Intranet ↗
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
};

