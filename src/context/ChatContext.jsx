import React, { createContext, useContext, useState, useEffect } from 'react'
import { INITIAL_CHAT_MESSAGES } from '../data/initialData'
import { generateId } from '../utils/helpers'
import { supabase } from '../lib/supabase'

const ChatContext = createContext(null)

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('cloudbox_chat_messages')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        return INITIAL_CHAT_MESSAGES
      }
    }
    return INITIAL_CHAT_MESSAGES
  })

  const [activeTab, setActiveTab] = useState('general')
  const [isChatOpen, setIsChatOpen] = useState(false)

  useEffect(() => {
    const fetchSupabaseMessages = async () => {
      try {
        const { data, error } = await supabase.from('chat_messages').select('*').order('created_at', { ascending: true })
        if (!error && data && data.length > 0) {
          setMessages(data.map(m => ({
            id: m.id,
            senderId: m.sender_id,
            senderName: m.sender_name,
            senderAvatar: m.sender_avatar,
            channelId: m.channel_id,
            text: m.text,
            isModerated: Boolean(m.is_moderated),
            createdAt: m.created_at
          })))
        } else if (!error && data && data.length === 0) {
          for (const msg of INITIAL_CHAT_MESSAGES) {
            await supabase.from('chat_messages').upsert({
              id: msg.id,
              sender_id: msg.senderId,
              sender_name: msg.senderName,
              sender_avatar: msg.senderAvatar,
              channel_id: msg.channelId,
              text: msg.text,
              is_moderated: msg.isModerated,
              created_at: msg.createdAt
            })
          }
        }
      } catch (e) {
      }
    }

    fetchSupabaseMessages()

    const channel = supabase.channel('realtime_chat_messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_messages' }, payload => {
        if (payload.eventType === 'INSERT') {
          const newMsg = payload.new
          setMessages(prev => {
            if (prev.some(m => m.id === newMsg.id)) return prev
            return [...prev, {
              id: newMsg.id,
              senderId: newMsg.sender_id,
              senderName: newMsg.sender_name,
              senderAvatar: newMsg.sender_avatar,
              channelId: newMsg.channel_id,
              text: newMsg.text,
              isModerated: Boolean(newMsg.is_moderated),
              createdAt: newMsg.created_at
            }]
          })
        } else if (payload.eventType === 'DELETE') {
          setMessages(prev => prev.filter(m => m.id !== payload.old.id))
        } else if (payload.eventType === 'UPDATE') {
          setMessages(prev => prev.map(m => m.id === payload.new.id ? {
            ...m,
            isModerated: Boolean(payload.new.is_moderated),
            text: payload.new.text
          } : m))
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cloudbox_chat_messages', JSON.stringify(messages))
  }, [messages])

  const sendMessage = async ({ text, senderId, senderName, senderAvatar, channelId = 'general' }) => {
    if (!text || !text.trim()) return

    const newMessage = {
      id: generateId(),
      senderId,
      senderName,
      senderAvatar,
      channelId,
      text: text.trim(),
      isModerated: false,
      createdAt: new Date().toISOString()
    }

    setMessages(prev => [...prev, newMessage])

    try {
      await supabase.from('chat_messages').insert({
        id: newMessage.id,
        sender_id: newMessage.senderId,
        sender_name: newMessage.senderName,
        sender_avatar: newMessage.senderAvatar,
        channel_id: newMessage.channelId,
        text: newMessage.text,
        is_moderated: false,
        created_at: newMessage.createdAt
      })
    } catch (e) {
    }

    return newMessage
  }

  const adminDeleteMessage = async (messageId) => {
    setMessages(prev => prev.filter(m => m.id !== messageId))

    try {
      await supabase.from('chat_messages').delete().eq('id', messageId)
    } catch (e) {
    }
  }

  const adminFlagMessage = async (messageId) => {
    let nextStatus = false
    setMessages(prev => prev.map(m => {
      if (m.id === messageId) {
        nextStatus = !m.isModerated
        return { ...m, isModerated: nextStatus }
      }
      return m
    }))

    try {
      await supabase.from('chat_messages').update({ is_moderated: nextStatus }).eq('id', messageId)
    } catch (e) {
    }
  }

  return (
    <ChatContext.Provider
      value={{
        messages,
        activeTab,
        setActiveTab,
        isChatOpen,
        setIsChatOpen,
        sendMessage,
        adminDeleteMessage,
        adminFlagMessage
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) throw new Error('useChat must be used within ChatProvider')
  return context
}