# Santa María Reyna de los Ángeles

Portal web público e intranet académica del Colegio Santa María Reyna de los Ángeles (La Perla, Callao).
Desarrollado en **React + Vite + TypeScript**, preparado para despliegue en **Vercel**, persistencia en **Supabase** e incorporando las mejoras de accesibilidad inclusiva del **APF3 (WCAG 2.1 nivel AA)**.

---

## ♿ Mejoras de Accesibilidad del APF3 (WCAG 2.1 AA)

- **Preferencias de lectura**: Barra superior con alternancia instantánea de **Alto Contraste** (`data-contrast="high"`) y **Texto Ampliado** (`data-text-size="large"`), con persistencia de sesión y anuncios en región viva ARIA.
- **Declaración de accesibilidad**: Ruta accesible en [`/accesibilidad`](/accesibilidad) detallando alcance, estado de conformidad y canales para reporte de barreras.
- **Formulario de contacto en dos pasos**: Paso 1 con ayuda contextual y validación con resumen de errores accesible (`role="alert"`), y Paso 2 con cuadro de diálogo accesible (`<dialog>`) para revisar y confirmar los datos antes de guardarlos.
- **Navegación por teclado y foco visible**: Enlaces e interactivos con área táctil mínima de 44px, indicador de foco contrastado (`outline: 3px solid #005fcc`) y retorno del foco al elemento de origen al cerrar ventanas modales.
- **Herramienta de auditoría en vivo (axe-core)**: Añade `?auditoria=1` a cualquier URL del portal para desplegar el panel de auditoría automática con `axe-core` y la prueba de espaciado de texto (WCAG 1.4.12).
- **Entregables e informes**: Todos los documentos oficiales de avance se encuentran en la carpeta [`avance informe 3/`](avance%20informe%203/):
  - Informe técnico: `APF3_Grupo5_SantaMaria.pdf` y `.docx`
  - Diapositivas de sustentación: `APF3_Grupo5_SantaMaria.pptx`
  - Matriz WCAG y Validación: `APF3_Grupo5_Matriz_WCAG_y_Validacion.xlsx`
  - Anexos e importador Figma: `APF3_Grupo5_Anexos.zip` y `APF3_Grupo5_Figma_Importable.zip`

---

## 🚀 Inicio rápido (Desarrollo local)

Requiere Node.js 18 o posterior.

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev
```

Abre en tu navegador:
- Portal público: [http://localhost:5173/](http://localhost:5173/)
- Con auditoría axe-core: [http://localhost:5173/?auditoria=1](http://localhost:5173/?auditoria=1)
- Declaración de accesibilidad: [http://localhost:5173/accesibilidad](http://localhost:5173/accesibilidad)
- Intranet académica: [http://localhost:5173/intranet](http://localhost:5173/intranet)

---

## 🔐 Cuentas de Demostración (Intranet)

| Perfil | Usuario | Contraseña | Aula |
| --- | --- | --- | --- |
| **Administrador** | `admin` | `Admin2026!` | Coordinación |
| **Estudiante** | `ana` | `Alumno2026!` | 5.º A de Primaria |
| **Estudiante** | `luis` | `Alumno2026!` | 5.º A de Primaria |
| **Estudiante** | `camila` | `Alumno2026!` | 1.º A de Secundaria |

*Nota: La pantalla de login incluye botones de acceso directo para ingresar con cualquiera de estas cuentas con un solo clic.*

---

## 🗄️ Configuración de Base de Datos con Supabase

El proyecto está diseñado con modo dual:
- **Sin credenciales**: Funciona inmediatamente en modo local utilizando `localStorage` y datos semilla de prueba.
- **Con credenciales**: Se conecta automáticamente a tu base de datos de Supabase en tiempo real.

### Pasos para conectar Supabase:

1. Crea un proyecto gratuito en [supabase.com](https://supabase.com).
2. Dirígete a la sección **SQL Editor** en tu panel de Supabase.
3. Abre el archivo [`supabase/schema.sql`](supabase/schema.sql) de este proyecto, copia todo su contenido y ejecútalo en Supabase. Este script creará:
   - Tablas: `students`, `users`, `courses`, `schedule`, `grades`, `tasks`, `submissions`, `announcements`, `contacts`, `audit`.
   - Permisos y privilegios para el cliente web anónimo (`anon`).
   - Datos iniciales completos (alumnos, cursos, horarios, tareas, comunicados y notas).
4. Ve a **Project Settings -> API** en Supabase y copia tu **Project URL** y **publishable / anon key**.
5. Crea un archivo `.env` en la raíz del proyecto (basado en `.env.example`):

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-public-key
```

6. Reinicia el servidor con `npm run dev` y el proyecto ya estará sincronizado con Supabase.

---

## 🌐 Despliegue en Vercel

1. Sube este repositorio a tu cuenta de GitHub.
2. Inicia sesión en [Vercel](https://vercel.com) y haz clic en **Add New -> Project**.
3. Importa el repositorio desde GitHub.
4. En **Environment Variables**, añade:
   - `VITE_SUPABASE_URL`: Tu URL de Supabase.
   - `VITE_SUPABASE_ANON_KEY`: Tu clave pública de Supabase.
5. Haz clic en **Deploy**.

> El archivo [`vercel.json`](vercel.json) ya se encuentra configurado para gestionar las rutas de la SPA sin errores 404 al recargar páginas.

---

## 📁 Estructura del Proyecto

```text
├── avance informe 3/     # Documentación APF3 (PDF, DOCX, PPTX, XLSX, Anexos ZIP)
├── public/
│   ├── assets/           # Fotografías y logo del colegio
│   ├── audit-tools.js    # Panel interactivo de auditoría axe-core
│   ├── audit-tools.css   # Estilos del panel de auditoría
│   ├── axe.min.js        # Motor axe-core WCAG 2.1 AA
│   └── spacing-test.css  # Comprobación de espaciado WCAG 1.4.12
├── src/
│   ├── components/       # Navbar, Footer, Modal, Toast, ScrollToTop, ReadingPreferences
│   ├── intranet/         # Pantallas de la intranet (Resumen, Alumnos, Cursos, Horario, Notas...)
│   ├── lib/              # Cliente de Supabase (supabase.ts)
│   ├── pages/            # Páginas públicas (Inicio, Institución, Nivel, Galería, Contacto, Declaración)
│   ├── services/         # dataService.ts y mockData.ts
│   ├── styles/           # styles.css, intranet.css y accessibility.css
│   ├── types/            # Definiciones de TypeScript
│   ├── App.tsx           # Router principal
│   └── main.tsx          # Punto de entrada
├── supabase/
│   └── schema.sql        # Script SQL completo para Supabase
├── vercel.json           # Configuración de despliegue para Vercel
├── .env.example          # Plantilla de variables de entorno
└── package.json
```
