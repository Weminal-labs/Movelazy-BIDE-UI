"use client";
import React, { useCallback, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { Loader } from 'react-feather';
import { useWorkspaceStore } from '@/services/workspace';
import { getLanguageFromFileName } from '@/utils/fileUtils';

const CodeEditor = () => {
  const { files, activeFileId, updateFileContent, saveFile } = useWorkspaceStore();
  const activeFile = files.find(file => file.id === activeFileId);

  // Handle content changes
  const handleEditorChange = (value: string | undefined) => {
    if (activeFileId && value !== undefined) {
      updateFileContent(activeFileId, value);
    }
  };

  // Handle save command (Ctrl/Cmd + S)
  const handleSave = useCallback(() => {
    if (activeFileId) {
      saveFile(activeFileId);
    }
  }, [activeFileId, saveFile]);

  // Add keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  if (!activeFile) {
    return (
      <div className="h-full w-full flex items-center justify-center text-gray-400 bg-[#1e1e1e]">
        No file selected
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <MonacoEditor
        loading={
          <div className="h-full w-full flex items-center justify-center text-gray-400 bg-[#1e1e1e]">
            <Loader className="animate-spin" size={24} />
          </div>
        }
        height="100vh"
        defaultLanguage={getLanguageFromFileName(activeFile.name)}
        theme="vs-dark"
        value={activeFile.content}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          wordWrap: 'on',
          automaticLayout: true,
        }}
        onMount={(editor, monaco) => {
          editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
            handleSave();
          });
        }}
      />
      {activeFile.isDirty && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-[#252526] text-[#c5c5c5] text-xs rounded">
          Unsaved Changes
        </div>
      )}
    </div>
  );
};

export default CodeEditor;