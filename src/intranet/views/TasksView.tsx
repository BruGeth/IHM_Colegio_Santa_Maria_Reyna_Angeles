import React, { useState } from 'react';
import { AppState, saveTask, submitTask } from '../../services/dataService';
import { Task } from '../../types';
import { Modal } from '../../components/Modal';

interface TasksViewProps {
  state: AppState;
  onRefresh: () => void;
  onToast: (msg: string, isError?: boolean) => void;
  initialOpenTaskId?: string | null;
  onClearInitialOpenTaskId?: () => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  state,
  onRefresh,
  onToast,
  initialOpenTaskId,
  onClearInitialOpenTaskId,
}) => {
  const isAdmin = state.user.role === 'admin';
  const [selectedTask, setSelectedTask] = useState<Task | null>(
    initialOpenTaskId
      ? state.tasks.find((t) => t.id === initialOpenTaskId) || null
      : null
  );
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(
    Boolean(initialOpenTaskId)
  );

  // New task form state (Admin)
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState(state.courses[0]?.id || '');
  const [due, setDue] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });
  const [description, setDescription] = useState('');

  // Submit answer state (Student)
  const currentSubmission = selectedTask
    ? state.submissions.find(
        (s) =>
          s.task === selectedTask.id && s.student === state.user.student
      )
    : null;
  const [answer, setAnswer] = useState(currentSubmission?.answer || '');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const getStudentName = (studentId: string) => {
    return state.students.find((s) => s.id === studentId)?.name || studentId;
  };

  const openTaskDetail = (task: Task) => {
    setSelectedTask(task);
    const sub = state.submissions.find(
      (s) => s.task === task.id && s.student === state.user.student
    );
    setAnswer(sub?.answer || '');
    setError(null);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailModalOpen(false);
    setSelectedTask(null);
    if (onClearInitialOpenTaskId) onClearInitialOpenTaskId();
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await saveTask({ course, title, description, due });
      setIsNewTaskModalOpen(false);
      onToast('Actividad publicada.');
      onRefresh();
    } catch (err: any) {
      setError(err?.message || 'Error al publicar la actividad.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;
    setError(null);
    setLoading(true);

    try {
      await submitTask(selectedTask.id, answer);
      setIsDetailModalOpen(false);
      onToast('Entrega guardada correctamente.');
      onRefresh();
    } catch (err: any) {
      setError(err?.message || 'Error al guardar la entrega.');
    } finally {
      setLoading(false);
    }
  };

  const taskSubmissions = selectedTask
    ? state.submissions.filter((s) => s.task === selectedTask.id)
    : [];

  return (
    <>
      <div className="viewHead">
        <div>
          <div className="eyebrow">
            {isAdmin ? 'Coordinación académica' : 'Mi espacio escolar'}
          </div>
          <h1 id="viewTitle">
            {isAdmin ? 'Actividades del aula' : 'Mis actividades'}
          </h1>
          <p>
            {isAdmin
              ? 'Publica actividades y revisa las entregas de los estudiantes.'
              : 'Encuentra las instrucciones y registra tu respuesta.'}
          </p>
        </div>
        {isAdmin && (
          <button
            type="button"
            className="btn"
            onClick={() => {
              setTitle('');
              setCourse(state.courses[0]?.id || '');
              setDescription('');
              setError(null);
              setIsNewTaskModalOpen(true);
            }}
          >
            + Publicar actividad
          </button>
        )}
      </div>

      {state.tasks.length ? (
        state.tasks.map((t) => {
          const submission = state.submissions.find(
            (s) => s.task === t.id && s.student === state.user.student
          );
          const count = state.submissions.filter((s) => s.task === t.id).length;

          return (
            <article key={t.id} className="taskCard">
              <div>
                <span className="chip blue">{getCourseName(t.course)}</span>
                <h2>{t.title}</h2>
                <p>{t.description}</p>
                <div className="taskMeta">
                  Entrega: {formatDate(t.due)}
                  {submission &&
                    ` · Última entrega: ${formatDate(submission.updated)}`}
                </div>
              </div>
              <div className="taskActions">
                <span
                  className={`chip ${
                    isAdmin ? 'blue' : submission ? 'green' : 'gold'
                  }`}
                >
                  {isAdmin
                    ? `${count} ${count === 1 ? 'entrega' : 'entregas'}`
                    : submission
                    ? 'Entregada'
                    : 'Pendiente'}
                </span>
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => openTaskDetail(t)}
                >
                  {isAdmin
                    ? 'Revisar entregas'
                    : submission
                    ? 'Ver / editar respuesta'
                    : 'Abrir actividad'}{' '}
                  →
                </button>
              </div>
            </article>
          );
        })
      ) : (
        <div className="empty">
          <p>No hay actividades publicadas.</p>
        </div>
      )}

      {/* MODAL CREAR ACTIVIDAD (ADMIN) */}
      <Modal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        title="Publicar actividad"
      >
        <h2 id="dialogTitle" className="dialogTitle">
          Publicar actividad
        </h2>
        <p className="dialogIntro">
          La actividad se mostrará solo a los estudiantes del aula
          correspondiente.
        </p>

        <form onSubmit={handleCreateTask}>
          <div className="formgrid">
            <div className="field">
              <label htmlFor="taskTitle">Título</label>
              <input
                id="taskTitle"
                required
                minLength={3}
                maxLength={100}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="taskCourse">Curso</label>
              <select
                id="taskCourse"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
              >
                {state.courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} · {c.classroom}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="taskDue">Fecha de entrega</label>
              <input
                id="taskDue"
                type="date"
                required
                value={due}
                onChange={(e) => setDue(e.target.value)}
              />
            </div>

            <div className="field full">
              <label htmlFor="taskDesc">Instrucciones</label>
              <textarea
                id="taskDesc"
                required
                minLength={10}
                maxLength={1500}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
          </div>

          {error && (
            <div className="formerror" role="alert">
              {error}
            </div>
          )}

          <div className="formActions">
            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Publicando…' : 'Publicar actividad'}
            </button>
            <button
              type="button"
              className="btn secondary"
              onClick={() => setIsNewTaskModalOpen(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL DETALLE / ENTREGAS (ADMIN & STUDENT) */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetail}
        title={selectedTask?.title}
      >
        {selectedTask && (
          <>
            <h2 id="dialogTitle" className="dialogTitle">
              {selectedTask.title}
            </h2>
            <p className="dialogIntro">
              {getCourseName(selectedTask.course)} · Entrega:{' '}
              {formatDate(selectedTask.due)}
            </p>
            <p className="preserve dialogIntro" style={{ marginTop: '14px' }}>
              {selectedTask.description}
            </p>

            {isAdmin ? (
              <>
                <h3 className="sectionGap" style={{ marginTop: '24px' }}>
                  Respuestas de estudiantes ({taskSubmissions.length})
                </h3>
                {taskSubmissions.length ? (
                  taskSubmissions.map((s, idx) => (
                    <div key={idx} className="contactDetail">
                      <b>{getStudentName(s.student)}</b>
                      <small className="muted">
                        {' '}
                        · {formatDate(s.updated)}
                      </small>
                      <p className="preserve">{s.answer}</p>
                    </div>
                  ))
                ) : (
                  <div className="empty">
                    <p>Todavía no se han recibido respuestas.</p>
                  </div>
                )}
              </>
            ) : (
              <form onSubmit={handleSubmitAnswer} style={{ marginTop: '20px' }}>
                <div className="field full">
                  <label htmlFor="taskAnswer">Tu respuesta</label>
                  <textarea
                    id="taskAnswer"
                    required
                    minLength={10}
                    maxLength={4000}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Escribe tu entrega aquí..."
                  ></textarea>
                </div>

                {error && (
                  <div className="formerror" role="alert">
                    {error}
                  </div>
                )}

                <div className="formActions">
                  <button className="btn" type="submit" disabled={loading}>
                    {loading
                      ? 'Guardando…'
                      : currentSubmission
                      ? 'Actualizar entrega'
                      : 'Enviar respuesta'}
                  </button>
                </div>

                <p className="hint sectionGap">
                  Entrega de texto en modo demostración. Puedes editar tu
                  respuesta; se conserva la fecha real de entrega.
                </p>
              </form>
            )}
          </>
        )}
      </Modal>
    </>
  );
};
