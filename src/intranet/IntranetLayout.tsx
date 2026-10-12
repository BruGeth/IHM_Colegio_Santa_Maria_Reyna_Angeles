import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  AppState,
  fetchState,
  getCurrentUser,
  logout,
} from '../services/dataService';
import { Login } from './Login';
import { Icon } from './Icons';
import { Toast } from '../components/Toast';

// Views
import { DashboardView } from './views/DashboardView';
import { StudentsView } from './views/StudentsView';
import { CoursesView } from './views/CoursesView';
import { ScheduleView } from './views/ScheduleView';
import { GradesView } from './views/GradesView';
import { TasksView } from './views/TasksView';
import { AnnouncementsView } from './views/AnnouncementsView';
import { ContactsView } from './views/ContactsView';

export const IntranetLayout: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [appState, setAppState] = useState<AppState | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastIsError, setToastIsError] = useState(false);
  const [initialOpenTaskId, setInitialOpenTaskId] = useState<string | null>(
    null
  );

  const activeTab = searchParams.get('tab') || 'resumen';

  const showToast = useCallback((msg: string, isError = false) => {
    setToastMessage(msg);
    setToastIsError(isError);
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  }, []);

  const loadData = useCallback(async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const state = await fetchState();
      setAppState(state);
    } catch (err: any) {
      showToast(err?.message || 'Error al conectar con la intranet', true);
    } finally {
      setLoading(false);
    }
  }, [currentUser, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleLoginSuccess = () => {
    setCurrentUser(getCurrentUser());
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setAppState(null);
  };

  const handleNavigate = (tab: string) => {
    setSearchParams({ tab });
    setIsSidebarOpen(false);
    window.scrollTo(0, 0);
  };

  const handleOpenTask = (taskId: string) => {
    setInitialOpenTaskId(taskId);
    handleNavigate('tareas');
  };

  if (!currentUser) {
    return <Login onSuccess={handleLoginSuccess} />;
  }

  if (loading && !appState) {
    return (
      <main id="main" className="loading" tabIndex={-1}>
        <p>Conectando con la intranet…</p>
      </main>
    );
  }

  if (!appState) {
    return (
      <main id="main" className="serverError">
        <div className="eyebrow">Intranet académica</div>
        <h1>No se pudo cargar la información</h1>
        <p>Revisa la configuración o intenta iniciar sesión nuevamente.</p>
        <div className="errorActions">
          <button type="button" className="btn" onClick={loadData}>
            Reintentar
          </button>
          <button type="button" className="btn secondary" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </main>
    );
  }

  const isAdmin = appState.user.role === 'admin';

  const tabs: [string, string, string][] = isAdmin
    ? [
        ['resumen', 'Resumen', 'home'],
        ['alumnos', 'Estudiantes', 'students'],
        ['cursos', 'Cursos', 'courses'],
        ['horario', 'Horario', 'calendar'],
        ['notas', 'Calificaciones', 'grades'],
        ['tareas', 'Actividades', 'tasks'],
        ['avisos', 'Comunicados', 'news'],
        ['consultas', 'Consultas', 'contact'],
      ]
    : [
        ['resumen', 'Mi resumen', 'home'],
        ['cursos', 'Mis cursos', 'courses'],
        ['horario', 'Mi horario', 'calendar'],
        ['notas', 'Mis calificaciones', 'grades'],
        ['tareas', 'Mis actividades', 'tasks'],
        ['avisos', 'Comunicados', 'news'],
      ];

  const initials = appState.user.name
    .split(' ')
    .slice(0, 2)
    .map((v) => v[0])
    .join('');

  return (
    <div className="shell">
      {/* SIDEBAR */}
      <aside
        id="sidebar"
        className={`sidebar ${isSidebarOpen ? 'open' : ''}`}
      >
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
        <p className="sideLabel">
          {isAdmin ? 'GESTIÓN ACADÉMICA' : 'MI ESPACIO ESCOLAR'}
        </p>

        <nav className="sideNav" aria-label="Secciones de la intranet">
          {tabs.map(([key, title, iconName]) => (
            <button
              key={key}
              type="button"
              className={`navItem ${activeTab === key ? 'active' : ''}`}
              onClick={() => handleNavigate(key)}
              aria-current={activeTab === key ? 'page' : undefined}
            >
              <Icon name={iconName} />
              <span>{title}</span>
            </button>
          ))}
        </nav>

        <div className="sideHelp">
          <span>¿Buscas información del colegio?</span>
          <Link to="/">Visitar el portal público ↗</Link>
          <p>Entorno académico de demostración.</p>
        </div>
      </aside>

      {/* WORKSPACE */}
      <div className="workspace">
        <header className="topbar">
          <div className="topbarLeft">
            <button
              className="menuToggle"
              id="sidebarToggle"
              aria-label="Abrir menú de intranet"
              aria-expanded={isSidebarOpen}
              aria-controls="sidebar"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
            >
              ☰
            </button>
            <span className="yearBadge">
              Año académico 2026 <span aria-hidden="true">/</span>{' '}
              {isAdmin ? 'Coordinación' : appState.classroom || 'Aula'}
            </span>
          </div>

          <div className="userMenu">
            <span className="avatar" aria-hidden="true">
              {initials}
            </span>
            <span className="userInfo">
              <b>{appState.user.name}</b>
              <small>
                {isAdmin ? 'Administrador' : 'Estudiante'} · Cuenta demo
              </small>
            </span>
            <button
              id="logout"
              className="logout"
              type="button"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        <main id="main" className="content" tabIndex={-1}>
          <div id="screen">
            {activeTab === 'resumen' && (
              <DashboardView
                state={appState}
                onNavigate={handleNavigate}
                onOpenTask={handleOpenTask}
              />
            )}
            {activeTab === 'alumnos' && isAdmin && (
              <StudentsView
                state={appState}
                onRefresh={loadData}
                onToast={showToast}
              />
            )}
            {activeTab === 'cursos' && (
              <CoursesView
                state={appState}
                onRefresh={loadData}
                onToast={showToast}
                onNavigate={handleNavigate}
              />
            )}
            {activeTab === 'horario' && (
              <ScheduleView
                state={appState}
                onRefresh={loadData}
                onToast={showToast}
              />
            )}
            {activeTab === 'notas' && (
              <GradesView
                state={appState}
                onRefresh={loadData}
                onToast={showToast}
              />
            )}
            {activeTab === 'tareas' && (
              <TasksView
                state={appState}
                onRefresh={loadData}
                onToast={showToast}
                initialOpenTaskId={initialOpenTaskId}
                onClearInitialOpenTaskId={() => setInitialOpenTaskId(null)}
              />
            )}
            {activeTab === 'avisos' && (
              <AnnouncementsView
                state={appState}
                onRefresh={loadData}
                onToast={showToast}
              />
            )}
            {activeTab === 'consultas' && isAdmin && (
              <ContactsView
                state={appState}
                onRefresh={loadData}
                onToast={showToast}
              />
            )}
          </div>

          <footer className="pageFooter">
            <span>Santa María · Proyecto académico independiente</span>
            <span>Datos ficticios · Sincronizado con Supabase / Store</span>
          </footer>
        </main>
      </div>

      <Toast message={toastMessage} isError={toastIsError} />
    </div>
  );
};

