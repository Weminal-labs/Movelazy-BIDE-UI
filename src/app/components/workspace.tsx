"use client";

import React, { useState } from 'react';
import { useWorkspaceStore } from '../store/workspace';

const Workspace: React.FC = () => {
  const { files, activeFileId, setActiveFile, addFile } = useWorkspaceStore();
  const [isOpen, setIsOpen] = useState(true); // State to manage folder open/close

  const handleAddFile = () => {
    const name = prompt('Enter new file name:');
    if (name) {
      addFile(name, '// New file content');
    }
  };

  const toggleFolder = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="h-full bg-[#252526] text-gray-300 p-2">
      <div className="text-lg font-bold mb-2">Movelazy</div>
      <button
        onClick={handleAddFile}
        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded mb-2"
      >
        Add File
      </button>
      <div>
        <div onClick={toggleFolder} className="cursor-pointer">
          {isOpen ? '📂' : '📁'} Project Files
        </div>
        {isOpen && (
          <ul className="overflow-y-auto pl-4">
            {files.map((file) => (
              <li
                key={file.id}
                className={`p-2 cursor-pointer ${
                  file.id === activeFileId ? 'bg-blue-600' : 'hover:bg-gray-700'
                }`}
                onClick={() => setActiveFile(file.id)}
              >
                {file.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Workspace;
