"use client";
import React, { useState, useCallback, useEffect } from 'react';
import { Explorer } from './Explorer';
import { PanelType } from '@/types/panel.type';

interface SidePanelProps {
    activePanel: PanelType | null;
    width: number;
    onResize: (width: number) => void;
}

export const SidePanel = ({ activePanel, width, onResize }: SidePanelProps) => {
    const [isResizing, setIsResizing] = useState(false);

    // Resize handlers
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizing(true);
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isResizing) {
            const newWidth = Math.min(Math.max(e.clientX, 160), 480);
            onResize(newWidth);
        }
    }, [isResizing, onResize]);

    const handleMouseUp = useCallback(() => {
        setIsResizing(false);
    }, []);

    // Add mouse move and up listeners
    useEffect(() => {
        if (isResizing) {
            document.body.style.cursor = 'col-resize';
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            document.body.style.cursor = 'default';
        }

        return () => {
            document.body.style.cursor = 'default';
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing, handleMouseMove, handleMouseUp]);

    if (!activePanel) return null;

    const renderPanel = () => {
        switch (activePanel) {
            case 'explorer':
                return <Explorer />;
            case 'search':
                return <div className="p-4 text-white">Search Panel (Coming Soon)</div>;
            case 'git':
                return <div className="p-4 text-white">Git Panel (Coming Soon)</div>;
            case 'extensions':
                return <div className="p-4 text-white">Extensions Panel (Coming Soon)</div>;
            case 'compiler':
                return <div className="p-4 text-white">Compiler Panel (Coming Soon)</div>;
            case 'deployer':
                return <div className="p-4 text-white">Deployer Panel (Coming Soon)</div>;
            default:
                return null;
        }
    };

    return (
        <div className="relative flex h-full" style={{ width }}>
            <div className="flex-1 bg-[#252526] border-r border-[#3c3c3c] overflow-y-auto">
                {renderPanel()}
            </div>

            {/* Resize handle */}
            <div
                className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-600 active:bg-blue-600 z-10"
                onMouseDown={handleMouseDown}
            />
        </div>
    );
};