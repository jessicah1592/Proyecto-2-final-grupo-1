import React, { useState } from 'react'
import { X, User, FileText, Upload, Check, Save } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { AVATAR_PRESETS } from '../../utils/helpers'

export const ProfileModal = ({ isOpen, onClose }) => {
  const { currentUser, updateProfile } = useAuth()
  if (!isOpen || !currentUser) return null

  const [name, setName] = useState(currentUser.name || '')
  const [bio, setBio] = useState(currentUser.bio || '')
  const [avatar, setAvatar] = useState(currentUser.avatar || AVATAR_PRESETS[0])
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setAvatar(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = (e) => {
    e.preventDefault()
    updateProfile({ name, bio, avatar })
    setSavedSuccess(true)
    setTimeout(() => {
      setSavedSuccess(false)
      onClose()
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Mi Perfil de Usuario</h2>
            <p className="text-xs text-slate-500">Personaliza tu foto de perfil y biografía</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={avatar}
              alt="Avatar"
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/30 shadow-md"
            />
            <div className="flex-1 space-y-1.5">
              <span className="text-xs font-bold text-slate-700 block">Cambiar foto de perfil</span>
              <div className="flex items-center gap-1.5">
                {AVATAR_PRESETS.slice(0, 4).map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatar(preset)}
                    className={`w-7 h-7 rounded-lg overflow-hidden border-2 ${
                      avatar === preset ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-transparent'
                    }`}
                  >
                    <img src={preset} alt="preset" className="w-full h-full object-cover" />
                  </button>
                ))}
                <label className="cursor-pointer px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 ml-1">
                  <Upload className="w-3 h-3" />
                  <span>Subir</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Nombre de Usuario</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Breve Descripción Personal (Biografía)</label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <textarea
                rows={3}
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Escribe algo sobre ti..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 resize-none"
              />
            </div>
          </div>

          <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs text-indigo-900 flex justify-between items-center">
            <div>
              <p className="font-semibold">{currentUser.email}</p>
              <p className="text-[11px] text-indigo-600 capitalize">Plan {currentUser.plan} • {currentUser.role === 'admin' ? 'Administrador' : 'Usuario Estándar'}</p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition-all"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>¡Cambios Guardados!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Guardar Cambios</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}