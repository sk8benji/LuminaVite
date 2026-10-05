# 🎀 LuminaVite - SaaS de Invitaciones Digitales Interactivas (Bodas & XV Años)

Plataforma SaaS para crear, personalizar y compartir invitaciones digitales interactivas en formato móvil vertical (9:16) con confirmación RSVP directa a WhatsApp, conteo regresivo en vivo y almacenamiento multimedia en AWS S3.

---

## 🚀 Características Principales

* **Carga móvil en menos de 1 segundo:** Renderizado ultraligero optimizado para redes 4G con React Server Components.
* **Previsualizaciones automáticas en WhatsApp:** Metadatos dinámicos OpenGraph con la foto vertical, nombre y fecha.
* **Confirmación RSVP sin fricción a WhatsApp:** Generación de mensaje codificado listo para enviar al anfitrión o salón.
* **5 Estilos y Paletas Visuales:**
  * `Princesa Rosa` (XV Años)
  * `Clásica Imperial` (Bodas / Gala)
  * `Esmeralda Royal` (Gala Nocturna)
  * `Jardín Botánica` (Boho / Romántica)
  * `Minimalista Editorial` (Vogue / Modern)
* **Multimedia con AWS S3:** Subida directa con Presigned URLs (fotos 9:16, bloque de niña a señorita y música MP3 de fondo) sin sobrecargar el servidor.
* **Línea de Tiempo interactiva (Itinerario):** Nodos con iconos para llegada, misa, brindis, vals y fiesta.
* **Mesa de regalos / Zelle / Lluvia de Sobres.**
* **Agendar en Calendario:** Enlaces directos a Google Calendar y descarga de archivo `.ics` para Apple/Outlook.
* **Panel de Control (Dashboard) & Wizard de 4 pasos:** Con simulador interactivo de smartphone en tiempo real.

---

## 🛠️ Stack Tecnológico

* **Framework:** Next.js (App Router) + TypeScript
* **Estilos:** Tailwind CSS + Lucide Icons + Canvas Confetti
* **Base de Datos & ORM:** PostgreSQL + Prisma ORM
* **Almacenamiento:** AWS S3 (`@aws-sdk/client-s3` y Presigned URLs)
* **Despliegue:** Railway + Git (`main` branch CI/CD)

---

## ⚙️ Variables de Entorno

Configura en tu archivo `.env` o en el panel de **Railway**:

```env
# Conexión a PostgreSQL (proporcionada automáticamente por el plugin de Railway)
DATABASE_URL="postgresql://usuario:password@host:port/database?schema=public"

# AWS S3 Storage
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="TU_AWS_ACCESS_KEY_ID"
AWS_SECRET_ACCESS_KEY="TU_AWS_SECRET_ACCESS_KEY"
AWS_S3_BUCKET_NAME="luminavite-storage"
AWS_CLOUDFRONT_URL="" # Opcional si usas CloudFront

# URL del sitio
NEXT_PUBLIC_SITE_URL="https://tu-proyecto.up.railway.app"
```

---

## 📦 Configuración del Bucket en AWS S3

Para permitir que el navegador suba fotos y música directamente a S3, configura la regla CORS en tu Bucket de AWS S3:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"]
  }
]
```

---

## 🚢 Despliegue en Railway

1. Entra a [Railway.app](https://railway.app) y crea un nuevo proyecto.
2. Agrega un servicio **PostgreSQL**.
3. Agrega un servicio desde **GitHub Repo**: selecciona `sk8benji/LuminaVite`.
4. En las variables del servicio Next.js, referencia `DATABASE_URL` desde la base de datos PostgreSQL de Railway y agrega tus credenciales de AWS S3.
5. Railway detectará el `Dockerfile` o el build de Next.js automáticamente y desplegará en minutos.

---

## 💻 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Generar cliente de Prisma
npx prisma generate

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) para ver la aplicación.
Demos integrados listos para probar:
* Demo XV Años: `http://localhost:3000/elsy-xv`
* Demo Boda: `http://localhost:3000/sofia-y-alejandro`
* Panel de Creación: `http://localhost:3000/eventos/nuevo`
