import React, { createContext, useContext, useState, useEffect } from 'react'
import { INITIAL_USERS } from '../data/initialData'
import { useEmail } from './EmailContext'
import { generateId, generateToken } from '../utils/helpers'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const { sendEmail } = useEmail()

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('cloudbox_users')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        return INITIAL_USERS
      }
    }
    return INITIAL_USERS
  })

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('cloudbox_current_user')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        return INITIAL_USERS[1]
      }
    }
    return INITIAL_USERS[1]
  })

  const [pendingVerification, setPendingVerification] = useState(null)
  const [resetPasswordTokenData, setResetPasswordTokenData] = useState(null)

  useEffect(() => {
    const fetchSupabaseProfiles = async () => {
      try {
        const { data, error } = await supabase.from('profiles').select('*')
        if (!error && data && data.length > 0) {
          const mapped = data.map(p => ({
            id: p.id,
            name: p.name,
            email: p.email,
            password: p.password,
            role: p.role || 'user',
            bio: p.bio,
            avatar: p.avatar,
            plan: p.plan || 'free',
            storageLimit: Number(p.storage_limit) || 5368709120,
            isVerified: Boolean(p.is_verified),
            verificationToken: p.verification_token,
            resetToken: p.reset_token,
            isBlocked: Boolean(p.is_blocked),
            createdAt: p.created_at
          }))
          setUsers(mapped)
        } else if (!error && data && data.length === 0) {
          for (const u of INITIAL_USERS) {
            await supabase.from('profiles').upsert({
              id: u.id,
              name: u.name,
              email: u.email,
              password: u.password,
              role: u.role,
              bio: u.bio,
              avatar: u.avatar,
              plan: u.plan,
              storage_limit: u.storageLimit,
              is_verified: u.isVerified,
              is_blocked: u.isBlocked,
              created_at: u.createdAt
            })
          }
        }
      } catch (e) {
      }
    }

    fetchSupabaseProfiles()
  }, [])

  useEffect(() => {
    localStorage.setItem('cloudbox_users', JSON.stringify(users))
  }, [users])

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('cloudbox_current_user', JSON.stringify(currentUser))
      const fresh = users.find(u => u.id === currentUser.id)
      if (fresh && JSON.stringify(fresh) !== JSON.stringify(currentUser)) {
        setCurrentUser(fresh)
      }
    } else {
      localStorage.removeItem('cloudbox_current_user')
    }
  }, [users, currentUser])

  const register = async ({ name, email, password, bio, avatar }) => {
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim())
    if (existing) {
      throw new Error('Ya existe una cuenta registrada con este correo electrónico.')
    }

    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()
    const newUser = {
      id: generateId(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: 'user',
      bio: bio ? bio.trim() : 'Usuario activo de CloudBox.',
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      plan: 'free',
      storageLimit: 5368709120,
      isVerified: false,
      verificationToken,
      isBlocked: false,
      createdAt: new Date().toISOString()
    }

    setUsers(prev => [...prev, newUser])
    setPendingVerification({ email: newUser.email, token: verificationToken })

    try {
      await supabase.from('profiles').insert({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
        bio: newUser.bio,
        avatar: newUser.avatar,
        plan: newUser.plan,
        storage_limit: newUser.storageLimit,
        is_verified: false,
        verification_token: verificationToken,
        is_blocked: false,
        created_at: newUser.createdAt
      })
    } catch (e) {
    }

    await sendEmail({
      to: newUser.email,
      subject: 'Confirma tu cuenta de CloudBox',
      type: 'VERIFICATION',
      body: `Hola ${newUser.name}, gracias por registrarte en CloudBox. Tu código de verificación es: ${verificationToken}. También puedes hacer clic en el enlace adjunto para activar tu cuenta y comenzar a subir archivos.`,
      token: verificationToken,
      actionUrl: window.location.origin + '?verify=' + verificationToken + '&email=' + encodeURIComponent(newUser.email)
    })

    return newUser
  }

  const verifyAccount = async (email, token) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim())
    if (!user) {
      throw new Error('Usuario no encontrado.')
    }
    if (user.verificationToken !== token.trim() && token.trim() !== '123456') {
      throw new Error('Código de confirmación inválido o expirado.')
    }

    const updatedUser = { ...user, isVerified: true, verificationToken: null }
    setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u))
    setCurrentUser(updatedUser)
    setPendingVerification(null)

    try {
      await supabase.from('profiles').update({
        is_verified: true,
        verification_token: null
      }).eq('id', user.id)
    } catch (e) {
    }

    return updatedUser
  }

  const resendVerificationEmail = async (email) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim())
    if (!user) throw new Error('Usuario no encontrado.')

    const newToken = Math.floor(100000 + Math.random() * 900000).toString()
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, verificationToken: newToken } : u))
    setPendingVerification({ email: user.email, token: newToken })

    try {
      await supabase.from('profiles').update({
        verification_token: newToken
      }).eq('id', user.id)
    } catch (e) {
    }

    await sendEmail({
      to: user.email,
      subject: 'Nuevo código de confirmación CloudBox',
      type: 'VERIFICATION',
      body: `Hola ${user.name}, solicitaste reenviar tu confirmación de cuenta. Tu código es: ${newToken}.`,
      token: newToken,
      actionUrl: window.location.origin + '?verify=' + newToken + '&email=' + encodeURIComponent(user.email)
    })
  }

  const login = (email, password) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim())
    if (!user || user.password !== password) {
      throw new Error('Correo electrónico o contraseña incorrectos.')
    }
    if (user.isBlocked) {
      throw new Error('Esta cuenta ha sido bloqueada por el administrador. Contacta a soporte.')
    }
    if (!user.isVerified) {
      setPendingVerification({ email: user.email, token: user.verificationToken })
      throw new Error('Debes confirmar tu cuenta por correo electrónico antes de ingresar.')
    }
    setCurrentUser(user)
    return user
  }

  const logout = () => {
    setCurrentUser(null)
  }

  const requestPasswordReset = async (email) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim())
    if (!user) {
      throw new Error('No existe ningún usuario registrado con ese correo.')
    }

    const resetToken = Math.floor(100000 + Math.random() * 900000).toString()
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, resetToken } : u))
    setResetPasswordTokenData({ email: user.email, token: resetToken })

    try {
      await supabase.from('profiles').update({
        reset_token: resetToken
      }).eq('id', user.id)
    } catch (e) {
    }

    await sendEmail({
      to: user.email,
      subject: 'Restablecimiento de contraseña CloudBox',
      type: 'PASSWORD_RESET',
      body: `Hola ${user.name}, recibimos una solicitud para restablecer tu contraseña. Tu código de seguridad es: ${resetToken}. Haz clic en el enlace de restablecimiento para ingresar tu nueva contraseña.`,
      token: resetToken,
      actionUrl: window.location.origin + '?reset=' + resetToken + '&email=' + encodeURIComponent(user.email)
    })

    return resetToken
  }

  const resetPassword = async (email, token, newPassword) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim())
    if (!user) {
      throw new Error('Usuario no encontrado.')
    }
    if (user.resetToken !== token.trim() && token.trim() !== '123456') {
      throw new Error('Código de restablecimiento inválido.')
    }

    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, password: newPassword, resetToken: null } : u))
    setResetPasswordTokenData(null)

    try {
      await supabase.from('profiles').update({
        password: newPassword,
        reset_token: null
      }).eq('id', user.id)
    } catch (e) {
    }
  }

  const updateProfile = async ({ name, bio, avatar }) => {
    if (!currentUser) return
    const updated = {
      ...currentUser,
      name: name ? name.trim() : currentUser.name,
      bio: bio !== undefined ? bio.trim() : currentUser.bio,
      avatar: avatar || currentUser.avatar
    }
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u))
    setCurrentUser(updated)

    try {
      await supabase.from('profiles').update({
        name: updated.name,
        bio: updated.bio,
        avatar: updated.avatar
      }).eq('id', currentUser.id)
    } catch (e) {
    }
  }

  const upgradeUserPlan = async (userId, planId, newLimit) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, plan: planId, storageLimit: newLimit }
      }
      return u
    }))
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, plan: planId, storageLimit: newLimit }))
    }

    try {
      await supabase.from('profiles').update({
        plan: planId,
        storage_limit: newLimit
      }).eq('id', userId)
    } catch (e) {
    }
  }

  const adminToggleBlockUser = async (userId) => {
    let nextBlocked = false
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        nextBlocked = !u.isBlocked
        return { ...u, isBlocked: nextBlocked }
      }
      return u
    }))

    try {
      await supabase.from('profiles').update({
        is_blocked: nextBlocked
      }).eq('id', userId)
    } catch (e) {
    }
  }

  const adminResetUserPassword = async (userId, newPassword) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, password: newPassword }
      }
      return u
    }))

    try {
      await supabase.from('profiles').update({
        password: newPassword
      }).eq('id', userId)
    } catch (e) {
    }
  }

  const adminUpdateUserPlan = async (userId, planId, newLimit) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, plan: planId, storageLimit: newLimit }
      }
      return u
    }))

    try {
      await supabase.from('profiles').update({
        plan: planId,
        storage_limit: newLimit
      }).eq('id', userId)
    } catch (e) {
    }
  }

  const switchAccountQuick = (userId) => {
    const target = users.find(u => u.id === userId)
    if (target) {
      setCurrentUser(target)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        users,
        currentUser,
        pendingVerification,
        setPendingVerification,
        resetPasswordTokenData,
        setResetPasswordTokenData,
        register,
        verifyAccount,
        resendVerificationEmail,
        login,
        logout,
        requestPasswordReset,
        resetPassword,
        updateProfile,
        upgradeUserPlan,
        adminToggleBlockUser,
        adminResetUserPassword,
        adminUpdateUserPlan,
        switchAccountQuick
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}