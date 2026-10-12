import React, { useState } from 'react';
import { AppState, saveStudent } from '../../services/dataService';
import { Student } from '../../types';
import { Modal } from '../../components/Modal';

interface StudentsViewProps {
  state: AppState;
  onRefresh: () => void;
  onToast: (msg: string, isError?: boolean) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  state,
  onRefresh,
  onToast,
}) => {
  const [search, setSearch] = useState('');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [classroom, setClassroom] = useState('5.º A · Primaria');
  const [active, setActive] = useState(1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('Alumno2026!');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const classrooms = ['5.º A · Primaria', '1.º A · Secundaria'];

  const filteredStudents = state.students.filter((s) =>
    `${s.name} ${s.id} ${s.classroom}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const openNewStudent = () => {
    setEditingStudent(null);
    setName('');
    setClassroom(classrooms[0]);
    setActive(1);
    setUsername('');
    setPassword('Alumno2026!');
    setError(null);
    setIsModalOpen(true);
  };

  const openEditStudent = (student: Student) => {
    setEditingStudent(student);
    setName(student.name);
    setClassroom(student.classroom);
    setActive(student.active);
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await saveStudent({
        id: editingStudent?.id,
        name,
        classroom,
        active,
        username: editingStudent ? undefined : username,
        password: editingStudent ? undefined : password,
      });
      setIsModalOpen(false);
      onToast(
        editingStudent ? 'Estudiante actualizado.' : 'Estudiante registrado.'
      );
      onRefresh();
    } catch (err: any) {
      setError(err?.message || 'Error al guardar estudiante.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="viewHead">
        <div>
          <div className="eyebrow">Coordinación académica</div>
          <h1 id="viewTitle">Estudiantes</h1>
          <p>Administra las cuentas de demostración y sus aulas.</p>
        </div>
        <button type="button" className="btn" onClick={openNewStudent}>
          + Registrar estudiante
        </button>
      </div>

      <section className="panel">
        <div className="toolbar">
          <label htmlFor="studentSearch">Buscar estudiante</label>
          <input
            className="search"
            id="studentSearch"
            placeholder="Nombre, código o aula"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Estudiante</th>
                <th>Aula</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length ? (
                filteredStudents.map((s) => (
                  <tr key={s.id}>
                    <td className="hint">{s.id}</td>
                    <td>
                      <strong>{s.name}</strong>
                    </td>
                    <td>{s.classroom}</td>
                    <td>
                      <span className={`chip ${s.active ? 'green' : 'red'}`}>
                        {s.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="textbtn"
                        onClick={() => openEditStudent(s)}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center' }}>
                    No se encontraron estudiantes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* MODAL EDIT / CREATE */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStudent ? 'Editar estudiante' : 'Registrar estudiante'}
      >
        <h2 id="dialogTitle" className="dialogTitle">
          {editingStudent ? 'Editar estudiante' : 'Registrar estudiante'}
        </h2>
        <p className="dialogIntro">
          {editingStudent
            ? 'Actualiza su nombre o estado. Su historial académico se conserva.'
            : 'Usa una identidad ficticia. El registro también crea una cuenta para iniciar sesión.'}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="formgrid">
            <div className="field">
              <label htmlFor="studentName">Nombre completo</label>
              <input
                id="studentName"
                required
                minLength={3}
                maxLength={80}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="studentClassroom">Aula</label>
              <select
                id="studentClassroom"
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

            <div className="field">
              <label htmlFor="studentActive">Estado</label>
              <select
                id="studentActive"
                value={active}
                onChange={(e) => setActive(Number(e.target.value))}
              >
                <option value={1}>Activo</option>
                <option value={0}>Inactivo</option>
              </select>
            </div>

            {!editingStudent && (
              <>
                <div className="field">
                  <label htmlFor="studentUsername">Usuario de acceso</label>
                  <input
                    id="studentUsername"
                    required
                    minLength={3}
                    maxLength={30}
                    placeholder="ej. carlos"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label htmlFor="studentPassword">
                    Contraseña de demostración
                  </label>
                  <input
                    id="studentPassword"
                    type="password"
                    required
                    minLength={8}
                    maxLength={100}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </>
            )}
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
      </Modal>
    </>
  );
};
