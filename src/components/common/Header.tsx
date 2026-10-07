import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  BookOpen, 
  Network, 
  MessageSquareQuote, 
  CheckSquare, 
  GitBranch, 
  BarChart3, 
  FlaskConical, 
  Sparkles,
  PlayCircle,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  User,
  Layers,
  ArrowRight,
  ShieldAlert,
  SlidersHorizontal,
  GraduationCap,
  Shield,
  HelpCircle,
  Compass,
  Video,
  Volume2,
  VolumeX,
  LogIn,
  UserPlus,
  LogOut
} from 'lucide-react';
import { UserRole, UserProfile } from '../../types';
import { isAudioMuted, toggleAudioMuted, playClickSound, playSwooshSound } from '../../utils/soundEffects';

export type ActiveTab = 
  | 'ingest' 
  | 'graph' 
  | 'tutor' 
  | 'quiz' 
  | 'remediation' 
  | 'video-studio'
  | 'dashboard' 
  | 'evaluation';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenDemoTour: () => void;
  selectedStudent: string;
  onSelectStudent: (studentId: string) => void;
  remediationStageActive: boolean;
  userRole?: UserRole;
  onSelectRole?: (role: UserRole) => void;
  isAdminAuthenticated?: boolean;
  onRequestAdminAuth?: (actionName?: string) => void;
  currentUser?: UserProfile | null;
  onOpenAuth?: (mode?: 'login' | 'signup') => void;
  onSignOut?: () => void;
}

interface NavGroup {
  id: string;
  label: string;
  icon: any;
  items: {
    id: ActiveTab;
    label: string;
    description: string;
    icon: any;
    badge?: string;
    highlight?: boolean;
    adminOnly?: boolean;
  }[];
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenDemoTour,
  selectedStudent,
  onSelectStudent,
  remediationStageActive,
  userRole = 'learner',
  onSelectRole,
  isAdminAuthenticated = false,
  onRequestAdminAuth,
  currentUser,
  onOpenAuth,
  onSignOut
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMuted, setIsMuted] = useState(isAudioMuted());
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleToggleMute = () => {
    const next = toggleAudioMuted();
    setIsMuted(next);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scrolling when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navGroups: NavGroup[] = [
    {
      id: 'study',
      label: 'Study & Knowledge',
      icon: BookOpen,
      items: [
        {
          id: 'ingest',
          label: '1. Multimodal Ingestion',
          description: 'Upload textbooks, video transcripts, and custom slides',
          icon: BookOpen,
          badge: 'Materials'
        },
        {
          id: 'graph',
          label: '2. Concept Knowledge Graph',
          description: 'Prerequisite DAG with 9 mechanics competency nodes',
          icon: Network,
          badge: '9 Nodes'
        }
      ]
    },
    {
      id: 'tutoring',
      label: 'Tutoring & Practice',
      icon: MessageSquareQuote,
      items: [
        {
          id: 'tutor',
          label: '3. Grounded Tutor Chat',
          description: 'Verified sentence claims and anti-hallucination refusal',
          icon: MessageSquareQuote,
          badge: 'Verified'
        },
        {
          id: 'quiz',
          label: '4. Adaptive Quiz Engine',
          description: 'Bayesian knowledge tracing with real-time diagnostics',
          icon: CheckSquare
        },
        {
          id: 'remediation',
          label: '5. Root-Cause Remediation',
          description: 'Prerequisite gap backtracking and targeted mini-lessons',
          icon: GitBranch,
          highlight: true,
          badge: remediationStageActive ? 'ACTIVE LOOP' : 'Demo 4'
        },
        {
          id: 'video-studio',
          label: '🎥 AI Video Lecture Studio',
          description: 'Synthesize synchronized chalkboard videos with narration',
          icon: PlayCircle,
          badge: 'AI Studio'
        }
      ]
    },
    {
      id: 'analytics',
      label: userRole === 'admin' ? 'Admin & Scientific Proof' : 'Analytics & Proof',
      icon: BarChart3,
      items: [
        {
          id: 'dashboard',
          label: userRole === 'admin' ? '6. Cohort & Mastery Matrix' : '6. Personalization Dashboard',
          description: 'Bayesian mastery progress, cohort risk radar, and action plan',
          icon: BarChart3
        },
        {
          id: 'evaluation',
          label: '7. Scientific Eval Lab',
          description: 'RAGAS benchmark scores (Faithfulness 0.948) & cohort simulations',
          icon: FlaskConical,
          badge: 'RAGAS 0.94'
        }
      ]
    }
  ];

  const allItems = navGroups.flatMap(g => g.items);

  // Find active group
  const activeGroup = navGroups.find(group => 
    group.items.some(item => item.id === activeTab)
  );

  const activeItem = allItems.find(item => item.id === activeTab);

  const handleSwitchToAdmin = (actionName?: string) => {
    if (!isAdminAuthenticated) {
      onRequestAdminAuth?.(actionName || 'Admin Console');
    } else {
      onSelectRole?.('admin');
    }
  };

  // Quick bottom bar tabs on mobile
  const bottomBarTabs = [
    { id: 'ingest' as ActiveTab, label: 'Study', icon: BookOpen },
    { id: 'tutor' as ActiveTab, label: 'Tutor', icon: MessageSquareQuote },
    { id: 'remediation' as ActiveTab, label: 'Remediate', icon: GitBranch, highlight: true },
    { id: 'video-studio' as ActiveTab, label: 'Video', icon: Video },
    { id: 'dashboard' as ActiveTab, label: 'Mastery', icon: BarChart3 }
  ];

  // Mobile Drawer Portal rendered directly into document.body to avoid backdrop-blur containment
  const mobileDrawerPortal = isMounted && mobileMenuOpen ? createPortal(
    <div className="fixed inset-0 z-[99999] flex justify-end animate-in fade-in duration-150">
      {/* Dark Backdrop Overlay with click-to-dismiss */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Drawer Panel Sliding in from Right */}
      <div className="relative w-full max-w-xs sm:max-w-sm h-full bg-white shadow-2xl flex flex-col justify-between overflow-y-auto z-10 border-l border-slate-200">
        <div className="p-6 space-y-6">
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-base shadow-md shadow-indigo-500/20">
                Q
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">QIRA Navigation</h3>
                <p className="text-[11px] font-mono text-slate-500 font-medium">
                  {userRole === 'admin' ? '🛡️ Admin Console' : '👨‍🎓 Learner Mode'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Role Switcher (Learner vs Admin) */}
          {onSelectRole && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono text-slate-500 uppercase font-bold">Access Level</label>
                {isAdminAuthenticated ? (
                  <span className="text-[10px] font-mono text-emerald-600 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Authenticated
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-amber-600 font-bold flex items-center gap-1">
                    PIN: 6316 Protected
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => onSelectRole('learner')}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    userRole === 'learner'
                      ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  <span>Learner</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchToAdmin('Admin Navigation')}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    userRole === 'admin'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin {!isAdminAuthenticated && '🔒'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Active Student Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-slate-500 uppercase font-bold">Active Student Profile</label>
            <select
              value={selectedStudent}
              onChange={(e) => onSelectStudent(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer font-sans"
            >
              <option value="sim-student-b">👩‍💻 Shahul (Gap Diagnosed - 42%)</option>
              <option value="sim-student-a">👨‍🎓 Alex (High Prior - 81%)</option>
              <option value="sim-student-c">🧑‍🔬 Maya (Misconception - 46%)</option>
            </select>
          </div>

          {/* Grouped Nav Items */}
          <div className="space-y-5">
            {navGroups.map((group) => (
              <div key={group.id} className="space-y-1.5">
                <h4 className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider px-2">
                  {group.label}
                </h4>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isItemActive = activeTab === item.id;
                    const ItemIcon = item.icon;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onSelectTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                          isItemActive
                            ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20'
                            : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <ItemIcon className={`w-4 h-4 shrink-0 ${isItemActive ? 'text-white' : 'text-slate-500'}`} />
                          <span className="text-xs">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                            isItemActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Drawer User Account Card & Demo Tour */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-2.5">
          {currentUser ? (
            <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="truncate max-w-[130px]">
                  <div className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono capitalize">{currentUser.role}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSignOut?.();
                }}
                className="text-[11px] text-rose-600 font-bold px-2 py-1 rounded-lg hover:bg-rose-50 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth?.('login');
                }}
                className="py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth?.('signup');
                }}
                className="py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              onOpenDemoTour();
              setMobileMenuOpen(false);
            }}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch 5-Step Demo Tour</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <header ref={navRef} className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-white/70 shadow-xs select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand Identity */}
            <div className="flex items-center gap-4 lg:gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 font-black text-lg">
                  Q
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base tracking-tight text-slate-900">QIRA</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                      userRole === 'admin'
                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                        : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    }`}>
                      {userRole === 'admin' ? 'ADMIN CONSOLE' : 'AI LEARNING'}
                    </span>
                    <span className="hidden xl:inline-flex items-center gap-1 text-[11px] text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Grounded RAG
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                    Classical Mechanics & Newtonian Dynamics
                  </p>
                </div>
              </div>

              {/* Desktop Grouped Dropdown Menus */}
              <nav className="hidden md:flex items-center space-x-1.5 ml-1 lg:ml-2">
                {navGroups.map((group) => {
                  const isGroupActive = activeGroup?.id === group.id;
                  const isOpen = openDropdown === group.id;
                  const GroupIcon = group.icon;

                  return (
                    <div key={group.id} className="relative">
                      <button
                        type="button"
                        onClick={() => setOpenDropdown(isOpen ? null : group.id)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isGroupActive
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        <GroupIcon className={`w-3.5 h-3.5 ${isGroupActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                        <span>{group.label}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Dropdown Card */}
                      {isOpen && (
                        <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                          <div className="space-y-1">
                            {group.items.map((item) => {
                              const isItemActive = activeTab === item.id;
                              const ItemIcon = item.icon;

                              return (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => {
                                    onSelectTab(item.id);
                                    setOpenDropdown(null);
                                  }}
                                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 cursor-pointer ${
                                    isItemActive
                                      ? 'bg-indigo-600 text-white shadow-sm'
                                      : 'text-slate-700 hover:bg-slate-50'
                                  }`}
                                >
                                  <div className={`p-1.5 rounded-lg mt-0.5 ${
                                    isItemActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                                  }`}>
                                    <ItemIcon className="w-4 h-4" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <span className={`text-xs font-bold ${isItemActive ? 'text-white' : 'text-slate-900'}`}>
                                        {item.label}
                                      </span>
                                      {item.badge && (
                                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                                          isItemActive
                                            ? 'bg-white/20 text-white'
                                            : item.highlight
                                            ? 'bg-amber-100 text-amber-800'
                                            : 'bg-slate-100 text-slate-600'
                                        }`}>
                                          {item.badge}
                                        </span>
                                      )}
                                    </div>
                                    <p className={`text-[11px] leading-tight truncate mt-0.5 ${
                                      isItemActive ? 'text-indigo-100' : 'text-slate-500'
                                    }`}>
                                      {item.description}
                                    </p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>

            {/* Right: Role Switcher, Student Selector & Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Role Switcher Toggle Pill (Learner vs Admin) */}
              {onSelectRole && (
                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => onSelectRole('learner')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      userRole === 'learner'
                        ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Switch to Learner View"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="hidden lg:inline">Learner</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSwitchToAdmin('Admin Console')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      userRole === 'admin'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Switch to Admin Console (PIN: 6316)"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span className="hidden lg:inline">Admin {!isAdminAuthenticated && '🔒'}</span>
                  </button>
                </div>
              )}

              {/* Audio Sound Effects Mute Toggle Button */}
              <button
                type="button"
                onClick={handleToggleMute}
                className={`p-2 rounded-xl transition-all cursor-pointer border ${
                  isMuted 
                    ? 'bg-slate-100 text-slate-400 border-slate-200 hover:text-slate-700' 
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-xs hover:bg-indigo-100'
                }`}
                title={isMuted ? 'Sound Effects Muted (Click to Enable)' : 'Sound Effects Active (Click to Mute)'}
                aria-label="Toggle Sound Effects"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Student switcher */}
              <div className="hidden sm:flex items-center gap-2 bg-slate-100/90 px-3 py-1.5 rounded-xl border border-slate-200">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={selectedStudent}
                  onChange={(e) => {
                    playClickSound();
                    onSelectStudent(e.target.value);
                  }}
                  className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="sim-student-b">👩‍💻 Shahul (Gap Diagnosed - 42%)</option>
                  <option value="sim-student-a">👨‍🎓 Alex (High Prior - 81%)</option>
                  <option value="sim-student-c">🧑‍🔬 Maya (Misconception - 46%)</option>
                </select>
              </div>

              {/* 5-Step Demo Tour button */}
              <button
                type="button"
                onClick={() => {
                  playSwooshSound();
                  onOpenDemoTour();
                }}
                className="hidden xl:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 text-white text-xs font-bold transition-all shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] group cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                <span>5-Step Demo Tour</span>
              </button>

              {/* Login / Sign Up or User Profile Menu */}
              {currentUser ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setAccountMenuOpen(!accountMenuOpen);
                    }}
                    className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-800 transition-all cursor-pointer shadow-2xs"
                    title={`Signed in as ${currentUser.name}`}
                  >
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="hidden lg:flex flex-col text-left">
                      <span className="text-xs font-bold leading-tight truncate max-w-[95px]">{currentUser.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono capitalize leading-none">{currentUser.role}</span>
                    </div>
                    <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${accountMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {accountMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="pb-2.5 mb-2 border-b border-slate-100">
                        <div className="font-bold text-xs text-slate-900 truncate">{currentUser.name}</div>
                        <div className="text-[11px] font-mono text-slate-500 truncate">{currentUser.email}</div>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {currentUser.role.toUpperCase()}
                          </span>
                          {currentUser.institution && (
                            <span className="text-[10px] text-slate-500 truncate max-w-[140px]">{currentUser.institution}</span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <button
                          type="button"
                          onClick={() => {
                            setAccountMenuOpen(false);
                            onOpenAuth?.('login');
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-700 hover:bg-slate-100 font-medium transition-colors text-left cursor-pointer"
                        >
                          <User className="w-3.5 h-3.5 text-slate-500" />
                          <span>Switch Account</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setAccountMenuOpen(false);
                            onSignOut?.();
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-rose-600 hover:bg-rose-50 font-medium transition-colors text-left cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      onOpenAuth?.('login');
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Log In</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      onOpenAuth?.('signup');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center gap-1"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Sign Up</span>
                  </button>
                </div>
              )}

              {/* Mobile Hamburger Toggle Button */}
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setMobileMenuOpen(true);
                }}
                aria-label="Open navigation menu"
                className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Persistent Mobile Bottom Quick Navigation Bar (Rock-Solid 1-Tap Access) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 flex items-center justify-around shadow-lg select-none">
        {bottomBarTabs.map((tab) => {
          const isTabActive = activeTab === tab.id;
          const TabIcon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                isTabActive
                  ? 'text-indigo-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className={`p-1 rounded-lg ${isTabActive ? 'bg-indigo-50 text-indigo-600' : ''}`}>
                <TabIcon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium leading-none mt-0.5">
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* More Menu Drawer Trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
        >
          <div className="p-1 rounded-lg">
            <Menu className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium leading-none mt-0.5">
            More
          </span>
        </button>
      </nav>

      {/* Mount Portal for Full-Height Drawer */}
      {mobileDrawerPortal}
    </>
  );
};
