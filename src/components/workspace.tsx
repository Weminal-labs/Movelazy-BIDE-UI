"use client";

import React, { useState } from 'react';
import { useWorkspaceStore } from '../store/workspace';

const Workspace: React.FC = () => {
  const { files, activeFileId, setActiveFile } = useWorkspaceStore();
  const [openFolders, setOpenFolders] = useState<{ [key: string]: boolean }>({
    contracts: false,
    scripts: false,
    tests: false,
  });

  const toggleFolder = (folder: string) => {
    setOpenFolders((prev) => ({ ...prev, [folder]: !prev[folder] }));
  };

  return (
    <div className="h-full bg-[#252526] text-gray-300 p-2">
      <div className="text-lg font-bold mb-2">Movelazy</div>
      <div>
        {/* Contracts Folder */}
        <div onClick={() => toggleFolder('contracts')} className="cursor-pointer">
          {openFolders.contracts ? '📂' : '📁'} Contracts
        </div>
        {openFolders.contracts && (
          <ul className="overflow-y-auto pl-4">
            {files
              .filter(file => file.name.startsWith('contracts/'))
              .map((file) => (
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

        {/* Scripts Folder */}
        <div onClick={() => toggleFolder('scripts')} className="cursor-pointer">
          {openFolders.scripts ? '📂' : '📁'} Scripts
        </div>
        {openFolders.scripts && (
          <ul className="overflow-y-auto pl-4">
            {files
              .filter(file => file.name.startsWith('scripts/'))
              .map((file) => (
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

        {/* Tests Folder */}
        <div onClick={() => toggleFolder('tests')} className="cursor-pointer">
          {openFolders.tests ? '📂' : '📁'} Tests
        </div>
        {openFolders.tests && (
          <ul className="overflow-y-auto pl-4">
            {files
              .filter(file => file.name.startsWith('tests/'))
              .map((file) => (
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
