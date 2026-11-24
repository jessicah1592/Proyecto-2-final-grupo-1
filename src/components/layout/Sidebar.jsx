import React, { useState } from 'react'
import {
  Folder,
  FolderPlus,
  UploadCloud,
  HardDrive,
  Trash2,
  BarChart2,
  CreditCard,
  ShieldAlert,
  ChevronRight,
  ChevronDown,
  Plus,
  Zap,
  FolderTree
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useFiles } from '../../context/FileContext'
import { formatBytes } from '../../utils/helpers'

export const Sidebar = ({ activeView, setActiveView, onOpenUpgrade }) => {
  const { currentUser } = useAuth()
  const {
    folders,
    files,
    currentFolderId,
    setCurrentFolderId,
    getUserStorageUsed,
    setIsUploadModalOpen,
    setIsCreateFolderModalOpen
  } = useFiles()

  const [isNewMenuOpen, setIsNewMenuOpen] = useState(false)
  const [expandedFolders, setExpandedFolders] = useState({})

  const userFolders = currentUser
    ? folders.filter(f => f.userId === currentUser.id && !f.isDeleted)
    : []

  const userTrashCount = currentUser
    ? files.filter(f => f.userId === currentUser.id && f.isDeleted).length +
      folders.filter(f => f.userId === currentUser.id && f.isDeleted).length
    : 0

  const usedBytes = currentUser ? getUserStorageUsed(currentUser.id) : 0
  const maxBytes = currentUser ? currentUser.storageLimit : 1
  const percentUsed = Math.min(100, Math.round((usedBytes / maxBytes) * 100))

  const toggleFolderExpand = (folderId, e) => {
    e.stopPropagation()
    setExpandedFolders(prev => ({ ...prev, [folderId]: !prev[folderId] }))
  }

  const renderFolderHierarchy = (parentId = null, depth = 0) => {
    const list = userFolders.filter(f => f.parentId === parentId)
    if (list.length === 0) return null

    return (
      <div className={`space-y-0.5 ${depth > 0 ? 'ml-3 pl-2 border-l border-slate-200' : ''}`}>
        {list.map(f => {
          const hasChildren = userFolders.some(child => child.parentId === f.id)
          const isExpanded = !!expandedFolders[f.id]
          const isCurrent = currentFolderId === f.id && activeView === 'files'

          return (
            <div key={f.id}>
              <div
                onClick={() => {
                  setCurrentFolderId(f.id)
                  setActiveView('files')
                }}
                className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  isCurrent
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {hasChildren ? (
                    <button
                      type="button"
                      onClick={(e) => toggleFolderExpand(f.id, e)}
                      className="p-0.5 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600"
                    >
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>
                  ) : (
                    <span className="w-3.5" />
                  )}
                  <Folder
                    className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110"
                    style={{ color: f.color || '#6366f1' }}
                  />
                  <span className="truncate">{f.name}</span>
                </div>
              </div>

              {hasChildren && isExpanded && renderFolderHierarchy(f.id, depth + 1)}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 shrink-0 select-none">
      <div className="p-4 space-y-5 overflow-y-auto">
        <div className="relative">
          <button
            onClick={() => setIsNewMenuOpen(!isNewMenuOpen)}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm shadow-md shadow-indigo-200 hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Elemento</span>
            <ChevronDown className="w-4 h-4 ml-auto" />
          </button>

          {isNewMenuOpen && (
            <div
              className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-40 animate-in fade-in zoom-in-95"
              onMouseLeave={() => setIsNewMenuOpen(false)}
            >
              <button
                onClick={() => {
                  setIsUploadModalOpen(true)
                  setIsNewMenuOpen(false)
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 text-left"
              >
                <UploadCloud className="w-4 h-4 text-indigo-500" />
                <span>Subir Archivo</span>
              </button>

              <button
                onClick={() => {
                  setIsCreateFolderModalOpen(true)
                  setIsNewMenuOpen(false)
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 text-left"
              >
                <FolderPlus className="w-4 h-4 text-indigo-500" />
                <span>Nueva Carpeta</span>
              </button>
            </div>
          )}
        </div>

        <nav className="space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Navegación
          </p>

          <button
            onClick={() => {
              setCurrentFolderId(null)
              setActiveView('files')
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeView === 'files' && currentFolderId === null
                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>Mis Archivos</span>
          </button>

          <button
            onClick={() => setActiveView('trash')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeView === 'trash'
                ? 'bg-rose-50 text-rose-700 font-semibold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Trash2 className="w-4 h-4" />
              <span>Papelera</span>
            </div>
            {userTrashCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold">
                {userTrashCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveView('stats')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeView === 'stats'
                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Estadísticas de Uso</span>
          </button>

          <button
            onClick={() => setActiveView('plans')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeView === 'plans'
                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Planes de Almacenamiento</span>
          </button>

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => setActiveView('admin')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                activeView === 'admin'
                  ? 'bg-rose-100 text-rose-800'
                  : 'text-rose-600 hover:bg-rose-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Panel Administrador</span>
              </div>
              <span className="text-[10px] bg-rose-600 text-white uppercase px-1.5 py-0.5 rounded font-bold">
                Admin
              </span>
            </button>
          )}
        </nav>

        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <FolderTree className="w-3.5 h-3.5" />
              <span>Estructura de Carpetas</span>
            </div>
            <button
              onClick={() => setIsCreateFolderModalOpen(true)}
              title="Crear subcarpeta"
              className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="max-h-56 overflow-y-auto px-1">
            {renderFolderHierarchy(null)}
            {userFolders.length === 0 && (
              <p className="px-3 py-2 text-xs text-slate-400 italic">No hay carpetas creadas</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-200 bg-slate-50/50">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Almacenamiento</span>
            <span className="text-slate-500 font-medium">{percentUsed}%</span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                percentUsed > 85 ? 'bg-rose-500' : percentUsed > 60 ? 'bg-amber-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${percentUsed}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-400">
            {formatBytes(usedBytes)} de {formatBytes(maxBytes)} utilizados
          </p>

          <button
            onClick={onOpenUpgrade}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-xl transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-indigo-600" />
            <span>Ampliar Capacidad</span>
          </button>
        </div>
      </div>
    </aside>
  )
}