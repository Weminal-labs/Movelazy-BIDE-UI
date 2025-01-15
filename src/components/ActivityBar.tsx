"use client";
import React from 'react';
import { FileText, Search, GitBranch, Package } from 'react-feather';
import { PanelType } from '@/types/panel.type';

interface ActivityBarProps {
    activePanel: PanelType | null;
    onPanelChange: (panel: PanelType) => void;
}

export const ActivityBar = ({ activePanel, onPanelChange }: ActivityBarProps) => {
    const panels: { id: PanelType; icon: React.ReactNode; title: string }[] = [
        { id: 'explorer', icon: <FileText size={24} />, title: 'Explorer' },
        { id: 'search', icon: <Search size={24} />, title: 'Search' },
        { id: 'git', icon: <GitBranch size={24} />, title: 'Source Control' },
        { id: 'extensions', icon: <Package size={24} />, title: 'Extensions' },
        {
            id: 'compiler', icon: (
                <img
                    src="/code.png"
                    width={24}
                    height={24}
                    alt="Deployer"
                    className="text-[#858585] group-hover:text-white"
                />
            ), title: 'Compiler'
        },
        {
            id: 'deployer', icon: (
                <img
                    src="/logo.png"
                    width={24}
                    height={24}
                    alt="Deployer"
                    className="text-[#858585] group-hover:text-white"
                />
            ), title: 'Deployer'
        }
    ];

    return (
        <div className="w-12 h-full bg-[#333333] flex flex-col items-center py-2">
            {panels.map((panel) => (
                <button
                    key={panel.id}
                    onClick={() => onPanelChange(panel.id)}
                    className={`w-12 h-12 flex items-center justify-center text-[#858585] hover:text-white
            ${activePanel === panel.id ? 'text-white border-l-2 border-white' : ''}`}
                    title={panel.title}
                >
                    {panel.icon}
                </button>
            ))}
        </div>
    );
};