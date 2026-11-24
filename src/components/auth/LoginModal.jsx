import React, { useState } from 'react'
import { X, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export const LoginModal = ({ isOpen, onClose, onOpenRegister, onOpenForgotPassword, onOpenVerify }) => {
  const { login, users } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      login(email, password)
      onClose()
    } catch (err) {
      setError(err.message)
      if (err.message.includes('confirmar tu cuenta')) {
        setTimeout(() => {
          onClose()
          if (onOpenVerify) onOpenVerify(email)
        }, 1500)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
    setError('')
    try {
      login(demoEmail, demoPassword)
      onClose()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Iniciar Sesión</h2>
            <p className="text-xs text-slate-400">Ingresa a tu cuenta segura en CloudBox</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Correo Electrónico</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Contraseña</label>
              <button
                type="button"
                onClick={() => {
                  onClose()
                  onOpenForgotPassword()
                }}
                className="text-xs text-indigo-600 hover:underline font-semibold"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition-all"
          >
            {isLoading ? 'Comprobando...' : 'Entrar a CloudBox'}
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-2">
              Acceso Rápido para Pruebas
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@cloudbox.com', 'admin123')}
                className="p-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-center text-rose-700 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-rose-600" />
                <span className="text-[11px] font-bold block leading-tight">Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('jessica@ceutec.edu', 'jessica123')}
                className="p-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl text-center text-indigo-700 transition-colors"
              >
                <UserCheck className="w-4 h-4 mx-auto mb-1 text-indigo-600" />
                <span className="text-[11px] font-bold block leading-tight">Jessica (Pro)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('carlos@cloudbox.com', 'user123')}
                className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-center text-slate-700 transition-colors"
              >
                <UserCheck className="w-4 h-4 mx-auto mb-1 text-slate-600" />
                <span className="text-[11px] font-bold block leading-tight">Carlos (Free)</span>
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
            ¿No tienes una cuenta aún?{' '}
            <button
              type="button"
              onClick={() => {
                onClose()
                onOpenRegister()
              }}
              className="text-indigo-600 font-bold hover:underline"
            >
              Regístrate aquí
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}