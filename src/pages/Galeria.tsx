import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { galleryData, levels } from '../services/mockData';
import { Modal } from '../components/Modal';
import { GalleryItem } from '../types';

export const Galeria: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFilter = searchParams.get('nivel') || 'todas';
  const [filter, setFilter] = useState<string>(
    ['inicial', 'primaria', 'secundaria'].includes(initialFilter)
      ? initialFilter
      : 'todas'
  );
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const qNivel = searchParams.get('nivel');
    if (qNivel && ['inicial', 'primaria', 'secundaria'].includes(qNivel)) {
      setFilter(qNivel);
    }
  }, [searchParams]);

  const handleFilterChange = (k: string) => {
    setFilter(k);
    if (k === 'todas') {
      searchParams.delete('nivel');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ nivel: k });
    }
  };

  const filteredPhotos = galleryData.filter(
    (g) => filter === 'todas' || g.category === filter
  );

  return (
    <>
      <section className="pageHero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Inicio</Link> / Galería
          </div>
          <h1>Nuestra vida escolar</h1>
          <p className="lead">
            Encuentros, expresiones culturales y momentos compartidos por la
            comunidad de Santa María.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div
            className="filterbar"
            role="group"
            aria-label="Filtrar fotografías por nivel"
          >
            {['todas', 'inicial', 'primaria', 'secundaria'].map((k) => (
              <button
                key={k}
                type="button"
                className="filter"
                aria-pressed={filter === k}
                onClick={() => handleFilterChange(k)}
              >
                {k === 'todas' ? 'Todos los niveles' : levels[k].name}
              </button>
            ))}
          </div>

          <p className="help" id="galleryCount" role="status">
            {filteredPhotos.length} fotografías
          </p>

          <div className="gallery" id="gallery">
            {filteredPhotos.map((photo, index) => (
              <button
                key={index}
                type="button"
                className="photo"
                onClick={() => setSelectedPhoto(photo)}
                aria-label={`Ampliar: ${photo.title}`}
              >
                <img
                  src={`/assets/${photo.image}`}
                  loading="lazy"
                  alt={photo.desc}
                />
                <span className="photoInfo">
                  <em aria-hidden="true">↗</em>
                  <strong>{photo.title}</strong>
                  <small>
                    {levels[photo.category].name} · Archivo institucional
                  </small>
                </span>
              </button>
            ))}
          </div>

          <p className="source">
            Fuente: secciones de Inicial, Primaria y Secundaria de{' '}
            <a
              href="https://www.santamra.edu.pe/"
              target="_blank"
              rel="noopener noreferrer"
            >
              santamra.edu.pe ↗
            </a>
            . Fotografías de archivo sin fecha confirmada; títulos descriptivos
            del proyecto. El uso académico no acredita autorización para una
            publicación oficial.
          </p>
        </div>
      </section>

      {/* MODAL DIALOG FOR ZOOMED PHOTO */}
      <Modal
        isOpen={Boolean(selectedPhoto)}
        onClose={() => setSelectedPhoto(null)}
        title={selectedPhoto?.title}
      >
        {selectedPhoto && (
          <div>
            <div className="eyebrow">
              Vida escolar · {levels[selectedPhoto.category].name}
            </div>
            <h3 id="modalTitle">{selectedPhoto.title}</h3>
            <img
              src={`/assets/${selectedPhoto.image}`}
              alt={selectedPhoto.desc}
            />
            <p>{selectedPhoto.desc}</p>
            <p>
              Fotografía del archivo público de Santa María. Fecha no
              especificada en la fuente.
            </p>
          </div>
        )}
      </Modal>
    </>
  );
};

