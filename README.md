# Santa María Reyna de los Ángeles

Portal web público e intranet académica del Colegio Santa María Reyna de los Ángeles (La Perla, Callao).
Reescrito completamente en **React + Vite + TypeScript**, preparado para despliegue en **Vercel** y persistencia en **Supabase**.

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
   - Políticas de seguridad (RLS).
   - Datos iniciales completos (alumnos, cursos, horarios, tareas, comunicados y notas).
4. Ve a **Project Settings -> API** en Supabase y copia tu **Project URL** y **anon public key**.
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
   - `VITE_SUPABASE_ANON_KEY`: Tu clave anónima de Supabase.
5. Haz clic en **Deploy**.

> El archivo [`vercel.json`](vercel.json) ya se encuentra configurado para gestionar las rutas de la SPA sin errores 404 al recargar páginas.

---

## 📁 Estructura del Proyecto

```text
├── public/
│   └── assets/           # Fotografías y logo del colegio
├── src/
│   ├── components/       # Navbar, Footer, Modal, Toast, ScrollToTop
│   ├── intranet/         # Pantallas de la intranet
│   │   ├── views/        # Resumen, Alumnos, Cursos, Horario, Notas, Tareas, Avisos, Consultas
│   │   ├── Icons.tsx     # Iconos SVG
│   │   ├── IntranetLayout.tsx
│   │   └── Login.tsx
│   ├── lib/              # Cliente de Supabase (supabase.ts)
│   ├── pages/            # Páginas públicas (Inicio, Institución, Nivel, Galería, Contacto)
│   ├── services/         # dataService.ts y mockData.ts
│   ├── styles/           # styles.css y intranet.css
│   ├── types/            # Definiciones de TypeScript
│   ├── App.tsx           # Router principal
│   └── main.tsx          # Punto de entrada
├── supabase/
│   └── schema.sql        # Script SQL completo para Supabase
├── vercel.json           # Configuración de despliegue para Vercel
├── .env.example          # Plantilla de variables de entorno
└── package.json
```
