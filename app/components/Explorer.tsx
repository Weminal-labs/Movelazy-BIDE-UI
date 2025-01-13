"use client";
import React, { useState, useCallback, useMemo, DragEvent } from 'react';
import { useWorkspaceStore } from '@/services/workspace';
import { FileFolder } from '@/types/file.type';
import {
  ChevronRight,
  ChevronDown,
  File as FileIcon,
  Folder,
  Plus,
  Trash2,
  Edit2,
  Circle,
  Search,
  X
} from 'react-feather';

export const Explorer = () => {
  const { files, activeFileId, setActiveFile, addFile, deleteFile, updateFile } = useWorkspaceStore();
  const [explorerWidth, setExplorerWidth] = useState(240);
  const [isResizing, setIsResizing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openFolders, setOpenFolders] = useState<{ [K in FileFolder]: boolean }>({
    contracts: true,
    scripts: false,
    tests: false,
  });
  const [draggedFile, setDraggedFile] = useState<string | null>(null);
  const [dragOverFolder, setDragOverFolder] = useState<FileFolder | null>(null);

  // Filter files based on search query
  const filteredFiles = useMemo(() => {
    if (!searchQuery) return files;
    return files.filter(file =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [files, searchQuery]);

  // Auto-expand folders when searching
  React.useEffect(() => {
    if (searchQuery) {
      setOpenFolders({
        contracts: true,
        scripts: true,
        tests: true,
      });
    }
  }, [searchQuery]);

  // Resize handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isResizing) {
      const newWidth = Math.min(Math.max(e.clientX, 160), 480);
      setExplorerWidth(newWidth);
    }
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Add mouse move and up listeners
  React.useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const toggleFolder = (folder: FileFolder) => {
    setOpenFolders((prev) => ({ ...prev, [folder]: !prev[folder] }));
  };

  const handleCreateFile = (folder: FileFolder, e: React.MouseEvent) => {
    e.stopPropagation();
    const fileName = prompt("Enter new file name:");
    if (fileName) {
      addFile(`${folder}/${fileName}`);
    }
  };

  const handleDeleteFile = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this file?")) {
      deleteFile(fileId);
    }
  };

  const handleUpdateFile = (fileId: string, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newName = prompt("Enter new file name:", currentName.split('/').pop());
    if (newName) {
      const folder = currentName.split('/')[0];
      updateFile(fileId, `${folder}/${newName}`);
    }
  };

  // Drag handlers
  const handleDragStart = (e: DragEvent<HTMLDivElement>, fileId: string) => {
    setDraggedFile(fileId);
    e.dataTransfer.setData('text/plain', fileId);
    // Add some opacity to dragged element
    (e.target as HTMLDivElement).style.opacity = '0.5';
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    setDraggedFile(null);
    setDragOverFolder(null);
    (e.target as HTMLDivElement).style.opacity = '1';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, folder: FileFolder) => {
    e.preventDefault();
    if (draggedFile && dragOverFolder !== folder) {
      setDragOverFolder(folder);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, targetFolder: FileFolder) => {
    e.preventDefault();
    const fileId = e.dataTransfer.getData('text/plain');
    const file = files.find(f => f.id === fileId);

    if (file) {
      const currentFolder = file.name.split('/')[0];
      if (currentFolder !== targetFolder) {
        const fileName = file.name.split('/').pop();
        updateFile(fileId, `${targetFolder}/${fileName}`);
      }
    }

    setDragOverFolder(null);
    setDraggedFile(null);
  };

  const FolderSection = ({ folder }: { folder: FileFolder }) => {
    const isOpen = openFolders[folder];
    const folderFiles = filteredFiles.filter((file) => file.name.startsWith(`${folder}/`));

    if (searchQuery && folderFiles.length === 0) return null;

    return (
      <div>
        <div
          onClick={() => toggleFolder(folder)}
          onDragOver={(e) => handleDragOver(e, folder)}
          onDrop={(e) => handleDrop(e, folder)}
          className={`flex items-center px-2 py-1 cursor-pointer group
            ${dragOverFolder === folder ? 'bg-[#37373d]' : 'hover:bg-[#2a2d2e]'}`}
        >
          <span className="mr-1">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
          <Folder size={16} className="mr-1 text-[#c5c5c5]" />
          <span className="text-[#c5c5c5] text-sm capitalize">{folder}</span>
          <button
            onClick={(e) => handleCreateFile(folder, e)}
            className="ml-auto hidden group-hover:block text-[#c5c5c5] hover:text-white"
          >
            <Plus size={14} />
          </button>
        </div>

        {isOpen && (
          <div className="ml-4">
            {folderFiles.map((file) => (
              <div
                key={file.id}
                draggable
                onDragStart={(e) => handleDragStart(e, file.id)}
                onDragEnd={handleDragEnd}
                onClick={() => setActiveFile(file.id)}
                className={`flex items-center px-2 py-1 cursor-pointer group
                  ${file.id === activeFileId ? 'bg-[#37373d]' : 'hover:bg-[#2a2d2e]'}
                  ${draggedFile === file.id ? 'opacity-50' : ''}`}
              >
                <FileIcon size={16} className="mr-1 text-[#c5c5c5]" />
                <span className="text-[#c5c5c5] text-sm">{file.name.split('/').pop()}</span>
                {file.isDirty && (
                  <Circle size={8} fill="#fff" className="ml-1 text-[#c5c5c5]" />
                )}
                <div className="ml-auto hidden group-hover:flex items-center gap-2">
                  <button
                    onClick={(e) => handleUpdateFile(file.id, file.name, e)}
                    className="text-[#c5c5c5] hover:text-white"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={(e) => handleDeleteFile(file.id, e)}
                    className="text-[#c5c5c5] hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative flex h-full" style={{ width: explorerWidth }}>
      <div className="flex-1 bg-[#252526] border-r border-[#3c3c3c] overflow-y-auto flex flex-col">
        <div className="p-2 text-sm font-semibold text-[#bbbbbb]">EXPLORER</div>

        {/* Search Bar */}
        <div className="px-2 mb-2">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files..."
              className="w-full bg-[#3c3c3c] text-[#cccccc] text-sm px-8 py-1 rounded outline-none focus:ring-1 focus:ring-blue-500"
            />
            <Search
              size={14}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#cccccc]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#cccccc] hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* File Tree */}
        <div className="flex-1">
          <FolderSection folder="contracts" />
          <FolderSection folder="scripts" />
          <FolderSection folder="tests" />
        </div>
      </div>

      {/* Resize handle */}
      <div
        className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-600 active:bg-blue-600 z-10"
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};