import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const initialUsers = [
  {
    id: 'user-admin',
    name: 'Administrador CloudBox',
    email: 'admin@cloudbox.com',
    password: 'admin123',
    role: 'admin',
    bio: 'Superadministrador de la plataforma CloudBox. Moderación global, auditoría de archivos y control de usuarios.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    plan: 'enterprise',
    storageLimit: BigInt(536870912000),
    isVerified: true,
    isBlocked: false
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
    storageLimit: BigInt(53687091200),
    isVerified: true,
    isBlocked: false
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
    storageLimit: BigInt(5368709120),
    isVerified: true,
    isBlocked: false
  }
]

async function main() {
  for (const u of initialUsers) {
    await prisma.profile.upsert({
      where: { id: u.id },
      update: {},
      create: u
    })
  }
}

main()
  .catch((e) => {
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
