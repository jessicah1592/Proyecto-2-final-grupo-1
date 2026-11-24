# CloudBox - Gestión y Almacenamiento de Archivos (Prisma + Supabase)

Sistema web desarrollado con **React**, **Vite**, **Tailwind CSS**, **Prisma ORM** y **Supabase** para la gestión personal de archivos en la nube, carpetas jerárquicas, previsualización multimedia interactiva, enlaces de descarga protegidos con contraseña, chat comunitario en tiempo real, planes de almacenamiento con pago simulado y panel de administración global.

---

## Integración con Prisma ORM

Se ha configurado **Prisma** para gestionar los modelos de la base de datos PostgreSQL alojada en Supabase.

### 1. Esquema de Datos (`prisma/schema.prisma`)
Define los modelos mapeados a las tablas de la base de datos:
- `Profile`: Gestión de usuarios, credenciales, roles, biografía, foto de perfil, planes y cuotas.
- `Folder`: Jerarquía de carpetas con soporte de subcarpetas y papelera.
- `File`: Archivos subidos, tipos MIME, peso, URLs y estado de moderación.
- `DownloadLink`: Enlaces de descarga con tokens únicos, contraseñas y expiración.
- `ChatMessage`: Mensajes del chat comunitario.

### 2. Variables de Entorno (`.env`)
En el archivo `.env` se encuentran configuradas las variables de conexión directa y agrupada (pooler) de Supabase para Prisma:
```env
DATABASE_URL="postgresql://postgres.ygygrvmfwfepmyazymgg:[TU_CONTRASENA_SUPABASE]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.ygygrvmfwfepmyazymgg:[TU_CONTRASENA_SUPABASE]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```
*(Reemplaza `[TU_CONTRASENA_SUPABASE]` con la contraseña de tu base de datos en Supabase).*

### 3. Comandos de Prisma Disponibles

| Comando | Acción |
| :--- | :--- |
| `npm run prisma:generate` | Genera el cliente tipado de Prisma `@prisma/client`. |
| `npm run prisma:push` | Sincroniza y crea las tablas directamente en la base de datos de Supabase sin necesidad de migraciones manuales. |
| `npm run prisma:studio` | Abre la interfaz gráfica visual de Prisma Studio en el navegador para ver y editar registros en vivo. |
| `npm run prisma:seed` | Ejecuta el archivo semilla (`prisma/seed.js`) para insertar los usuarios iniciales. |
| `npm run server` | Inicia el servidor backend API Express (`server.js`) impulsado por Prisma Client en el puerto 5000. |

---

## Características Principales

### 1. Registro y Autenticación de Usuarios
- Formulario de registro con nombre, correo, contraseña, biografía y selección de foto de perfil (avatares predefinidos o subida de imagen propia desde el equipo).
- Inicio de sesión con validación de credenciales, comprobación de estado de bloqueo y sincronización con Supabase.
- Validación por correo electrónico con códigos de 6 dígitos y enlaces directos (`?verify=` y `?reset=`).
- Buzón interactivo de notificaciones y correos del sistema en pantalla con confirmación en 1 clic y soporte opcional para integración con EmailJS.

### 2. Gestión de Archivos
- Carga de archivos desde el dispositivo mediante selector o arrastrar y soltar (Drag and Drop), con verificación de cuota de almacenamiento disponible.
- Visualización en cuadrícula (Grid) y en lista (List), con buscador en tiempo real y filtros por tipo de archivo.
- Consulta de metadatos detallados (nombre, tipo MIME, tamaño en bytes/MB, fecha y hora de subida, propietario, carpeta y contador de descargas).
- Previsualización directa en la aplicación sin necesidad de descarga:
  - **Imágenes**: visualizador con zoom y rotación 90°.
  - **Audio**: reproductor interactivo con controles de reproducción.
  - **Video**: reproductor de video HTML5 de alta definición.
  - **Documentos y Código**: visor de documentos PDF y visor de texto/código formateado.
- Descarga directa de archivos a la computadora.
- Eliminación a la papelera con deshabilitación automática de sus enlaces de descarga asociados.

### 3. Gestión de Carpetas
- Creación de carpetas personalizadas con paleta de colores distintivos y estructura en árbol (subcarpetas anidadas).
- Mover archivos entre carpetas (lo quita de la carpeta anterior).
- Duplicar archivos (crea una copia independiente que ocupa almacenamiento adicional dentro del plan del usuario).
- Al eliminar una carpeta, todos los archivos que contiene y sus enlaces de descarga asociados se trasladan a la papelera.
- Papelera de reciclaje con opción para restaurar elementos o vaciar permanentemente liberando espacio en la cuenta.

### 4. Panel de Administración y Moderación
- Vista exclusiva para el usuario administrador con permisos globales.
- Auditoría de todos los archivos de cualquier usuario de la plataforma.
- Restricción de archivos con motivo específico (bloquea la visualización pública) y eliminación definitiva.
- Moderación y eliminación definitiva de carpetas.
- Moderación del chat comunitario (marcar mensajes inapropiados o eliminarlos).
- Control de usuarios: bloqueo/desbloqueo de cuentas, restablecimiento directo de contraseñas y ajuste de cuotas de almacenamiento.

### 5. Enlaces de Descarga Múltiples y Personalizados
- Generación de enlaces de descarga tanto para archivos individuales como para carpetas completas.
- Múltiples enlaces simultáneos por archivo o carpeta, cada uno con su propio título, clave de acceso y fecha de expiración opcional.
- Dos modalidades de contraseña:
  - Incluida directamente en el enlace URL para acceso inmediato.
  - Entregada por separado, solicitando al destinatario ingresar la contraseña en el portal.
- Revocación independiente de cualquier enlace sin alterar los demás enlaces activos.
- Portal público de descarga (`?share=TOKEN`) con validación de clave, comprobación de expiración, previsualización y descarga individual o masiva de carpetas.

### 6. Chat Integrado con Supabase Realtime
- Comunicación instantánea entre usuarios con suscripción a eventos de Supabase Realtime.
- Identificación de usuario con avatar, nombre y hora.
- Herramientas de moderación en tiempo real para el administrador.

### 7. Planes de Almacenamiento y Pago Simulado
- Planes disponibles:
  - **Plan Básico**: 5 GB (Gratuito)
  - **Plan Profesional**: 50 GB ($9.99 / mes)
  - **Plan Empresarial**: 500 GB ($24.99 / mes)
- Formulario de pago simulado con tarjeta de crédito/débito, formateo automático y confirmación con actualización instantánea de la cuota de almacenamiento.

### 8. Panel de Estadísticas Personales
- Gráfico circular de porcentaje de almacenamiento utilizado vs total disponible.
- Desglose detallado por tipo de archivo (Imágenes, Videos, Audios, Documentos/PDF, Otros) con peso y porcentaje.
- Métricas de archivos totales, carpetas, enlaces activos y descargas acumuladas.

---

## Cuentas de Acceso Preconfiguradas para Pruebas

| Rol | Correo Electrónico | Contraseña | Plan |
| :--- | :--- | :--- | :--- |
| **Super Administrador** | `admin@cloudbox.com` | `admin123` | Empresarial (500 GB) |
| **Usuario Pro (Jessica)** | `jessica@ceutec.edu` | `jessica123` | Profesional (50 GB) |
| **Usuario Básico (Carlos)**| `carlos@cloudbox.com` | `user123` | Básico (5 GB) |

*Nota: La barra de navegación superior incluye un selector rápido de cuentas para alternar de forma instantánea entre perfiles sin necesidad de escribir las credenciales.*

---

## Instrucciones para Ejecutar el Proyecto

1. Iniciar la aplicación React en modo desarrollo:
```bash
npm run dev
```

2. (Opcional) Iniciar el servidor API backend con Prisma:
```bash
npm run server
```

3. (Opcional) Visualizar los datos en Prisma Studio:
```bash
npm run prisma:studio
```
