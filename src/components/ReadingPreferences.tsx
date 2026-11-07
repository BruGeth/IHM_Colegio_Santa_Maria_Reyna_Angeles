import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const ReadingPreferences: React.FC = () => {
  const [contrast, setContrast] = useState<'standard' | 'high'>(() => {
    return (sessionStorage.getItem('sm-v3-contrast') as 'standard' | 'high') || 'standard';
  });

  const [textSize, setTextSize] = useState<'normal' | 'large'>(() => {
    return (sessionStorage.getItem('sm-v3-text') as 'normal' | 'large') || 'normal';
  });

  const [statusMessage, setStatusMessage] = useState<string>('');

  useEffect(() => {
    document.documentElement.dataset.contrast = contrast;
    sessionStorage.setItem('sm-v3-contrast', contrast);
  }, [contrast]);

  useEffect(() => {
    document.documentElement.dataset.textSize = textSize;
    sessionStorage.setItem('sm-v3-text', textSize);
  }, [textSize]);

  const toggleContrast = () => {
    const next = contrast === 'high' ? 'standard' : 'high';
    setContrast(next);
    setStatusMessage(
      next === 'high' ? 'Alto contraste activado.' : 'Contraste estándar activado.'
    );
  };

  const toggleTextSize = () => {
    const next = textSize === 'large' ? 'normal' : 'large';
    setTextSize(next);
    setStatusMessage(
      next === 'large' ? 'Texto ampliado activado.' : 'Tamaño de texto estándar activado.'
    );
  };

  return (
    <fieldset className="reading-prefs" id="readingPrefs">
      <legend>Preferencias de lectura</legend>
      <button
        type="button"
        id="contrastPreference"
        aria-pressed={contrast === 'high'}
        onClick={toggleContrast}
      >
        Alto contraste
      </button>
      <button
        type="button"
        id="textPreference"
        aria-pressed={textSize === 'large'}
        onClick={toggleTextSize}
      >
        Texto ampliado
      </button>
      <Link to="/accesibilidad">Declaración de accesibilidad</Link>
      <span id="preferenceStatus" role="status" aria-live="polite">
        {statusMessage}
      </span>
    </fieldset>
  );
};
