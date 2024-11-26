'use client';

import { useState } from 'react';

export interface FileNode {
  name: string;
  type: 'file' | 'directory';
  children?: FileNode[];
}

interface FileTreeProps {
  files: FileNode[];
  onFileSelect: (path: string) => void;
  level?: number;
}

export default function FileTree({ 
  files, 
  onFileSelect, 
  level = 0 
}: FileTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (name: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(name)) {
      newExpanded.delete(name);
    } else {
      newExpanded.add(name);
    }
    setExpandedFolders(newExpanded);
  };

  return (
    <div style={{ paddingLeft: level * 12 }}>
      {files.map((file) => (
        <div key={file.name}>
          <div
            className="flex items-center py-1 px-2 hover:bg-[#2a2d2e] rounded cursor-pointer"
            onClick={() => {
              if (file.type === 'directory') {
                toggleFolder(file.name);
              } else {
                onFileSelect(file.name);
              }
            }}
          >
            {/* Icon có thể thêm sau */}
            <span className="text-sm">{file.name}</span>
          </div>
          
          {file.type === 'directory' && 
           expandedFolders.has(file.name) && 
           file.children && (
            <FileTree
              files={file.children}
              onFileSelect={onFileSelect}
              level={level + 1}
            />
          )}
        </div>
      ))}
    </div>
  );
}