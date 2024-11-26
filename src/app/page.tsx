"use client";

import CodeEditor from './components/CodeEditor';
import Workspace from './components/workspace';
import { useState } from 'react';

export default function Home() {
  const [code, setCode] = useState('// Start coding here!');

  return (
    <div className="h-screen flex">
      <div className="w-1/4 bg-gray-800 text-white p-4">
      </div>
      <div className="flex-1">
        <CodeEditor value={code} onChange={setCode} />
      </div>
    </div>
  );
}
