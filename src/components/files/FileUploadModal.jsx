import React, { useState, useRef } from 'react'
import { X, UploadCloud, File, AlertCircle, CheckCircle2, HardDrive } from 'lucide-react'
import { useFiles } from '../../context/FileContext'
import { useAuth } from '../../context/AuthContext'
import { formatBytes } from '../../utils/helpers'

export const FileUploadModal = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth()
  const { currentFolderId, folders, uploadFile, getUserStorageUsed } = useFiles()

  const [selectedFiles, setSelectedFiles] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const fileInputRef = useRef(null)

  if (!isOpen || !currentUser) return null

  const currentFolder = folders.find(f => f.id === currentFolderId)
  const usedBytes = getUserStorageUsed(currentUser.id)
  const remainingBytes = Math.max(0, currentUser.storageLimit - usedBytes)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(Array.from(e.dataTransfer.files))
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesSelected(Array.from(e.target.files))
    }
  }

  const handleFilesSelected = (filesList) => {
    setError('')
    const totalSelectedSize = filesList.reduce((sum, f) => sum + f.size, 0)
    if (totalSelectedSize > remainingBytes) {
      setError(`El total seleccionado (${formatBytes(totalSelectedSize)}) supera tu espacio disponible (${formatBytes(remainingBytes)}). Amplía tu plan para subir más.`)
      return
    }
    setSelectedFiles(prev => [...prev, ...filesList])
  }

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleUploadSubmit = async () => {
    if (selectedFiles.length === 0) {
      setError('Por favor selecciona al menos un archivo para subir.')
      return
    }

    setIsUploading(true)
    setError('')

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        await new Promise((resolve, reject) => {
          const reader = new FileReader()

          if (file.type.startsWith('text/') || file.name.endsWith('.json') || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
            reader.readAsText(file)
            reader.onload = (e) => {
              try {
                uploadFile({
                  name: file.name,
                  size: file.size,
                  mimeType: file.type || 'text/plain',
                  content: e.target.result,
                  url: null,
                  folderId: currentFolderId,
                  userId: currentUser.id,
                  userStorageLimit: currentUser.storageLimit
                })
                resolve()
              } catch (err) {
                reject(err)
              }
            }
          } else {
            reader.readAsDataURL(file)
            reader.onload = (e) => {
              try {
                uploadFile({
                  name: file.name,
                  size: file.size,
                  mimeType: file.type || 'application/octet-stream',
                  content: null,
                  url: e.target.result,
                  folderId: currentFolderId,
                  userId: currentUser.id,
                  userStorageLimit: currentUser.storageLimit
                })
                resolve()
              } catch (err) {
                reject(err)
              }
            }
          }

          reader.onerror = () => reject(new Error('Error al leer el archivo del dispositivo.'))
        })

        setProgress(Math.round(((i + 1) / selectedFiles.length) * 100))
      }

      setTimeout(() => {
        setIsUploading(false)
        setSelectedFiles([])
        setProgress(0)
        onClose()
      }, 500)
    } catch (err) {
      setError(err.message)
      setIsUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Subir Archivos</h2>
              <p className="text-xs text-slate-500">
                Destino: {currentFolder ? `Carpeta "${currentFolder.name}"` : 'Raíz (Mis Archivos)'}
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

        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50/70 scale-[0.99]'
                : 'border-slate-300 hover:border-indigo-400 bg-slate-50/60 hover:bg-slate-50'
            }`}
          >
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <UploadCloud className="w-12 h-12 text-indigo-500 mx-auto mb-3 animate-bounce" />
            <p className="text-sm font-bold text-slate-700">
              Haz clic para seleccionar o arrastra archivos aquí
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Imágenes, audios, videos, documentos PDF, textos o cualquier archivo
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-100/70 p-2.5 rounded-xl">
            <span className="flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-slate-400" />
              <span>Espacio disponible en tu cuenta:</span>
            </span>
            <span className="font-bold text-slate-700">{formatBytes(remainingBytes)}</span>
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">
                Archivos seleccionados ({selectedFiles.length})
              </span>
              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                {selectedFiles.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate flex-1">
                      <File className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span className="truncate font-medium text-slate-700">{f.name}</span>
                      <span className="text-slate-400 shrink-0">({formatBytes(f.size)})</span>
                    </div>
                    <button
                      onClick={() => removeFile(i)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isUploading && (
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs text-indigo-700 font-semibold">
                <span>Subiendo archivos...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleUploadSubmit}
              disabled={isUploading || selectedFiles.length === 0}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-200"
            >
              {isUploading ? 'Procesando...' : `Subir ${selectedFiles.length} Archivo(s)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}