import React from 'react'
import { X, Check, Zap, Sparkles } from 'lucide-react'
import { STORAGE_PLANS } from '../../data/initialData'
import { useAuth } from '../../context/AuthContext'

export const UpgradeModal = ({ isOpen, onClose, onSelectPlanToPay }) => {
  const { currentUser } = useAuth()
  if (!isOpen || !currentUser) return null

  const handleChoosePlan = (plan) => {
    onClose()
    onSelectPlanToPay(plan)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 my-6">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Planes de Almacenamiento</h2>
            <p className="text-xs text-slate-500">
              Amplía la capacidad de tu nube y desbloquea funciones avanzadas
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STORAGE_PLANS.map(plan => {
              const isCurrent = currentUser.plan === plan.id
              return (
                <div
                  key={plan.id}
                  className={`relative rounded-3xl p-6 flex flex-col justify-between border-2 transition-all ${
                    plan.popular
                      ? 'border-indigo-600 bg-indigo-50/20 shadow-xl shadow-indigo-100'
                      : isCurrent
                      ? 'border-emerald-500 bg-emerald-50/10'
                      : 'border-slate-200 bg-white hover:border-indigo-300'
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Más Popular
                    </span>
                  )}

                  {isCurrent && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full shadow-md">
                      Plan Actual
                    </span>
                  )}

                  <div>
                    <h3 className="font-bold text-base text-slate-800">{plan.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{plan.tagline}</p>

                    <div className="my-5 pb-5 border-b border-slate-100">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-slate-900">${plan.price}</span>
                        <span className="text-xs text-slate-400">/ mes</span>
                      </div>
                      <span className="inline-block mt-2 font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                        {plan.sizeText} de Almacenamiento
                      </span>
                    </div>

                    <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    disabled={isCurrent}
                    onClick={() => handleChoosePlan(plan)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                      isCurrent
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : plan.popular
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200'
                        : 'bg-slate-900 hover:bg-slate-800 text-white shadow-md'
                    }`}
                  >
                    {isCurrent ? (
                      <span>Plan en Uso</span>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>Elegir {plan.name}</span>
                      </>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}