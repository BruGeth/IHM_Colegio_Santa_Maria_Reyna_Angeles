import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { login } from '../services/dataService';
import { User } from '../types';

interface LoginProps {
  onSuccess: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await login(username, password);
      onSuccess(user);
    } catch (err: any) {
      setError(err?.message || 'Error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseAccount = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setError(null);
  };

  return (
    <main id="main" className="login">
      {/* STORY HERO */}
      <section className="loginStory">
        <Link to="/" className="brand">
          <img
            src="/assets/logo.png"
            width="43"
            height="47"
            alt="Escudo Santa María"
          />
          <span>
            <b>Santa María</b>
            <small>Reyna de los Ángeles</small>
          </span>
        </Link>
        <div className="eyebrow">Tu comunidad, siempre cerca</div>
        <h1>
          Todo tu mundo escolar,
          <br />
          en un solo lugar.
        </h1>
        <p>
          Organiza tu semana, sigue tus avances y mantente conectado con lo que
          sucede en tu aula.
        </p>
        <img
          className="loginPhoto"
          src="/assets/foto12.jpg"
          alt="Estudiantes del archivo institucional"
        />
        <span className="storyFooter">
          Proyecto académico independiente · Fotografía del archivo del colegio
        </span>
      </section>

      {/* LOGIN FORM AREA */}
      <section className="loginFormArea">
        <div className="loginPanel">
          <div className="eyebrow">Intranet académica</div>
          <h2>Bienvenido de nuevo</h2>
          <p className="hint">
            Ingresa con una cuenta de demostración para acceder a tu espacio.
          </p>

          <form onSubmit={handleSubmit} className="loginForm">
            <div className="field">
              <label htmlFor="username">Usuario</label>
              <input
                id="username"
                name="username"
                autoComplete="username"
                required
                maxLength={30}
                placeholder="Escribe tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="password">Contraseña</label>
              <div className="passwordWrap">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  maxLength={100}
                  placeholder="Escribe tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                  }
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </div>

            {error && (
              <div className="formerror" role="alert">
                {error}
              </div>
            )}

            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Ingresando…' : 'Iniciar sesión →'}
            </button>
          </form>

          {/* DEMO ACCOUNTS */}
          <details className="demoAccounts" open>
            <summary>Cuentas para explorar el proyecto</summary>
            <div className="demoRow">
              <span>
                <b>Estudiante · Ana Torres</b>
                <span>
                  <code>ana / Alumno2026!</code>
                </span>
              </span>
              <button
                type="button"
                className="textbtn"
                onClick={() => handleUseAccount('ana', 'Alumno2026!')}
              >
                Usar cuenta
              </button>
            </div>
            <div className="demoRow">
              <span>
                <b>Administración</b>
                <span>
                  <code>admin / Admin2026!</code>
                </span>
              </span>
              <button
                type="button"
                className="textbtn"
                onClick={() => handleUseAccount('admin', 'Admin2026!')}
              >
                Usar cuenta
              </button>
            </div>
            <p className="hint">También: luis o camila / Alumno2026!</p>
          </details>

          <div className="notice">
            Entorno de demostración con datos ficticios. Los cambios quedan
            guardados para las siguientes sesiones.
          </div>

          <Link to="/" className="backPortal">
            ← Volver al portal del colegio
          </Link>
        </div>
      </section>
    </main>
  );
};
