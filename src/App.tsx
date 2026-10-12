import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';
import { PortalLayout } from './components/PortalLayout';
import { Inicio } from './pages/Inicio';
import { Institucion } from './pages/Institucion';
import { Nivel } from './pages/Nivel';
import { Galeria } from './pages/Galeria';
import { Contacto } from './pages/Contacto';
import { NotFound } from './pages/NotFound';
import { IntranetLayout } from './intranet/IntranetLayout';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* PUBLIC PORTAL */}
        <Route path="/" element={<PortalLayout />}>
          <Route index element={<Inicio />} />
          <Route path="inicio" element={<Navigate to="/" replace />} />
          <Route path="institucion" element={<Institucion />} />
          <Route path="inicial" element={<Nivel levelKey="inicial" />} />
          <Route path="primaria" element={<Nivel levelKey="primaria" />} />
          <Route path="secundaria" element={<Nivel levelKey="secundaria" />} />
          <Route path="galeria" element={<Galeria />} />
          <Route path="contacto" element={<Contacto />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* INTRANET */}
        <Route path="/intranet" element={<IntranetLayout />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
