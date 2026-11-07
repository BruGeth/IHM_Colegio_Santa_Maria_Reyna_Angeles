import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export const DeclaracionAccesibilidad: React.FC = () => {
  useEffect(() => {
    document.title = 'Declaración de accesibilidad | Santa María';
    const h1 = document.querySelector('h1');
    if (h1) {
      h1.tabIndex = -1;
      h1.focus();
    }
  }, []);

  return (
    <article className="a11y-declaration">
      <h1>Declaración de accesibilidad</h1>
      <p>
        Santa María Reyna de los Ángeles. Prototipo académico v3.0 del Grupo 5.
        Revisión: 2 de noviembre de 2026.
      </p>

      <h2>Alcance</h2>
      <p>
        Inicio, Primaria, Galería, Contacto y acceso a la intranet. El objetivo
        técnico es WCAG 2.1 nivel AA.
      </p>

      <h2>Estado de conformidad</h2>
      <p>
        Parcialmente conforme. La comprobación técnica combina axe-core,
        inspección manual del código y recorridos con teclado y presentaciones
        adaptadas. La auditoría y las limitaciones se detallan en los anexos
        del APF3. Una herramienta automática no acredita conformidad AA
        completa.
      </p>

      <h2>Limitaciones conocidas</h2>
      <p>
        La comprobación con un lector de pantalla y la validación por personas
        con tecnologías de apoyo se registran por separado. Los resultados de
        usabilidad de octubre pertenecen al APF2. Esta versión utiliza datos
        ficticios y almacenamiento en la nube (Supabase) para las operaciones
        académicas.
      </p>

      <h2>Reportar una barrera</h2>
      <p>
        Utiliza el formulario del prototipo, selecciona "Otro" e indica la
        página, la tarea y la tecnología de apoyo utilizada. El registro llega
        a la bandeja de Consultas de la administración del Grupo 5. No se
        envía al colegio.
      </p>

      <p style={{ marginTop: '24px' }}>
        <Link to="/contacto" className="inlineLink">
          Reportar una barrera al equipo del prototipo →
        </Link>
      </p>
      <p>
        <Link to="/" className="inlineLink">
          ← Volver al portal
        </Link>
      </p>
    </article>
  );
};
