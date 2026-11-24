import React, { useState } from 'react'
import {
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  FileArchive,
  File,
  MoreVertical,
  Eye,
  Download,
  Share2,
  Trash2,
  Copy,
  FolderInput,
  Info,
  ShieldAlert,
  Link2
} from 'lucide-react'
import { useFiles } from '../../context/FileContext'
import { formatBytes, formatDate, downloadBlob } from '../../utils/helpers'

export const FileCard = ({ file, isListView, onPreview, onDetails, onShare, onMoveCopy }) => {
  const { deleteFile, downloadLinks } = useFiles()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const activeLinks = downloadLinks.filter(l => l.targetType === 'file' && l.targetId === file.id)

  const getFileIcon = () => {
    switch (file.type) {
      case 'image':
        return <FileImage className="w-6 h-6 text-rose-500" />
      case 'video':
        return <FileVideo className="w-6 h-6 text-indigo-500" />
      case 'audio':
        return <FileAudio className="w-6 h-6 text-purple-500" />
      case 'pdf':
        return <FileText className="w-6 h-6 text-red-600" />
      case 'document-text':
      case 'code':
        return <FileCode className="w-6 h-6 text-emerald-600" />
      case 'archive':
        return <FileArchive className="w-6 h-6 text-amber-500" />
      default:
        return <File className="w-6 h-6 text-slate-500" />
    }
  }

  const handleDownload = (e) => {
    e.stopPropagation()
    downloadBlob(file.url || file.content, file.name, file.mimeType)
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    setIsMenuOpen(false)
    if (confirm(`¿Enviar "${file.name}" a la papelera? Sus enlaces asociados quedarán deshabilitados.`)) {
      deleteFile(file.id)
    }
  }

  if (isListView) {
    return (
      <div
        onClick={onPreview}
        className="group flex items-center justify-between p-3 bg-white hover:bg-indigo-50/40 border border-slate-200 rounded-xl transition-all cursor-pointer"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
            {getFileIcon()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-slate-800 text-xs sm:text-sm truncate group-hover:text-indigo-600">
                {file.name}
              </h4>
              {file.isRestricted && (
                <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shrink-0">
                  <ShieldAlert className="w-3 h-3" />
                  Restringido
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              {formatBytes(file.size)} • {formatDate(file.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-4">
          {activeLinks.length > 0 && (
            <span className="hidden sm:flex items-center gap-1 text-[11px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-semibold">
              <Link2 className="w-3 h-3" />
              {activeLinks.length}
            </span>
          )}

          <button
            onClick={handleDownload}
            title="Descargar archivo"
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              onShare()
            }}
            title="Enlaces de descarga"
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <div className="relative" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
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
                    onPreview()
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 text-left font-medium"
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Previsualizar</span>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false)
                    onDetails()
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 text-left font-medium"
                >
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  <span>Ver Detalles</span>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false)
                    onMoveCopy('move')
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 text-left font-medium"
                >
                  <FolderInput className="w-3.5 h-3.5 text-slate-400" />
                  <span>Mover a otra carpeta</span>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false)
                    onMoveCopy('copy')
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 text-left font-medium"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Duplicar archivo</span>
                </button>

                <div className="border-t border-slate-100 my-1" />

                <button
                  onClick={handleDelete}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 text-left font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar archivo</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={onPreview}
      className="group relative bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:scale-105 transition-transform">
            {getFileIcon()}
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
                    onPreview()
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 text-left font-medium"
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Previsualizar</span>
                </button>

                <button
                  onClick={(e) => {
                    setIsMenuOpen(false)
                    handleDownload(e)
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 text-left font-medium"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Descargar</span>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false)
                    onShare()
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 text-left font-medium"
                >
                  <Share2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Enlaces ({activeLinks.length})</span>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false)
                    onDetails()
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 text-left font-medium"
                >
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  <span>Detalles</span>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false)
                    onMoveCopy('move')
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 text-left font-medium"
                >
                  <FolderInput className="w-3.5 h-3.5 text-slate-400" />
                  <span>Mover a otra carpeta</span>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false)
                    onMoveCopy('copy')
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 text-left font-medium"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Duplicar archivo</span>
                </button>

                <div className="border-t border-slate-100 my-1" />

                <button
                  onClick={handleDelete}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 text-left font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar archivo</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {file.type === 'image' && file.url && (
          <div className="w-full h-28 mb-2 rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
            <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
          </div>
        )}

        <h4 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors line-clamp-2">
          {file.name}
        </h4>

        {file.isRestricted && (
          <div className="mt-1 inline-flex items-center gap-1 text-[10px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5 rounded">
            <ShieldAlert className="w-3 h-3" />
            <span>Restringido por moderación</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>{formatBytes(file.size)}</span>
        <div className="flex items-center gap-1.5">
          {activeLinks.length > 0 && (
            <span className="flex items-center gap-0.5 text-indigo-600 font-semibold bg-indigo-50 px-1.5 py-0.5 rounded">
              <Link2 className="w-3 h-3" />
              {activeLinks.length}
            </span>
          )}
          <span>{formatDate(file.createdAt)}</span>
        </div>
      </div>
    </div>
  )
}