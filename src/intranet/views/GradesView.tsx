import React, { useState, useEffect } from 'react';
import { AppState, saveGrade } from '../../services/dataService';

interface GradesViewProps {
  state: AppState;
  onRefresh: () => void;
  onToast: (msg: string, isError?: boolean) => void;
}

export const GradesView: React.FC<GradesViewProps> = ({
  state,
  onRefresh,
  onToast,
}) => {
  const isAdmin = state.user.role === 'admin';
  const [period, setPeriod] = useState(3);

  // Form states for admin
  const activeStudents = state.students.filter((s) => s.active);
  const [studentId, setStudentId] = useState(activeStudents[0]?.id || '');

  const selectedStudent = state.students.find((s) => s.id === studentId);
  const studentCourses = state.courses.filter(
    (c) => c.classroom === selectedStudent?.classroom
  );

  const [courseId, setCourseId] = useState(studentCourses[0]?.id || '');
  const [formPeriod, setFormPeriod] = useState(3);
  const [assessment, setAssessment] = useState('Práctica 1');
  const [gradeValue, setGradeValue] = useState<string>('');
  const [currentStatus, setCurrentStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assessments = ['Práctica 1', 'Proyecto', 'Evaluación bimestral'];

  useEffect(() => {
    if (studentCourses.length && !studentCourses.some((c) => c.id === courseId)) {
      setCourseId(studentCourses[0].id);
    }
  }, [studentId, studentCourses, courseId]);

  useEffect(() => {
    // Sync current grade
    const g = state.grades.find(
      (item) =>
        item.student === studentId &&
        item.course === courseId &&
        item.period === formPeriod &&
        item.assessment === assessment
    );

    if (g) {
      setGradeValue(String(g.grade));
      const d = new Date(g.updated);
      const dateStr = new Intl.DateTimeFormat('es-PE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(d);
      setCurrentStatus(`Registrada: ${g.grade} · ${dateStr}`);
    } else {
      setGradeValue('');
      setCurrentStatus('Evaluación pendiente de registro.');
    }
  }, [studentId, courseId, formPeriod, assessment, state.grades]);

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const num = parseFloat(gradeValue);
    if (isNaN(num) || num < 0 || num > 20) {
      setError('La calificación debe ser un número entre 0 y 20.');
      return;
    }

    setLoading(true);
    try {
      await saveGrade(studentId, courseId, formPeriod, assessment, num);
      onToast('Calificación guardada.');
      onRefresh();
    } catch (err: any) {
      setError(err?.message || 'Error al guardar la calificación.');
    } finally {
      setLoading(false);
    }
  };

  const periodGrades = state.grades.filter((g) => g.period === period);
  const average = periodGrades.length
    ? (
        periodGrades.reduce((acc, g) => acc + g.grade, 0) / periodGrades.length
      ).toFixed(1)
    : '—';

  const exportGrades = () => {
    const cell = (v: any) => {
      let text = String(v ?? '');
      if (/^[=+@\-\t\r]/.test(text)) text = "'" + text;
      return '"' + text.replace(/"/g, '""') + '"';
    };

    const getStudentName = (sId: string) =>
      state.students.find((s) => s.id === sId)?.name || sId;
    const getCourseName = (cId: string) =>
      state.courses.find((c) => c.id === cId)?.name || cId;
    const formatDate = (val: string) => {
      try {
        const d = new Date(val);
        return new Intl.DateTimeFormat('es-PE', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }).format(d);
      } catch {
        return val;
      }
    };

    const rows = [
      ['Estudiante', 'Curso', 'Bimestre', 'Evaluación', 'Nota', 'Actualizado'],
      ...periodGrades.map((g) => [
        getStudentName(g.student),
        getCourseName(g.course),
        g.period,
        g.assessment,
        g.grade,
        formatDate(g.updated),
      ]),
    ];

    const csvContent =
      '\uFEFF' +
      rows.map((row) => row.map(cell).join(';')).join('\r\n');

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SantaMaria_Calificaciones_B${period}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    onToast('Reporte de calificaciones descargado.');
  };

  const studentsToRender = isAdmin
    ? state.students
    : state.students.filter((s) => s.id === state.user.student);

  return (
    <>
      <div className="viewHead">
        <div>
          <div className="eyebrow">
            {isAdmin ? 'Coordinación académica' : 'Mi espacio escolar'}
          </div>
          <h1 id="viewTitle">
            {isAdmin ? 'Calificaciones' : 'Mis calificaciones'}
          </h1>
          <p>Evaluaciones por bimestre · Escala de 0 a 20.</p>
        </div>
        <button
          type="button"
          id="exportGrades"
          className="btn secondary"
          onClick={exportGrades}
        >
          ↓ Descargar reporte
        </button>
      </div>

      {isAdmin && (
        <section className="panel sectionGap">
          <h2>Registrar o actualizar una calificación</h2>
          <p className="hint">
            Selecciona estudiante, curso y evaluación. La nota estará disponible
            al guardar.
          </p>
          <form onSubmit={handleGradeSubmit}>
            <div className="formgrid">
              <div className="field">
                <label htmlFor="gradeStudent">Estudiante</label>
                <select
                  id="gradeStudent"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                >
                  {activeStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} · {s.classroom}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="gradeCourse">Curso del aula</label>
                <select
                  id="gradeCourse"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                >
                  {studentCourses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="gradePeriod">Bimestre</label>
                <select
                  id="gradePeriod"
                  value={formPeriod}
                  onChange={(e) => setFormPeriod(Number(e.target.value))}
                >
                  {[1, 2, 3, 4].map((p) => (
                    <option key={p} value={p}>
                      Bimestre {p}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="gradeAssessment">Evaluación</label>
                <select
                  id="gradeAssessment"
                  value={assessment}
                  onChange={(e) => setAssessment(e.target.value)}
                >
                  {assessments.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="gradeValue">Calificación (0 a 20)</label>
                <input
                  id="gradeValue"
                  type="number"
                  min="0"
                  max="20"
                  step="0.1"
                  required
                  placeholder="Ej. 18"
                  value={gradeValue}
                  onChange={(e) => setGradeValue(e.target.value)}
                />
              </div>

              <div className="field">
                <label>Estado actual</label>
                <p id="currentGrade" className="hint">
                  {currentStatus}
                </p>
              </div>
            </div>

            {error && (
              <div className="formerror" role="alert">
                {error}
              </div>
            )}

            <div className="formActions">
              <button className="btn" type="submit" disabled={loading}>
                {loading ? 'Guardando…' : 'Guardar calificación'}
              </button>
              <span className="hint">Se registra quién realizó el cambio.</span>
            </div>
          </form>
        </section>
      )}

      <section className="panel sectionGap">
        <div className="toolbar">
          <div>
            <label htmlFor="period">Periodo </label>
            <select
              id="period"
              value={period}
              onChange={(e) => setPeriod(Number(e.target.value))}
            >
              {[1, 2, 3, 4].map((p) => (
                <option key={p} value={p}>
                  Bimestre {p}
                </option>
              ))}
            </select>
          </div>
          <span className="hint">
            {periodGrades.length} evaluaciones registradas
            {!isAdmin && ` · Promedio referencial ${average}`}
          </span>
        </div>

        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                {isAdmin && <th>Estudiante</th>}
                <th>Curso</th>
                <th>Práctica 1</th>
                <th>Proyecto</th>
                <th>Evaluación bimestral</th>
                <th>Promedio</th>
              </tr>
            </thead>
            <tbody>
              {studentsToRender.flatMap((s) =>
                state.courses
                  .filter((c) => c.classroom === s.classroom)
                  .map((c) => {
                    const rowGrades = periodGrades.filter(
                      (g) => g.student === s.id && g.course === c.id
                    );
                    const avg = rowGrades.length
                      ? (
                          rowGrades.reduce((sum, g) => sum + g.grade, 0) /
                          rowGrades.length
                        ).toFixed(1)
                      : '—';

                    return (
                      <tr key={`${s.id}-${c.id}`}>
                        {isAdmin && <td>{s.name}</td>}
                        <td>
                          <strong>{c.name}</strong>
                        </td>
                        {assessments.map((a) => {
                          const gradeItem = rowGrades.find(
                            (g) => g.assessment === a
                          );
                          return (
                            <td key={a}>
                              <span
                                className={gradeItem ? 'score' : 'hint'}
                              >
                                {gradeItem ? gradeItem.grade : '—'}
                              </span>
                            </td>
                          );
                        })}
                        <td>
                          <b>{avg}</b>
                        </td>
                      </tr>
                    );
                  })
              )}
            </tbody>
          </table>
        </div>

        <p className="hint sectionGap">
          El promedio es la media simple de las evaluaciones registradas. Las
          evaluaciones pendientes no se cuentan; no es una libreta oficial.
        </p>
      </section>
    </>
  );
};
