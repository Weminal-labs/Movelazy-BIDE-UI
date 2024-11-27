"use client";

import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';

const TerminalComponent: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const terminal = useRef<Terminal | null>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminal.current = new Terminal();
      terminal.current.open(terminalRef.current);
      terminal.current.write('Welcome to the integrated terminal!\r\n');
    }

    return () => {
      terminal.current?.dispose();
    };
  }, []);

  return <div ref={terminalRef} style={{ height: '100%', width: '100%' }} />;
};

export default TerminalComponent; 