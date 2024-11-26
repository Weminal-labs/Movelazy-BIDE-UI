'use client';

import FileTree, { FileNode } from './FileTree';

interface FileExplorerProps {
  onFileSelect: (path: string) => void;
}

export default function FileExplorer({ onFileSelect }: FileExplorerProps) {
  const initialFiles: FileNode[] = [
    {
      name: 'src',
      type: 'directory',
      children: [
        { name: 'index.ts', type: 'file' },
        { name: 'types.ts', type: 'file' },
      ],
    },
    { name: 'package.json', type: 'file' },
    { name: 'README.md', type: 'file' },
  ];

  return (
    <div className="h-full bg-[#252526] text-gray-300 p-2">
      <div className="text-sm font-medium mb-2">EXPLORER</div>
      <FileTree files={initialFiles} onFileSelect={onFileSelect} />
    </div>
  );
}