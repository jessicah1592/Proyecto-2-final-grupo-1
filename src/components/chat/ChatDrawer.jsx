import React, { useState, useRef, useEffect } from 'react'
import {
  X,
  Send,
  MessageSquare,
  ShieldAlert,
  Trash2,
  Users,
  AlertTriangle,
  Smile
} from 'lucide-react'
import { useChat } from '../../context/ChatContext'
import { useAuth } from '../../context/AuthContext'
import { formatDate } from '../../utils/helpers'

export const ChatDrawer = () => {
  const { currentUser } = useAuth()
  const {
    messages,
    isChatOpen,
    setIsChatOpen,
    sendMessage,
    adminDeleteMessage,
    adminFlagMessage
  } = useChat()

  const [inputText, setInputText] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isChatOpen])

  if (!isChatOpen) return null

  const handleSend = (e) => {
    e.preventDefault()
    if (!inputText.trim() || !currentUser) return

    sendMessage({
      text: inputText,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      channelId: 'general'
    })

    setInputText('')
  }

  const isAdmin = currentUser?.role === 'admin'

  return (
    <div className="fixed bottom-4 right-4 z-40 w-96 max-w-[calc(100vw-2rem)] h-[540px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
      <div className="p-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm">Chat Comunitario</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <p className="text-[11px] text-indigo-100">Comunicación activa entre usuarios</p>
          </div>
        </div>

        <button
          onClick={() => setIsChatOpen(false)}
          className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No hay mensajes aún. ¡Comienza la conversación!
          </div>
        ) : (
          messages.map(msg => {
            const isMe = currentUser && msg.senderId === currentUser.id
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isMe ? 'flex-row-reverse' : 'flex-row'} items-start group`}
              >
                <img
                  src={msg.senderAvatar}
                  alt={msg.senderName}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200 shrink-0 mt-0.5"
                />

                <div className={`max-w-[78%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-bold text-slate-600 truncate max-w-[120px]">
                      {msg.senderName}
                    </span>
                    <span className="text-[9px] text-slate-400">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div
                    className={`p-3 rounded-2xl text-xs relative ${
                      msg.isModerated
                        ? 'bg-rose-50 text-rose-700 border border-rose-200 italic'
                        : isMe
                        ? 'bg-indigo-600 text-white rounded-tr-none shadow-sm'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none shadow-sm'
                    }`}
                  >
                    {msg.isModerated ? (
                      <span className="flex items-center gap-1 text-[11px]">
                        <AlertTriangle className="w-3 h-3 text-rose-500" />
                        [Mensaje retirado por moderación]
                      </span>
                    ) : (
                      <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                    )}

                    {isAdmin && (
                      <div className="mt-1.5 pt-1 border-t border-slate-100 flex items-center gap-2 justify-end">
                        <button
                          onClick={() => adminFlagMessage(msg.id)}
                          title="Alternar moderación"
                          className="text-[10px] font-semibold text-amber-600 hover:text-amber-800 flex items-center gap-1"
                        >
                          <ShieldAlert className="w-3 h-3" />
                          <span>{msg.isModerated ? 'Restaurar' : 'Moderar'}</span>
                        </button>
                        <button
                          onClick={() => adminDeleteMessage(msg.id)}
                          title="Eliminar mensaje definitivamente"
                          className="text-[10px] font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder={currentUser ? 'Escribe un mensaje...' : 'Inicia sesión para chatear'}
          disabled={!currentUser}
          className="flex-1 px-3.5 py-2 bg-slate-100 rounded-xl text-xs outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-all"
        />
        <button
          type="submit"
          disabled={!currentUser || !inputText.trim()}
          className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white rounded-xl shadow-sm transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  )
}