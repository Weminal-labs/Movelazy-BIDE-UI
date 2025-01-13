"use client";
import React, { useState, useCallback } from 'react';
import { useWorkspaceStore } from '@/services/workspace';
import { FileFolder } from '@/types/file.type';
import { ChevronRight, ChevronDown, File as FileIcon, Folder, Plus, Trash2, Edit2, Circle } from 'react-feather';

export const Explorer = () => {
  const { files, activeFileId, setActiveFile, addFile, deleteFile, updateFile } = useWorkspaceStore();
  const [explorerWidth, setExplorerWidth] = useState(240);
  const [isResizing, setIsResizing] = useState(false);
  const [openFolders, setOpenFolders] = useState<{ [K in FileFolder]: boolean }>({
    contracts: true,
    scripts: false,
    tests: false,
  });

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

  const FolderSection = ({ folder }: { folder: FileFolder }) => {
    const isOpen = openFolders[folder];
    const folderFiles = files.filter((file) => file.name.startsWith(`${folder}/`));

    return (
      <div>
        <div
          onClick={() => toggleFolder(folder)}
          className="flex items-center px-2 py-1 hover:bg-[#2a2d2e] cursor-pointer group"
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
                onClick={() => setActiveFile(file.id)}
                className={`flex items-center px-2 py-1 cursor-pointer group
                  ${file.id === activeFileId ? 'bg-[#37373d]' : 'hover:bg-[#2a2d2e]'}`}
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
      <div className="flex-1 bg-[#252526] border-r border-[#3c3c3c]">
        <div className="p-2 text-sm font-semibold text-[#bbbbbb]">EXPLORER</div>
        <div>
          <FolderSection folder="contracts" />
          <FolderSection folder="scripts" />
          <FolderSection folder="tests" />
        </div>
      </div>
      {/* Resize handle */}
      <div
        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-600 active:bg-blue-600"
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};