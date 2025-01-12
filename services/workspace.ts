import { create } from 'zustand';
import { File } from '@/types/file.type';
import { v4 as uuidv4 } from 'uuid';

interface WorkspaceState {
    files: File[];
    activeFileId: string | null;
    setActiveFile: (fileId: string) => void;
    addFile: (name: string) => void;
    deleteFile: (fileId: string) => void;
    updateFile: (fileId: string, newName: string) => void;
    updateFileContent: (fileId: string, content: string) => void;
    saveFile: (fileId: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
    files: [],
    activeFileId: null,

    setActiveFile: (fileId) => {
        set({ activeFileId: fileId });
    },

    addFile: (name) => {
        const newFile: File = {
            id: uuidv4(),
            name,
            content: '',
            createdAt: new Date(),
            updatedAt: new Date(),
            isDirty: false,
        };

        set((state) => ({
            files: [...state.files, newFile],
            activeFileId: newFile.id,
        }));
    },

    deleteFile: (fileId) => {
        set((state) => ({
            files: state.files.filter((file) => file.id !== fileId),
            // If active file is deleted, clear active file
            activeFileId: state.activeFileId === fileId ? null : state.activeFileId,
        }));
    },

    updateFile: (fileId, newName) => {
        set((state) => ({
            files: state.files.map((file) =>
                file.id === fileId
                    ? {
                        ...file,
                        name: newName,
                        updatedAt: new Date(),
                    }
                    : file
            ),
        }));
    },

    updateFileContent: (fileId, content) => {
        set((state) => ({
            files: state.files.map((file) =>
                file.id === fileId
                    ? {
                        ...file,
                        content,
                        isDirty: true,
                    }
                    : file
            ),
        }));
    },

    saveFile: (fileId) => {
        set((state) => ({
            files: state.files.map((file) =>
                file.id === fileId
                    ? {
                        ...file,
                        isDirty: false,
                        updatedAt: new Date(),
                    }
                    : file
            ),
        }));
    },
}));