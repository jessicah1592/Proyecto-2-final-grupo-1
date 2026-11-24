import React, { useState, useEffect } from 'react'
import { X, Folder, Palette, Check } from 'lucide-react'
import { useFiles } from '../../context/FileContext'
import { useAuth } from '../../context/AuthContext'

const COLOR_OPTIONS = [
  '#4f46e5',
  '#0284c7',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#64748b'
]

export const CreateFolderModal = ({ isOpen, onClose, folderToEdit }) => {
  const { currentUser } = useAuth()
  const { currentFolderId, createFolder, renameFolder } = useFiles()

  const [name, setName] = useState('')
  const [color, setColor] = useState(COLOR_OPTIONS[0])
  const [error, setError] = useState('')

  useEffect(() => {
    if (folderToEdit) {
      setName(folderToEdit.name)
      setColor(folderToEdit.color || COLOR_OPTIONS[0])
    } else {
      setName('')
      setColor(COLOR_OPTIONS[0])
    }
  }, [folderToEdit, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Por favor ingresa un nombre para la carpeta.')
      return
    }

    if (folderToEdit) {
      renameFolder(folderToEdit.id, name)
    } else {
      createFolder({
        name,
        parentId: currentFolderId,
        color,
        userId: currentUser.id
      })
    }

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
              style={{ backgroundColor: color }}
            >
              <Folder className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                {folderToEdit ? 'Renombrar Carpeta' : 'Nueva Carpeta'}
              </h2>
              <p className="text-xs text-slate-500">
                {folderToEdit ? 'Actualiza el nombre' : 'Organiza tus archivos personales'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && <p className="text-xs text-rose-600">{error}</p>}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Nombre de la Carpeta</label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ej: Proyectos 2026"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>

          {!folderToEdit && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-slate-400" />
                <span>Color Distintivo</span>
              </label>
              <div className="flex items-center gap-2 pt-1">
                {COLOR_OPTIONS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm"
                    style={{ backgroundColor: c }}
                  >
                    {color === c && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm"
            >
              {folderToEdit ? 'Guardar Cambios' : 'Crear Carpeta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}