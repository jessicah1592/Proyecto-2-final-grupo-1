import React from 'react'
import {
  BarChart3,
  HardDrive,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  Share2,
  Download,
  Folder,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useFiles } from '../../context/FileContext'
import { formatBytes } from '../../utils/helpers'

export const StatsDashboard = ({ onOpenUpgrade }) => {
  const { currentUser } = useAuth()
  const { files, folders, downloadLinks, getUserStorageUsed } = useFiles()

  if (!currentUser) return null

  const userFiles = files.filter(f => f.userId === currentUser.id && !f.isDeleted)
  const userFolders = folders.filter(f => f.userId === currentUser.id && !f.isDeleted)
  const userLinks = downloadLinks.filter(l => l.userId === currentUser.id)

  const usedBytes = getUserStorageUsed(currentUser.id)
  const maxBytes = currentUser.storageLimit
  const percentUsed = Math.min(100, Math.round((usedBytes / maxBytes) * 100))

  const totalDownloads = userLinks.reduce((sum, l) => sum + (l.downloadsCount || 0), 0) +
    userFiles.reduce((sum, f) => sum + (f.downloadsCount || 0), 0)

  const typeBreakdown = {
    images: userFiles.filter(f => f.type === 'image'),
    videos: userFiles.filter(f => f.type === 'video'),
    audios: userFiles.filter(f => f.type === 'audio'),
    documents: userFiles.filter(f => f.type === 'pdf' || f.type === 'document-text' || f.type === 'code' || f.type === 'document-office'),
    others: userFiles.filter(f => !['image', 'video', 'audio', 'pdf', 'document-text', 'code', 'document-office'].includes(f.type))
  }

  const calculateSize = (list) => list.reduce((sum, item) => sum + item.size, 0)

  const categories = [
    {
      label: 'Imágenes',
      icon: <FileImage className="w-5 h-5 text-rose-500" />,
      color: 'bg-rose-500',
      bgColor: 'bg-rose-50',
      count: typeBreakdown.images.length,
      size: calculateSize(typeBreakdown.images)
    },
    {
      label: 'Videos',
      icon: <FileVideo className="w-5 h-5 text-indigo-500" />,
      color: 'bg-indigo-600',
      bgColor: 'bg-indigo-50',
      count: typeBreakdown.videos.length,
      size: calculateSize(typeBreakdown.videos)
    },
    {
      label: 'Audios',
      icon: <FileAudio className="w-5 h-5 text-purple-500" />,
      color: 'bg-purple-600',
      bgColor: 'bg-purple-50',
      count: typeBreakdown.audios.length,
      size: calculateSize(typeBreakdown.audios)
    },
    {
      label: 'Documentos & PDF',
      icon: <FileText className="w-5 h-5 text-blue-500" />,
      color: 'bg-blue-600',
      bgColor: 'bg-blue-50',
      count: typeBreakdown.documents.length,
      size: calculateSize(typeBreakdown.documents)
    },
    {
      label: 'Otros Archivos',
      icon: <Layers className="w-5 h-5 text-slate-500" />,
      color: 'bg-slate-500',
      bgColor: 'bg-slate-50',
      count: typeBreakdown.others.length,
      size: calculateSize(typeBreakdown.others)
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Panel de Estadísticas y Uso</h1>
            <p className="text-xs text-slate-500">Métricas en tiempo real de tu cuenta y archivos</p>
          </div>
        </div>

        <button
          onClick={onOpenUpgrade}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-200 flex items-center gap-2 self-start sm:self-auto transition-transform hover:scale-105"
        >
          <span>Ampliar Plan de Almacenamiento</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Total de Archivos</span>
            <FileText className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-slate-800">{userFiles.length}</p>
          <p className="text-[11px] text-slate-400">Activos en tu nube</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Carpetas Creadas</span>
            <Folder className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-slate-800">{userFolders.length}</p>
          <p className="text-[11px] text-slate-400">Estructura jerárquica</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Enlaces Activos</span>
            <Share2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-slate-800">{userLinks.length}</p>
          <p className="text-[11px] text-slate-400">Protegidos o públicos</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Descargas Totales</span>
            <Download className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-slate-800">{totalDownloads}</p>
          <p className="text-[11px] text-slate-400">Generadas por terceros</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-indigo-600" />
              <span>Desglose por Tipo de Archivo</span>
            </h2>
            <span className="text-xs text-slate-400">Capacidad: {formatBytes(maxBytes)}</span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
            {categories.map((cat, idx) => {
              const catPercent = usedBytes > 0 ? (cat.size / usedBytes) * 100 : 0
              return (
                <div
                  key={idx}
                  className={`${cat.color} h-full transition-all`}
                  style={{ width: `${catPercent}%` }}
                  title={`${cat.label}: ${formatBytes(cat.size)}`}
                />
              )
            })}
          </div>

          <div className="divide-y divide-slate-100 pt-2">
            {categories.map((cat, idx) => {
              const catPercent = usedBytes > 0 ? Math.round((cat.size / usedBytes) * 100) : 0
              return (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${cat.bgColor}`}>
                      {cat.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{cat.label}</p>
                      <p className="text-[11px] text-slate-400">{cat.count} archivo(s)</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-800">{formatBytes(cat.size)}</p>
                    <p className="text-[11px] text-slate-400">{catPercent}% del espacio usado</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-800">Estado de tu Plan</h2>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                Plan {currentUser.plan}
              </span>
            </div>

            <div className="text-center py-4">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    stroke="#e2e8f0"
                    strokeWidth="12"
                    fill="transparent"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    stroke="#4f46e5"
                    strokeWidth="12"
                    strokeDasharray={326.7}
                    strokeDashoffset={326.7 - (326.7 * percentUsed) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-2xl font-bold text-slate-800">{percentUsed}%</span>
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Usado</span>
                </div>
              </div>

              <p className="text-xs font-semibold text-slate-700 mt-2">
                {formatBytes(usedBytes)} de {formatBytes(maxBytes)}
              </p>
              <p className="text-[11px] text-slate-400">
                {formatBytes(Math.max(0, maxBytes - usedBytes))} disponibles
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
            <div className="flex items-center gap-2 text-indigo-700 font-bold">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Seguridad de Almacenamiento</span>
            </div>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Tus archivos están respaldados y encriptados en la nube con acceso exclusivo desde tu cuenta.
            </p>
            <button
              onClick={onOpenUpgrade}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-center shadow-sm"
            >
              Mejorar Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}