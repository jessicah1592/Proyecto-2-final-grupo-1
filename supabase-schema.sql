create table if not exists public.profiles (
  id text primary key,
  email text unique not null,
  name text not null,
  password text,
  role text default 'user',
  bio text,
  avatar text,
  plan text default 'free',
  storage_limit bigint default 5368709120,
  is_verified boolean default false,
  verification_token text,
  reset_token text,
  is_blocked boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.folders (
  id text primary key,
  user_id text not null,
  name text not null,
  parent_id text,
  color text default '#6366f1',
  is_deleted boolean default false,
  deleted_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.files (
  id text primary key,
  user_id text not null,
  folder_id text,
  name text not null,
  size bigint not null default 0,
  type text not null,
  mime_type text default 'application/octet-stream',
  url text,
  content text,
  is_deleted boolean default false,
  deleted_at timestamp with time zone,
  is_restricted boolean default false,
  restriction_reason text,
  downloads_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.download_links (
  id text primary key,
  user_id text not null,
  target_type text not null,
  target_id text not null,
  title text not null,
  token text unique not null,
  password text,
  include_password_in_url boolean default false,
  expires_at timestamp with time zone,
  downloads_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.chat_messages (
  id text primary key,
  sender_id text not null,
  sender_name text not null,
  sender_avatar text,
  channel_id text default 'general',
  text text not null,
  is_moderated boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;
alter table public.folders enable row level security;
alter table public.files enable row level security;
alter table public.download_links enable row level security;
alter table public.chat_messages enable row level security;

drop policy if exists "Allow all public profiles" on public.profiles;
create policy "Allow all public profiles" on public.profiles for all using (true) with check (true);

drop policy if exists "Allow all public folders" on public.folders;
create policy "Allow all public folders" on public.folders for all using (true) with check (true);

drop policy if exists "Allow all public files" on public.files;
create policy "Allow all public files" on public.files for all using (true) with check (true);

drop policy if exists "Allow all public download links" on public.download_links;
create policy "Allow all public download links" on public.download_links for all using (true) with check (true);

drop policy if exists "Allow all public chat messages" on public.chat_messages;
create policy "Allow all public chat messages" on public.chat_messages for all using (true) with check (true);

insert into storage.buckets (id, name, public) values ('cloudbox-files', 'cloudbox-files', true)
on conflict (id) do nothing;

drop policy if exists "Public Access cloudbox-files" on storage.objects;
create policy "Public Access cloudbox-files" on storage.objects for all using (bucket_id = 'cloudbox-files') with check (bucket_id = 'cloudbox-files');

insert into public.profiles (id, email, name, password, role, bio, avatar, plan, storage_limit, is_verified, is_blocked, created_at)
values
  ('user-admin', 'admin@cloudbox.com', 'Administrador CloudBox', 'admin123', 'admin', 'Superadministrador de la plataforma CloudBox. Moderación global, auditoría de archivos y control de usuarios.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80', 'enterprise', 536870912000, true, false, '2026-01-01T10:00:00.000Z'),
  ('user-jessica', 'jessica@ceutec.edu', 'Jessica Hernández', 'jessica123', 'user', 'Estudiante de Ingeniería de Software en CEUTEC. Desarrollando soluciones web modernas y almacenamiento en la nube.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80', 'pro', 53687091200, true, false, '2026-02-15T08:30:00.000Z'),
  ('user-carlos', 'carlos@cloudbox.com', 'Carlos Mendoza', 'user123', 'user', 'Diseñador UI/UX y creador de contenidos digitales. Uso CloudBox para compartir recursos gráficos con clientes.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80', 'free', 5368709120, true, false, '2026-03-01T11:00:00.000Z')
on conflict (id) do update set
  name = excluded.name,
  password = excluded.password,
  role = excluded.role,
  bio = excluded.bio,
  avatar = excluded.avatar,
  plan = excluded.plan,
  storage_limit = excluded.storage_limit;

insert into public.folders (id, user_id, name, parent_id, color, is_deleted, created_at)
values
  ('folder-1', 'user-jessica', 'Documentos Académicos', null, '#4f46e5', false, '2026-02-16T09:00:00.000Z'),
  ('folder-2', 'user-jessica', 'Proyecto Ingeniería de Software', 'folder-1', '#0284c7', false, '2026-02-17T10:15:00.000Z'),
  ('folder-3', 'user-jessica', 'Multimedia y Recursos', null, '#10b981', false, '2026-02-18T14:20:00.000Z'),
  ('folder-4', 'user-carlos', 'Diseños y Brandbook', null, '#f59e0b', false, '2026-03-02T12:00:00.000Z')
on conflict (id) do nothing;

insert into public.files (id, user_id, folder_id, name, size, type, mime_type, url, content, is_deleted, is_restricted, downloads_count, created_at)
values
  ('file-1', 'user-jessica', 'folder-2', 'Especificacion_Requerimientos_Proyecto2.pdf', 2457600, 'pdf', 'application/pdf', 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf', null, false, false, 14, '2026-02-18T11:00:00.000Z'),
  ('file-2', 'user-jessica', 'folder-2', 'Arquitectura_del_Sistema_CloudBox.png', 1843200, 'image', 'image/png', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80', null, false, false, 29, '2026-02-19T14:30:00.000Z'),
  ('file-3', 'user-jessica', 'folder-3', 'Podcast_Presentacion_Tecnica.mp3', 6291456, 'audio', 'audio/mpeg', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', null, false, false, 8, '2026-02-20T16:00:00.000Z'),
  ('file-4', 'user-jessica', 'folder-3', 'Demo_Video_Promocional.mp4', 15728640, 'video', 'video/mp4', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', null, false, false, 42, '2026-02-21T18:45:00.000Z'),
  ('file-5', 'user-jessica', null, 'Configuracion_Servidor.json', 4096, 'document-text', 'application/json', null, '{\n  "appName": "CloudBox Storage Pro",\n  "version": "2.5.0",\n  "cloudRegion": "us-east-1",\n  "encryption": "AES-256-GCM"\n}', false, false, 5, '2026-02-22T08:00:00.000Z'),
  ('file-6', 'user-jessica', 'folder-1', 'Manual_Usuario_CloudBox.txt', 8192, 'document-text', 'text/plain', null, 'BIENVENIDO A CLOUDBOX\nPlataforma integral de gestión de archivos personales.', false, false, 3, '2026-02-22T09:30:00.000Z'),
  ('file-7', 'user-carlos', 'folder-4', 'Logotipo_Vectorial_CEUTEC.png', 940000, 'image', 'image/png', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80', null, false, false, 19, '2026-03-02T13:10:00.000Z')
on conflict (id) do nothing;

insert into public.download_links (id, user_id, target_type, target_id, title, token, password, include_password_in_url, expires_at, downloads_count, created_at)
values
  ('link-1', 'user-jessica', 'file', 'file-1', 'Enlace para Evaluación Docente', 'doc-eval-2026', null, false, '2026-12-31T23:59:59.000Z', 14, '2026-02-18T12:00:00.000Z'),
  ('link-2', 'user-jessica', 'file', 'file-1', 'Enlace con Clave de Seguridad', 'doc-confidencial', 'secretoceutec', true, null, 6, '2026-02-18T15:00:00.000Z'),
  ('link-3', 'user-jessica', 'folder', 'folder-2', 'Descarga Completa Carpeta Proyecto', 'folder-proyecto2', 'react2026', false, '2026-12-30T00:00:00.000Z', 9, '2026-02-19T10:00:00.000Z')
on conflict (id) do nothing;

insert into public.chat_messages (id, sender_id, sender_name, sender_avatar, channel_id, text, is_moderated, created_at)
values
  ('msg-1', 'user-admin', 'Administrador CloudBox', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80', 'general', '¡Bienvenidos a la plataforma CloudBox! Recuerden mantener un uso respetuoso del almacenamiento y compartir enlaces de forma segura.', false, '2026-02-15T09:00:00.000Z'),
  ('msg-2', 'user-jessica', 'Jessica Hernández', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80', 'general', 'Hola a todos, acabo de subir los recursos del Proyecto 2 de Ingeniería de Software para revisión.', false, '2026-02-18T11:30:00.000Z'),
  ('msg-3', 'user-carlos', 'Carlos Mendoza', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80', 'general', 'Excelente Jessica, ya revisé los archivos compartidos mediante el enlace. La previsualización de video y documentos funciona excelente.', false, '2026-02-18T12:05:00.000Z')
on conflict (id) do nothing;
