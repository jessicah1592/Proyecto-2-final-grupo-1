import React from 'react'
import { X, Info, HardDrive, Calendar, FileType, User, Folder, Download, Link2, ShieldAlert } from 'lucide-react'
import { formatBytes, formatDate, downloadBlob } from '../../utils/helpers'
import { useFiles } from '../../context/FileContext'
import { useAuth } from '../../context/AuthContext'

export const FileDetailsModal = ({ file, isOpen, onClose }) => {
  const { folders, downloadLinks } = useFiles()
  const { users } = useAuth()

  if (!isOpen || !file) return null

  const parentFolder = folders.find(f => f.id === file.folderId)
  const owner = users.find(u => u.id === file.userId)
  const activeLinks = downloadLinks.filter(l => l.targetType === 'file' && l.targetId === file.id)

  const handleDownload = () => {
    downloadBlob(file.url || file.content, file.name, file.mimeType)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Detalles del Archivo</h2>
              <p className="text-xs text-slate-500">Información técnica y metadatos</p>
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
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <h3 className="font-bold text-slate-800 text-sm break-all">{file.name}</h3>
            <span className="inline-block mt-1 text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold">
              {file.mimeType || 'application/octet-stream'}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-slate-400" />
                <span>Tamaño:</span>
              </span>
              <span className="font-bold text-slate-800">{formatBytes(file.size)} ({file.size.toLocaleString()} bytes)</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-2">
                <FileType className="w-4 h-4 text-slate-400" />
                <span>Categoría:</span>
              </span>
              <span className="font-semibold text-slate-800 uppercase">{file.type}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Fecha de Subida:</span>
              </span>
              <span className="font-semibold text-slate-800">{formatDate(file.createdAt)}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-2">
                <Folder className="w-4 h-4 text-slate-400" />
                <span>Ubicación actual:</span>
              </span>
              <span className="font-semibold text-slate-800">{parentFolder ? parentFolder.name : 'Raíz (Mis Archivos)'}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                <span>Propietario:</span>
              </span>
              <span className="font-semibold text-slate-800">{owner ? owner.name : 'Usuario'}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-2">
                <Download className="w-4 h-4 text-slate-400" />
                <span>Descargas directas:</span>
              </span>
              <span className="font-semibold text-slate-800">{file.downloadsCount || 0} descargas</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-2">
                <Link2 className="w-4 h-4 text-slate-400" />
                <span>Enlaces de descarga activos:</span>
              </span>
              <span className="font-bold text-indigo-600">{activeLinks.length} enlace(s)</span>
            </div>

            {file.isRestricted && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                <div>
                  <p className="font-bold">Restringido por el Administrador</p>
                  <p className="text-[11px] text-rose-600">{file.restrictionReason || 'Contenido sujeto a moderación.'}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar Archivo</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}