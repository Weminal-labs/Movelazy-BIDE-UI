import React from 'react';
import MonacoEditor from '@monaco-editor/react';

const CodeEditor: React.FC<{ value: string; onChange: (value: string) => void }> = ({ value, onChange }) => {
  return (
    <MonacoEditor
      height="100vh"
      defaultLanguage="javascript"
      theme="vs-dark"
      value={value}
      onChange={(value) => onChange(value || '')}
    />
  );
};

export default CodeEditor;
