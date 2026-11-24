import React from 'react'
import {
  Trash2,
  RotateCcw,
  AlertTriangle,
  Folder,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  File,
  CheckCircle2
} from 'lucide-react'
import { useFiles } from '../../context/FileContext'
import { useAuth } from '../../context/AuthContext'
import { formatBytes, formatDate } from '../../utils/helpers'

export const TrashView = () => {
  const { currentUser } = useAuth()
  const {
    files,
    folders,
    restoreFile,
    restoreFolder,
    emptyTrash
  } = useFiles()

  if (!currentUser) return null

  const deletedFiles = files.filter(f => f.userId === currentUser.id && f.isDeleted)
  const deletedFolders = folders.filter(f => f.userId === currentUser.id && f.isDeleted)

  const totalItems = deletedFiles.length + deletedFolders.length
  const totalTrashSize = deletedFiles.reduce((sum, f) => sum + f.size, 0)

  const handleEmptyTrash = () => {
    if (confirm(`¿Estás seguro de que deseas vaciar la papelera? Se borrarán permanentemente ${totalItems} elementos y se liberará espacio de tu cuenta. Esta acción no se puede deshacer.`)) {
      emptyTrash(currentUser.id)
    }
  }

  const getFileIcon = (file) => {
    switch (file.type) {
      case 'image':
        return <FileImage className="w-5 h-5 text-rose-500" />
      case 'video':
        return <FileVideo className="w-5 h-5 text-indigo-500" />
      case 'audio':
        return <FileAudio className="w-5 h-5 text-purple-500" />
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-600" />
      case 'document-text':
      case 'code':
        return <FileCode className="w-5 h-5 text-emerald-600" />
      default:
        return <File className="w-5 h-5 text-slate-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Papelera de Reciclaje</h1>
              <p className="text-xs text-slate-500">
                {totalItems} elementos en papelera ({formatBytes(totalTrashSize)})
              </p>
            </div>
          </div>
        </div>

        {totalItems > 0 && (
          <button
            onClick={handleEmptyTrash}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-200 transition-all self-start sm:self-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Vaciar Papelera Permanentemente</span>
          </button>
        )}
      </div>

      {totalItems === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm max-w-lg mx-auto my-8">
          <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-300">
            <Trash2 className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">La papelera está vacía</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Los archivos y carpetas que elimines se mantendrán aquí hasta que decidas restaurarlos o vaciar la papelera.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {deletedFolders.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Carpetas Eliminadas ({deletedFolders.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {deletedFolders.map(folder => (
                  <div
                    key={folder.id}
                    className="p-4 bg-white rounded-2xl border border-rose-200 shadow-sm flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 truncate mr-2">
                      <Folder className="w-6 h-6 text-rose-400 shrink-0" />
                      <div className="truncate">
                        <p className="font-bold text-xs text-slate-800 truncate">{folder.name}</p>
                        <p className="text-[11px] text-slate-400">Eliminada: {formatDate(folder.deletedAt)}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => restoreFolder(folder.id)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 shrink-0 transition-colors"
                      title="Restaurar carpeta y su contenido"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restaurar</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {deletedFiles.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Archivos Eliminados ({deletedFiles.length})
              </h3>
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                {deletedFiles.map(file => (
                  <div
                    key={file.id}
                    className="p-3.5 flex items-center justify-between hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-3 truncate mr-3">
                      <div className="p-2 rounded-lg bg-slate-100 shrink-0">
                        {getFileIcon(file)}
                      </div>
                      <div className="truncate">
                        <p className="font-semibold text-xs text-slate-800 truncate">{file.name}</p>
                        <p className="text-[11px] text-slate-400">
                          {formatBytes(file.size)} • Eliminado: {formatDate(file.deletedAt)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => restoreFile(file.id)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 shrink-0 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restaurar</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}