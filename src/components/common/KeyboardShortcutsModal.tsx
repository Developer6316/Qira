import React from 'react';
import { 
  Keyboard, 
  X, 
  Search, 
  Navigation, 
  Zap, 
  Volume2, 
  Database, 
  Compass, 
  Shield, 
  BookOpen,
  HelpCircle,
  CornerDownLeft
} from 'lucide-react';
import { playClickSound, playSwooshSound } from '../../utils/soundEffects';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCommandPalette?: () => void;
}

interface ShortcutGroup {
  title: string;
  icon: any;
  shortcuts: {
    keys: string[];
    description: string;
    badge?: string;
  }[];
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  onOpenCommandPalette
}) => {
  if (!isOpen) return null;

  const shortcutGroups: ShortcutGroup[] = [
    {
      title: 'Navigation & Direct Tab Switching',
      icon: Navigation,
      shortcuts: [
        { keys: ['Ctrl', '1'], description: 'Jump to 1. Multimodal Ingestion Hub', badge: 'Materials' },
        { keys: ['Ctrl', '2'], description: 'Jump to 2. Concept Knowledge Graph', badge: 'Topology' },
        { keys: ['Ctrl', '3'], description: 'Jump to 3. Grounded Cognitive Tutor', badge: 'Tutor Chat' },
        { keys: ['Ctrl', '4'], description: 'Jump to 4. Adaptive Assessment Quiz', badge: 'Diagnostic' },
        { keys: ['Ctrl', '5'], description: 'Jump to 5. Root-Cause Remediation Flow', badge: 'Core' },
        { keys: ['Ctrl', '6'], description: 'Jump to 6. Chalkboard Video Studio', badge: 'Studio' },
        { keys: ['Ctrl', '7'], description: 'Jump to 7. Personalization & Mastery Dashboard', badge: 'BKT Analytics' },
        { keys: ['Ctrl', '8'], description: 'Jump to 8. Evaluation Benchmark Lab', badge: 'Admin Suite' }
      ]
    },
    {
      title: 'Search & Command Palette',
      icon: Search,
      shortcuts: [
        { keys: ['Ctrl', 'K'], description: 'Open Global Command Palette & Concept Search', badge: 'Primary' },
        { keys: ['⌘', 'K'], description: 'Open Command Palette (Mac)', badge: 'macOS' },
        { keys: ['↑', '↓'], description: 'Navigate search results and command suggestions' },
        { keys: ['↵ Enter'], description: 'Execute selected command or jump to topic' },
        { keys: ['Esc'], description: 'Dismiss modal or exit active dialog' }
      ]
    },
    {
      title: 'Power Tools & Quick Controls',
      icon: Zap,
      shortcuts: [
        { keys: ['?'], description: 'Toggle this Keyboard Shortcuts Cheatsheet', badge: 'Help' },
        { keys: ['Ctrl', '/'], description: 'Alternative hotkey for shortcuts cheat sheet' },
        { keys: ['Ctrl', 'M'], description: 'Toggle Sound Effects & Audio feedback', badge: 'Audio' },
        { keys: ['Ctrl', 'D'], description: 'Inspect Internal Embedded Database (user_database.json)', badge: 'DB' },
        { keys: ['Ctrl', 'T'], description: 'Launch 5-Step Hackathon Demo Tour Walkthrough', badge: 'Tour' },
        { keys: ['Ctrl', 'Shift', 'A'], description: 'Switch to Faculty Admin Console (PIN: 6316)', badge: 'Faculty' }
      ]
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Keyboard Shortcuts & Power Controls</span>
                <span className="text-[11px] font-mono font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded-full">
                  ACCESSIBILITY
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Speed up your workflow and study sessions with global hotkeys
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close shortcuts modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {shortcutGroups.map((group, gIdx) => {
            const GroupIcon = group.icon;

            return (
              <div key={gIdx} className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <GroupIcon className="w-4 h-4 text-indigo-500" />
                  <span>{group.title}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {group.shortcuts.map((sc, sIdx) => (
                    <div
                      key={sIdx}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors"
                    >
                      <div className="pr-3 truncate">
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {sc.description}
                        </div>
                        {sc.badge && (
                          <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                            {sc.badge}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {sc.keys.map((k, kIdx) => (
                          <React.Fragment key={kIdx}>
                            <kbd className="px-2 py-1 text-xs font-mono font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 shadow-2xs min-w-[24px] text-center">
                              {k}
                            </kbd>
                            {kIdx < sc.keys.length - 1 && (
                              <span className="text-slate-400 text-xs font-bold">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-100/70 dark:bg-slate-950/70 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-medium">Tip: Press</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono font-bold shadow-2xs">Ctrl</kbd>
            <span>+</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono font-bold shadow-2xs">K</kbd>
            <span>anytime to search concepts and trigger actions.</span>
          </div>

          {onOpenCommandPalette && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenCommandPalette();
              }}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Open Command Palette</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
