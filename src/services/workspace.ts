import { create } from 'zustand';
import { File } from '@/types/file.type';
import { v4 as uuidv4 } from 'uuid';

interface WorkspaceState {
    files: File[];
    activeFileId: string | null;
    setActiveFile: (fileId: string) => void;
    addFile: (name: string) => void;
    addFileWithContent: (name: string, content: string) => void;
    deleteFile: (fileId: string) => void;
    updateFile: (fileId: string, newName: string) => void;
    updateFileContent: (fileId: string, content: string) => void;
    saveFile: (fileId: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
    files: [],
    activeFileId: null,

    setActiveFile: (fileId) => {
        set((state) => {
            if (!state.files.find((file) => file.id === fileId)) {
                console.warn(`File with ID ${fileId} not found`);
                return state;
            }
            return { activeFileId: fileId };
        });
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

    addFileWithContent(name, content) {
        const newFile = {
            id: uuidv4(),
            name: name,
            content: content,
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
        set((state) => {
            const remainingFiles = state.files.filter((file) => file.id !== fileId);
            const nextActiveFileId =
                state.activeFileId === fileId && remainingFiles.length > 0
                    ? remainingFiles[0].id
                    : null;

            return {
                files: remainingFiles,
                activeFileId: nextActiveFileId,
            };
        });
    },

    updateFile: (fileId, newName) => {
        set((state) => ({
            files: updateFileById(state.files, fileId, (file) => ({
                ...file,
                name: newName,
                updatedAt: new Date(),
            })),
        }));
    },

    updateFileContent: (fileId, content) => {
        set((state) => ({
            files: updateFileById(state.files, fileId, (file) => ({
                ...file,
                content,
                isDirty: file.content !== content,
            })),
        }));
    },

    saveFile: (fileId) => {
        set((state) => ({
            files: updateFileById(state.files, fileId, (file) => ({
                ...file,
                isDirty: false,
                updatedAt: new Date(),
            })),
        }));
    },
}));

const updateFileById = (
    files: File[],
    fileId: string,
    updateFn: (file: File) => File
): File[] => {
    return files.map((file) => (file.id === fileId ? updateFn(file) : file));
};
