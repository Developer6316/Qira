import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  BookOpen, 
  Network, 
  MessageSquare, 
  CheckSquare, 
  Sparkles, 
  Video, 
  BarChart3, 
  Shield, 
  Database, 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  User, 
  LogIn, 
  FileText, 
  ArrowRight, 
  CornerDownLeft, 
  X,
  Compass,
  Zap,
  Tag
} from 'lucide-react';
import { ActiveTab } from './Header';
import { CONCEPT_NODES } from '../../data/conceptGraph';
import { IngestedMaterial, SourceCitation, UserRole, UserProfile } from '../../types';
import { playClickSound, playSwooshSound } from '../../utils/soundEffects';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenCitation: (citation: SourceCitation) => void;
  onOpenDemoTour: () => void;
  onOpenDatabaseInspector: () => void;
  onOpenShortcutsModal: () => void;
  onToggleMute: () => void;
  isMuted: boolean;
  onSelectStudent: (studentId: string) => void;
  onRequestAdminAuth?: (actionName?: string) => void;
  userRole?: UserRole;
  currentUser?: UserProfile | null;
  onOpenAuth?: (mode?: 'login' | 'signup') => void;
  materials: IngestedMaterial[];
}

interface PaletteItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Navigation' | 'Concepts & Topics' | 'Materials & Sources' | 'Quick Actions';
  icon: any;
  badge?: string;
  shortcut?: string;
  action: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onOpenCitation,
  onOpenDemoTour,
  onOpenDatabaseInspector,
  onOpenShortcutsModal,
  onToggleMute,
  isMuted,
  onSelectStudent,
  onRequestAdminAuth,
  userRole,
  currentUser,
  onOpenAuth,
  materials
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-focus on open and reset state
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Build items list
  const allItems: PaletteItem[] = [
    // 1. Navigation Tabs (Ctrl+1 to Ctrl+8)
    {
      id: 'tab-ingest',
      title: 'Multimodal Ingestion Hub',
      subtitle: 'Upload textbooks, lecture transcripts, and slide decks',
      category: 'Navigation',
      icon: BookOpen,
      shortcut: 'Ctrl+1',
      badge: 'Step 1',
      action: () => {
        onSelectTab('ingest');
        onClose();
      }
    },
    {
      id: 'tab-graph',
      title: 'Concept Knowledge Graph',
      subtitle: 'Explore Bayesian prerequisite dependencies and mastery topology',
      category: 'Navigation',
      icon: Network,
      shortcut: 'Ctrl+2',
      badge: 'Step 2',
      action: () => {
        onSelectTab('graph');
        onClose();
      }
    },
    {
      id: 'tab-tutor',
      title: 'Grounded Cognitive Tutor',
      subtitle: 'Ask physics questions with verified textbook citations & speech-to-text',
      category: 'Navigation',
      icon: MessageSquare,
      shortcut: 'Ctrl+3',
      badge: 'Step 3',
      action: () => {
        onSelectTab('tutor');
        onClose();
      }
    },
    {
      id: 'tab-quiz',
      title: 'Adaptive Assessment & Quiz Engine',
      subtitle: 'Diagnostic questions that isolate misconceptions in real-time',
      category: 'Navigation',
      icon: CheckSquare,
      shortcut: 'Ctrl+4',
      badge: 'Step 4',
      action: () => {
        onSelectTab('quiz');
        onClose();
      }
    },
    {
      id: 'tab-remediation',
      title: 'Root-Cause Remediation Flow',
      subtitle: 'Targeted Bayesian remediation for prerequisite gaps',
      category: 'Navigation',
      icon: Sparkles,
      shortcut: 'Ctrl+5',
      badge: 'Core Feature',
      action: () => {
        onSelectTab('remediation');
        onClose();
      }
    },
    {
      id: 'tab-video-studio',
      title: 'Chalkboard Video Studio',
      subtitle: 'AI-synthesized chalkboard lectures with animated audio professor',
      category: 'Navigation',
      icon: Video,
      shortcut: 'Ctrl+6',
      badge: 'Studio',
      action: () => {
        onSelectTab('video-studio');
        onClose();
      }
    },
    {
      id: 'tab-dashboard',
      title: 'Personalization & Mastery Dashboard',
      subtitle: 'Bayesian Knowledge Tracing (BKT) analytics & printable reports',
      category: 'Navigation',
      icon: BarChart3,
      shortcut: 'Ctrl+7',
      badge: 'Analytics',
      action: () => {
        onSelectTab('dashboard');
        onClose();
      }
    },
    {
      id: 'tab-evaluation',
      title: 'Evaluation Benchmark Lab',
      subtitle: 'Faithfulness, RAG triad hallucination metrics, and test cases',
      category: 'Navigation',
      icon: Shield,
      shortcut: 'Ctrl+8',
      badge: 'Admin / Faculty',
      action: () => {
        onSelectTab('evaluation');
        onClose();
      }
    },

    // 2. Physics Concepts
    ...CONCEPT_NODES.map((node) => ({
      id: `concept-${node.id}`,
      title: node.name,
      subtitle: `${node.topic} • ${node.chapter} • ${node.coreFormulas.join(', ')}`,
      category: 'Concepts & Topics' as const,
      icon: Zap,
      badge: `Tier ${node.tier}`,
      action: () => {
        onSelectTab('graph');
        onClose();
      }
    })),

    // 3. Materials & Textbooks
    ...materials.map((mat) => ({
      id: `mat-${mat.id}`,
      title: mat.title,
      subtitle: `${mat.type.toUpperCase()} • ${(mat.topicsCovered || []).join(', ')} • ${mat.pageCount ? `${mat.pageCount} pages` : mat.duration || 'Document'}`,
      category: 'Materials & Sources' as const,
      icon: FileText,
      badge: mat.status,
      action: () => {
        onOpenCitation({
          id: `cit-${mat.id}`,
          sourceId: mat.id,
          sourceTitle: mat.title,
          sourceType: mat.type,
          pageNumber: mat.pageCount ? 1 : undefined,
          timestamp: mat.duration ? '00:00' : undefined,
          snippet: mat.summary || 'Grounded source document for course concepts.',
          confidence: 0.98
        });
        onClose();
      }
    })),

    // 4. Quick Actions
    {
      id: 'act-tour',
      title: 'Launch 5-Step Demo Tour',
      subtitle: 'Interactive guided tour of the key grounded learning innovations',
      category: 'Quick Actions',
      icon: Compass,
      shortcut: 'Ctrl+T',
      badge: 'Guided Walkthrough',
      action: () => {
        onOpenDemoTour();
        onClose();
      }
    },
    {
      id: 'act-db',
      title: 'Inspect Internal Database (data/user_database.json)',
      subtitle: 'View persistent JSON records, active users, and mastery snapshots',
      category: 'Quick Actions',
      icon: Database,
      shortcut: 'Ctrl+D',
      badge: 'Database',
      action: () => {
        onOpenDatabaseInspector();
        onClose();
      }
    },
    {
      id: 'act-shortcuts',
      title: 'Keyboard Shortcuts Guide',
      subtitle: 'View full cheat sheet of keyboard hotkeys and productivity shortcuts',
      category: 'Quick Actions',
      icon: HelpCircle,
      shortcut: '?',
      badge: 'Cheat Sheet',
      action: () => {
        onOpenShortcutsModal();
        onClose();
      }
    },
    {
      id: 'act-mute',
      title: isMuted ? 'Unmute Sound Effects & Audio' : 'Mute Sound Effects & Audio',
      subtitle: 'Toggle tactile UI sound feedback on buttons and actions',
      category: 'Quick Actions',
      icon: isMuted ? Volume2 : VolumeX,
      shortcut: 'Ctrl+M',
      badge: isMuted ? 'Muted' : 'Active',
      action: () => {
        onToggleMute();
        onClose();
      }
    },
    {
      id: 'act-persona-shahul',
      title: 'Switch to Shahul (Prerequisite Gap Identified - 42%)',
      subtitle: 'Simulate learner with kinematics acceleration gap for Newton 2 remediation',
      category: 'Quick Actions',
      icon: User,
      badge: 'Learner Persona',
      action: () => {
        onSelectStudent('sim-student-b');
        onClose();
      }
    },
    {
      id: 'act-persona-alex',
      title: 'Switch to Alex (High Prior Mastery - 81%)',
      subtitle: 'Simulate advanced learner with strong kinematics foundation',
      category: 'Quick Actions',
      icon: User,
      badge: 'Learner Persona',
      action: () => {
        onSelectStudent('sim-student-a');
        onClose();
      }
    },
    {
      id: 'act-persona-maya',
      title: 'Switch to Maya (Misconception Prone - 46%)',
      subtitle: 'Simulate student with common friction & normal force misconceptions',
      category: 'Quick Actions',
      icon: User,
      badge: 'Learner Persona',
      action: () => {
        onSelectStudent('sim-student-c');
        onClose();
      }
    },
    {
      id: 'act-auth-login',
      title: currentUser ? `Switch Account (Signed in as ${currentUser.name})` : 'Log In to Account',
      subtitle: 'Access saved mastery progress and personalized video lectures',
      category: 'Quick Actions',
      icon: LogIn,
      badge: 'Auth Portal',
      action: () => {
        onOpenAuth?.('login');
        onClose();
      }
    },
    {
      id: 'act-auth-signup',
      title: 'Create Free Account',
      subtitle: 'Register new academic profile and save sessions to internal database',
      category: 'Quick Actions',
      icon: LogIn,
      badge: 'Register',
      action: () => {
        onOpenAuth?.('signup');
        onClose();
      }
    },
    {
      id: 'act-admin-toggle',
      title: userRole === 'admin' ? 'Switch to Learner View' : 'Switch to Faculty Admin View (PIN: 6316)',
      subtitle: 'Unlock textbook ingestion, rubric scoring, and benchmark evaluation suites',
      category: 'Quick Actions',
      icon: Shield,
      shortcut: 'Ctrl+Shift+A',
      badge: 'Privileged',
      action: () => {
        if (onRequestAdminAuth) {
          onRequestAdminAuth('Admin Switch');
        }
        onClose();
      }
    }
  ];

  // Filter items by search query
  const cleanQuery = query.toLowerCase().trim();
  const filteredItems = allItems.filter((item) => {
    if (!cleanQuery) return true;
    return (
      item.title.toLowerCase().includes(cleanQuery) ||
      item.subtitle?.toLowerCase().includes(cleanQuery) ||
      item.category.toLowerCase().includes(cleanQuery) ||
      item.badge?.toLowerCase().includes(cleanQuery) ||
      item.shortcut?.toLowerCase().includes(cleanQuery)
    );
  });

  // Keep selected index in bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  // Keydown handler inside modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = filteredItems[selectedIndex];
      if (item) {
        playClickSound();
        item.action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 gap-3">
          <Search className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, concept (e.g. Newton, Acceleration), or jump to tab..."
            className="flex-1 bg-transparent text-sm sm:text-base font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-1 text-[11px] font-mono font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 dark:text-slate-400 shadow-2xs">
            ESC
          </kbd>
        </div>

        {/* Categories / Results List */}
        <div 
          ref={listRef}
          className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-slate-100 dark:divide-slate-800/60"
        >
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
              <Compass className="w-10 h-10 mx-auto text-slate-400 dark:text-slate-600 mb-2 animate-bounce" />
              <p className="text-sm font-semibold">No commands or concepts found for "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for "Remediation", "Newton", "Quiz", or "Tour"</p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    playClickSound();
                    item.action();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-950 dark:text-indigo-100 border border-indigo-200 dark:border-indigo-800/80 shadow-xs'
                      : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/50 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-xl shrink-0 ${
                      isSelected 
                        ? 'bg-indigo-600 text-white shadow-xs' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold truncate">{item.title}</span>
                        {item.badge && (
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md font-semibold ${
                            isSelected
                              ? 'bg-indigo-200/60 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.subtitle && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {item.shortcut && (
                      <kbd className="hidden sm:inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 shadow-2xs">
                        {item.shortcut}
                      </kbd>
                    )}
                    {isSelected && (
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 font-mono">
                        <span className="hidden sm:inline">Select</span>
                        <CornerDownLeft className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="px-4 py-2.5 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-2xs font-bold">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-2xs font-bold">↓</kbd>
              <span>navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-2xs font-bold">↵</kbd>
              <span>select</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline">Press</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-2xs font-bold">?</kbd>
            <span className="hidden sm:inline">for shortcuts cheat sheet</span>
          </div>
        </div>
      </div>
    </div>
  );
};
