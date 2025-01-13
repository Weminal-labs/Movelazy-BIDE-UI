'use client';
import React, { useState } from 'react';
import { ActivityBar } from './ActivityBar';
import { SidePanel } from './SidePanel';
import CodeEditor from './CodeEditor';
import { PanelType } from '@/types/panel.type';

export default function IDE() {
  const [activePanel, setActivePanel] = useState<PanelType | null>('explorer');
  const [sidePanelWidth, setSidePanelWidth] = useState(240);

  const handlePanelChange = (panel: PanelType) => {
    setActivePanel(activePanel === panel ? null : panel);
  };

  return (
    <div className="flex h-screen bg-[#1e1e1e]">
      <ActivityBar
        activePanel={activePanel}
        onPanelChange={handlePanelChange}
      />
      {activePanel && (
        <SidePanel
          activePanel={activePanel}
          width={sidePanelWidth}
          onResize={setSidePanelWidth}
        />
      )}
      <div className="flex-1">
        <CodeEditor />
      </div>
    </div>
  );
}