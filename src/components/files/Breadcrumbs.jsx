import React from 'react'
import { ChevronRight, Home, Folder, Plus, UploadCloud, LayoutGrid, List, Filter } from 'lucide-react'
import { useFiles } from '../../context/FileContext'

export const Breadcrumbs = ({ onNewFolder, onUpload }) => {
  const {
    folders,
    currentFolderId,
    setCurrentFolderId,
    viewMode,
    setViewMode,
    fileTypeFilter,
    setFileTypeFilter
  } = useFiles()

  const buildTrail = () => {
    if (!currentFolderId) return []
    const trail = []
    let curr = folders.find(f => f.id === currentFolderId)
    while (curr) {
      trail.unshift(curr)
      curr = folders.find(f => f.id === curr.parentId)
    }
    return trail
  }

  const trail = buildTrail()

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
      <div className="flex items-center gap-1.5 flex-wrap text-sm">
        <button
          onClick={() => setCurrentFolderId(null)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-colors ${
            !currentFolderId ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Mis Archivos</span>
        </button>

        {trail.map((folder, index) => {
          const isLast = index === trail.length - 1
          return (
            <React.Fragment key={folder.id}>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              <button
                onClick={() => setCurrentFolderId(folder.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  isLast ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Folder className="w-3.5 h-3.5" style={{ color: folder.color || '#6366f1' }} />
                <span>{folder.name}</span>
              </button>
            </React.Fragment>
          )
        })}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
          <select
            value={fileTypeFilter}
            onChange={(e) => setFileTypeFilter(e.target.value)}
            className="bg-transparent text-slate-700 font-medium px-2 py-1 outline-none cursor-pointer"
          >
            <option value="all">Todos los tipos</option>
            <option value="image">Imágenes</option>
            <option value="video">Videos</option>
            <option value="audio">Audios</option>
            <option value="document">Documentos / PDF</option>
            <option value="code">Código / Texto</option>
          </select>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('grid')}
            title="Vista en Cuadrícula"
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            title="Vista en Lista"
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={onNewFolder}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Carpeta</span>
        </button>

        <button
          onClick={onUpload}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Subir Archivo</span>
        </button>
      </div>
    </div>
  )
}