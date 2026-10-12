import React, { useState } from 'react';
import {
  AppState,
  saveSchedule,
  removeSchedule,
} from '../../services/dataService';
import { Modal } from '../../components/Modal';

interface ScheduleViewProps {
  state: AppState;
  onRefresh: () => void;
  onToast: (msg: string, isError?: boolean) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  state,
  onRefresh,
  onToast,
}) => {
  const isAdmin = state.user.role === 'admin';
  const classrooms = ['5.º A · Primaria', '1.º A · Secundaria'];
  const [selectedClassroom, setSelectedClassroom] = useState(
    isAdmin ? classrooms[0] : state.classroom || classrooms[0]
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [blockToDelete, setBlockToDelete] = useState<number | null>(null);

  // Form states
  const [course, setCourse] = useState(
    state.courses[0]?.id || ''
  );
  const [day, setDay] = useState(0);
  const [startTime, setStartTime] = useState('11:00');
  const [endTime, setEndTime] = useState('12:00');
  const [room, setRoom] = useState('Aula 5A');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  // Enrolled courses for selected classroom
  const enrolledCourses = state.courses
    .filter((c) => c.classroom === selectedClassroom)
    .map((c) => c.id);

  // Filter schedule for this classroom
  const classroomSchedule = state.schedule.filter((s) =>
    enrolledCourses.includes(s.course)
  );

  // Unique hours
  const hours = [
    ...new Set(classroomSchedule.map((s) => `${s.start}|${s.end}`)),
  ].sort();

  const handleOpenAdd = () => {
    const defaultCourse = state.courses.find(
      (c) => c.classroom === selectedClassroom
    );
    setCourse(defaultCourse?.id || state.courses[0]?.id || '');
    setDay(0);
    setStartTime('11:00');
    setEndTime('12:00');
    setRoom(selectedClassroom.includes('Primaria') ? 'Aula 5A' : 'Aula 1A');
    setError(null);
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await saveSchedule({
        course,
        day,
        start: startTime,
        end: endTime,
        room,
      });
      setIsAddModalOpen(false);
      onToast('Bloque de horario agregado.');
      onRefresh();
    } catch (err: any) {
      setError(err?.message || 'Error al agregar bloque.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmRemove = async () => {
    if (!blockToDelete) return;
    try {
      await removeSchedule(blockToDelete);
      setBlockToDelete(null);
      onToast('Bloque eliminado.');
      onRefresh();
    } catch (err: any) {
      onToast(err?.message || 'Error al eliminar bloque.', true);
    }
  };

  return (
    <>
      <div className="viewHead">
        <div>
          <div className="eyebrow">
            {isAdmin ? 'Coordinación académica' : 'Mi espacio escolar'}
          </div>
          <h1 id="viewTitle">Horario semanal</h1>
          <p>Consulta los bloques de clase registrados para cada día.</p>
        </div>
        {isAdmin && (
          <button type="button" className="btn" onClick={handleOpenAdd}>
            + Agregar bloque
          </button>
        )}
      </div>

      <section className="panel">
        {isAdmin && (
          <div className="toolbar">
            <label htmlFor="scheduleClass">Aula</label>
            <select
              id="scheduleClass"
              value={selectedClassroom}
              onChange={(e) => setSelectedClassroom(e.target.value)}
            >
              {classrooms.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="tablewrap">
          <table className="schedule">
            <thead>
              <tr>
                <th className="timecol">Horario</th>
                {days.map((d) => (
                  <th key={d}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hours.map((h) => {
                const [start, end] = h.split('|');
                return (
                  <tr key={h}>
                    <th className="timecol" scope="row">
                      {start}
                      <br />
                      {end}
                    </th>
                    {days.map((_, dayIdx) => {
                      const blocks = classroomSchedule.filter(
                        (s) =>
                          s.day === dayIdx &&
                          s.start === start &&
                          s.end === end
                      );
                      return (
                        <td key={dayIdx}>
                          {blocks.length ? (
                            blocks.map((s) => {
                              const c = state.courses.find(
                                (item) => item.id === s.course
                              );
                              return (
                                <div
                                  key={s.id}
                                  className={`classBlock ${c?.color || 'blue'}`}
                                >
                                  <b>{c?.name || s.course}</b>
                                  <small>{c?.teacher}</small>
                                  <small>{s.room}</small>
                                  {isAdmin && (
                                    <button
                                      type="button"
                                      className="textbtn danger"
                                      onClick={() => setBlockToDelete(s.id)}
                                      style={{ marginTop: '5px' }}
                                    >
                                      Eliminar bloque
                                    </button>
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <span className="hint">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!hours.length && (
          <div className="empty" style={{ marginTop: '20px' }}>
            <p>Todavía no se han registrado bloques de clase para esta aula.</p>
          </div>
        )}

        <p className="hint sectionGap">
          Horario de demostración. Los espacios sin clase aparecen con un guion.
        </p>
      </section>

      {/* MODAL AGREGAR BLOQUE */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Agregar bloque de clase"
      >
        <h2 id="dialogTitle" className="dialogTitle">
          Agregar bloque de clase
        </h2>
        <p className="dialogIntro">
          El sistema valida que el aula y el salón no tengan un bloque
          coincidente.
        </p>

        <form onSubmit={handleAddSubmit}>
          <div className="formgrid">
            <div className="field">
              <label htmlFor="schedCourse">Curso</label>
              <select
                id="schedCourse"
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
              <label htmlFor="schedDay">Día</label>
              <select
                id="schedDay"
                value={day}
                onChange={(e) => setDay(Number(e.target.value))}
              >
                {days.map((d, i) => (
                  <option key={i} value={i}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="schedStart">Hora de inicio</label>
              <input
                id="schedStart"
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="schedEnd">Hora final</label>
              <input
                id="schedEnd"
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="schedRoom">Salón</label>
              <input
                id="schedRoom"
                type="text"
                required
                minLength={2}
                maxLength={40}
                value={room}
                onChange={(e) => setRoom(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="formerror" role="alert">
              {error}
            </div>
          )}

          <div className="formActions">
            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Agregando…' : 'Agregar bloque'}
            </button>
            <button
              type="button"
              className="btn secondary"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL CONFIRMAR ELIMINAR */}
      <Modal
        isOpen={Boolean(blockToDelete)}
        onClose={() => setBlockToDelete(null)}
        title="Eliminar bloque"
      >
        <h2 id="dialogTitle" className="dialogTitle">
          Eliminar bloque de clase
        </h2>
        <p className="dialogIntro">
          Se eliminará únicamente este bloque del horario. El curso y las notas
          se conservan.
        </p>
        <div className="formActions">
          <button
            type="button"
            className="btn"
            style={{ backgroundColor: '#a62e3d', borderColor: '#a62e3d' }}
            onClick={handleConfirmRemove}
          >
            Eliminar bloque
          </button>
          <button
            type="button"
            className="btn secondary"
            onClick={() => setBlockToDelete(null)}
          >
            Cancelar
          </button>
        </div>
      </Modal>
    </>
  );
};
