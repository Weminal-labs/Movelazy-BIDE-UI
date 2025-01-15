"use client";
import React, { useState, useMemo, DragEvent } from 'react';
import { useWorkspaceStore } from '@/services/workspace';
import { FileFolder } from '@/types/file.type';
import { FolderSection } from './FolderSection';
import {
  Search,
  X,
  File as FileIcon,
  Edit2,
  Trash2,
  Circle
} from 'react-feather';
import {
  HELLO_FILE_NAME,
  CONFIG_FILE_NAME,
  HELLO_CONTENT,
  CONFIG_CONTENT
} from '@/constants/fileTemplates';

export const Explorer = () => {
  const { files, activeFileId, setActiveFile, addFile, addFileWithContent, deleteFile, updateFile } = useWorkspaceStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [openFolders, setOpenFolders] = useState<{ [K in FileFolder]: boolean }>({
    contracts: true,
    scripts: true,
    tests: true,
  });
  const [draggedFile, setDraggedFile] = useState<string | null>(null);
  const [dragOverFolder, setDragOverFolder] = useState<FileFolder | null>(null);

  const folders: FileFolder[] = ['contracts', 'scripts', 'tests'];
  const [filesCreated, setFilesCreated] = useState<boolean>(false);

  React.useEffect(() => {
    const createInitialFiles = async () => {
      if (filesCreated) return;

      await addFileWithContent(CONFIG_FILE_NAME, CONFIG_CONTENT);
      await addFileWithContent(`${folders[0]}/${HELLO_FILE_NAME}`, HELLO_CONTENT);

      setFilesCreated(true);
    };

    createInitialFiles();
  });


  const filteredFiles = useMemo(() => {
    if (!searchQuery) return files;
    return files.filter(file =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [files, searchQuery]);

  React.useEffect(() => {
    if (searchQuery) {
      setOpenFolders({
        contracts: true,
        scripts: true,
        tests: true,
      });
    }
  }, [searchQuery]);

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

  const handleDragStart = (e: DragEvent<HTMLDivElement>, fileId: string) => {
    setDraggedFile(fileId);
    e.dataTransfer.setData('text/plain', fileId);
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

  // Get root files (files not in any folder)
  const rootFiles = useMemo(() => {
    return filteredFiles.filter(file => !file.name.includes('/'));
  }, [filteredFiles]);

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 text-sm font-semibold text-[#bbbbbb]">EXPLORER</div>

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

      <div className="flex-1 overflow-y-auto">
        {/* Root files */}
        {rootFiles.map((file) => (
          <div
            key={file.id}
            onClick={() => setActiveFile(file.id)}
            className={`flex items-center px-2 py-1 cursor-pointer group ml-2
              ${file.id === activeFileId ? 'bg-[#37373d]' : 'hover:bg-[#2a2d2e]'}`}
          >
            <FileIcon size={16} className="mr-1 text-[#c5c5c5]" />
            <span className="text-[#c5c5c5] text-sm">{file.name}</span>
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

        {/* Folders */}
        {folders.map((folder) => (
          <FolderSection
            key={folder}
            folder={folder}
            filteredFiles={filteredFiles}
            toggleFolder={toggleFolder}
            handleCreateFile={handleCreateFile}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            handleDragStart={handleDragStart}
            handleDragEnd={handleDragEnd}
            handleUpdateFile={handleUpdateFile}
            handleDeleteFile={handleDeleteFile}
            setActiveFile={setActiveFile}
            activeFileId={activeFileId}
            openFolders={openFolders}
            draggedFile={draggedFile}
            dragOverFolder={dragOverFolder}
            searchQuery={searchQuery}
          />
        ))}
      </div>
    </div>
  );
};