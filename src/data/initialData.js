export const INITIAL_USERS = [
  {
    id: 'user-admin',
    name: 'Administrador CloudBox',
    email: 'admin@cloudbox.com',
    password: 'admin123',
    role: 'admin',
    bio: 'Superadministrador de la plataforma CloudBox. Moderación global, auditoría de archivos y control de usuarios.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    plan: 'enterprise',
    storageLimit: 536870912000,
    isVerified: true,
    isBlocked: false,
    createdAt: '2026-01-01T10:00:00.000Z'
  },
  {
    id: 'user-jessica',
    name: 'Jessica Hernández',
    email: 'jessica@ceutec.edu',
    password: 'jessica123',
    role: 'user',
    bio: 'Estudiante de Ingeniería de Software en CEUTEC. Desarrollando soluciones web modernas y almacenamiento en la nube.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    plan: 'pro',
    storageLimit: 53687091200,
    isVerified: true,
    isBlocked: false,
    createdAt: '2026-02-15T08:30:00.000Z'
  },
  {
    id: 'user-carlos',
    name: 'Carlos Mendoza',
    email: 'carlos@cloudbox.com',
    password: 'user123',
    role: 'user',
    bio: 'Diseñador UI/UX y creador de contenidos digitales. Uso CloudBox para compartir recursos gráficos con clientes.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    plan: 'free',
    storageLimit: 5368709120,
    isVerified: true,
    isBlocked: false,
    createdAt: '2026-03-01T11:00:00.000Z'
  }
]

export const INITIAL_FOLDERS = [
  {
    id: 'folder-1',
    name: 'Documentos Académicos',
    userId: 'user-jessica',
    parentId: null,
    color: '#4f46e5',
    isDeleted: false,
    deletedAt: null,
    createdAt: '2026-02-16T09:00:00.000Z'
  },
  {
    id: 'folder-2',
    name: 'Proyecto Ingeniería de Software',
    userId: 'user-jessica',
    parentId: 'folder-1',
    color: '#0284c7',
    isDeleted: false,
    deletedAt: null,
    createdAt: '2026-02-17T10:15:00.000Z'
  },
  {
    id: 'folder-3',
    name: 'Multimedia y Recursos',
    userId: 'user-jessica',
    parentId: null,
    color: '#10b981',
    isDeleted: false,
    deletedAt: null,
    createdAt: '2026-02-18T14:20:00.000Z'
  },
  {
    id: 'folder-4',
    name: 'Diseños y Brandbook',
    userId: 'user-carlos',
    parentId: null,
    color: '#f59e0b',
    isDeleted: false,
    deletedAt: null,
    createdAt: '2026-03-02T12:00:00.000Z'
  }
]

export const INITIAL_FILES = [
  {
    id: 'file-1',
    name: 'Especificacion_Requerimientos_Proyecto2.pdf',
    userId: 'user-jessica',
    folderId: 'folder-2',
    size: 2457600,
    type: 'pdf',
    mimeType: 'application/pdf',
    url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    isDeleted: false,
    deletedAt: null,
    isRestricted: false,
    restrictionReason: null,
    downloadsCount: 14,
    createdAt: '2026-02-18T11:00:00.000Z'
  },
  {
    id: 'file-2',
    name: 'Arquitectura_del_Sistema_CloudBox.png',
    userId: 'user-jessica',
    folderId: 'folder-2',
    size: 1843200,
    type: 'image',
    mimeType: 'image/png',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    isDeleted: false,
    deletedAt: null,
    isRestricted: false,
    restrictionReason: null,
    downloadsCount: 29,
    createdAt: '2026-02-19T14:30:00.000Z'
  },
  {
    id: 'file-3',
    name: 'Podcast_Presentacion_Tecnica.mp3',
    userId: 'user-jessica',
    folderId: 'folder-3',
    size: 6291456,
    type: 'audio',
    mimeType: 'audio/mpeg',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    isDeleted: false,
    deletedAt: null,
    isRestricted: false,
    restrictionReason: null,
    downloadsCount: 8,
    createdAt: '2026-02-20T16:00:00.000Z'
  },
  {
    id: 'file-4',
    name: 'Demo_Video_Promocional.mp4',
    userId: 'user-jessica',
    folderId: 'folder-3',
    size: 15728640,
    type: 'video',
    mimeType: 'video/mp4',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    isDeleted: false,
    deletedAt: null,
    isRestricted: false,
    restrictionReason: null,
    downloadsCount: 42,
    createdAt: '2026-02-21T18:45:00.000Z'
  },
  {
    id: 'file-5',
    name: 'Configuracion_Servidor.json',
    userId: 'user-jessica',
    folderId: null,
    size: 4096,
    type: 'document-text',
    mimeType: 'application/json',
    content: JSON.stringify({
      appName: 'CloudBox Storage Pro',
      version: '2.5.0',
      cloudRegion: 'us-east-1',
      encryption: 'AES-256-GCM',
      maxUploadParallel: 4,
      features: {
        chat: true,
        downloadLinks: true,
        previewInApp: true,
        adminAudit: true
      }
    }, null, 2),
    url: null,
    isDeleted: false,
    deletedAt: null,
    isRestricted: false,
    restrictionReason: null,
    downloadsCount: 5,
    createdAt: '2026-02-22T08:00:00.000Z'
  },
  {
    id: 'file-6',
    name: 'Manual_Usuario_CloudBox.txt',
    userId: 'user-jessica',
    folderId: 'folder-1',
    size: 8192,
    type: 'document-text',
    mimeType: 'text/plain',
    content: `BIENVENIDO A CLOUDBOX

Plataforma integral de gestión de archivos personales, carpetas y enlaces seguros.

1. Subida de Archivos:
Arrastra y suelta tus archivos o haz clic en Subir Archivo.

2. Previsualización:
Podrás ver imágenes, reproducir audios y videos, y leer documentos directamente en la web.

3. Enlaces Compartidos:
Crea enlaces protegidos con contraseña y fechas de expiración independientes.

4. Papelera de Reciclaje:
Al eliminar carpetas o archivos, van a la papelera hasta que decidas vaciarla.`,
    url: null,
    isDeleted: false,
    deletedAt: null,
    isRestricted: false,
    restrictionReason: null,
    downloadsCount: 3,
    createdAt: '2026-02-22T09:30:00.000Z'
  },
  {
    id: 'file-7',
    name: 'Logotipo_Vectorial_CEUTEC.png',
    userId: 'user-carlos',
    folderId: 'folder-4',
    size: 940000,
    type: 'image',
    mimeType: 'image/png',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
    isDeleted: false,
    deletedAt: null,
    isRestricted: false,
    restrictionReason: null,
    downloadsCount: 19,
    createdAt: '2026-03-02T13:10:00.000Z'
  }
]

export const INITIAL_DOWNLOAD_LINKS = [
  {
    id: 'link-1',
    userId: 'user-jessica',
    targetType: 'file',
    targetId: 'file-1',
    title: 'Enlace para Evaluación Docente',
    token: 'doc-eval-2026',
    password: null,
    includePasswordInUrl: false,
    expiresAt: '2026-12-31T23:59:59.000Z',
    downloadsCount: 14,
    createdAt: '2026-02-18T12:00:00.000Z'
  },
  {
    id: 'link-2',
    userId: 'user-jessica',
    targetType: 'file',
    targetId: 'file-1',
    title: 'Enlace con Clave de Seguridad',
    token: 'doc-confidencial',
    password: 'secretoceutec',
    includePasswordInUrl: true,
    expiresAt: null,
    downloadsCount: 6,
    createdAt: '2026-02-18T15:00:00.000Z'
  },
  {
    id: 'link-3',
    userId: 'user-jessica',
    targetType: 'folder',
    targetId: 'folder-2',
    title: 'Descarga Completa Carpeta Proyecto',
    token: 'folder-proyecto2',
    password: 'react2026',
    includePasswordInUrl: false,
    expiresAt: '2026-12-30T00:00:00.000Z',
    downloadsCount: 9,
    createdAt: '2026-02-19T10:00:00.000Z'
  }
]

export const INITIAL_CHAT_MESSAGES = [
  {
    id: 'msg-1',
    senderId: 'user-admin',
    senderName: 'Administrador CloudBox',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    channelId: 'general',
    text: '¡Bienvenidos a la plataforma CloudBox! Recuerden mantener un uso respetuoso del almacenamiento y compartir enlaces de forma segura.',
    isModerated: false,
    createdAt: '2026-02-15T09:00:00.000Z'
  },
  {
    id: 'msg-2',
    senderId: 'user-jessica',
    senderName: 'Jessica Hernández',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    channelId: 'general',
    text: 'Hola a todos, acabo de subir los recursos del Proyecto 2 de Ingeniería de Software para revisión.',
    isModerated: false,
    createdAt: '2026-02-18T11:30:00.000Z'
  },
  {
    id: 'msg-3',
    senderId: 'user-carlos',
    senderName: 'Carlos Mendoza',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    channelId: 'general',
    text: 'Excelente Jessica, ya revisé los archivos compartidos mediante el enlace. La previsualización de video y documentos funciona excelente.',
    isModerated: false,
    createdAt: '2026-02-18T12:05:00.000Z'
  }
]

export const STORAGE_PLANS = [
  {
    id: 'free',
    name: 'Plan Básico',
    tagline: 'Ideal para uso personal cotidiano',
    sizeBytes: 5368709120,
    sizeText: '5 GB',
    price: 0,
    features: [
      '5 GB de almacenamiento en la nube',
      'Previsualización de imágenes y audio',
      'Enlaces de descarga básicos',
      'Acceso al chat de comunidad'
    ]
  },
  {
    id: 'pro',
    name: 'Plan Profesional',
    tagline: 'Para estudiantes y profesionales exigentes',
    sizeBytes: 53687091200,
    sizeText: '50 GB',
    price: 9.99,
    popular: true,
    features: [
      '50 GB de almacenamiento de alta velocidad',
      'Enlaces protegidos con contraseña ilimitados',
      'Fechas de expiración personalizadas',
      'Previsualización completa (Video, Audio, Docs, PDF)',
      'Soporte prioritario y panel analítico completo'
    ]
  },
  {
    id: 'enterprise',
    name: 'Plan Empresarial',
    tagline: 'Máxima capacidad sin restricciones',
    sizeBytes: 536870912000,
    sizeText: '500 GB',
    price: 24.99,
    features: [
      '500 GB de almacenamiento ultra rápido',
      'Múltiples enlaces simultáneos por archivo/carpeta',
      'Auditoría y estadísticas avanzadas en tiempo real',
      'Transferencia de archivos de gran tamaño',
      'Seguridad de nivel corporativo'
    ]
  }
]