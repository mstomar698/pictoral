import React, { useEffect } from 'react';

export function useEditorKeyboardShortcuts(handlers: {
  onUndo: () => void;
  onRedo: () => void;
}): void {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.key === 'z' || e.key === 'Z') {
        e.preventDefault();
        if (e.shiftKey) handlers.onRedo();
        else handlers.onUndo();
      } else if (e.key === 'y' || e.key === 'Y') {
        e.preventDefault();
        handlers.onRedo();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handlers]);
}
