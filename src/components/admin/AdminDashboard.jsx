import React, { useState } from 'react'
import {
  ShieldAlert,
  Users,
  FileText,
  Folder,
  MessageSquare,
  Lock,
  Unlock,
  KeyRound,
  Trash2,
  CheckCircle2,
  Eye,
  AlertTriangle,
  Search,
  HardDrive
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useFiles } from '../../context/FileContext'
import { useChat } from '../../context/ChatContext'
import { formatBytes, formatDate } from '../../utils/helpers'

export const AdminDashboard = ({ onPreviewFile }) => {
  const {
    users,
    adminToggleBlockUser,
    adminResetUserPassword,
    adminUpdateUserPlan
  } = useAuth()

  const {
    files,
    folders,
    getUserStorageUsed,
    adminRestrictFile,
    adminUnrestrictFile,
    adminDeleteFilePermanently,
    adminDeleteFolderPermanently
  } = useFiles()

  const {
    messages,
    adminDeleteMessage,
    adminFlagMessage
  } = useChat()

  const [activeTab, setActiveTab] = useState('users')
  const [searchTerm, setSearchTerm] = useState('')
  const [resettingUserId, setResettingUserId] = useState(null)
  const [newPasswordInput, setNewPasswordInput] = useState('')
  const [restrictingFileId, setRestrictingFileId] = useState(null)
  const [restrictionReason, setRestrictionReason] = useState('')

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredFiles = files.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleResetPasswordSubmit = (userId) => {
    if (!newPasswordInput.trim()) return
    adminResetUserPassword(userId, newPasswordInput.trim())
    setResettingUserId(null)
    setNewPasswordInput('')
    alert('Contraseña actualizada con éxito.')
  }

  const handleRestrictFileSubmit = (fileId) => {
    if (!restrictionReason.trim()) return
    adminRestrictFile(fileId, restrictionReason.trim())
    setRestrictingFileId(null)
    setRestrictionReason('')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">Panel de Control de Administración</h1>
              <span className="text-[10px] bg-rose-600 text-white uppercase font-bold px-2 py-0.5 rounded">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-slate-500">Moderación de contenido, auditoría de archivos y control de usuarios</p>
          </div>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'users' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Usuarios ({users.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'files' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Archivos ({files.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('folders')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'folders' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600'
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            <span>Carpetas ({folders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'chat' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat ({messages.length})</span>
          </button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder={`Buscar en ${activeTab}...`}
          className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500 shadow-sm"
        />
      </div>

      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-4">Usuario</th>
                  <th className="p-4">Plan / Almacenamiento</th>
                  <th className="p-4">Rol</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-right">Acciones de Moderación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map(user => {
                  const used = getUserStorageUsed(user.id)
                  const userFilesCount = files.filter(f => f.userId === user.id && !f.isDeleted).length
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/60">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200"
                          />
                          <div>
                            <p className="font-bold text-slate-800">{user.name}</p>
                            <p className="text-slate-400 text-[11px]">{user.email}</p>
                            <p className="text-[10px] text-slate-500 italic line-clamp-1 max-w-xs">{user.bio}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="font-semibold text-slate-700 capitalize">Plan {user.plan}</span>
                        <p className="text-[11px] text-slate-400">
                          {formatBytes(used)} de {formatBytes(user.storageLimit)} ({userFilesCount} archivos)
                        </p>
                      </td>

                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          user.role === 'admin' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {user.role}
                        </span>
                      </td>

                      <td className="p-4">
                        {user.isBlocked ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                            <Lock className="w-3 h-3" />
                            Bloqueado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                            <CheckCircle2 className="w-3 h-3" />
                            Activo
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => adminToggleBlockUser(user.id)}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                              user.isBlocked
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                            }`}
                          >
                            {user.isBlocked ? 'Desbloquear' : 'Bloquear'}
                          </button>

                          <button
                            onClick={() => setResettingUserId(user.id)}
                            className="px-2.5 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg font-bold text-[11px] flex items-center gap-1"
                          >
                            <KeyRound className="w-3 h-3" />
                            <span>Restablecer Clave</span>
                          </button>
                        </div>

                        {resettingUserId === user.id && (
                          <div className="mt-2 p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2 justify-end">
                            <input
                              type="text"
                              placeholder="Nueva contraseña..."
                              value={newPasswordInput}
                              onChange={e => setNewPasswordInput(e.target.value)}
                              className="px-2 py-1 bg-white border border-slate-200 rounded text-xs outline-none"
                            />
                            <button
                              onClick={() => handleResetPasswordSubmit(user.id)}
                              className="px-2 py-1 bg-indigo-600 text-white rounded text-xs font-bold"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={() => setResettingUserId(null)}
                              className="px-2 py-1 bg-slate-200 text-slate-600 rounded text-xs"
                            >
                              Cancelar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'files' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-4">Archivo</th>
                  <th className="p-4">Propietario</th>
                  <th className="p-4">Tamaño</th>
                  <th className="p-4">Estado de Moderación</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFiles.map(file => {
                  const owner = users.find(u => u.id === file.userId)
                  return (
                    <tr key={file.id} className="hover:bg-slate-50/60">
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-5 h-5 text-indigo-500 shrink-0" />
                          <div className="truncate max-w-xs">
                            <p className="font-bold text-slate-800 truncate">{file.name}</p>
                            <p className="text-[11px] text-slate-400">{formatDate(file.createdAt)}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-semibold text-slate-700">
                        {owner?.name || 'Usuario'} ({owner?.email})
                      </td>

                      <td className="p-4 text-slate-600 font-mono">
                        {formatBytes(file.size)}
                      </td>

                      <td className="p-4">
                        {file.isRestricted ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 flex items-center gap-1 w-fit">
                            <ShieldAlert className="w-3 h-3" />
                            Restringido: {file.restrictionReason}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 w-fit">
                            Aprobado
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onPreviewFile(file)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                            title="Previsualizar"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {file.isRestricted ? (
                            <button
                              onClick={() => adminUnrestrictFile(file.id)}
                              className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-bold text-[11px]"
                            >
                              Habilitar
                            </button>
                          ) : (
                            <button
                              onClick={() => setRestrictingFileId(file.id)}
                              className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg font-bold text-[11px]"
                            >
                              Restringir
                            </button>
                          )}

                          <button
                            onClick={() => {
                              if (confirm(`¿Eliminar definitivamente "${file.name}" de la plataforma?`)) {
                                adminDeleteFilePermanently(file.id)
                              }
                            }}
                            className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg"
                            title="Eliminar permanentemente"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {restrictingFileId === file.id && (
                          <div className="mt-2 p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2 justify-end">
                            <input
                              type="text"
                              placeholder="Motivo de la restricción..."
                              value={restrictionReason}
                              onChange={e => setRestrictionReason(e.target.value)}
                              className="px-2 py-1 bg-white border border-slate-200 rounded text-xs outline-none"
                            />
                            <button
                              onClick={() => handleRestrictFileSubmit(file.id)}
                              className="px-2 py-1 bg-rose-600 text-white rounded text-xs font-bold"
                            >
                              Aplicar
                            </button>
                            <button
                              onClick={() => setRestrictingFileId(null)}
                              className="px-2 py-1 bg-slate-200 text-slate-600 rounded text-xs"
                            >
                              Cancelar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'folders' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-4">Carpeta</th>
                  <th className="p-4">Propietario</th>
                  <th className="p-4">Fecha Creación</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {folders.map(folder => {
                  const owner = users.find(u => u.id === folder.userId)
                  const containedFiles = files.filter(f => f.folderId === folder.id && !f.isDeleted).length
                  return (
                    <tr key={folder.id} className="hover:bg-slate-50/60">
                      <td className="p-4 flex items-center gap-2.5">
                        <Folder className="w-5 h-5 text-indigo-500 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-800">{folder.name}</p>
                          <p className="text-[11px] text-slate-400">{containedFiles} archivos contenidos</p>
                        </div>
                      </td>

                      <td className="p-4 font-semibold text-slate-700">
                        {owner?.name || 'Usuario'} ({owner?.email})
                      </td>

                      <td className="p-4 text-slate-500">
                        {formatDate(folder.createdAt)}
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar definitivamente la carpeta "${folder.name}" y todo su contenido?`)) {
                              adminDeleteFolderPermanently(folder.id)
                            }
                          }}
                          className="px-3 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-xs rounded-lg inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Eliminar Definitivamente</span>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'chat' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-4">Emisor</th>
                  <th className="p-4">Mensaje</th>
                  <th className="p-4">Fecha / Hora</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-right">Acciones de Moderación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {messages.map(msg => (
                  <tr key={msg.id} className="hover:bg-slate-50/60">
                    <td className="p-4 font-bold text-slate-800 flex items-center gap-2">
                      <img src={msg.senderAvatar} alt={msg.senderName} className="w-6 h-6 rounded-md object-cover" />
                      <span>{msg.senderName}</span>
                    </td>

                    <td className="p-4 max-w-md text-slate-700">
                      {msg.text}
                    </td>

                    <td className="p-4 text-slate-400">
                      {formatDate(msg.createdAt)}
                    </td>

                    <td className="p-4">
                      {msg.isModerated ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                          Moderado
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                          Visible
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => adminFlagMessage(msg.id)}
                          className="px-2 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded text-xs font-semibold"
                        >
                          {msg.isModerated ? 'Restaurar' : 'Marcar Inapropiado'}
                        </button>
                        <button
                          onClick={() => adminDeleteMessage(msg.id)}
                          className="p-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded"
                          title="Eliminar mensaje definitivamente"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}