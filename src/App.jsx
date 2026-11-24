import React, { useState, useEffect } from 'react'
import { EmailProvider, useEmail } from './context/EmailContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { FileProvider, useFiles } from './context/FileContext'
import { ChatProvider } from './context/ChatContext'
import { Navbar } from './components/layout/Navbar'
import { Sidebar } from './components/layout/Sidebar'
import { EmailNotificationDrawer } from './components/layout/EmailNotificationDrawer'
import { FileList } from './components/files/FileList'
import { TrashView } from './components/trash/TrashView'
import { StatsDashboard } from './components/stats/StatsDashboard'
import { AdminDashboard } from './components/admin/AdminDashboard'
import { ChatDrawer } from './components/chat/ChatDrawer'
import { LoginModal } from './components/auth/LoginModal'
import { RegisterModal } from './components/auth/RegisterModal'
import { VerifyModal } from './components/auth/VerifyModal'
import { ForgotPasswordModal } from './components/auth/ForgotPasswordModal'
import { ResetPasswordModal } from './components/auth/ResetPasswordModal'
import { ProfileModal } from './components/auth/ProfileModal'
import { FileUploadModal } from './components/files/FileUploadModal'
import { CreateFolderModal } from './components/folders/CreateFolderModal'
import { FilePreviewModal } from './components/files/FilePreviewModal'
import { FileDetailsModal } from './components/files/FileDetailsModal'
import { MoveCopyModal } from './components/files/MoveCopyModal'
import { ShareLinksModal } from './components/shares/ShareLinksModal'
import { UpgradeModal } from './components/plans/UpgradeModal'
import { PaymentModal } from './components/plans/PaymentModal'
import { PublicShareView } from './components/shares/PublicShareView'
import { STORAGE_PLANS } from './data/initialData'

const AppContent = () => {
  const { currentUser, users, verifyAccount } = useAuth()
  const {
    files,
    folders,
    downloadLinks,
    recordDownload,
    previewFile,
    setPreviewFile,
    detailsFile,
    setDetailsFile,
    isUploadModalOpen,
    setIsUploadModalOpen,
    isCreateFolderModalOpen,
    setIsCreateFolderModalOpen
  } = useFiles()

  const [activeView, setActiveView] = useState('files')
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isVerifyOpen, setIsVerifyOpen] = useState(false)
  const [verifyEmailTarget, setVerifyEmailTarget] = useState('')
  const [verifyTokenTarget, setVerifyTokenTarget] = useState('')
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false)
  const [resetEmailTarget, setResetEmailTarget] = useState('')
  const [resetTokenTarget, setResetTokenTarget] = useState('')
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false)
  const [planToPay, setPlanToPay] = useState(null)
  const [folderToEdit, setFolderToEdit] = useState(null)
  const [shareTarget, setShareTarget] = useState(null)
  const [moveCopyTarget, setMoveCopyTarget] = useState(null)

  const [publicShareToken, setPublicShareToken] = useState(null)
  const [publicSharePwd, setPublicSharePwd] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const share = params.get('share')
    const pwd = params.get('pwd')
    const verify = params.get('verify')
    const reset = params.get('reset')
    const email = params.get('email')

    if (share) {
      setPublicShareToken(share)
      setPublicSharePwd(pwd || '')
    }

    if (verify && email) {
      setVerifyEmailTarget(email)
      setVerifyTokenTarget(verify)
      setIsVerifyOpen(true)
    }

    if (reset && email) {
      setResetEmailTarget(email)
      setResetTokenTarget(reset)
      setIsResetPasswordOpen(true)
    }
  }, [])

  if (publicShareToken) {
    return (
      <PublicShareView
        token={publicShareToken}
        urlPassword={publicSharePwd}
        downloadLinks={downloadLinks}
        files={files}
        folders={folders}
        users={users}
        onRecordDownload={recordDownload}
        onClose={() => {
          setPublicShareToken(null)
          window.history.pushState({}, '', window.location.pathname)
        }}
      />
    )
  }

  const handleOpenVerifyModal = (email, token = '') => {
    setVerifyEmailTarget(email)
    setVerifyTokenTarget(token)
    setIsVerifyOpen(true)
  }

  const handleOpenResetPasswordModal = (email, token = '') => {
    setResetEmailTarget(email)
    setResetTokenTarget(token)
    setIsResetPasswordOpen(true)
  }

  const handleConfirmTokenFromEmail = (email, token) => {
    try {
      verifyAccount(email, token)
      alert(`¡Cuenta (${email}) confirmada exitosamente! Ya puedes utilizar la plataforma.`)
    } catch (e) {
      handleOpenVerifyModal(email, token)
    }
  }

  const handleResetTokenFromEmail = (email, token) => {
    handleOpenResetPasswordModal(email, token)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenUpgrade={() => setIsUpgradeOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      <div className="flex-1 flex overflow-hidden">
        {currentUser && (
          <Sidebar
            activeView={activeView}
            setActiveView={setActiveView}
            onOpenUpgrade={() => setIsUpgradeOpen(true)}
          />
        )}

        <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {!currentUser ? (
            <div className="max-w-2xl mx-auto text-center py-16 space-y-6">
              <div className="w-20 h-20 bg-indigo-600 text-white rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-indigo-200">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Almacenamiento en la Nube Inteligente y Seguro
              </h1>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Gestiona tus archivos personales, organízalos en carpetas jerárquicas, visualízalos en tiempo real, genera enlaces de descarga protegidos con contraseña y comunícate mediante el chat integrado.
              </p>

              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => setIsRegisterOpen(true)}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-200 transition-all hover:scale-105"
                >
                  Crear Cuenta Gratis
                </button>
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-2xl font-bold text-sm shadow-sm transition-all"
                >
                  Iniciar Sesión
                </button>
              </div>

              <div className="pt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-xs text-indigo-600 uppercase mb-1">Previsualización</h3>
                  <p className="text-xs text-slate-500">Imágenes directas, reproducción de audio y video, y lectura de documentos PDF sin descargar.</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-xs text-indigo-600 uppercase mb-1">Enlaces Múltiples</h3>
                  <p className="text-xs text-slate-500">Múltiples enlaces simultáneos con claves de acceso independientes y fechas de expiración.</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-xs text-indigo-600 uppercase mb-1">Panel Administrador</h3>
                  <p className="text-xs text-slate-500">Control total, moderación de archivos, bloqueo de cuentas y auditoría de mensajes de chat.</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {activeView === 'files' && (
                <FileList
                  onNewFolder={() => {
                    setFolderToEdit(null)
                    setIsCreateFolderModalOpen(true)
                  }}
                  onUpload={() => setIsUploadModalOpen(true)}
                  onEditFolder={(folder) => {
                    setFolderToEdit(folder)
                    setIsCreateFolderModalOpen(true)
                  }}
                  onShareTarget={(target) => setShareTarget(target)}
                  onMoveCopy={(file, mode) => setMoveCopyTarget({ file, mode })}
                  onPreviewFile={(file) => setPreviewFile(file)}
                  onDetailsFile={(file) => setDetailsFile(file)}
                />
              )}

              {activeView === 'trash' && <TrashView />}

              {activeView === 'stats' && (
                <StatsDashboard onOpenUpgrade={() => setIsUpgradeOpen(true)} />
              )}

              {activeView === 'plans' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-xl font-bold text-slate-800">Planes de Almacenamiento Ampliables</h1>
                    <p className="text-xs text-slate-500">Elige el plan que mejor se adapte a tus necesidades con pago simulado inmediato</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {STORAGE_PLANS.map(plan => {
                      const isCurrent = currentUser.plan === plan.id
                      return (
                        <div
                          key={plan.id}
                          className={`bg-white rounded-3xl p-6 border-2 transition-all flex flex-col justify-between ${
                            plan.popular ? 'border-indigo-600 shadow-lg' : isCurrent ? 'border-emerald-500' : 'border-slate-200'
                          }`}
                        >
                          <div>
                            <span className="text-xs uppercase font-bold text-slate-400 block">{plan.name}</span>
                            <div className="flex items-baseline gap-1 my-3">
                              <span className="text-3xl font-black text-slate-900">${plan.price}</span>
                              <span className="text-xs text-slate-400">/ mes</span>
                            </div>
                            <span className="inline-block mb-4 px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-bold font-mono">
                              {plan.sizeText} Almacenamiento
                            </span>
                            <ul className="space-y-2 text-xs text-slate-600 mb-6">
                              {plan.features.map((f, i) => (
                                <li key={i} className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                                  <span>{f}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <button
                            disabled={isCurrent}
                            onClick={() => setPlanToPay(plan)}
                            className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors ${
                              isCurrent
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                            }`}
                          >
                            {isCurrent ? 'Plan Actual' : `Elegir ${plan.name}`}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {activeView === 'admin' && currentUser.role === 'admin' && (
                <AdminDashboard onPreviewFile={(file) => setPreviewFile(file)} />
              )}
            </>
          )}
        </main>
      </div>

      <ChatDrawer />

      <EmailNotificationDrawer
        onConfirmToken={handleConfirmTokenFromEmail}
        onResetToken={handleResetTokenFromEmail}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenForgotPassword={() => setIsForgotPasswordOpen(true)}
        onOpenVerify={(email) => handleOpenVerifyModal(email)}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenVerify={(email) => handleOpenVerifyModal(email)}
      />

      <VerifyModal
        isOpen={isVerifyOpen}
        onClose={() => setIsVerifyOpen(false)}
        targetEmail={verifyEmailTarget}
        defaultToken={verifyTokenTarget}
      />

      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenResetPassword={(email, token) => handleOpenResetPasswordModal(email, token)}
      />

      <ResetPasswordModal
        isOpen={isResetPasswordOpen}
        onClose={() => setIsResetPasswordOpen(false)}
        targetEmail={resetEmailTarget}
        defaultToken={resetTokenTarget}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      <CreateFolderModal
        isOpen={isCreateFolderModalOpen}
        onClose={() => {
          setIsCreateFolderModalOpen(false)
          setFolderToEdit(null)
        }}
        folderToEdit={folderToEdit}
      />

      <FilePreviewModal
        file={previewFile}
        isOpen={Boolean(previewFile)}
        onClose={() => setPreviewFile(null)}
        onShare={(file) => setShareTarget({ type: 'file', item: file })}
      />

      <FileDetailsModal
        file={detailsFile}
        isOpen={Boolean(detailsFile)}
        onClose={() => setDetailsFile(null)}
      />

      <MoveCopyModal
        file={moveCopyTarget?.file}
        mode={moveCopyTarget?.mode}
        isOpen={Boolean(moveCopyTarget)}
        onClose={() => setMoveCopyTarget(null)}
      />

      <ShareLinksModal
        target={shareTarget}
        isOpen={Boolean(shareTarget)}
        onClose={() => setShareTarget(null)}
      />

      <UpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
        onSelectPlanToPay={(plan) => setPlanToPay(plan)}
      />

      <PaymentModal
        plan={planToPay}
        isOpen={Boolean(planToPay)}
        onClose={() => setPlanToPay(null)}
      />
    </div>
  )
}

export default function App() {
  return (
    <EmailProvider>
      <AuthProvider>
        <FileProvider>
          <ChatProvider>
            <AppContent />
          </ChatProvider>
        </FileProvider>
      </AuthProvider>
    </EmailProvider>
  )
}