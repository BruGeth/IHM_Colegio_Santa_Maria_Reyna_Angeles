import React, { useState } from 'react';
import { AppState, updateContactStatus } from '../../services/dataService';
import { Contact } from '../../types';
import { Modal } from '../../components/Modal';

interface ContactsViewProps {
  state: AppState;
  onRefresh: () => void;
  onToast: (msg: string, isError?: boolean) => void;
}

export const ContactsView: React.FC<ContactsViewProps> = ({
  state,
  onRefresh,
  onToast,
}) => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [status, setStatus] = useState<'Pendiente' | 'Atendida'>('Pendiente');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const openContact = (c: Contact) => {
    setSelectedContact(c);
    setStatus(c.status);
    setError(null);
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact) return;
    setError(null);
    setLoading(true);

    try {
      await updateContactStatus(selectedContact.id, status);
      setSelectedContact(null);
      onToast('Estado de consulta actualizado.');
      onRefresh();
    } catch (err: any) {
      setError(err?.message || 'Error al actualizar estado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="viewHead">
        <div>
          <div className="eyebrow">Coordinación académica</div>
          <h1 id="viewTitle">Consultas de familias</h1>
          <p>Solicitudes registradas desde el formulario del portal público.</p>
        </div>
      </div>

      <section className="panel">
        {state.contacts.length ? (
          <div className="tablewrap">
            <table>
              <thead>
                <tr>
                  <th>Seguimiento</th>
                  <th>Familia / contacto</th>
                  <th>Motivo</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {state.contacts.map((c) => (
                  <tr key={c.id}>
                    <td className="hint">{c.id}</td>
                    <td>
                      <strong>{c.name}</strong>
                      <br />
                      <span className="hint">{c.email}</span>
                    </td>
                    <td>{c.topic}</td>
                    <td>{formatDate(c.created)}</td>
                    <td>
                      <span
                        className={`chip ${
                          c.status === 'Atendida' ? 'green' : 'gold'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="textbtn"
                        onClick={() => openContact(c)}
                      >
                        Ver consulta
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty">
            <p>
              Todavía no hay consultas. Registra una consulta de prueba desde el
              portal.
            </p>
          </div>
        )}
      </section>

      {/* MODAL DETALLE DE CONSULTA */}
      <Modal
        isOpen={Boolean(selectedContact)}
        onClose={() => setSelectedContact(null)}
        title={selectedContact ? `Consulta ${selectedContact.id}` : ''}
      >
        {selectedContact && (
          <>
            <h2 id="dialogTitle" className="dialogTitle">
              Consulta {selectedContact.id}
            </h2>
            <p className="dialogIntro">
              {selectedContact.topic} · {formatDate(selectedContact.created)}
            </p>

            <div className="contactDetail">
              <b>{selectedContact.name}</b>
              <p>
                {selectedContact.email}
                {selectedContact.phone ? ` · ${selectedContact.phone}` : ''}
              </p>
              <p className="preserve" style={{ marginTop: '12px' }}>
                {selectedContact.message}
              </p>
            </div>

            <form onSubmit={handleUpdateStatus} style={{ marginTop: '20px' }}>
              <div className="field">
                <label htmlFor="contactStatus">Estado de atención</label>
                <select
                  id="contactStatus"
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as 'Pendiente' | 'Atendida')
                  }
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Atendida">Atendida</option>
                </select>
              </div>

              {error && (
                <div className="formerror" role="alert">
                  {error}
                </div>
              )}

              <div className="formActions">
                <button className="btn" type="submit" disabled={loading}>
                  {loading ? 'Guardando…' : 'Guardar estado'}
                </button>
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => setSelectedContact(null)}
                >
                  Cerrar
                </button>
              </div>

              <p className="hint sectionGap">
                Actualizar el estado no envía un correo ni contacta a la
                familia.
              </p>
            </form>
          </>
        )}
      </Modal>
    </>
  );
};

