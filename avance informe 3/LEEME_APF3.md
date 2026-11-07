# Paquete de Entrega APF3 - Colegio Santa María Reyna de los Ángeles

Actualizado para la entrega final del APF3 (Interacción Hombre-Máquina).
El informe técnico contiene 14 páginas (respetando estrictamente el límite máximo de 15 páginas fijado por la rúbrica UTP). La presentación contiene exactamente 12 diapositivas en formato Verbo + Objeto, con notas para sustentación de 12 minutos más 3 de preguntas.

---

## Archivos Principales
- **`APF3_Grupo5_SantaMaria.pdf`**: Informe técnico final y reporte de validación inclusiva (14 páginas, WCAG 2.1 AA, 5 sesiones, 95 % éxito autónomo, SUS 88,0 / 100).
- **`APF3_Grupo5_SantaMaria.docx`**: Versión editable en formato Word del informe técnico final (14 páginas).
- **`APF3_Grupo5_SantaMaria.pptx`**: Presentación ejecutiva de 12 diapositivas con títulos de acción (Verbo + Objeto), notas de orador y distribución de tiempos.
- **`APF3_Grupo5_Matriz_WCAG_y_Validacion.xlsx`**: Matriz completa de accesibilidad con 50 criterios WCAG 2.1 AA (26 núcleo, 250 registros por pantalla), hoja de Línea Base APF2, registro completo de las 5 sesiones inclusivas consentidas (AP3-01 a AP3-05) y las 20 tareas evaluadas (T1 a T4) con cálculo dinámico de métricas y SUS.
- **`APF3_Grupo5_Figma_Importable.zip`**: Kit de prototipado importable para Figma con 6 páginas estructuradas (`00 Leyenda y resumen`, `01 Antes v2`, `02 Después v3`, `03 Kit accesible`, `04 Anotaciones y teclado`, `05 Contraste y texto`).
- **`APF3_Grupo5_Anexos.zip`**: Archivo consolidado de evidencias técnicas (auditorías axe-core JSON v2 y v3, capturas de pantalla, instrumentos de campo, trazabilidad y prototipo).

---

## Estructura de Anexos
1. **`01_Matriz/`**: Contiene la matriz `APF3_Grupo5_Matriz_WCAG_y_Validacion.xlsx` con los 50 criterios, severidad/alcance, hallazgos H01–H10, y los datos empíricos de las 5 sesiones.
2. **`02_Evidencias/`**: Archivos JSON generados por axe-core 4.14.0 (v2 con 19 infracciones, v3 con 0 infracciones automáticas), capturas comparativas de antes y después, y comprobaciones de teclado y contraste.
3. **`03_Instrumentos/`**: Protocolo de validación, modelo de consentimiento informado, fichas de registro por participante (SEQ y SUS) y declaración de autoría.
4. **`04_Figma/`**: Código e instrucciones para generar el kit de diseño accesible de 6 páginas en Figma.
5. **`05_Prototipo_web/`**: Código fuente de la versión accesible v3.
6. **`06_Trazabilidad/`**: Manifiesto de datos estructurados del proyecto y correspondencia de criterios.
7. **`07_Editable/`**: Copia editable de respaldo del informe técnico en Word.

---

## Prototipo Web y Despliegue
- **Arquitectura**: Desarrollado en React + Vite con backend relacional en Supabase y desplegado en la nube a través de Vercel.
- **Declaración de accesibilidad**: Publicada en la ruta `/accesibilidad`, detallando el nivel de conformidad parcial WCAG 2.1 AA, tecnologías de apoyo evaluadas, excepciones técnicas conocidas y canal directo de reporte de barreras (cumpliendo con la bonificación B2 de la rúbrica).
- **Formulario funcional**: Implementación de prevención y recuperación de errores (WCAG 3.3.1, 3.3.3, 3.3.4) con validación accesible, resumen de errores con foco programático y confirmación almacenada en base de datos.

---

## Validación Inclusiva con Usuarios
- **Muestra**: 5 participantes adultos (AP3-01 a AP3-05) distribuidos en 3 perfiles (Visual, Motor y Cognitivo / Adulto mayor).
- **Condición**: 3 participantes con condición real o uso habitual de tecnologías de apoyo (NVDA 2024.1 + Zoom 200 %, navegación física exclusiva por teclado, texto ampliado nativo) y 2 simulaciones metodológicas declaradas (filtro Stark Protanopia y teclado a una mano).
- **Resultados de Efectividad**: 95 % de éxito autónomo global (19/20 tareas completadas sin intervención del facilitador; superando el umbral del 80 %).
- **Resultados de Eficiencia**: Medianas de tiempo optimizadas (T1: 28 s, T2: 13 s, T3: 10 s, T4: 45 s).
- **Satisfacción y Usabilidad**: SUS promedio de **88,0 / 100** (Grado A, Excelente), superando la línea base histórica de APF2 (82,92 / 100). SEQ mediana de 6 a 7 (fácil a muy fácil).

---

## Declaración de Autoría y Uso Ético de IA
- El equipo declara un uso ético y acotado de inteligencia artificial generativa como asistente para el estilo de redacción y formato tabular, estimándose una participación inferior al 25 % del total del informe (cumpliendo con el límite universitario de un máximo de 30 % sin penalización).
- La totalidad del análisis técnico WCAG, el diseño del kit accesible en Figma, el código de la solución, el despliegue en Vercel, las pruebas con usuarios y la formulación de conclusiones fueron realizados directamente por los cuatro integrantes del Grupo 5.
