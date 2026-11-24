import React, { useState } from 'react'
import { Folder, MoreVertical, Share2, Trash2, Edit2, FolderOpen, Link2 } from 'lucide-react'
import { useFiles } from '../../context/FileContext'
import { formatDate } from '../../utils/helpers'

export const FolderCard = ({ folder, onOpen, onEdit, onShare }) => {
  const { files, folders, deleteFolder, downloadLinks } = useFiles()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const filesCount = files.filter(f => f.folderId === folder.id && !f.isDeleted).length
  const subfoldersCount = folders.filter(f => f.parentId === folder.id && !f.isDeleted).length

  const activeLinksCount = downloadLinks.filter(l => l.targetType === 'folder' && l.targetId === folder.id).length

  const handleDelete = (e) => {
    e.stopPropagation()
    setIsMenuOpen(false)
    if (confirm(`¿Enviar a la papelera la carpeta "${folder.name}" y todos los archivos contenidos?`)) {
      deleteFolder(folder.id)
    }
  }

  return (
    <div
      onDoubleClick={onOpen}
      onClick={onOpen}
      className="group relative bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
            style={{ backgroundColor: `${folder.color || '#6366f1'}15`, color: folder.color || '#6366f1' }}
          >
            <Folder className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors line-clamp-1 max-w-[140px] sm:max-w-[180px]">
              {folder.name}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {filesCount} archivos {subfoldersCount > 0 ? `• ${subfoldersCount} carpetas` : ''}
            </p>
          </div>
        </div>

        <div className="relative" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {isMenuOpen && (
            <div
              className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-30 animate-in fade-in zoom-in-95"
              onMouseLeave={() => setIsMenuOpen(false)}
            >
              <button
                onClick={() => {
                  setIsMenuOpen(false)
                  onOpen()
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 text-left font-medium"
              >
                <FolderOpen className="w-3.5 h-3.5 text-indigo-500" />
                <span>Abrir carpeta</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false)
                  onShare()
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 text-left font-medium"
              >
                <Share2 className="w-3.5 h-3.5 text-indigo-500" />
                <span>Generar enlaces ({activeLinksCount})</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false)
                  onEdit()
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 text-left font-medium"
              >
                <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Renombrar carpeta</span>
              </button>

              <div className="border-t border-slate-100 my-1" />

              <button
                onClick={handleDelete}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 text-left font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Mover a papelera</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Creada: {formatDate(folder.createdAt)}</span>
        {activeLinksCount > 0 && (
          <span className="flex items-center gap-1 text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-full">
            <Link2 className="w-3 h-3" />
            {activeLinksCount} enlaces
          </span>
        )}
      </div>
    </div>
  )
}