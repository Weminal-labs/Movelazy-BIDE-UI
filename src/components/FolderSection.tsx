import React from 'react';
import { File, FileFolder } from '@/types/file.type';
import {
    ChevronRight,
    ChevronDown,
    File as FileIcon,
    Folder,
    Plus,
    Trash2,
    Edit2,
    Circle,
} from 'react-feather';

export interface FolderSectionProps {
    folder: FileFolder;
    filteredFiles: File[];
    toggleFolder: (folder: FileFolder) => void;
    handleCreateFile: (folder: FileFolder, e: React.MouseEvent) => void;
    handleDragOver: (e: React.DragEvent<HTMLDivElement>, folder: FileFolder) => void;
    handleDrop: (e: React.DragEvent<HTMLDivElement>, folder: FileFolder) => void;
    handleDragStart: (e: React.DragEvent<HTMLDivElement>, fileId: string) => void;
    handleDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
    handleUpdateFile: (fileId: string, currentName: string, e: React.MouseEvent) => void;
    handleDeleteFile: (fileId: string, e: React.MouseEvent) => void;
    setActiveFile: (fileId: string) => void;
    activeFileId: string | null;
    openFolders: { [key in FileFolder]: boolean };
    draggedFile: string | null;
    dragOverFolder: FileFolder | null;
    searchQuery?: string;
}

export const FolderSection = ({
    folder,
    filteredFiles,
    toggleFolder,
    handleCreateFile,
    handleDragOver,
    handleDrop,
    handleDragStart,
    handleDragEnd,
    handleUpdateFile,
    handleDeleteFile,
    setActiveFile,
    activeFileId,
    openFolders,
    draggedFile,
    dragOverFolder,
}: FolderSectionProps) => {
    const isOpen = openFolders[folder];
    const folderFiles = filteredFiles.filter((file) => file.name.startsWith(`${folder}/`));

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

            {isOpen && folderFiles.length > 0 && (
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