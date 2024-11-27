import { create } from 'zustand';

// Định nghĩa kiểu dữ liệu của file
interface File {
  id: string; // ID duy nhất
  name: string; // Tên file
  content: string; // Nội dung file
}

interface WorkspaceState {
  files: File[]; // Danh sách file
  activeFileId: string | null; // File đang mở
  setActiveFile: (id: string) => void; // Chọn file để mở
  addFile: (name: string, content: string) => void; // Thêm file mới
  updateFileContent: (id: string, content: string) => void; // Cập nhật nội dung file
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  files: [
    { id: '1', name: 'file1.js', content: '// File 1 content' },
    { id: '2', name: 'file2.ts', content: '// File 2 content' },
  ],
  activeFileId: null,
  setActiveFile: (id) => set({ activeFileId: id }),
  addFile: (name, content) =>
    set((state) => ({
      files: [...state.files, { id: Math.random().toString(), name, content }],
    })),
  updateFileContent: (id, content) =>
    set((state) => ({
      files: state.files.map((file) =>
        file.id === id ? { ...file, content } : file
      ),
    })),
}));
