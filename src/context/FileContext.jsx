import React, { createContext, useContext, useState, useEffect } from 'react'
import { INITIAL_FILES, INITIAL_FOLDERS, INITIAL_DOWNLOAD_LINKS } from '../data/initialData'
import { generateId, generateToken, getFileType, getFileExtension } from '../utils/helpers'
import { supabase } from '../lib/supabase'

const FileContext = createContext(null)

export const FileProvider = ({ children }) => {
  const [files, setFiles] = useState(() => {
    const saved = localStorage.getItem('cloudbox_files')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        return INITIAL_FILES
      }
    }
    return INITIAL_FILES
  })

  const [folders, setFolders] = useState(() => {
    const saved = localStorage.getItem('cloudbox_folders')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        return INITIAL_FOLDERS
      }
    }
    return INITIAL_FOLDERS
  })

  const [downloadLinks, setDownloadLinks] = useState(() => {
    const saved = localStorage.getItem('cloudbox_download_links')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        return INITIAL_DOWNLOAD_LINKS
      }
    }
    return INITIAL_DOWNLOAD_LINKS
  })

  const [currentFolderId, setCurrentFolderId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [fileTypeFilter, setFileTypeFilter] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [previewFile, setPreviewFile] = useState(null)
  const [detailsFile, setDetailsFile] = useState(null)
  const [shareModalTarget, setShareModalTarget] = useState(null)
  const [moveCopyTarget, setMoveCopyTarget] = useState(null)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false)

  useEffect(() => {
    const fetchSupabaseData = async () => {
      try {
        const { data: dbFolders, error: foldersErr } = await supabase.from('folders').select('*')
        if (!foldersErr && dbFolders && dbFolders.length > 0) {
          setFolders(dbFolders.map(f => ({
            id: f.id,
            name: f.name,
            userId: f.user_id,
            parentId: f.parent_id,
            color: f.color,
            isDeleted: Boolean(f.is_deleted),
            deletedAt: f.deleted_at,
            createdAt: f.created_at
          })))
        } else if (!foldersErr && dbFolders && dbFolders.length === 0) {
          for (const f of INITIAL_FOLDERS) {
            await supabase.from('folders').upsert({
              id: f.id,
              name: f.name,
              user_id: f.userId,
              parent_id: f.parentId,
              color: f.color,
              is_deleted: f.isDeleted,
              deleted_at: f.deletedAt,
              created_at: f.createdAt
            })
          }
        }

        const { data: dbFiles, error: filesErr } = await supabase.from('files').select('*')
        if (!filesErr && dbFiles && dbFiles.length > 0) {
          setFiles(dbFiles.map(f => ({
            id: f.id,
            name: f.name,
            userId: f.user_id,
            folderId: f.folder_id,
            size: Number(f.size) || 0,
            type: f.type,
            mimeType: f.mime_type,
            url: f.url,
            content: f.content,
            isDeleted: Boolean(f.is_deleted),
            deletedAt: f.deleted_at,
            isRestricted: Boolean(f.is_restricted),
            restrictionReason: f.restriction_reason,
            downloadsCount: Number(f.downloads_count) || 0,
            createdAt: f.created_at
          })))
        } else if (!filesErr && dbFiles && dbFiles.length === 0) {
          for (const fi of INITIAL_FILES) {
            await supabase.from('files').upsert({
              id: fi.id,
              name: fi.name,
              user_id: fi.userId,
              folder_id: fi.folderId,
              size: fi.size,
              type: fi.type,
              mime_type: fi.mimeType,
              url: fi.url,
              content: fi.content,
              is_deleted: fi.isDeleted,
              deleted_at: fi.deletedAt,
              is_restricted: fi.isRestricted,
              restriction_reason: fi.restrictionReason,
              downloads_count: fi.downloadsCount,
              created_at: fi.createdAt
            })
          }
        }

        const { data: dbLinks, error: linksErr } = await supabase.from('download_links').select('*')
        if (!linksErr && dbLinks && dbLinks.length > 0) {
          setDownloadLinks(dbLinks.map(l => ({
            id: l.id,
            userId: l.user_id,
            targetType: l.target_type,
            targetId: l.target_id,
            title: l.title,
            token: l.token,
            password: l.password,
            includePasswordInUrl: Boolean(l.include_password_in_url),
            expiresAt: l.expires_at,
            downloadsCount: Number(l.downloads_count) || 0,
            createdAt: l.created_at
          })))
        } else if (!linksErr && dbLinks && dbLinks.length === 0) {
          for (const l of INITIAL_DOWNLOAD_LINKS) {
            await supabase.from('download_links').upsert({
              id: l.id,
              user_id: l.userId,
              target_type: l.targetType,
              target_id: l.targetId,
              title: l.title,
              token: l.token,
              password: l.password,
              include_password_in_url: l.includePasswordInUrl,
              expires_at: l.expiresAt,
              downloads_count: l.downloadsCount,
              created_at: l.createdAt
            })
          }
        }
      } catch (e) {
      }
    }

    fetchSupabaseData()
  }, [])

  useEffect(() => {
    localStorage.setItem('cloudbox_files', JSON.stringify(files))
  }, [files])

  useEffect(() => {
    localStorage.setItem('cloudbox_folders', JSON.stringify(folders))
  }, [folders])

  useEffect(() => {
    localStorage.setItem('cloudbox_download_links', JSON.stringify(downloadLinks))
  }, [downloadLinks])

  const getUserStorageUsed = (userId) => {
    return files
      .filter(f => f.userId === userId && !f.isDeleted)
      .reduce((sum, file) => sum + (file.size || 0), 0)
  }

  const createFolder = async ({ name, parentId, color = '#6366f1', userId }) => {
    const newFolder = {
      id: generateId(),
      name: name.trim(),
      userId,
      parentId: parentId || null,
      color,
      isDeleted: false,
      deletedAt: null,
      createdAt: new Date().toISOString()
    }
    setFolders(prev => [newFolder, ...prev])

    try {
      await supabase.from('folders').insert({
        id: newFolder.id,
        name: newFolder.name,
        user_id: newFolder.userId,
        parent_id: newFolder.parentId,
        color: newFolder.color,
        is_deleted: false,
        created_at: newFolder.createdAt
      })
    } catch (e) {
    }

    return newFolder
  }

  const renameFolder = async (folderId, newName) => {
    const trimmed = newName.trim()
    setFolders(prev => prev.map(f => f.id === folderId ? { ...f, name: trimmed } : f))

    try {
      await supabase.from('folders').update({ name: trimmed }).eq('id', folderId)
    } catch (e) {
    }
  }

  const getAllDescendantFolderIds = (folderId, allFolders = folders) => {
    let ids = [folderId]
    const children = allFolders.filter(f => f.parentId === folderId)
    children.forEach(child => {
      ids = [...ids, ...getAllDescendantFolderIds(child.id, allFolders)]
    })
    return ids
  }

  const deleteFolder = async (folderId) => {
    const folderIdsToDelete = getAllDescendantFolderIds(folderId)
    const now = new Date().toISOString()

    setFolders(prev => prev.map(f => {
      if (folderIdsToDelete.includes(f.id)) {
        return { ...f, isDeleted: true, deletedAt: now }
      }
      return f
    }))

    const filesInFolders = files.filter(f => folderIdsToDelete.includes(f.folderId))
    const fileIdsToDelete = filesInFolders.map(f => f.id)

    setFiles(prev => prev.map(f => {
      if (folderIdsToDelete.includes(f.folderId)) {
        return { ...f, isDeleted: true, deletedAt: now }
      }
      return f
    }))

    setDownloadLinks(prev => prev.filter(l => {
      if (l.targetType === 'folder' && folderIdsToDelete.includes(l.targetId)) return false
      if (l.targetType === 'file' && fileIdsToDelete.includes(l.targetId)) return false
      return true
    }))

    if (currentFolderId && folderIdsToDelete.includes(currentFolderId)) {
      setCurrentFolderId(null)
    }

    try {
      for (const id of folderIdsToDelete) {
        await supabase.from('folders').update({ is_deleted: true, deleted_at: now }).eq('id', id)
        await supabase.from('files').update({ is_deleted: true, deleted_at: now }).eq('folder_id', id)
        await supabase.from('download_links').delete().eq('target_id', id)
      }
      for (const fid of fileIdsToDelete) {
        await supabase.from('download_links').delete().eq('target_id', fid)
      }
    } catch (e) {
    }
  }

  const restoreFolder = async (folderId) => {
    const folderIdsToRestore = getAllDescendantFolderIds(folderId)

    setFolders(prev => prev.map(f => {
      if (folderIdsToRestore.includes(f.id)) {
        return { ...f, isDeleted: false, deletedAt: null }
      }
      return f
    }))

    setFiles(prev => prev.map(f => {
      if (folderIdsToRestore.includes(f.folderId)) {
        return { ...f, isDeleted: false, deletedAt: null }
      }
      return f
    }))

    try {
      for (const id of folderIdsToRestore) {
        await supabase.from('folders').update({ is_deleted: false, deleted_at: null }).eq('id', id)
        await supabase.from('files').update({ is_deleted: false, deleted_at: null }).eq('folder_id', id)
      }
    } catch (e) {
    }
  }

  const uploadFile = async ({ name, size, mimeType, content, url, folderId, userId, userStorageLimit }) => {
    const used = getUserStorageUsed(userId)
    if (used + size > userStorageLimit) {
      throw new Error('Almacenamiento insuficiente. Has alcanzado el límite de tu plan actual. Por favor amplía tu plan.')
    }

    const type = getFileType(name, mimeType)
    const newFile = {
      id: generateId(),
      name,
      userId,
      folderId: folderId || null,
      size,
      type,
      mimeType,
      content: content || null,
      url: url || null,
      isDeleted: false,
      deletedAt: null,
      isRestricted: false,
      restrictionReason: null,
      downloadsCount: 0,
      createdAt: new Date().toISOString()
    }

    setFiles(prev => [newFile, ...prev])

    try {
      await supabase.from('files').insert({
        id: newFile.id,
        name: newFile.name,
        user_id: newFile.userId,
        folder_id: newFile.folderId,
        size: newFile.size,
        type: newFile.type,
        mime_type: newFile.mimeType,
        url: newFile.url,
        content: newFile.content,
        is_deleted: false,
        is_restricted: false,
        downloads_count: 0,
        created_at: newFile.createdAt
      })
    } catch (e) {
    }

    return newFile
  }

  const deleteFile = async (fileId) => {
    const now = new Date().toISOString()
    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, isDeleted: true, deletedAt: now } : f))
    setDownloadLinks(prev => prev.filter(l => !(l.targetType === 'file' && l.targetId === fileId)))

    try {
      await supabase.from('files').update({ is_deleted: true, deleted_at: now }).eq('id', fileId)
      await supabase.from('download_links').delete().eq('target_id', fileId)
    } catch (e) {
    }
  }

  const restoreFile = async (fileId) => {
    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, isDeleted: false, deletedAt: null } : f))

    try {
      await supabase.from('files').update({ is_deleted: false, deleted_at: null }).eq('id', fileId)
    } catch (e) {
    }
  }

  const emptyTrash = async (userId) => {
    const deletedFiles = files.filter(f => f.userId === userId && f.isDeleted)
    const deletedFolders = folders.filter(f => f.userId === userId && f.isDeleted)
    const deletedFileIds = deletedFiles.map(f => f.id)
    const deletedFolderIds = deletedFolders.map(f => f.id)

    setFiles(prev => prev.filter(f => !(f.userId === userId && f.isDeleted)))
    setFolders(prev => prev.filter(f => !(f.userId === userId && f.isDeleted)))

    setDownloadLinks(prev => prev.filter(l => {
      if (l.targetType === 'file' && deletedFileIds.includes(l.targetId)) return false
      if (l.targetType === 'folder' && deletedFolderIds.includes(l.targetId)) return false
      return true
    }))

    try {
      for (const fid of deletedFileIds) {
        await supabase.from('files').delete().eq('id', fid)
        await supabase.from('download_links').delete().eq('target_id', fid)
      }
      for (const foid of deletedFolderIds) {
        await supabase.from('folders').delete().eq('id', foid)
        await supabase.from('download_links').delete().eq('target_id', foid)
      }
    } catch (e) {
    }
  }

  const moveFile = async (fileId, targetFolderId) => {
    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, folderId: targetFolderId || null } : f))

    try {
      await supabase.from('files').update({ folder_id: targetFolderId || null }).eq('id', fileId)
    } catch (e) {
    }
  }

  const duplicateFile = async (fileId, targetFolderId, userId, userStorageLimit) => {
    const original = files.find(f => f.id === fileId)
    if (!original) return

    const used = getUserStorageUsed(userId)
    if (used + original.size > userStorageLimit) {
      throw new Error('No tienes suficiente almacenamiento para duplicar este archivo. Amplía tu plan para continuar.')
    }

    const nameParts = original.name.split('.')
    const ext = nameParts.length > 1 ? '.' + nameParts.pop() : ''
    const newName = nameParts.join('.') + ' (Copia)' + ext

    const copy = {
      ...original,
      id: generateId(),
      name: newName,
      folderId: targetFolderId || null,
      isDeleted: false,
      deletedAt: null,
      downloadsCount: 0,
      createdAt: new Date().toISOString()
    }

    setFiles(prev => [copy, ...prev])

    try {
      await supabase.from('files').insert({
        id: copy.id,
        name: copy.name,
        user_id: copy.userId,
        folder_id: copy.folderId,
        size: copy.size,
        type: copy.type,
        mime_type: copy.mimeType,
        url: copy.url,
        content: copy.content,
        is_deleted: false,
        is_restricted: false,
        downloads_count: 0,
        created_at: copy.createdAt
      })
    } catch (e) {
    }

    return copy
  }

  const createDownloadLink = async ({ targetType, targetId, title, password, includePasswordInUrl, expiresAt, userId }) => {
    const token = generateToken(10)
    const newLink = {
      id: generateId(),
      userId,
      targetType,
      targetId,
      title: title ? title.trim() : (targetType === 'folder' ? 'Enlace de Carpeta' : 'Enlace de Descarga'),
      token,
      password: password ? password.trim() : null,
      includePasswordInUrl: Boolean(includePasswordInUrl),
      expiresAt: expiresAt || null,
      downloadsCount: 0,
      createdAt: new Date().toISOString()
    }

    setDownloadLinks(prev => [newLink, ...prev])

    try {
      await supabase.from('download_links').insert({
        id: newLink.id,
        user_id: newLink.userId,
        target_type: newLink.targetType,
        target_id: newLink.targetId,
        title: newLink.title,
        token: newLink.token,
        password: newLink.password,
        include_password_in_url: newLink.includePasswordInUrl,
        expires_at: newLink.expiresAt,
        downloads_count: 0,
        created_at: newLink.createdAt
      })
    } catch (e) {
    }

    return newLink
  }

  const revokeDownloadLink = async (linkId) => {
    setDownloadLinks(prev => prev.filter(l => l.id !== linkId))

    try {
      await supabase.from('download_links').delete().eq('id', linkId)
    } catch (e) {
    }
  }

  const recordDownload = async (linkId) => {
    const link = downloadLinks.find(l => l.id === linkId)
    if (!link) return

    const nextCount = (link.downloadsCount || 0) + 1
    setDownloadLinks(prev => prev.map(l => l.id === linkId ? { ...l, downloadsCount: nextCount } : l))

    try {
      await supabase.from('download_links').update({ downloads_count: nextCount }).eq('id', linkId)
    } catch (e) {
    }

    if (link.targetType === 'file') {
      const fileTarget = files.find(f => f.id === link.targetId)
      const nextFileCount = (fileTarget?.downloadsCount || 0) + 1
      setFiles(prev => prev.map(f => f.id === link.targetId ? { ...f, downloadsCount: nextFileCount } : f))

      try {
        await supabase.from('files').update({ downloads_count: nextFileCount }).eq('id', link.targetId)
      } catch (e) {
      }
    }
  }

  const adminRestrictFile = async (fileId, reason) => {
    const textReason = reason || 'Restringido por moderación del administrador.'
    setFiles(prev => prev.map(f => f.id === fileId ? {
      ...f,
      isRestricted: true,
      restrictionReason: textReason
    } : f))

    try {
      await supabase.from('files').update({
        is_restricted: true,
        restriction_reason: textReason
      }).eq('id', fileId)
    } catch (e) {
    }
  }

  const adminUnrestrictFile = async (fileId) => {
    setFiles(prev => prev.map(f => f.id === fileId ? {
      ...f,
      isRestricted: false,
      restrictionReason: null
    } : f))

    try {
      await supabase.from('files').update({
        is_restricted: false,
        restriction_reason: null
      }).eq('id', fileId)
    } catch (e) {
    }
  }

  const adminDeleteFilePermanently = async (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
    setDownloadLinks(prev => prev.filter(l => !(l.targetType === 'file' && l.targetId === fileId)))

    try {
      await supabase.from('files').delete().eq('id', fileId)
      await supabase.from('download_links').delete().eq('target_id', fileId)
    } catch (e) {
    }
  }

  const adminDeleteFolderPermanently = async (folderId) => {
    const folderIdsToDelete = getAllDescendantFolderIds(folderId)
    const filesToDelete = files.filter(f => folderIdsToDelete.includes(f.folderId))
    const fileIds = filesToDelete.map(f => f.id)

    setFolders(prev => prev.filter(f => !folderIdsToDelete.includes(f.id)))
    setFiles(prev => prev.filter(f => !folderIdsToDelete.includes(f.folderId)))
    setDownloadLinks(prev => prev.filter(l => {
      if (l.targetType === 'folder' && folderIdsToDelete.includes(l.targetId)) return false
      if (l.targetType === 'file' && fileIds.includes(l.targetId)) return false
      return true
    }))

    try {
      for (const id of folderIdsToDelete) {
        await supabase.from('folders').delete().eq('id', id)
        await supabase.from('download_links').delete().eq('target_id', id)
      }
      for (const fid of fileIds) {
        await supabase.from('files').delete().eq('id', fid)
        await supabase.from('download_links').delete().eq('target_id', fid)
      }
    } catch (e) {
    }
  }

  return (
    <FileContext.Provider
      value={{
        files,
        folders,
        downloadLinks,
        currentFolderId,
        setCurrentFolderId,
        searchQuery,
        setSearchQuery,
        fileTypeFilter,
        setFileTypeFilter,
        viewMode,
        setViewMode,
        previewFile,
        setPreviewFile,
        detailsFile,
        setDetailsFile,
        shareModalTarget,
        setShareModalTarget,
        moveCopyTarget,
        setMoveCopyTarget,
        isUploadModalOpen,
        setIsUploadModalOpen,
        isCreateFolderModalOpen,
        setIsCreateFolderModalOpen,
        getUserStorageUsed,
        createFolder,
        renameFolder,
        deleteFolder,
        restoreFolder,
        uploadFile,
        deleteFile,
        restoreFile,
        emptyTrash,
        moveFile,
        duplicateFile,
        createDownloadLink,
        revokeDownloadLink,
        recordDownload,
        adminRestrictFile,
        adminUnrestrictFile,
        adminDeleteFilePermanently,
        adminDeleteFolderPermanently
      }}
    >
      {children}
    </FileContext.Provider>
  )
}

export const useFiles = () => {
  const context = useContext(FileContext)
  if (!context) throw new Error('useFiles must be used within FileProvider')
  return context
}