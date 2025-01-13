'use client';
import React from 'react';
import { Explorer } from '../Explorer';
import CodeEditor from '../CodeEditor';

export default function IDE() {
  return (
    <div className="flex h-screen bg-[#1e1e1e]">
      <Explorer />
      <div className="flex-1">
        <CodeEditor />
      </div>
    </div>
  );
}