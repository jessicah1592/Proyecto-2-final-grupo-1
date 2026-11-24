import React, { useState } from 'react'
import {
  Cloud,
  Search,
  Bell,
  Mail,
  MessageSquare,
  ShieldAlert,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  Zap,
  BarChart3,
  HardDrive
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useFiles } from '../../context/FileContext'
import { useEmail } from '../../context/EmailContext'
import { useChat } from '../../context/ChatContext'
import { formatBytes } from '../../utils/helpers'

export const Navbar = ({
  onOpenLogin,
  onOpenRegister,
  onOpenProfile,
  onOpenUpgrade,
  activeView,
  setActiveView
}) => {
  const { currentUser, logout, users, switchAccountQuick } = useAuth()
  const { searchQuery, setSearchQuery, getUserStorageUsed } = useFiles()
  const { unreadCount, setIsInboxOpen } = useEmail()
  const { isChatOpen, setIsChatOpen } = useChat()

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isSwitchAccountOpen, setIsSwitchAccountOpen] = useState(false)

  const usedBytes = currentUser ? getUserStorageUsed(currentUser.id) : 0
  const maxBytes = currentUser ? currentUser.storageLimit : 1
  const percentUsed = Math.min(100, Math.round((usedBytes / maxBytes) * 100))

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setActiveView('files')}
          className="flex items-center gap-2.5 text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-slate-800 tracking-tight">CloudBox</span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded border border-indigo-200">
                Pro
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Gestión Segura en la Nube</p>
          </div>
        </button>
      </div>

      <div className="flex-1 max-w-xl mx-4 sm:mx-8">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar archivos por nombre o tipo..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 hover:bg-slate-200/70 focus:bg-white border border-transparent focus:border-indigo-400 rounded-xl outline-none transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => setIsInboxOpen(true)}
          title="Buzón de Correos del Sistema"
          className="relative p-2.5 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
        >
          <Mail className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          title="Chat Comunitario"
          className={`relative p-2.5 rounded-xl transition-colors ${
            isChatOpen ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
        </button>

        {currentUser ? (
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-500/30"
              />
              <div className="hidden md:block text-left text-xs">
                <p className="font-semibold text-slate-700 truncate max-w-[120px]">{currentUser.name}</p>
                <p className="text-slate-400 capitalize">{currentUser.role === 'admin' ? 'Administrador' : `Plan ${currentUser.plan}`}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {isUserMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <div className="px-4 py-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-11 h-11 rounded-xl object-cover ring-2 ring-indigo-500/20"
                    />
                    <div className="flex-1 overflow-hidden">
                      <p className="font-bold text-sm text-slate-800 truncate">{currentUser.name}</p>
                      <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                      <span className={`inline-block text-[10px] uppercase font-bold mt-1 px-2 py-0.5 rounded-full ${
                        currentUser.role === 'admin'
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                      }`}>
                        {currentUser.role === 'admin' ? 'Super Administrador' : `Plan ${currentUser.plan}`}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Espacio usado</span>
                      <span className="font-semibold text-slate-700">{formatBytes(usedBytes)} de {formatBytes(maxBytes)}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          percentUsed > 85 ? 'bg-rose-500' : percentUsed > 60 ? 'bg-amber-500' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${percentUsed}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="py-1 text-sm text-slate-600">
                  <button
                    onClick={() => {
                      onOpenProfile()
                      setIsUserMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-left"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Mi Perfil & Biografía</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenUpgrade()
                      setIsUserMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-left text-indigo-600 font-medium"
                  >
                    <Zap className="w-4 h-4 text-indigo-500" />
                    <span>Ampliar Almacenamiento</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveView('stats')
                      setIsUserMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-left"
                  >
                    <BarChart3 className="w-4 h-4 text-slate-400" />
                    <span>Estadísticas de Uso</span>
                  </button>

                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => {
                        setActiveView('admin')
                        setIsUserMenuOpen(false)
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-rose-50 text-left text-rose-600 font-medium"
                    >
                      <ShieldAlert className="w-4 h-4 text-rose-500" />
                      <span>Panel Administrador</span>
                    </button>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-2 px-2">
                  <div className="relative">
                    <button
                      onClick={() => setIsSwitchAccountOpen(!isSwitchAccountOpen)}
                      className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg"
                    >
                      <span>Cambiar de cuenta rápida</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>

                    {isSwitchAccountOpen && (
                      <div className="mt-1 bg-slate-50 p-1 rounded-xl border border-slate-200/70 space-y-1">
                        {users.map(u => (
                          <button
                            key={u.id}
                            onClick={() => {
                              switchAccountQuick(u.id)
                              setIsSwitchAccountOpen(false)
                              setIsUserMenuOpen(false)
                            }}
                            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left text-xs ${
                              u.id === currentUser.id ? 'bg-indigo-100 text-indigo-800 font-bold' : 'hover:bg-white text-slate-700'
                            }`}
                          >
                            <img src={u.avatar} alt={u.name} className="w-5 h-5 rounded-md object-cover" />
                            <span className="truncate flex-1">{u.name}</span>
                            <span className="text-[10px] px-1 bg-slate-200 text-slate-600 rounded">
                              {u.role === 'admin' ? 'Admin' : u.plan}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      logout()
                      setIsUserMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 mt-1 text-sm text-rose-600 hover:bg-rose-50 rounded-xl text-left"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenLogin}
              className="px-3.5 py-1.5 text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Iniciar Sesión
            </button>
            <button
              onClick={onOpenRegister}
              className="px-3.5 py-1.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors"
            >
              Registrarse
            </button>
          </div>
        )}
      </div>
    </header>
  )
}