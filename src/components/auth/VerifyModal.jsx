import React, { useState, useEffect } from 'react'
import { X, Mail, CheckCircle2, AlertCircle, RefreshCw, Inbox } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useEmail } from '../../context/EmailContext'

export const VerifyModal = ({ isOpen, onClose, targetEmail, defaultToken }) => {
  const { verifyAccount, resendVerificationEmail } = useAuth()
  const { setIsInboxOpen } = useEmail()

  const [email, setEmail] = useState(targetEmail || '')
  const [code, setCode] = useState(defaultToken || '')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isResending, setIsResending] = useState(false)

  useEffect(() => {
    if (targetEmail) setEmail(targetEmail)
    if (defaultToken) setCode(defaultToken)
  }, [targetEmail, defaultToken])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    try {
      verifyAccount(email, code)
      setSuccess('¡Cuenta confirmada exitosamente! Bienvenido a CloudBox.')
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleResend = async () => {
    setError('')
    setIsResending(true)
    try {
      await resendVerificationEmail(email)
      setSuccess('Se ha enviado un nuevo código de confirmación a tu correo.')
      setTimeout(() => setSuccess(''), 4000)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Confirmar Cuenta</h2>
              <p className="text-xs text-slate-500">Validación de correo electrónico</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Hemos enviado un correo de confirmación a <span className="font-bold text-slate-800">{email}</span>. Ingresa el código de 6 dígitos para activar tu cuenta.
          </p>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Código de Verificación</label>
            <input
              type="text"
              required
              maxLength={6}
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="123456"
              className="w-full py-3 text-center font-mono text-2xl tracking-widest bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-200 flex items-center justify-center gap-2 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirmar y Acceder</span>
          </button>

          <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-between items-center text-xs">
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
              <span>Reenviar correo</span>
            </button>

            <button
              type="button"
              onClick={() => setIsInboxOpen(true)}
              className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-lg"
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>Ver en Buzón de Correos</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}