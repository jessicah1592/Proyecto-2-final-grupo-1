import React, { useState } from 'react'
import {
  X,
  Share2,
  Lock,
  Calendar,
  Copy,
  Check,
  Trash2,
  Plus,
  ExternalLink,
  Shield,
  Clock,
  Link,
  Folder,
  File
} from 'lucide-react'
import { useFiles } from '../../context/FileContext'
import { useAuth } from '../../context/AuthContext'
import { formatDate } from '../../utils/helpers'

export const ShareLinksModal = ({ target, isOpen, onClose }) => {
  const { currentUser } = useAuth()
  const { downloadLinks, createDownloadLink, revokeDownloadLink } = useFiles()

  const [title, setTitle] = useState('')
  const [password, setPassword] = useState('')
  const [hasPassword, setHasPassword] = useState(false)
  const [includePasswordInUrl, setIncludePasswordInUrl] = useState(false)
  const [hasExpiration, setHasExpiration] = useState(false)
  const [expiresAt, setExpiresAt] = useState('')
  const [copiedLinkId, setCopiedLinkId] = useState(null)
  const [error, setError] = useState('')

  if (!isOpen || !target || !currentUser) return null

  const { type, item } = target
  const activeLinks = downloadLinks.filter(l => l.targetType === type && l.targetId === item.id)

  const handleCreateLink = (e) => {
    e.preventDefault()
    setError('')

    if (hasPassword && !password.trim()) {
      setError('Por favor define la contraseña para el enlace.')
      return
    }

    if (hasExpiration && !expiresAt) {
      setError('Por favor selecciona una fecha de expiración.')
      return
    }

    createDownloadLink({
      targetType: type,
      targetId: item.id,
      title: title || (type === 'folder' ? `Carpeta ${item.name}` : `Archivo ${item.name}`),
      password: hasPassword ? password.trim() : null,
      includePasswordInUrl,
      expiresAt: hasExpiration ? new Date(expiresAt).toISOString() : null,
      userId: currentUser.id
    })

    setTitle('')
    setPassword('')
    setHasPassword(false)
    setIncludePasswordInUrl(false)
    setHasExpiration(false)
    setExpiresAt('')
  }

  const getFullShareUrl = (link) => {
    const origin = window.location.origin + window.location.pathname
    let url = `${origin}?share=${link.token}`
    if (link.includePasswordInUrl && link.password) {
      url += `&pwd=${encodeURIComponent(link.password)}`
    }
    return url
  }

  const copyLinkToClipboard = (link) => {
    const url = getFullShareUrl(link)
    navigator.clipboard.writeText(url)
    setCopiedLinkId(link.id)
    setTimeout(() => setCopiedLinkId(null), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 my-6">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Enlaces de Descarga</h2>
              <p className="text-xs text-slate-500 truncate max-w-xs sm:max-w-md">
                {type === 'folder' ? 'Carpeta:' : 'Archivo:'} <span className="font-semibold text-slate-700">{item.name}</span>
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

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleCreateLink} className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-indigo-600" />
              <span>Generar Nuevo Enlace de Descarga</span>
            </h3>

            {error && <p className="text-xs text-rose-600">{error}</p>}

            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Etiqueta / Nombre del enlace (opcional)</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ej. Enlace para profesor o cliente"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-2 pt-1 border-t border-slate-200/60">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasPassword}
                  onChange={e => setHasPassword(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <Lock className="w-3.5 h-3.5 text-indigo-500" />
                <span>Proteger este enlace con contraseña</span>
              </label>

              {hasPassword && (
                <div className="pl-5 space-y-2 animate-in fade-in">
                  <input
                    type="text"
                    required={hasPassword}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Escribe la clave de acceso..."
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                  />

                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="radio"
                        name="pwdMode"
                        checked={!includePasswordInUrl}
                        onChange={() => setIncludePasswordInUrl(false)}
                      />
                      <span>Entregar contraseña por separado (el destinatario la ingresa manualmente)</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="radio"
                        name="pwdMode"
                        checked={includePasswordInUrl}
                        onChange={() => setIncludePasswordInUrl(true)}
                      />
                      <span>Incluir contraseña directamente en el enlace (acceso directo autenticado)</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2 pt-1 border-t border-slate-200/60">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasExpiration}
                  onChange={e => setHasExpiration(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                <span>Establecer fecha y hora de expiración</span>
              </label>

              {hasExpiration && (
                <div className="pl-5 animate-in fade-in">
                  <input
                    type="datetime-local"
                    required={hasExpiration}
                    value={expiresAt}
                    onChange={e => setExpiresAt(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              Generar Enlace
            </button>
          </form>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Enlaces Activos Simultáneos ({activeLinks.length})
              </h4>
            </div>

            {activeLinks.length === 0 ? (
              <p className="p-6 text-center text-xs text-slate-400 italic bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                Aún no has generado ningún enlace de descarga para este elemento.
              </p>
            ) : (
              <div className="space-y-2.5">
                {activeLinks.map(link => {
                  const isExpired = link.expiresAt && new Date(link.expiresAt) < new Date()
                  return (
                    <div
                      key={link.id}
                      className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2.5"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="font-bold text-xs text-slate-800">{link.title}</h5>
                            {link.password ? (
                              <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                                <Lock className="w-3 h-3" />
                                Protegido
                              </span>
                            ) : (
                              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                                Público
                              </span>
                            )}
                            {isExpired && (
                              <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5 rounded">
                                Expirado
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            <span>Descargas: {link.downloadsCount || 0}</span>
                            <span>•</span>
                            <span>Expira: {link.expiresAt ? formatDate(link.expiresAt) : 'Sin expiración'}</span>
                          </div>
                          {link.password && (
                            <p className="text-[11px] text-slate-500 mt-1 font-mono">
                              Contraseña:{' '}
                              <span className="font-bold text-slate-700">{link.password}</span>
                              {link.includePasswordInUrl && (
                                <span className="text-[10px] ml-1.5 text-indigo-600 font-sans font-medium">(Incluida en el enlace)</span>
                              )}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => revokeDownloadLink(link.id)}
                          title="Revocar este enlace"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          readOnly
                          value={getFullShareUrl(link)}
                          className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-600 outline-none truncate"
                        />
                        <button
                          onClick={() => copyLinkToClipboard(link)}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0 transition-colors"
                        >
                          {copiedLinkId === link.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600">Copiado</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copiar</span>
                            </>
                          )}
                        </button>
                        <a
                          href={getFullShareUrl(link)}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl shrink-0"
                          title="Abrir vista pública en nueva pestaña"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}