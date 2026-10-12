import React, { useState } from 'react';
import { AppState, saveAnnouncement } from '../../services/dataService';
import { Modal } from '../../components/Modal';

interface AnnouncementsViewProps {
  state: AppState;
  onRefresh: () => void;
  onToast: (msg: string, isError?: boolean) => void;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({
  state,
  onRefresh,
  onToast,
}) => {
  const isAdmin = state.user.role === 'admin';
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [audience, setAudience] = useState<'Todos' | 'Primaria' | 'Secundaria'>(
    'Todos'
  );
  const [body, setBody] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await saveAnnouncement({ title, audience, body });
      setIsModalOpen(false);
      onToast('Comunicado publicado.');
      onRefresh();
    } catch (err: any) {
      setError(err?.message || 'Error al publicar el comunicado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="viewHead">
        <div>
          <div className="eyebrow">
            {isAdmin ? 'Coordinación académica' : 'Mi espacio escolar'}
          </div>
          <h1 id="viewTitle">Comunicados</h1>
          <p>Mantente al tanto de la información de tu comunidad.</p>
        </div>
        {isAdmin && (
          <button
            type="button"
            className="btn"
            onClick={() => {
              setTitle('');
              setAudience('Todos');
              setBody('');
              setError(null);
              setIsModalOpen(true);
            }}
          >
            + Nuevo comunicado
          </button>
        )}
      </div>

      {state.announcements.length ? (
        state.announcements.map((a) => (
          <article key={a.id} className="announcement">
            <div className="meta">
              <span className="chip red">{a.audience}</span>
              <span>
                {formatDate(a.created)} · Coordinación académica
              </span>
            </div>
            <h2>{a.title}</h2>
            <p>{a.body}</p>
          </article>
        ))
      ) : (
        <div className="empty">
          <p>No hay comunicados para tu nivel.</p>
        </div>
      )}

      {/* MODAL CREAR COMUNICADO */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nuevo comunicado"
      >
        <h2 id="dialogTitle" className="dialogTitle">
          Nuevo comunicado
        </h2>
        <p className="dialogIntro">Elige el nivel que recibirá este aviso.</p>

        <form onSubmit={handleCreateAnnouncement}>
          <div className="formgrid">
            <div className="field">
              <label htmlFor="annTitle">Título</label>
              <input
                id="annTitle"
                required
                minLength={3}
                maxLength={100}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="annAudience">Dirigido a</label>
              <select
                id="annAudience"
                value={audience}
                onChange={(e) =>
                  setAudience(
                    e.target.value as 'Todos' | 'Primaria' | 'Secundaria'
                  )
                }
              >
                <option value="Todos">Todos</option>
                <option value="Primaria">Primaria</option>
                <option value="Secundaria">Secundaria</option>
              </select>
            </div>

            <div className="field full">
              <label htmlFor="annBody">Mensaje</label>
              <textarea
                id="annBody"
                required
                minLength={10}
                maxLength={1500}
                value={body}
                onChange={(e) => setBody(e.target.value)}
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
              {loading ? 'Publicando…' : 'Publicar comunicado'}
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

