import React, { useState } from 'react'
import { X, Folder, FolderInput, Copy, AlertCircle, Check } from 'lucide-react'
import { useFiles } from '../../context/FileContext'
import { useAuth } from '../../context/AuthContext'
import { formatBytes } from '../../utils/helpers'

export const MoveCopyModal = ({ file, mode = 'move', isOpen, onClose }) => {
  const { currentUser } = useAuth()
  const { folders, moveFile, duplicateFile } = useFiles()

  const [selectedFolderId, setSelectedFolderId] = useState(file?.folderId || null)
  const [operationMode, setOperationMode] = useState(mode)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  if (!isOpen || !file || !currentUser) return null

  const userFolders = folders.filter(f => f.userId === currentUser.id && !f.isDeleted)

  const handleAction = () => {
    setError('')
    try {
      if (operationMode === 'move') {
        if (selectedFolderId === file.folderId) {
          setError('El archivo ya se encuentra en esta carpeta.')
          return
        }
        moveFile(file.id, selectedFolderId)
        setSuccess('¡Archivo movido con éxito!')
      } else {
        duplicateFile(file.id, selectedFolderId, currentUser.id, currentUser.storageLimit)
        setSuccess('¡Copia creada con éxito (espacio adicional asignado)!')
      }

      setTimeout(() => {
        setSuccess('')
        onClose()
      }, 1000)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              {operationMode === 'move' ? <FolderInput className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                {operationMode === 'move' ? 'Mover Archivo' : 'Duplicar Archivo'}
              </h2>
              <p className="text-xs text-slate-500 truncate max-w-[200px]">{file.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2 text-xs text-emerald-700">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setOperationMode('move')}
              className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                operationMode === 'move' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              <FolderInput className="w-3.5 h-3.5" />
              <span>Mover (Quitar de la actual)</span>
            </button>
            <button
              onClick={() => setOperationMode('copy')}
              className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                operationMode === 'copy' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Duplicar (+{formatBytes(file.size)})</span>
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Selecciona Carpeta de Destino:</label>
            <div className="max-h-56 overflow-y-auto space-y-1 border border-slate-200 rounded-xl p-2 bg-slate-50/50">
              <button
                type="button"
                onClick={() => setSelectedFolderId(null)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                  selectedFolderId === null
                    ? 'bg-indigo-100 text-indigo-800 font-bold border border-indigo-200'
                    : 'hover:bg-white text-slate-700'
                }`}
              >
                <Folder className="w-4 h-4 text-slate-400" />
                <span>Raíz (Mis Archivos)</span>
              </button>

              {userFolders.map(folder => (
                <button
                  key={folder.id}
                  type="button"
                  onClick={() => setSelectedFolderId(folder.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                    selectedFolderId === folder.id
                      ? 'bg-indigo-100 text-indigo-800 font-bold border border-indigo-200'
                      : 'hover:bg-white text-slate-700'
                  }`}
                >
                  <Folder className="w-4 h-4" style={{ color: folder.color || '#6366f1' }} />
                  <span className="truncate">{folder.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleAction}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm"
            >
              {operationMode === 'move' ? 'Confirmar Movimiento' : 'Crear Duplicado'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}