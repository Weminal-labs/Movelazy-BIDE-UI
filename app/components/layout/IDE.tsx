'use client';

import { useState } from 'react';
import FileExplorer from '../workspace/FileExplorer';
import MonacoEditor from '../editor/MonacoEditor';

export default function IDE() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  return (
    <div className="flex h-screen bg-[#1e1e1e]">
      {/* Workspace sidebar */}
      <div className="w-64 border-r border-gray-800">
        <FileExplorer onFileSelect={setSelectedFile} />
      </div>
      
      {/* Editor area */}
      <div className="flex-1">
        <MonacoEditor 
          path={selectedFile} 
          defaultLanguage="typescript"
          theme="vs-dark"
        />
      </div>
    </div>
  );
}