import React, { useState } from 'react'
import {
  FolderPlus,
  UploadCloud,
  Folder as FolderIcon,
  FileQuestion,
  FileText,
  Search,
  Sparkles
} from 'lucide-react'
import { useFiles } from '../../context/FileContext'
import { useAuth } from '../../context/AuthContext'
import { Breadcrumbs } from './Breadcrumbs'
import { FolderCard } from '../folders/FolderCard'
import { FileCard } from './FileCard'

export const FileList = ({
  onNewFolder,
  onUpload,
  onEditFolder,
  onShareTarget,
  onMoveCopy,
  onPreviewFile,
  onDetailsFile
}) => {
  const { currentUser } = useAuth()
  const {
    files,
    folders,
    currentFolderId,
    setCurrentFolderId,
    searchQuery,
    fileTypeFilter,
    viewMode
  } = useFiles()

  const [isDragOverArea, setIsDragOverArea] = useState(false)

  if (!currentUser) return null

  const userFolders = folders.filter(f => f.userId === currentUser.id && !f.isDeleted)
  const userFiles = files.filter(f => f.userId === currentUser.id && !f.isDeleted)

  const currentSubfolders = userFolders.filter(f => {
    if (searchQuery.trim()) {
      return f.name.toLowerCase().includes(searchQuery.toLowerCase())
    }
    return f.parentId === currentFolderId
  })

  const currentFiles = userFiles.filter(f => {
    if (searchQuery.trim()) {
      const matchSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchType = fileTypeFilter === 'all' || f.type === fileTypeFilter || (fileTypeFilter === 'document' && (f.type === 'pdf' || f.type === 'document-text' || f.type === 'document-office'))
      return matchSearch && matchType
    }

    const inFolder = f.folderId === currentFolderId
    let matchType = true
    if (fileTypeFilter !== 'all') {
      if (fileTypeFilter === 'document') {
        matchType = ['pdf', 'document-text', 'document-office'].includes(f.type)
      } else if (fileTypeFilter === 'code') {
        matchType = ['code', 'document-text'].includes(f.type)
      } else {
        matchType = f.type === fileTypeFilter
      }
    }

    return inFolder && matchType
  })

  const isEmpty = currentSubfolders.length === 0 && currentFiles.length === 0

  return (
    <div className="space-y-6">
      <Breadcrumbs onNewFolder={onNewFolder} onUpload={onUpload} />

      {isEmpty ? (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200 max-w-lg mx-auto my-12 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto mb-4">
            <FolderIcon className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Esta carpeta está vacía</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto mb-6">
            Comienza subiendo tus archivos o crea subcarpetas para organizar tu información de forma segura.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onNewFolder}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <FolderPlus className="w-4 h-4 text-slate-500" />
              <span>Nueva Carpeta</span>
            </button>
            <button
              onClick={onUpload}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-200 flex items-center gap-1.5 transition-colors"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Subir Archivo</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {currentSubfolders.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <FolderIcon className="w-3.5 h-3.5" />
                <span>Carpetas ({currentSubfolders.length})</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {currentSubfolders.map(folder => (
                  <FolderCard
                    key={folder.id}
                    folder={folder}
                    onOpen={() => setCurrentFolderId(folder.id)}
                    onEdit={() => onEditFolder(folder)}
                    onShare={() => onShareTarget({ type: 'folder', item: folder })}
                  />
                ))}
              </div>
            </div>
          )}

          {currentFiles.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" />
                <span>Archivos ({currentFiles.length})</span>
              </h2>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {currentFiles.map(file => (
                    <FileCard
                      key={file.id}
                      file={file}
                      isListView={false}
                      onPreview={() => onPreviewFile(file)}
                      onDetails={() => onDetailsFile(file)}
                      onShare={() => onShareTarget({ type: 'file', item: file })}
                      onMoveCopy={(mode) => onMoveCopy(file, mode)}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {currentFiles.map(file => (
                    <FileCard
                      key={file.id}
                      file={file}
                      isListView={true}
                      onPreview={() => onPreviewFile(file)}
                      onDetails={() => onDetailsFile(file)}
                      onShare={() => onShareTarget({ type: 'file', item: file })}
                      onMoveCopy={(mode) => onMoveCopy(file, mode)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}