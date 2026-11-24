import React, { createContext, useContext, useState, useEffect } from 'react'
import { generateToken } from '../utils/helpers'

const EmailContext = createContext(null)

export const EmailProvider = ({ children }) => {
  const [emails, setEmails] = useState(() => {
    const saved = localStorage.getItem('cloudbox_emails')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        return []
      }
    }
    return [
      {
        id: 'welcome-email-1',
        to: 'jessica@ceutec.edu',
        from: 'CloudBox Security <seguridad@cloudbox.com>',
        subject: '¡Cuenta confirmada con éxito en CloudBox!',
        type: 'NOTIFICATION',
        body: 'Hola Jessica, tu cuenta ha sido verificada satisfactoriamente. Ya puedes disfrutar de 50 GB de almacenamiento seguro y compartir archivos mediante enlaces protegidos.',
        token: null,
        isRead: false,
        sentAt: '2026-02-15T08:35:00.000Z'
      }
    ]
  })

  const [activeEmail, setActiveEmail] = useState(null)
  const [isInboxOpen, setIsInboxOpen] = useState(false)
  const [emailServiceConfig, setEmailServiceConfig] = useState(() => {
    const saved = localStorage.getItem('cloudbox_email_config')
    return saved ? JSON.parse(saved) : { serviceId: '', templateId: '', publicKey: '' }
  })

  useEffect(() => {
    localStorage.setItem('cloudbox_emails', JSON.stringify(emails))
  }, [emails])

  useEffect(() => {
    localStorage.setItem('cloudbox_email_config', JSON.stringify(emailServiceConfig))
  }, [emailServiceConfig])

  const sendEmail = async ({ to, subject, type, body, token, actionUrl }) => {
    const newEmail = {
      id: 'email_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      to,
      from: 'CloudBox Auth <soporte@cloudbox.com>',
      subject,
      type,
      body,
      token,
      actionUrl,
      isRead: false,
      sentAt: new Date().toISOString()
    }

    setEmails(prev => [newEmail, ...prev])

    if (emailServiceConfig.serviceId && emailServiceConfig.templateId && emailServiceConfig.publicKey) {
      try {
        await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_id: emailServiceConfig.serviceId,
            template_id: emailServiceConfig.templateId,
            user_id: emailServiceConfig.publicKey,
            template_params: {
              to_email: to,
              subject: subject,
              message: body,
              verification_code: token || '',
              action_link: actionUrl || ''
            }
          })
        })
      } catch (err) {
      }
    }

    return newEmail
  }

  const markAsRead = (emailId) => {
    setEmails(prev => prev.map(em => em.id === emailId ? { ...em, isRead: true } : em))
  }

  const deleteEmail = (emailId) => {
    setEmails(prev => prev.filter(em => em.id !== emailId))
    if (activeEmail?.id === emailId) {
      setActiveEmail(null)
    }
  }

  const clearAllEmails = () => {
    setEmails([])
    setActiveEmail(null)
  }

  const unreadCount = emails.filter(e => !e.isRead).length

  return (
    <EmailContext.Provider
      value={{
        emails,
        activeEmail,
        setActiveEmail,
        isInboxOpen,
        setIsInboxOpen,
        sendEmail,
        markAsRead,
        deleteEmail,
        clearAllEmails,
        unreadCount,
        emailServiceConfig,
        setEmailServiceConfig
      }}
    >
      {children}
    </EmailContext.Provider>
  )
}

export const useEmail = () => {
  const context = useContext(EmailContext)
  if (!context) throw new Error('useEmail must be used within EmailProvider')
  return context
}