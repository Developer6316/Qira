import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/common/Header';
import { CitationModal } from './components/common/CitationModal';
import { DemoTourModal } from './components/common/DemoTourModal';
import { AdminAuthModal } from './components/auth/AdminAuthModal';
import { AuthPage } from './components/auth/AuthPage';
import { CommandPaletteModal } from './components/common/CommandPaletteModal';
import { KeyboardShortcutsModal } from './components/common/KeyboardShortcutsModal';
import { DatabaseInspectorModal } from './components/database/DatabaseInspectorModal';
import { 
  dbSaveUserMastery, 
  dbGetUserMastery,
  dbSaveUserMaterial,
  dbGetUserMaterials,
  dbSaveUserLecture,
  dbGetUserLectures
} from './services/databaseService';
import { MultimodalIngestion } from './components/ingestion/MultimodalIngestion';
import { ConceptGraphView } from './components/graph/ConceptGraphView';
import { GroundedTutorChat } from './components/tutor/GroundedTutorChat';
import { AdaptiveQuizEngine } from './components/assessment/AdaptiveQuizEngine';
import { RootCauseRemediationFlow } from './components/remediation/RootCauseRemediationFlow';
import { PersonalizationDashboard } from './components/dashboard/PersonalizationDashboard';
import { EvaluationBenchmarkLab } from './components/evaluation/EvaluationBenchmarkLab';
import { VideoLectureStudio } from './components/video/VideoLectureStudio';
import { 
  DEFAULT_INGESTED_MATERIALS, 
  INITIAL_STUDENT_MASTERY,
  SAMPLE_ASSESSMENT_QUESTIONS
} from './data/defaultCourse';
import { 
  IngestedMaterial, 
  ConceptMastery, 
  SourceCitation, 
  RemediationSession,
  AssessmentQuestion,
  UserRole,
  GeneratedVideoLecture,
  UserProfile
} from './types';
import { findRootCauseGap } from './data/conceptGraph';
import { isAudioMuted, toggleAudioMuted, playClickSound, playSwooshSound } from './utils/soundEffects';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('qira_auth_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only restore if user explicitly performed a login, not the legacy default
        if (parsed?.id === 'usr-shahul' && !parsed?.explicitlyLoggedIn) {
          localStorage.removeItem('qira_auth_user');
          return null;
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  // Default to showing the Login / Sign Up portal on first load when no account is signed in
  const [isAuthPageOpen, setIsAuthPageOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('qira_auth_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.id === 'usr-shahul' && !parsed?.explicitlyLoggedIn) {
          return true;
        }
        return false;
      }
      return true; // No account signed in -> show Login/Signup page by default
    } catch {
      return true;
    }
  });
  const [authPageInitialMode, setAuthPageInitialMode] = useState<'login' | 'signup'>('login');
  const [isDatabaseInspectorOpen, setIsDatabaseInspectorOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isKeyboardShortcutsOpen, setIsKeyboardShortcutsOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(isAudioMuted());

  const handleToggleMute = () => {
    const next = toggleAudioMuted();
    setIsMuted(next);
  };

  const [activeTab, setActiveTab] = useState<ActiveTab>('remediation');
  const [userRole, setUserRole] = useState<UserRole>('learner');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authActionName, setAuthActionName] = useState<string | undefined>(undefined);

  const [materials, setMaterials] = useState<IngestedMaterial[]>(DEFAULT_INGESTED_MATERIALS);
  const [activeLectureOverride, setActiveLectureOverride] = useState<GeneratedVideoLecture | null>(null);
  const [masteryMap, setMasteryMap] = useState<Record<string, ConceptMastery>>(INITIAL_STUDENT_MASTERY);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('sim-student-b');
  const [activeCitation, setActiveCitation] = useState<SourceCitation | null>(null);
  const [isDemoTourOpen, setIsDemoTourOpen] = useState(false);
  const [remediationSession, setRemediationSession] = useState<RemediationSession | null>(null);

  const studentNames: Record<string, string> = {
    'sim-student-b': 'Shahul (Prerequisite Gap Identified)',
    'sim-student-a': 'Alex (High Prior)',
    'sim-student-c': 'Maya (Misconception Prone)'
  };

  const handleRequestAdminAuth = (actionName?: string) => {
    playClickSound();
    setAuthActionName(actionName);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setIsAdminAuthenticated(true);
    setUserRole('admin');
  };

  const handleSelectRole = (role: UserRole) => {
    if (role === 'admin' && !isAdminAuthenticated) {
      handleRequestAdminAuth('Admin Console Access');
    } else {
      playClickSound();
      setUserRole(role);
    }
  };

  // Global Keyboard Shortcuts (Ctrl+K for Search/Command Palette, Ctrl+1-8 for tab switching, ? for shortcuts)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const modKey = isMac ? e.metaKey : e.ctrlKey;
      const target = e.target as HTMLElement | null;
      const isInputFocused = target && (
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.isContentEditable
      );

      // 1. Command Palette: Ctrl+K or Cmd+K
      if (modKey && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        playSwooshSound();
        setIsCommandPaletteOpen(prev => !prev);
        setIsKeyboardShortcutsOpen(false);
        return;
      }

      // 2. Escape: dismiss any open modals
      if (e.key === 'Escape') {
        if (isCommandPaletteOpen) {
          setIsCommandPaletteOpen(false);
          return;
        }
        if (isKeyboardShortcutsOpen) {
          setIsKeyboardShortcutsOpen(false);
          return;
        }
        if (activeCitation) {
          setActiveCitation(null);
          return;
        }
        if (isDemoTourOpen) {
          setIsDemoTourOpen(false);
          return;
        }
        if (isDatabaseInspectorOpen) {
          setIsDatabaseInspectorOpen(false);
          return;
        }
        if (isAuthModalOpen) {
          setIsAuthModalOpen(false);
          return;
        }
      }

      // 3. Tab Switching: Ctrl+1 through Ctrl+8 or Cmd+1 through Cmd+8
      if (modKey && !e.shiftKey && !e.altKey) {
        const tabKeyMap: Record<string, ActiveTab> = {
          '1': 'ingest',
          '2': 'graph',
          '3': 'tutor',
          '4': 'quiz',
          '5': 'remediation',
          '6': 'video-studio',
          '7': 'dashboard',
          '8': 'evaluation'
        };

        if (tabKeyMap[e.key]) {
          e.preventDefault();
          playClickSound();
          setActiveTab(tabKeyMap[e.key]);
          setIsCommandPaletteOpen(false);
          setIsKeyboardShortcutsOpen(false);
          return;
        }

        // Ctrl+M / Cmd+M: Toggle Audio Mute
        if (e.key === 'm' || e.key === 'M') {
          e.preventDefault();
          handleToggleMute();
          return;
        }

        // Ctrl+D / Cmd+D: Open Database Inspector
        if (e.key === 'd' || e.key === 'D') {
          e.preventDefault();
          playClickSound();
          setIsDatabaseInspectorOpen(prev => !prev);
          return;
        }

        // Ctrl+T / Cmd+T: Open Demo Tour
        if (e.key === 't' || e.key === 'T') {
          e.preventDefault();
          playSwooshSound();
          setIsDemoTourOpen(prev => !prev);
          return;
        }

        // Ctrl+/ or Cmd+/: Open Shortcuts Cheatsheet
        if (e.key === '/') {
          e.preventDefault();
          playClickSound();
          setIsKeyboardShortcutsOpen(prev => !prev);
          return;
        }
      }

      // Ctrl+Shift+A: Toggle/Request Admin
      if (modKey && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        if (userRole === 'learner') {
          handleRequestAdminAuth('Keyboard Shortcut Admin Switch');
        } else {
          setUserRole('learner');
          playClickSound();
        }
        return;
      }

      // 4. '?' key (when not focused in an input): Open Keyboard Shortcuts Cheatsheet
      if (e.key === '?' && !isInputFocused && !modKey) {
        e.preventDefault();
        playClickSound();
        setIsKeyboardShortcutsOpen(prev => !prev);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isCommandPaletteOpen, 
    isKeyboardShortcutsOpen, 
    activeCitation, 
    isDemoTourOpen, 
    isDatabaseInspectorOpen, 
    isAuthModalOpen, 
    userRole, 
    isAdminAuthenticated
  ]);

  // Synchronize mastery map, uploaded materials, and lectures with internal embedded database on user change
  useEffect(() => {
    if (currentUser?.id) {
      dbGetUserMastery(currentUser.id).then(storedMastery => {
        if (storedMastery && Object.keys(storedMastery).length > 0) {
          setMasteryMap(storedMastery);
        }
      });
      dbGetUserMaterials(currentUser.id).then(userMats => {
        if (userMats && userMats.length > 0) {
          setMaterials(prev => {
            const combined = [...userMats];
            for (const d of DEFAULT_INGESTED_MATERIALS) {
              if (!combined.some(m => m.id === d.id)) {
                combined.push(d);
              }
            }
            return combined;
          });
        }
      });
      dbGetUserLectures(currentUser.id).then(userLectures => {
        if (userLectures && userLectures.length > 0) {
          setActiveLectureOverride(userLectures[0]);
        }
      });
    }
  }, [currentUser?.id]);

  const handleUpdateMastery = (conceptId: string, newScore: number, reason: string) => {
    setMasteryMap(prev => {
      const current = prev[conceptId] || {
        conceptId,
        masteryScore: 0.5,
        confidenceInterval: 0.05,
        attemptsCount: 0,
        correctCount: 0,
        lastAssessedAt: '',
        history: [],
        status: 'developing' as const
      };

      const status: ConceptMastery['status'] = newScore >= 0.85 ? 'mastered' : newScore >= 0.70 ? 'competent' : newScore >= 0.50 ? 'developing' : 'critical';

      const updatedConcept: ConceptMastery = {
        ...current,
        masteryScore: newScore,
        attemptsCount: current.attemptsCount + 1,
        lastAssessedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status,
        history: [
          ...current.history,
          {
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            score: newScore,
            delta: Number((newScore - current.masteryScore).toFixed(3)),
            reason
          }
        ]
      };

      const updated: Record<string, ConceptMastery> = {
        ...prev,
        [conceptId]: updatedConcept
      };

      // Persist directly into internal embedded database
      dbSaveUserMastery(currentUser?.id || selectedStudentId, updated);

      return updated;
    });
  };

  const handleAddMaterial = (newMat: IngestedMaterial) => {
    setMaterials(prev => [newMat, ...prev]);
    if (currentUser?.id) {
      dbSaveUserMaterial(currentUser.id, newMat);
    }
  };

  const handleStudentUploadAndGenerateVideo = (newMat: IngestedMaterial, video: GeneratedVideoLecture) => {
    handleAddMaterial(newMat);
    setActiveLectureOverride(video);
    if (currentUser?.id) {
      dbSaveUserLecture(currentUser.id, video);
    }
    setActiveTab('video-studio');
  };

  const handleTriggerRemediationFromQuiz = (failedQuestion: AssessmentQuestion) => {
    const gap = findRootCauseGap(failedQuestion.conceptId, masteryMap);
    
    const prereqConceptId = gap ? gap.prereqConceptId : 'acceleration';
    const prereqConceptName = gap ? gap.prereqConceptName : 'Kinematic Acceleration & Derivatives';
    
    const newSession: RemediationSession = {
      id: `rem-session-${Date.now()}`,
      targetConceptId: failedQuestion.conceptId,
      targetConceptName: failedQuestion.conceptName,
      failedQuestion,
      studentAnswer: failedQuestion.options?.[0]?.id || 'opt-a',
      detectedRootCause: {
        prerequisiteConceptId: prereqConceptId,
        prerequisiteConceptName: prereqConceptName,
        gapType: gap?.gapType || 'prerequisite_gap',
        misconceptionExplanation: gap?.reason || 'Prerequisite gap detected in foundational kinematics definitions.',
        evidenceSnippet: 'Physics_Fundamentals_Vol1.pdf (Page 47): "Note that acceleration a is fundamentally Δv/Δt; without precise calculation of acceleration from velocity changes, force calculations will fail."',
        sourceReference: {
          title: 'Physics_Fundamentals_Vol1.pdf',
          type: 'pdf',
          location: 'Page 47'
        }
      },
      remedialLesson: {
        summary: `Remediating ${prereqConceptName}`,
        keyPoints: [
          'Acceleration a is the time rate of velocity change: a = (v_final - v_initial) / Δt.',
          'Net Force F_net is mass times acceleration (m · a), NOT mass times velocity (m · v).',
          'Calculate rate of change first before applying Newton\'s second law: a = Δv / Δt.'
        ],
        formulaBreakdown: 'a = \\frac{\\Delta v}{\\Delta t} \\implies \\Sigma F_{net} = m \\cdot a',
        sourceHighlight: 'Physics_Fundamentals_Vol1.pdf (Page 47)'
      },
      prerequisiteDiagnosticQuestion: SAMPLE_ASSESSMENT_QUESTIONS[1],
      stage: 'diagnosed',
      initialTargetMastery: masteryMap[failedQuestion.conceptId]?.masteryScore || 0.42,
      initialPrereqMastery: masteryMap[prereqConceptId]?.masteryScore || 0.42
    };

    setRemediationSession(newSession);
    setActiveTab('remediation');
  };

  const handleResetRemediation = () => {
    setRemediationSession(null);
  };

  const handleOpenAuth = (mode: 'login' | 'signup' = 'login') => {
    playClickSound();
    setAuthPageInitialMode(mode);
    setIsAuthPageOpen(true);
  };

  const handleAuthPageSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setUserRole(user.role);
    if (user.role === 'admin') {
      setIsAdminAuthenticated(true);
    }
    if (user.studentId) {
      setSelectedStudentId(user.studentId);
    }
    setIsAuthPageOpen(false);
  };

  const handleSignOut = () => {
    try {
      localStorage.removeItem('qira_auth_user');
      sessionStorage.removeItem('qira_active_user');
    } catch (e) {
      console.error(e);
    }
    setCurrentUser(null);
    setUserRole('learner');
    setIsAdminAuthenticated(false);
    playClickSound();
    setAuthPageInitialMode('login');
    setIsAuthPageOpen(true);
  };

  if (isAuthPageOpen) {
    return (
      <AuthPage
        initialMode={authPageInitialMode}
        onAuthSuccess={handleAuthPageSuccess}
        onBackToApp={() => setIsAuthPageOpen(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-purple-50/25 text-slate-900 flex flex-col selection:bg-indigo-500 selection:text-white font-sans antialiased">
      {/* Universal Top Navigation Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => {
          playClickSound();
          setActiveTab(tab);
        }}
        onOpenDemoTour={() => {
          playSwooshSound();
          setIsDemoTourOpen(true);
        }}
        selectedStudent={selectedStudentId}
        onSelectStudent={(sId) => {
          setSelectedStudentId(sId);
          if (sId === 'sim-student-a') {
            setMasteryMap(prev => ({
              ...prev,
              'acceleration': { ...prev['acceleration'], masteryScore: 0.88, status: 'mastered' },
              'newton-2': { ...prev['newton-2'], masteryScore: 0.82, status: 'competent' }
            }));
          } else if (sId === 'sim-student-b') {
            setMasteryMap(INITIAL_STUDENT_MASTERY);
          }
        }}
        remediationStageActive={!!remediationSession}
        userRole={userRole}
        onSelectRole={handleSelectRole}
        isAdminAuthenticated={isAdminAuthenticated}
        onRequestAdminAuth={handleRequestAdminAuth}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onSignOut={handleSignOut}
        onOpenDatabaseInspector={() => setIsDatabaseInspectorOpen(true)}
        onOpenCommandPalette={() => {
          playSwooshSound();
          setIsCommandPaletteOpen(true);
        }}
        onOpenKeyboardShortcuts={() => {
          playClickSound();
          setIsKeyboardShortcutsOpen(true);
        }}
      />

      {/* Main View Container with Smooth Ambient Lighting */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-28 md:py-6">
        {/* Guest Mode Banner when not logged in */}
        {!currentUser && (
          <div className="mb-5 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 border border-indigo-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs backdrop-blur-sm animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  You are currently exploring in Guest Session
                </p>
                <p className="text-[11px] text-slate-600">
                  Log in or create a free account so your diagnostic mastery, uploaded textbooks, and chalkboard videos are saved inside the internal database.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => handleOpenAuth('login')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition-all cursor-pointer"
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => handleOpenAuth('signup')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-all cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
        {activeTab === 'ingest' && (
          <div className="glass-panel rounded-3xl p-3 sm:p-5 shadow-xs transition-all duration-200">
            <div className="glass-card rounded-2xl p-1 sm:p-2">
              <MultimodalIngestion
                materials={materials}
                onAddMaterial={handleAddMaterial}
                onOpenCitation={(cit) => setActiveCitation(cit)}
                onNavigateToVideoStudio={(matId, topic) => {
                  setActiveTab('video-studio');
                }}
                userRole={userRole}
                onRequestAdminAuth={handleRequestAdminAuth}
                onStudentUploadAndGenerateVideo={handleStudentUploadAndGenerateVideo}
              />
            </div>
          </div>
        )}

        {activeTab === 'graph' && (
          <div className="glass-panel rounded-3xl p-3 sm:p-5 shadow-xs transition-all duration-200">
            <div className="glass-card rounded-2xl p-1 sm:p-2">
              <ConceptGraphView
                masteryMap={masteryMap}
                onOpenCitation={(cit) => setActiveCitation(cit)}
                onLaunchRemediationForNode={(cId) => setActiveTab('remediation')}
              />
            </div>
          </div>
        )}

        {/* Chat / Grounded Cognitive Tutor View */}
        {activeTab === 'tutor' && (
          <div className="glass-panel rounded-3xl p-3 sm:p-5 shadow-xs transition-all duration-200">
            <div className="glass-card rounded-2xl p-1 sm:p-2">
              <GroundedTutorChat
                materials={materials}
                onOpenCitation={(cit) => setActiveCitation(cit)}
              />
            </div>
          </div>
        )}

        {/* Quiz / Adaptive Assessment Engine View */}
        {activeTab === 'quiz' && (
          <div className="glass-panel rounded-3xl p-3 sm:p-5 shadow-xs transition-all duration-200">
            <div className="glass-card rounded-2xl p-1 sm:p-2">
              <AdaptiveQuizEngine
                masteryMap={masteryMap}
                onUpdateMastery={handleUpdateMastery}
                onOpenCitation={(cit) => setActiveCitation(cit)}
                onTriggerRemediation={handleTriggerRemediationFromQuiz}
              />
            </div>
          </div>
        )}

        {/* Remediation / Root-Cause Remediation View */}
        {activeTab === 'remediation' && (
          <div className="glass-panel rounded-3xl p-3 sm:p-5 shadow-xs transition-all duration-200">
            <div className="glass-card rounded-2xl p-1 sm:p-2">
              <RootCauseRemediationFlow
                session={remediationSession}
                masteryMap={masteryMap}
                onUpdateMastery={handleUpdateMastery}
                onOpenCitation={(cit) => setActiveCitation(cit)}
                onResetSession={handleResetRemediation}
              />
            </div>
          </div>
        )}

        {activeTab === 'video-studio' && (
          <div className="glass-panel rounded-3xl p-3 sm:p-5 shadow-xs transition-all duration-200">
            <div className="glass-card rounded-2xl p-1 sm:p-2">
              <VideoLectureStudio
                materials={materials}
                onSaveVideoToMaterials={handleAddMaterial}
                onOpenCitation={(cit) => setActiveCitation(cit)}
                activeLectureOverride={activeLectureOverride}
              />
            </div>
          </div>
        )}

        {/* Dashboard / Personalization & BKT Mastery View */}
        {activeTab === 'dashboard' && (
          <div className="glass-panel rounded-3xl p-3 sm:p-5 shadow-xs transition-all duration-200">
            <div className="glass-card rounded-2xl p-1 sm:p-2">
              <PersonalizationDashboard
                masteryMap={masteryMap}
                studentName={studentNames[selectedStudentId] || 'Shahul'}
                onNavigateToTab={(t) => setActiveTab(t)}
                onOpenCitation={(cit) => setActiveCitation(cit)}
                userRole={userRole}
                onUpdateMastery={handleUpdateMastery}
                onRequestAdminAuth={handleRequestAdminAuth}
              />
            </div>
          </div>
        )}

        {activeTab === 'evaluation' && (
          <div className="glass-panel rounded-3xl p-3 sm:p-5 shadow-xs transition-all duration-200">
            <div className="glass-card rounded-2xl p-1 sm:p-2">
              <EvaluationBenchmarkLab 
                userRole={userRole}
                onRequestAdminAuth={handleRequestAdminAuth}
              />
            </div>
          </div>
        )}
      </main>

      {/* Admin Authentication PIN Modal (Username Developer6316 / PIN 6316) */}
      <AdminAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        targetActionName={authActionName}
      />

      {/* Exact Source & Video Timestamp Citation Modal */}
      <CitationModal
        citation={activeCitation}
        onClose={() => setActiveCitation(null)}
      />

      {/* 5-Step Hackathon Demo Tour Walkthrough */}
      <DemoTourModal
        isOpen={isDemoTourOpen}
        onClose={() => setIsDemoTourOpen(false)}
        onNavigateToTab={(tab) => setActiveTab(tab)}
      />

      {/* Internal Embedded Database Live Inspector Modal */}
      <DatabaseInspectorModal
        isOpen={isDatabaseInspectorOpen}
        onClose={() => setIsDatabaseInspectorOpen(false)}
        currentUser={currentUser}
        masteryMap={masteryMap}
      />

      {/* Global Command & Concept Search Palette Modal (Ctrl+K or ⌘K) */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={(tab) => setActiveTab(tab)}
        onOpenCitation={(cit) => setActiveCitation(cit)}
        onOpenDemoTour={() => setIsDemoTourOpen(true)}
        onOpenDatabaseInspector={() => setIsDatabaseInspectorOpen(true)}
        onOpenShortcutsModal={() => setIsKeyboardShortcutsOpen(true)}
        onToggleMute={handleToggleMute}
        isMuted={isMuted}
        onSelectStudent={(sId) => {
          setSelectedStudentId(sId);
          if (sId === 'sim-student-a') {
            setMasteryMap(prev => ({
              ...prev,
              'acceleration': { ...prev['acceleration'], masteryScore: 0.88, status: 'mastered' },
              'newton-2': { ...prev['newton-2'], masteryScore: 0.82, status: 'competent' }
            }));
          } else if (sId === 'sim-student-b') {
            setMasteryMap(INITIAL_STUDENT_MASTERY);
          }
        }}
        onRequestAdminAuth={handleRequestAdminAuth}
        userRole={userRole}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        materials={materials}
      />

      {/* Global Keyboard Shortcuts Cheatsheet Modal (? or Ctrl+/) */}
      <KeyboardShortcutsModal
        isOpen={isKeyboardShortcutsOpen}
        onClose={() => setIsKeyboardShortcutsOpen(false)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />
    </div>
  );
}
