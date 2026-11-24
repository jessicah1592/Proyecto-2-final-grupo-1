import React, { useState } from 'react'
import {
  X,
  Download,
  Share2,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Play,
  Pause,
  Volume2,
  VolumeX,
  FileText,
  FileCode,
  ShieldAlert
} from 'lucide-react'
import { formatBytes, formatDate, downloadBlob } from '../../utils/helpers'

export const FilePreviewModal = ({ file, isOpen, onClose, onShare }) => {
  if (!isOpen || !file) return null

  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)

  const handleDownload = () => {
    downloadBlob(file.url || file.content, file.name, file.mimeType)
  }

  const renderPreviewContent = () => {
    if (file.isRestricted) {
      return (
        <div className="p-12 text-center text-slate-400">
          <ShieldAlert className="w-16 h-16 text-rose-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">Archivo Restringido</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            {file.restrictionReason || 'Este archivo ha sido restringido por el administrador y no está disponible para visualización pública.'}
          </p>
        </div>
      )
    }

    if (file.type === 'image') {
      return (
        <div className="flex flex-col items-center justify-center p-4 min-h-[360px] bg-slate-900/5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 text-xs shadow-sm">
            <button
              onClick={() => setZoom(prev => Math.min(prev + 0.25, 3))}
              className="p-1 hover:bg-slate-100 rounded text-slate-700"
              title="Acercar"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="font-mono">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom(prev => Math.max(prev - 0.25, 0.5))}
              className="p-1 hover:bg-slate-100 rounded text-slate-700"
              title="Alejar"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-slate-200" />
            <button
              onClick={() => setRotation(prev => (prev + 90) % 360)}
              className="p-1 hover:bg-slate-100 rounded text-slate-700"
              title="Rotar 90°"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-[60vh] max-w-full overflow-auto flex items-center justify-center p-2">
            <img
              src={file.url}
              alt={file.name}
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transition: 'transform 0.2s ease-out'
              }}
              className="max-h-[50vh] object-contain rounded-lg shadow-lg select-none"
            />
          </div>
        </div>
      )
    }

    if (file.type === 'audio') {
      return (
        <div className="p-8 text-center bg-gradient-to-b from-indigo-50/50 to-purple-50/50 rounded-2xl border border-indigo-100">
          <div className="w-24 h-24 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-200">
            <Volume2 className="w-12 h-12" />
          </div>
          <h3 className="font-bold text-slate-800 text-base mb-1">{file.name}</h3>
          <p className="text-xs text-slate-400 mb-6">{formatBytes(file.size)} • Reproducción directa</p>

          <div className="max-w-md mx-auto">
            <audio controls autoPlay className="w-full outline-none">
              <source src={file.url} type={file.mimeType || 'audio/mpeg'} />
              Tu navegador no soporta el reproductor de audio.
            </audio>
          </div>
        </div>
      )
    }

    if (file.type === 'video') {
      return (
        <div className="bg-black rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">
          <video
            controls
            autoPlay
            className="w-full max-h-[65vh] object-contain outline-none"
          >
            <source src={file.url} type={file.mimeType || 'video/mp4'} />
            Tu navegador no soporta la reproducción de video HTML5.
          </video>
        </div>
      )
    }

    if (file.type === 'pdf') {
      return (
        <div className="w-full h-[65vh] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 flex flex-col">
          <div className="p-2.5 bg-slate-800 text-white flex items-center justify-between text-xs px-4">
            <span className="font-mono flex items-center gap-2">
              <FileText className="w-4 h-4 text-red-400" />
              {file.name}
            </span>
            <span className="text-slate-400">Visualizador PDF integrado</span>
          </div>
          <iframe
            src={`${file.url}#toolbar=1`}
            title={file.name}
            className="w-full flex-1 border-0"
          />
        </div>
      )
    }

    if (file.type === 'document-text' || file.type === 'code' || file.content) {
      return (
        <div className="rounded-2xl border border-slate-200 bg-slate-900 text-slate-100 overflow-hidden flex flex-col max-h-[60vh]">
          <div className="p-3 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between text-xs px-4">
            <span className="font-mono flex items-center gap-2 text-indigo-300">
              <FileCode className="w-4 h-4" />
              {file.name}
            </span>
            <span className="text-slate-400 font-mono">{formatBytes(file.size)}</span>
          </div>
          <pre className="p-4 font-mono text-xs overflow-auto leading-relaxed select-text flex-1">
            <code>{file.content || 'Sin contenido de texto disponible para visualizar.'}</code>
          </pre>
        </div>
      )
    }

    return (
      <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200">
        <FileText className="w-16 h-16 text-slate-400 mx-auto mb-3" />
        <h3 className="font-bold text-slate-800 text-base">{file.name}</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Este tipo de archivo ({file.mimeType || 'binario'}) no cuenta con visor interactivo en pantalla. Puedes descargarlo directamente a tu equipo.
        </p>
        <button
          onClick={handleDownload}
          className="mt-4 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md inline-flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Descargar a mi dispositivo</span>
        </button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        <div className="p-4 sm:px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3 min-w-0 flex-1 mr-4">
            <h2 className="text-base font-bold text-slate-800 truncate">{file.name}</h2>
            <span className="text-xs text-slate-400 hidden sm:inline shrink-0">
              {formatBytes(file.size)} • {formatDate(file.createdAt)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onShare(file)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Compartir</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Descargar</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 flex-1 overflow-y-auto bg-slate-100/40">
          {renderPreviewContent()}
        </div>
      </div>
    </div>
  )
}