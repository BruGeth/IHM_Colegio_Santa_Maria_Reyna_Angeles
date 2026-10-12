import React from 'react';
import { AppState } from '../../services/dataService';
import { Icon } from '../Icons';

interface DashboardViewProps {
  state: AppState;
  onNavigate: (tab: string) => void;
  onOpenTask: (taskId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  state,
  onNavigate,
  onOpenTask,
}) => {
  const isAdmin = state.user.role === 'admin';
  const activeStudents = state.students.filter((s) => s.active);

  const studentSubmissions = state.submissions.filter(
    (s) => s.student === state.user.student
  );
  const pendingTasks = state.tasks.filter(
    (t) => !studentSubmissions.some((s) => s.task === t.id)
  );

  // Period 3 average
  const periodGrades = state.grades.filter((g) => g.period === 3);
  const average = periodGrades.length
    ? (
        periodGrades.reduce((sum, g) => sum + g.grade, 0) / periodGrades.length
      ).toFixed(1)
    : '—';

  const pendingContacts = state.contacts.filter(
    (c) => c.status === 'Pendiente'
  ).length;

  const formatDate = (val: string) => {
    try {
      const d = new Date(val.length === 10 ? val + 'T12:00:00-05:00' : val);
      return new Intl.DateTimeFormat('es-PE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(d);
    } catch {
      return val;
    }
  };

  const getCourseName = (courseId: string) => {
    return state.courses.find((c) => c.id === courseId)?.name || courseId;
  };

  return (
    <>
      <div className="viewHead">
        <div>
          <div className="eyebrow">
            {isAdmin ? 'Coordinación académica' : 'Mi espacio escolar'}
          </div>
          <h1 id="viewTitle">
            {isAdmin
              ? 'Un vistazo a tu comunidad'
              : `Hola, ${state.user.name.split(' ')[0]}`}
          </h1>
          <p>
            {isAdmin
              ? 'Gestiona la información académica y acompaña a cada aula.'
              : 'Tu semana, tus actividades y tus avances, en un mismo lugar.'}
          </p>
        </div>
      </div>

      <div className="welcomeBand">
        <div>
          <h2>
            {isAdmin
              ? 'Acompañamos cada paso.'
              : 'Sigamos aprendiendo juntos.'}
          </h2>
          <p>
            {isAdmin
              ? 'Registra una calificación y comprueba el cambio desde una cuenta de estudiante.'
              : 'Revisa las actividades de tu aula y organiza tu tiempo para dar lo mejor de ti.'}
          </p>
        </div>
        <button
          type="button"
          className="btn"
          onClick={() => onNavigate(isAdmin ? 'notas' : 'tareas')}
        >
          {isAdmin ? 'Registrar calificación' : 'Ver mis actividades'} →
        </button>
      </div>

      <div className="stats">
        {isAdmin ? (
          <>
            <div className="stat">
              <span className="statLabel">Estudiantes activos</span>
              <span className="statIcon">
                <Icon name="students" />
              </span>
              <div className="statValue">{activeStudents.length}</div>
              <div className="hint">En las aulas de demostración</div>
            </div>
            <div className="stat">
              <span className="statLabel">Cursos</span>
              <span className="statIcon">
                <Icon name="courses" />
              </span>
              <div className="statValue">{state.courses.length}</div>
              <div className="hint">Primaria y Secundaria</div>
            </div>
            <div className="stat">
              <span className="statLabel">Actividades publicadas</span>
              <span className="statIcon">
                <Icon name="tasks" />
              </span>
              <div className="statValue">{state.tasks.length}</div>
              <div className="hint">Disponibles para sus aulas</div>
            </div>
            <div className="stat">
              <span className="statLabel">Consultas pendientes</span>
              <span className="statIcon">
                <Icon name="contact" />
              </span>
              <div className="statValue">{pendingContacts}</div>
              <div className="hint">Bandeja de familias</div>
            </div>
          </>
        ) : (
          <>
            <div className="stat">
              <span className="statLabel">Mis cursos</span>
              <span className="statIcon">
                <Icon name="courses" />
              </span>
              <div className="statValue">{state.courses.length}</div>
              <div className="hint">En tu aula</div>
            </div>
            <div className="stat">
              <span className="statLabel">Actividades pendientes</span>
              <span className="statIcon">
                <Icon name="tasks" />
              </span>
              <div className="statValue">{pendingTasks.length}</div>
              <div className="hint">Por entregar</div>
            </div>
            <div className="stat">
              <span className="statLabel">Promedio referencial</span>
              <span className="statIcon">
                <Icon name="grades" />
              </span>
              <div className="statValue">{average}</div>
              <div className="hint">Bimestre 3 · escala 0–20</div>
            </div>
            <div className="stat">
              <span className="statLabel">Comunicados</span>
              <span className="statIcon">
                <Icon name="news" />
              </span>
              <div className="statValue">{state.announcements.length}</div>
              <div className="hint">Información de tu nivel</div>
            </div>
          </>
        )}
      </div>

      <div className="dashboardGrid">
        {/* LEFT COLUMN */}
        <section className="panel">
          <div className="panelHeader">
            <h2>
              {isAdmin ? 'Últimos movimientos' : 'Mis próximas actividades'}
            </h2>
            <button
              type="button"
              className="textbtn"
              onClick={() => onNavigate(isAdmin ? 'notas' : 'tareas')}
            >
              {isAdmin ? 'Ver calificaciones' : 'Ver todas'} →
            </button>
          </div>

          {isAdmin ? (
            state.audit.length ? (
              state.audit.slice(0, 5).map((a) => (
                <div key={a.id} className="listRow">
                  <span className="avatar">
                    <Icon name="check" />
                  </span>
                  <div className="rowMain">
                    <b>{a.action}</b>
                    <small>{a.detail}</small>
                    <small>
                      {formatDate(a.created)} · {a.actor}
                    </small>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty">
                <Icon name="courses" />
                <p>
                  Aquí aparecerán las operaciones realizadas en la intranet.
                </p>
              </div>
            )
          ) : pendingTasks.length ? (
            pendingTasks.slice(0, 3).map((t) => {
              const d = new Date(t.due + 'T12:00:00-05:00');
              return (
                <div key={t.id} className="listRow">
                  <div className="dateTile">
                    <b>{d.getDate()}</b>
                    <small>
                      {new Intl.DateTimeFormat('es-PE', {
                        month: 'short',
                      }).format(d)}
                    </small>
                  </div>
                  <div className="rowMain">
                    <b>{t.title}</b>
                    <small>
                      {getCourseName(t.course)} · Entrega {formatDate(t.due)}
                    </small>
                  </div>
                  <button
                    type="button"
                    className="textbtn"
                    onClick={() => onOpenTask(t.id)}
                  >
                    Abrir
                  </button>
                </div>
              );
            })
          ) : (
            <div className="empty">
              <Icon name="courses" />
              <p>¡Todo al día! No tienes actividades pendientes.</p>
            </div>
          )}
        </section>

        {/* RIGHT STACK */}
        <div className="stack">
          <section className="panel">
            <div className="panelHeader">
              <h2>Comunicados recientes</h2>
              <button
                type="button"
                className="textbtn"
                onClick={() => onNavigate('avisos')}
              >
                Ver todos →
              </button>
            </div>
            {state.announcements.length ? (
              state.announcements.slice(0, 2).map((a) => (
                <div key={a.id} className="listRow">
                  <div className="rowMain">
                    <span className="chip red">{a.audience}</span>
                    <b>{a.title}</b>
                    <small>{formatDate(a.created)}</small>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty">
                <p>No hay comunicados.</p>
              </div>
            )}
          </section>

          <section className="panel">
            <h2>{isAdmin ? 'Gestión para familias' : 'Tu horario semanal'}</h2>
            <p className="hint">
              {isAdmin
                ? 'Las consultas del portal se registran aquí y pueden marcarse como atendidas.'
                : 'Encuentra tus bloques de clase, cursos y aulas de lunes a viernes.'}
            </p>
            <button
              type="button"
              className="textbtn"
              onClick={() => onNavigate(isAdmin ? 'consultas' : 'horario')}
            >
              {isAdmin ? 'Abrir bandeja' : 'Consultar horario'} →
            </button>
          </section>
        </div>
      </div>
    </>
  );
};
