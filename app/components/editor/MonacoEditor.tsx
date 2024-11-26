'use client';

import { useRef } from 'react';
import * as Monaco from 'monaco-editor';
import { Editor } from '@monaco-editor/react';

interface MonacoEditorProps {
  path: string | null;
  defaultLanguage: string;
  theme: 'vs-dark' | 'light';
}

export default function MonacoEditor({ 
  path, 
  defaultLanguage, 
  theme 
}: MonacoEditorProps) {
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount = (editor: Monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
  };

  return (
    <Editor
      height="100vh"
      defaultLanguage={defaultLanguage}
      theme={theme}
      path={path || undefined}
      onMount={handleEditorDidMount}
      options={{
        minimap: { enabled: true },
        fontSize: 14,
        fontFamily: 'var(--font-geist-mono)',
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
    />
  );
}