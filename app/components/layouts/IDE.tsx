'use client';

import { Explorer } from '../Explorer';
import CodeEditor from '../CodeEditor';

export default function IDE() {
  return (
    <div className="flex h-screen bg-[#1e1e1e]">
      {/* Explorer sidebar */}
      <div className="w-64 border-r border-gray-800">
        <Explorer />
      </div>

      {/* Editor area */}
      <div className="flex-1 flex flex-col">
        <CodeEditor />
      </div>
    </div>
  );
}