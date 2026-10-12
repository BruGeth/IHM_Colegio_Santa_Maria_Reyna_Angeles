import React, { useState } from 'react';
import { AppState, saveCourse } from '../../services/dataService';
import { Course } from '../../types';
import { Modal } from '../../components/Modal';

interface CoursesViewProps {
  state: AppState;
  onRefresh: () => void;
  onToast: (msg: string, isError?: boolean) => void;
  onNavigate: (tab: string) => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  state,
  onRefresh,
  onToast,
  onNavigate,
}) => {
  const isAdmin = state.user.role === 'admin';
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [teacher, setTeacher] = useState('');
  const [classroom, setClassroom] = useState('5.º A · Primaria');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const classrooms = ['5.º A · Primaria', '1.º A · Secundaria'];

  const openNewCourse = () => {
    setSelectedCourse(null);
    setName('');
    setTeacher('');
    setClassroom(classrooms[0]);
    setError(null);
    setIsModalOpen(true);
  };

  const openCourseDetail = (course: Course) => {
    setSelectedCourse(course);
    setName(course.name);
    setTeacher(course.teacher);
    setClassroom(course.classroom);
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await saveCourse({
        id: selectedCourse?.id,
        name,
        teacher,
        classroom,
      });
      setIsModalOpen(false);
      onToast(selectedCourse ? 'Curso guardado.' : 'Nuevo curso registrado.');
      onRefresh();
    } catch (err: any) {
      setError(err?.message || 'Error al guardar el curso.');
    } finally {
      setLoading(false);
    }
  };

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

  const courseTasks = selectedCourse
    ? state.tasks.filter((t) => t.course === selectedCourse.id)
    : [];

  return (
    <>
      <div className="viewHead">
        <div>
          <div className="eyebrow">
            {isAdmin ? 'Coordinación académica' : 'Mi espacio escolar'}
          </div>
          <h1 id="viewTitle">{isAdmin ? 'Cursos y docentes' : 'Mis cursos'}</h1>
          <p>
            {isAdmin
              ? 'Organiza la oferta académica por aula.'
              : 'Conoce a tus docentes y las actividades de cada curso.'}
          </p>
        </div>
        {isAdmin && (
          <button type="button" className="btn" onClick={openNewCourse}>
            + Nuevo curso
          </button>
        )}
      </div>

      <div className="courseGrid">
        {state.courses.map((c) => {
          const taskCount = state.tasks.filter((t) => t.course === c.id).length;
          return (
            <article key={c.id} className={`courseCard ${c.color || 'blue'}`}>
              <div className="courseCode">
                {c.id} · {c.classroom}
              </div>
              <h2>{c.name}</h2>
              <p>Docente: {c.teacher}</p>
              <div className="courseFooter">
                <span className="chip">{taskCount} actividades</span>
                <button
                  type="button"
                  className="textbtn"
                  onClick={() => openCourseDetail(c)}
                >
                  {isAdmin ? 'Editar curso' : 'Ver mi curso'} →
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* MODAL (STUDENT READ-ONLY OR ADMIN EDIT) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCourse ? selectedCourse.name : 'Nuevo curso'}
      >
        {isAdmin ? (
          <>
            <h2 id="dialogTitle" className="dialogTitle">
              {selectedCourse ? 'Editar curso' : 'Nuevo curso'}
            </h2>
            <p className="dialogIntro">
              Los estudiantes del aula seleccionada verán este curso.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="formgrid">
                <div className="field">
                  <label htmlFor="courseName">Nombre del curso</label>
                  <input
                    id="courseName"
                    required
                    minLength={3}
                    maxLength={60}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label htmlFor="courseTeacher">Docente</label>
                  <input
                    id="courseTeacher"
                    required
                    minLength={3}
                    maxLength={60}
                    value={teacher}
                    onChange={(e) => setTeacher(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label htmlFor="courseClassroom">Aula</label>
                  <select
                    id="courseClassroom"
                    value={classroom}
                    onChange={(e) => setClassroom(e.target.value)}
                  >
                    {classrooms.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {error && (
                <div className="formerror" role="alert">
                  {error}
                </div>
              )}

              <div className="formActions">
                <button className="btn" type="submit" disabled={loading}>
                  {loading ? 'Guardando…' : 'Guardar cambios'}
                </button>
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </>
        ) : (
          selectedCourse && (
            <>
              <h2 id="dialogTitle" className="dialogTitle">
                {selectedCourse.name}
              </h2>
              <p className="dialogIntro">Docente: {selectedCourse.teacher}</p>
              <p className="hint sectionGap">{selectedCourse.classroom}</p>

              <h3 className="sectionGap" style={{ marginTop: '20px' }}>
                Actividades del curso
              </h3>
              {courseTasks.length ? (
                courseTasks.map((t) => (
                  <div key={t.id} className="listRow">
                    <div className="rowMain">
                      <b>{t.title}</b>
                      <small>Entrega: {formatDate(t.due)}</small>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty">
                  <p>No hay actividades publicadas.</p>
                </div>
              )}

              <div className="formActions">
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setIsModalOpen(false);
                    onNavigate('tareas');
                  }}
                >
                  Ir a mis actividades →
                </button>
              </div>
            </>
          )
        )}
      </Modal>
    </>
  );
};

