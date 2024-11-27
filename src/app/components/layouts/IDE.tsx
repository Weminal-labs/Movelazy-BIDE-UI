'use client';

import { useState } from 'react';
import Workspace from '../workspace';
import CodeEditor from '../CodeEditor';
import { useWorkspaceStore } from '../../store/workspace';

export default function IDE() {
  const { files, activeFileId, updateFileContent } = useWorkspaceStore();
  const [code, setCode] = useState('// Start coding here!');

  const activeFile = files.find((file) => file.id === activeFileId);

  const handleFileChange = (value: string) => {
    if (activeFileId) {
      updateFileContent(activeFileId, value);
    }
  };

  return (
    <div className="flex h-screen bg-[#1e1e1e]">
      {/* Workspace sidebar */}
      <div className="w-64 border-r border-gray-800">
        <Workspace />
      </div>
      
      {/* Editor area */}
      <div className="flex-1">
        <CodeEditor 
          value={activeFile ? activeFile.content : code} 
          onChange={handleFileChange} 
        />
      </div>
    </div>
  );
}