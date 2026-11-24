import React, { useState } from 'react'
import {
  X,
  Mail,
  Trash2,
  CheckCircle,
  KeyRound,
  ExternalLink,
  Copy,
  Clock,
  Send,
  Settings,
  AlertCircle
} from 'lucide-react'
import { useEmail } from '../../context/EmailContext'
import { formatDate } from '../../utils/helpers'

export const EmailNotificationDrawer = ({ onConfirmToken, onResetToken }) => {
  const {
    emails,
    activeEmail,
    setActiveEmail,
    isInboxOpen,
    setIsInboxOpen,
    markAsRead,
    deleteEmail,
    clearAllEmails,
    emailServiceConfig,
    setEmailServiceConfig
  } = useEmail()

  const [activeTab, setActiveTab] = useState('inbox')
  const [copiedToken, setCopiedToken] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  const [tempConfig, setTempConfig] = useState(emailServiceConfig)

  if (!isInboxOpen) return null

  const handleSelectEmail = (em) => {
    setActiveEmail(em)
    if (!em.isRead) {
      markAsRead(em.id)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopiedToken(true)
    setTimeout(() => setCopiedToken(false), 2000)
  }

  const handleSaveConfig = (e) => {
    e.preventDefault()
    setEmailServiceConfig(tempConfig)
    setShowConfig(false)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-base">Buzón de Correos del Sistema</h2>
              <p className="text-xs text-slate-500">Notificaciones y enlaces de autenticación real</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowConfig(!showConfig)}
              title="Configuración de servicio EmailJS"
              className={`p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-200/60 ${
                showConfig ? 'bg-indigo-50 text-indigo-600' : ''
              }`}
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsInboxOpen(false)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {showConfig && (
          <div className="p-4 bg-indigo-50/60 border-b border-indigo-100 text-xs">
            <h3 className="font-bold text-indigo-900 mb-1 flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5" />
              Configurar Envío por EmailJS (Opcional)
            </h3>
            <p className="text-indigo-700/80 mb-3">
              Puedes ingresar credenciales de EmailJS para despacho a servidores SMTP externos reales, o usar la bandeja interactiva integrada.
            </p>
            <form onSubmit={handleSaveConfig} className="space-y-2">
              <input
                type="text"
                placeholder="Service ID (ej: service_xyz)"
                value={tempConfig.serviceId}
                onChange={e => setTempConfig({ ...tempConfig, serviceId: e.target.value })}
                className="w-full p-2 bg-white rounded border border-indigo-200 text-xs outline-none"
              />
              <input
                type="text"
                placeholder="Template ID (ej: template_abc)"
                value={tempConfig.templateId}
                onChange={e => setTempConfig({ ...tempConfig, templateId: e.target.value })}
                className="w-full p-2 bg-white rounded border border-indigo-200 text-xs outline-none"
              />
              <input
                type="text"
                placeholder="Public Key / User ID"
                value={tempConfig.publicKey}
                onChange={e => setTempConfig({ ...tempConfig, publicKey: e.target.value })}
                className="w-full p-2 bg-white rounded border border-indigo-200 text-xs outline-none"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowConfig(false)}
                  className="px-3 py-1 bg-white border border-slate-200 rounded text-slate-600 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700"
                >
                  Guardar Configuración
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="flex-1 overflow-y-auto flex flex-col">
          {activeEmail ? (
            <div className="p-5 flex-1 flex flex-col">
              <button
                onClick={() => setActiveEmail(null)}
                className="self-start text-xs text-indigo-600 hover:text-indigo-800 font-semibold mb-4 flex items-center gap-1"
              >
                &larr; Volver a la lista de correos
              </button>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                      {activeEmail.type}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDate(activeEmail.sentAt)}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{activeEmail.subject}</h3>
                  <div className="mt-1 text-xs text-slate-500 space-y-0.5">
                    <p><span className="font-semibold text-slate-600">De:</span> {activeEmail.from}</p>
                    <p><span className="font-semibold text-slate-600">Para:</span> {activeEmail.to}</p>
                  </div>
                </div>

                <div className="py-2 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {activeEmail.body}
                </div>

                {activeEmail.token && (
                  <div className="p-3.5 bg-white border border-indigo-100 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">Código de seguridad generado:</span>
                      <button
                        onClick={() => copyToClipboard(activeEmail.token)}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        {copiedToken ? 'Copiado!' : 'Copiar código'}
                      </button>
                    </div>
                    <div className="text-2xl font-mono font-bold text-indigo-600 tracking-wider text-center py-1 bg-indigo-50/50 rounded-lg border border-indigo-100">
                      {activeEmail.token}
                    </div>
                  </div>
                )}

                {activeEmail.type === 'VERIFICATION' && (
                  <button
                    onClick={() => {
                      if (onConfirmToken) onConfirmToken(activeEmail.to, activeEmail.token)
                      setIsInboxOpen(false)
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-200 transition-all"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Confirmar Cuenta Ahora</span>
                  </button>
                )}

                {activeEmail.type === 'PASSWORD_RESET' && (
                  <button
                    onClick={() => {
                      if (onResetToken) onResetToken(activeEmail.to, activeEmail.token)
                      setIsInboxOpen(false)
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-200 transition-all"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Restablecer Contraseña Ahora</span>
                  </button>
                )}
              </div>

              <div className="mt-auto pt-4 flex justify-end">
                <button
                  onClick={() => deleteEmail(activeEmail.id)}
                  className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-800 font-semibold px-3 py-1.5 rounded-lg hover:bg-rose-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Eliminar este correo</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-2.5 flex-1">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span>Total de correos: {emails.length}</span>
                {emails.length > 0 && (
                  <button
                    onClick={clearAllEmails}
                    className="text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    Vaciar bandeja
                  </button>
                )}
              </div>

              {emails.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <Mail className="w-12 h-12 mx-auto stroke-1 text-slate-300 mb-2" />
                  <p className="font-semibold text-sm">Bandeja vacía</p>
                  <p className="text-xs">Los correos de confirmación y restablecimiento aparecerán aquí.</p>
                </div>
              ) : (
                emails.map(em => (
                  <div
                    key={em.id}
                    onClick={() => handleSelectEmail(em)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      em.isRead
                        ? 'bg-white border-slate-200 hover:border-slate-300'
                        : 'bg-indigo-50/50 border-indigo-200 hover:bg-indigo-50 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        {!em.isRead && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600" />
                        )}
                        <span className="text-xs font-bold text-slate-800">{em.from}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">{formatDate(em.sentAt)}</span>
                    </div>

                    <h4 className="text-xs font-semibold text-slate-900 truncate mb-1">{em.subject}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{em.body}</p>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {em.to}
                      </span>
                      {em.token && (
                        <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                          Token: {em.token}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}