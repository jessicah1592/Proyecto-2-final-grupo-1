import React, { useState } from 'react'
import { X, CreditCard, Lock, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export const PaymentModal = ({ plan, isOpen, onClose }) => {
  const { currentUser, upgradeUserPlan } = useAuth()

  const [cardNumber, setCardNumber] = useState('')
  const [cardHolder, setCardHolder] = useState(currentUser?.name || '')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  if (!isOpen || !plan || !currentUser) return null

  const formatCardInput = (value) => {
    const raw = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const parts = []
    for (let i = 0; i < raw.length && i < 16; i += 4) {
      parts.push(raw.substring(i, i + 4))
    }
    return parts.join(' ')
  }

  const handleCardChange = (e) => {
    setCardNumber(formatCardInput(e.target.value))
  }

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/[^0-9]/g, '')
    if (val.length > 2) {
      val = val.substring(0, 2) + '/' + val.substring(2, 4)
    }
    setExpiry(val)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsProcessing(true)

    setTimeout(() => {
      upgradeUserPlan(currentUser.id, plan.id, plan.sizeBytes)
      setIsProcessing(false)
      setIsSuccess(true)

      setTimeout(() => {
        setIsSuccess(false)
        onClose()
      }, 2000)
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Método de Pago Simulado</h2>
              <p className="text-xs text-slate-500">Ampliación a {plan.name} ({plan.sizeText})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-100 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">¡Pago Confirmado!</h3>
            <p className="text-xs text-slate-500">
              Tu cuenta ahora cuenta con <span className="font-bold text-indigo-600">{plan.sizeText}</span> de almacenamiento disponible.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="p-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-2xl shadow-md space-y-3">
              <div className="flex items-center justify-between text-indigo-200 text-xs">
                <span>Tarjeta de Crédito / Débito</span>
                <span className="font-bold tracking-wider uppercase">{plan.name}</span>
              </div>
              <div className="font-mono text-base tracking-widest py-1">
                {cardNumber || '•••• •••• •••• ••••'}
              </div>
              <div className="flex justify-between text-xs text-indigo-100">
                <span className="truncate max-w-[160px] uppercase">{cardHolder || 'NOMBRE TITULAR'}</span>
                <span>EXP: {expiry || 'MM/AA'}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Nombre en la Tarjeta</label>
              <input
                type="text"
                required
                value={cardHolder}
                onChange={e => setCardHolder(e.target.value)}
                placeholder="Como aparece en la tarjeta"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Número de Tarjeta</label>
              <div className="relative">
                <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  maxLength={19}
                  value={cardNumber}
                  onChange={handleCardChange}
                  placeholder="4111 2222 3333 4444"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Expiración</label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={expiry}
                  onChange={handleExpiryChange}
                  placeholder="MM/AA"
                  className="w-full px-3.5 py-2 text-center bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">CVC / CVV</label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    maxLength={4}
                    value={cvc}
                    onChange={e => setCvc(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="123"
                    className="w-full pl-8 pr-3 py-2 text-center bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500">Total a Pagar (Simulado):</span>
              <span className="font-bold text-slate-800 text-sm">${plan.price} USD</span>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isProcessing ? 'Procesando pago simulado...' : `Confirmar y Pagar $${plan.price}`}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  )
}