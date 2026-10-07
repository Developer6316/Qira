import React, { useState } from 'react';
import { Header, ActiveTab } from './components/common/Header';
import { CitationModal } from './components/common/CitationModal';
import { DemoTourModal } from './components/common/DemoTourModal';
import { AdminAuthModal } from './components/auth/AdminAuthModal';
import { AuthPage } from './components/auth/AuthPage';
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
import { playClickSound, playSwooshSound } from './utils/soundEffects';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('qira_auth_user');
      if (saved) return JSON.parse(saved);
      return {
        id: 'usr-shahul',
        name: 'Shahul',
        email: 'shahul.learner@physics.edu',
        role: 'learner',
        institution: 'MIT Physics',
        studentId: 'sim-student-b',
        createdAt: new Date().toISOString()
      };
    } catch {
      return null;
    }
  });

  const [isAuthPageOpen, setIsAuthPageOpen] = useState<boolean>(false);
  const [authPageInitialMode, setAuthPageInitialMode] = useState<'login' | 'signup'>('login');

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
        status: 'developing'
      };

      const status = newScore >= 0.85 ? 'mastered' : newScore >= 0.70 ? 'competent' : newScore >= 0.50 ? 'developing' : 'critical';

      return {
        ...prev,
        [conceptId]: {
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
        }
      };
    });
  };

  const handleAddMaterial = (newMat: IngestedMaterial) => {
    setMaterials(prev => [newMat, ...prev]);
  };

  const handleStudentUploadAndGenerateVideo = (newMat: IngestedMaterial, video: GeneratedVideoLecture) => {
    handleAddMaterial(newMat);
    setActiveLectureOverride(video);
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
    } catch (e) {
      console.error(e);
    }
    setCurrentUser(null);
    setUserRole('learner');
    setIsAdminAuthenticated(false);
    playClickSound();
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
      />

      {/* Main View Container with Smooth Ambient Lighting */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-28 md:py-6">
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
    </div>
  );
}
