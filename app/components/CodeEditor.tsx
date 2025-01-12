"use client";
import React from 'react';
import MonacoEditor from '@monaco-editor/react';
import { useWorkspaceStore } from '@/services/workspace';
import { getLanguageFromFileName } from '@/utils/fileUtils';
const CodeEditor = () => {
  const { files, activeFileId, updateFileContent } = useWorkspaceStore();

  // Find the active file
  const activeFile = files.find(file => file.id === activeFileId);

  // Handle content changes
  const handleEditorChange = (value: string | undefined) => {
    if (activeFileId && value !== undefined) {
      updateFileContent(activeFileId, value);
    }
  };

  if (!activeFile) {
    return (
      <div className="h-full w-full flex items-center justify-center text-gray-400 bg-[#1e1e1e]">
        No file selected
      </div>
    );
  }

  return (
    <MonacoEditor
      height="100vh"
      defaultLanguage={getLanguageFromFileName(activeFile.name)} // Detect file type
      theme="vs-dark"
      value={activeFile.content}
      onChange={handleEditorChange}
      options={{
        minimap: { enabled: true },
        fontSize: 14,
        wordWrap: 'on',
        automaticLayout: true,
      }}
    />
  );
};

export default CodeEditor;