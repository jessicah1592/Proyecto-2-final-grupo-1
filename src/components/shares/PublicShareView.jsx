import React, { useState } from 'react'
import {
  Cloud,
  Download,
  Lock,
  Calendar,
  AlertCircle,
  FileCheck,
  Folder,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  Eye
} from 'lucide-react'
import { formatBytes, formatDate, downloadBlob } from '../../utils/helpers'

export const PublicShareView = ({
  token,
  urlPassword,
  downloadLinks,
  files,
  folders,
  users,
  onRecordDownload,
  onClose
}) => {
  const link = downloadLinks.find(l => l.token === token)
  const [passwordInput, setPasswordInput] = useState(urlPassword || '')
  const [isUnlocked, setIsUnlocked] = useState(() => {
    if (!link) return false
    if (!link.password) return true
    if (urlPassword && urlPassword === link.password) return true
    return false
  })
  const [passwordError, setPasswordError] = useState('')
  const [previewingFile, setPreviewingFile] = useState(null)

  if (!link) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-xl border border-slate-200">
          <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-800">Enlace no encontrado</h2>
          <p className="text-xs text-slate-500 mt-2">
            El enlace de descarga que intentas abrir ha sido revocado o ya no existe.
          </p>
          <button
            onClick={onClose}
            className="mt-6 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs shadow-md"
          >
            Volver a CloudBox
          </button>
        </div>
      </div>
    )
  }

  const isExpired = link.expiresAt && new Date(link.expiresAt) < new Date()
  if (isExpired) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-xl border border-slate-200">
          <Calendar className="w-16 h-16 text-amber-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-800">Enlace Expirado</h2>
          <p className="text-xs text-slate-500 mt-2">
            Este enlace de descarga expiró el {formatDate(link.expiresAt)}. Solicita un nuevo enlace al propietario.
          </p>
          <button
            onClick={onClose}
            className="mt-6 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs shadow-md"
          >
            Volver a CloudBox
          </button>
        </div>
      </div>
    )
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    setPasswordError('')
    if (passwordInput.trim() === link.password) {
      setIsUnlocked(true)
    } else {
      setPasswordError('Contraseña incorrecta. Por favor intenta de nuevo.')
    }
  }

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 text-center">Enlace Protegido con Contraseña</h2>
          <p className="text-xs text-slate-500 text-center mt-1 mb-6">
            El remitente protegió el acceso a este contenido. Ingresa la clave para continuar.
          </p>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {passwordError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                {passwordError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Contraseña de Acceso</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  autoFocus
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-200 flex items-center justify-center gap-2"
            >
              <span>Desbloquear y Ver Contenido</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    )
  }

  const isFolder = link.targetType === 'folder'
  const folder = isFolder ? folders.find(f => f.id === link.targetId) : null
  const file = !isFolder ? files.find(f => f.id === link.targetId) : null
  const folderFiles = isFolder ? files.filter(f => f.folderId === folder?.id && !f.isDeleted) : []
  const owner = users.find(u => u.id === link.userId)

  const handleDownloadSingle = (targetFile) => {
    onRecordDownload(link.id)
    downloadBlob(targetFile.url || targetFile.content, targetFile.name, targetFile.mimeType)
  }

  const handleDownloadAllFolder = () => {
    folderFiles.forEach(f => {
      handleDownloadSingle(f)
    })
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
            <Cloud className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-800">CloudBox Share</span>
        </div>
        <button
          onClick={onClose}
          className="text-xs text-indigo-600 hover:underline font-semibold"
        >
          Ir al Inicio de CloudBox
        </button>
      </header>

      <main className="max-w-3xl w-full mx-auto p-4 sm:p-6 my-auto">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                {isFolder ? <Folder className="w-8 h-8" /> : <FileCheck className="w-8 h-8" />}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                  {isFolder ? 'Carpeta Compartida' : 'Archivo Compartido'}
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  {isFolder ? folder?.name : file?.name}
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Compartido por <span className="font-semibold text-slate-600">{owner?.name || 'Usuario'}</span> • {formatDate(link.createdAt)}
                </p>
              </div>
            </div>

            {!isFolder && file && (
              <button
                onClick={() => handleDownloadSingle(file)}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-indigo-200 flex items-center justify-center gap-2 shrink-0 transition-transform hover:scale-105"
              >
                <Download className="w-5 h-5" />
                <span>Descargar ({formatBytes(file.size)})</span>
              </button>
            )}

            {isFolder && folderFiles.length > 0 && (
              <button
                onClick={handleDownloadAllFolder}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-indigo-200 flex items-center justify-center gap-2 shrink-0 transition-transform hover:scale-105"
              >
                <Download className="w-5 h-5" />
                <span>Descargar Todo ({folderFiles.length} archivos)</span>
              </button>
            )}
          </div>

          <div className="py-6">
            {!isFolder && file && (
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                  {file.type === 'image' && file.url && (
                    <div className="max-h-96 overflow-hidden rounded-xl bg-slate-200 flex items-center justify-center mb-4">
                      <img src={file.url} alt={file.name} className="max-h-96 object-contain" />
                    </div>
                  )}

                  {file.type === 'audio' && file.url && (
                    <div className="p-4 text-center">
                      <audio controls className="w-full">
                        <source src={file.url} type={file.mimeType} />
                      </audio>
                    </div>
                  )}

                  {file.type === 'video' && file.url && (
                    <div className="rounded-xl overflow-hidden bg-black mb-4">
                      <video controls className="w-full max-h-96 object-contain">
                        <source src={file.url} type={file.mimeType} />
                      </video>
                    </div>
                  )}

                  {(file.type === 'document-text' || file.content) && (
                    <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs max-h-80 overflow-auto">
                      <code>{file.content}</code>
                    </pre>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-3">
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">TAMAÑO</span>
                      <span className="font-bold text-slate-800">{formatBytes(file.size)}</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">TIPO</span>
                      <span className="font-bold text-slate-800 uppercase">{file.type}</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">DESCARGAS</span>
                      <span className="font-bold text-slate-800">{link.downloadsCount || 0}</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">SEGURIDAD</span>
                      <span className="font-bold text-emerald-600 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verificado
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isFolder && (
              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 text-sm">
                  Archivos en esta carpeta ({folderFiles.length})
                </h3>

                {folderFiles.length === 0 ? (
                  <p className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                    Esta carpeta no contiene archivos públicos actualmente.
                  </p>
                ) : (
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
                    {folderFiles.map(f => (
                      <div key={f.id} className="p-3.5 flex items-center justify-between hover:bg-white transition-colors">
                        <div className="flex items-center gap-3 truncate">
                          <FileText className="w-5 h-5 text-indigo-500 shrink-0" />
                          <div className="truncate">
                            <p className="text-xs font-semibold text-slate-800 truncate">{f.name}</p>
                            <p className="text-[11px] text-slate-400">{formatBytes(f.size)}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDownloadSingle(f)}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shrink-0 ml-3"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Descargar</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="p-4 text-center text-xs text-slate-400">
        CloudBox Storage • Proyecto 2 de Ingeniería de Software
      </footer>
    </div>
  )
}