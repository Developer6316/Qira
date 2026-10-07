import React, { useState } from 'react';
import { ConceptMastery, SourceCitation, UserRole } from '../../types';
import { CONCEPT_NODES } from '../../data/conceptGraph';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Sparkles, 
  Award, 
  ArrowRight,
  Flame,
  Target,
  Zap,
  BookOpen,
  Users,
  Shield,
  Sliders,
  RefreshCw,
  Eye,
  Download,
  Printer
} from 'lucide-react';
import { StudentMasteryReportModal } from './StudentMasteryReportModal';
import { playClickSound, playSwooshSound } from '../../utils/soundEffects';

interface PersonalizationDashboardProps {
  masteryMap: Record<string, ConceptMastery>;
  studentName: string;
  onNavigateToTab: (tab: any) => void;
  onOpenCitation: (citation: SourceCitation) => void;
  userRole?: UserRole;
  onUpdateMastery?: (conceptId: string, newScore: number, reason: string) => void;
  onRequestAdminAuth?: (actionName?: string) => void;
}

export const PersonalizationDashboard: React.FC<PersonalizationDashboardProps> = ({
  masteryMap,
  studentName,
  onNavigateToTab,
  onOpenCitation,
  userRole = 'learner',
  onUpdateMastery,
  onRequestAdminAuth
}) => {
  const [activeCohortView, setActiveCohortView] = useState<'individual' | 'cohort'>(
    userRole === 'admin' ? 'cohort' : 'individual'
  );
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const conceptScores = CONCEPT_NODES.map(node => {
    const mastery = masteryMap[node.id]?.masteryScore ?? 0.5;
    return {
      node,
      score: mastery,
      attempts: masteryMap[node.id]?.attemptsCount ?? 4,
      history: masteryMap[node.id]?.history ?? []
    };
  });

  const overallMastery = Math.round(
    (conceptScores.reduce((acc, c) => acc + c.score, 0) / conceptScores.length) * 100
  );

  const weakConcepts = [...conceptScores]
    .filter(c => c.score < 0.70)
    .sort((a, b) => a.score - b.score);

  // Four-state color mapping with exact requested specs:
  // critical (red), developing (yellow), competent (emerald), mastered (blue)
  const getMasteryState = (score: number): {
    key: 'critical' | 'developing' | 'competent' | 'mastered';
    label: string;
    badgeText: string;
    textColor: string;
    bgColor: string;
    borderColor: string;
    barGradient: string;
    pillBg: string;
    solidColor: string;
  } => {
    if (score >= 0.85) {
      return {
        key: 'mastered',
        label: 'Mastered',
        badgeText: '🔵 Mastered',
        textColor: 'text-blue-700',
        bgColor: 'bg-blue-600',
        borderColor: 'border-blue-300',
        barGradient: 'from-blue-500 via-sky-500 to-indigo-600',
        pillBg: 'bg-blue-50 text-blue-700 border-blue-200',
        solidColor: '#3B82F6'
      };
    }
    if (score >= 0.70) {
      return {
        key: 'competent',
        label: 'Competent',
        badgeText: '🟢 Competent',
        textColor: 'text-emerald-700',
        bgColor: 'bg-emerald-600',
        borderColor: 'border-emerald-300',
        barGradient: 'from-emerald-500 to-teal-600',
        pillBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        solidColor: '#10B981'
      };
    }
    if (score >= 0.50) {
      return {
        key: 'developing',
        label: 'Developing',
        badgeText: '🟡 Developing',
        textColor: 'text-amber-800',
        bgColor: 'bg-amber-500',
        borderColor: 'border-amber-300',
        barGradient: 'from-amber-400 via-yellow-400 to-amber-500',
        pillBg: 'bg-amber-50 text-amber-800 border-amber-200',
        solidColor: '#F59E0B'
      };
    }
    return {
      key: 'critical',
      label: 'Critical',
      badgeText: '🔴 Critical',
      textColor: 'text-red-700',
      bgColor: 'bg-red-600',
      borderColor: 'border-red-300',
      barGradient: 'from-red-500 via-rose-500 to-red-600',
      pillBg: 'bg-red-50 text-red-700 border-red-200',
      solidColor: '#EF4444'
    };
  };

  // Mock cohort roster for Admin view
  const cohortStudents = [
    {
      id: 'sim-student-b',
      name: 'Shahul (Prerequisite Gap Identified)',
      overall: 42,
      status: 'critical',
      criticalConcept: 'Acceleration (42%)',
      lastActive: '10 mins ago',
      interventionNeeded: true
    },
    {
      id: 'sim-student-a',
      name: 'Alex (High Prior Ability)',
      overall: 81,
      status: 'competent',
      criticalConcept: 'None (Excelling in Kinematics)',
      lastActive: '2 hrs ago',
      interventionNeeded: false
    },
    {
      id: 'sim-student-c',
      name: 'Maya (Misconception Prone)',
      overall: 46,
      status: 'developing',
      criticalConcept: 'Static vs Kinetic Friction (38%)',
      lastActive: 'Yesterday',
      interventionNeeded: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className={`text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden ${
        userRole === 'admin'
          ? 'bg-gradient-to-r from-purple-700 via-indigo-700 to-slate-900'
          : 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-white/20 text-white border border-white/30 backdrop-blur-xs">
                {userRole === 'admin' ? 'ADMIN / INSTRUCTOR CONSOLE' : 'SYSTEM 6 OF 7'}
              </span>
              <span className="text-xs text-indigo-100 font-medium">
                {userRole === 'admin' ? 'Cohort Analytics & Knowledge Tracing Overseer' : 'Personalization & Dynamic Learner Model'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {userRole === 'admin' 
                ? 'Class-Wide Cohort Mastery & Diagnostic Radar' 
                : `Learner Mastery Profile: ${studentName}`}
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100 max-w-2xl leading-relaxed">
              {userRole === 'admin'
                ? 'Oversee Bayesian Knowledge Tracing across all enrolled learners, trigger class-wide prerequisite interventions, and audit real-time mastery growth.'
                : 'Bayesian Knowledge Tracing (BKT) continuously computes mastery probability across all 9 mechanics competencies with automated study schedule prioritization.'}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-2xl glass-card text-slate-900 shadow-md text-center min-w-[110px]">
              <div className="text-[10px] font-mono text-slate-500 font-bold uppercase">
                {userRole === 'admin' ? 'Cohort Avg' : 'Overall Mastery'}
              </div>
              <div className="text-2xl font-mono font-black text-indigo-600 mt-0.5">
                {userRole === 'admin' ? '56%' : `${overallMastery}%`}
              </div>
            </div>
            <div className="p-3.5 rounded-2xl glass-card text-slate-900 shadow-md text-center min-w-[110px]">
              <div className="text-[10px] font-mono text-slate-500 font-bold uppercase flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>{userRole === 'admin' ? 'At-Risk' : 'Streak'}</span>
              </div>
              <div className="text-2xl font-mono font-black text-amber-600 mt-0.5">
                {userRole === 'admin' ? '2 Learners' : '4 Days'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Toggle Tabs & Report Export Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 p-1.5 glass-card rounded-2xl max-w-lg">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setActiveCohortView('individual');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeCohortView === 'individual'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Learner Concept Profile</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              if (userRole !== 'admin') {
                onRequestAdminAuth?.('Class-Wide Cohort & Intervention Overseer');
              } else {
                setActiveCohortView('cohort');
              }
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeCohortView === 'cohort' && userRole === 'admin'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Cohort Matrix {userRole !== 'admin' ? '🔒 (Admin)' : '(3 Students)'}</span>
          </button>
        </div>

        {/* 1-Click Mastery Report Export Button */}
        <button
          type="button"
          onClick={() => {
            playClickSound();
            playSwooshSound();
            setIsReportModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-indigo-700 border border-indigo-200 shadow-xs hover:shadow-md font-bold text-xs transition-all hover:scale-[1.02] cursor-pointer"
        >
          <Download className="w-4 h-4 text-indigo-600" />
          <span>Export Mastery Report (JSON / PDF)</span>
        </button>
      </div>

      {/* Admin Cohort View */}
      {userRole === 'admin' && activeCohortView === 'cohort' && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider">
                    Enrolled Students Cohort Matrix
                  </h3>
                  <p className="text-xs text-slate-500">Real-time Bayesian knowledge tracing state and automated risk alerts</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  onNavigateToTab('remediation');
                }}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                + Trigger Cohort Remediation
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {cohortStudents.map((s) => (
                <div
                  key={s.id}
                  className={`p-5 rounded-2xl border transition-all space-y-3 ${
                    s.interventionNeeded
                      ? 'bg-amber-50/60 border-amber-300 ring-1 ring-amber-300/40 shadow-xs'
                      : 'bg-slate-50/70 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 truncate">{s.name.split(' ')[0]}</span>
                    <span className={`px-2 py-0.5 rounded-md font-mono text-xs font-black ${
                      s.overall >= 70 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {s.overall}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-sans">
                    {s.name}
                  </p>

                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                    <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">Critical Bottleneck:</div>
                    <div className="font-semibold text-slate-800 text-xs">{s.criticalConcept}</div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 text-[11px] font-mono text-slate-500">
                    <span>Active: {s.lastActive}</span>
                    {s.interventionNeeded ? (
                      <span className="text-rose-700 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Needs Remediation
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> On Track
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Concept Mastery Bars (Shown for Learner, or in Admin deep-dive) */}
      {(userRole === 'learner' || activeCohortView === 'individual') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 7 Cols: Progress Bars with 4 Color-Coded Segments */}
          <div className="lg:col-span-7 space-y-4">
            <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                    Physics Concept Mastery (BKT Posterior Probabilities)
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-500 font-semibold">9 Competencies</span>
              </div>

              {/* Color-Coded Segment State Legend */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">
                  Color-Coded Mastery Threshold Segments:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono font-bold">
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-red-50 text-red-700 border border-red-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                    <span>🔴 Critical (&lt;50%)</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                    <span>🟡 Developing (50-69%)</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>🟢 Competent (70-84%)</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                    <span>🔵 Mastered (85%+)</span>
                  </div>
                </div>
              </div>

              {/* List of Concepts with Segmented Visual Progress Bars */}
              <div className="space-y-4">
                {conceptScores.map(({ node, score, attempts }) => {
                  const percent = Math.round(score * 100);
                  const state = getMasteryState(score);

                  return (
                    <div key={node.id} className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-3 hover:border-slate-300 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">{node.name}</span>
                          <span className="text-[10px] font-mono text-slate-400 font-medium">({node.topic})</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-[10px] font-mono hidden sm:inline">
                            {attempts} attempts
                          </span>
                          
                          {/* Segment State Badge */}
                          <span className={`px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold border ${state.pillBg}`}>
                            {state.badgeText}
                          </span>

                          {/* Exact Mastery Percentage */}
                          <span className={`font-mono text-xs font-black ${state.textColor} min-w-[36px] text-right`}>
                            {percent}%
                          </span>
                        </div>
                      </div>

                      {/* Multi-Segmented Visual Progress Bar Track */}
                      <div className="space-y-1.5">
                        {/* 4-Zone Segmented Track */}
                        <div className="relative w-full bg-slate-200 h-3.5 rounded-full overflow-hidden border border-slate-300 p-0.5 flex">
                          {/* 4 Zone Segment Guides */}
                          <div className="w-[50%] h-full bg-red-500/10 border-r border-slate-300" title="Zone 1: Critical (0-49%)" />
                          <div className="w-[20%] h-full bg-amber-500/10 border-r border-slate-300" title="Zone 2: Developing (50-69%)" />
                          <div className="w-[15%] h-full bg-emerald-500/10 border-r border-slate-300" title="Zone 3: Competent (70-84%)" />
                          <div className="w-[15%] h-full bg-blue-500/10" title="Zone 4: Mastered (85-100%)" />

                          {/* Active Filled Progress Bar */}
                          <div
                            className={`absolute top-0.5 left-0.5 bottom-0.5 rounded-full bg-gradient-to-r ${state.barGradient} transition-all duration-500 shadow-xs`}
                            style={{ width: `${Math.max(3, Math.min(100, percent))}%` }}
                          />
                        </div>

                        {/* Threshold Scale Labels */}
                        <div className="flex justify-between text-[9px] font-mono text-slate-400 font-semibold px-1">
                          <span>0%</span>
                          <span className="text-red-600">50% (Critical)</span>
                          <span className="text-amber-700">70% (Dev)</span>
                          <span className="text-emerald-700">85% (Comp)</span>
                          <span className="text-blue-700">100% (Mastered)</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right 5 Cols: Weak Concepts & Recommended Action Plan */}
          <div className="lg:col-span-5 space-y-6">
            {/* Weak Topics Diagnostic Card */}
            <div className="glass-card rounded-2xl p-6 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                  Prioritized Remediation Gaps ({weakConcepts.length})
                </h3>
              </div>

              <div className="space-y-3">
                {weakConcepts.map(({ node, score }, idx) => {
                  const state = getMasteryState(score);
                  return (
                    <div
                      key={node.id}
                      onClick={() => {
                        playClickSound();
                        onNavigateToTab('remediation');
                      }}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:border-slate-300 transition-colors cursor-pointer"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                          <span className="text-indigo-600 font-mono font-bold">#{idx + 1}</span>
                          <span>{node.name}</span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-500">
                          Anchor: {node.primarySource.pageOrTimestamp}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 font-mono">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${state.pillBg}`}>
                          {state.label}
                        </span>
                        <span className={`text-xs font-black ${state.textColor}`}>
                          {Math.round(score * 100)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommended Action Plan */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Target className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                  Recommended Action Plan
                </h3>
              </div>

              <div className="space-y-3">
                <div 
                  onClick={() => {
                    playClickSound();
                    onNavigateToTab('remediation');
                  }}
                  className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-indigo-50 border border-amber-200 hover:border-amber-300 transition-all cursor-pointer space-y-1.5 group shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" /> High Priority Remediation
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 font-semibold">~8 min</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">
                    Review Kinematic Acceleration & dv/dt
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    Targeted prerequisite module to unblock Newton's 2nd Law.
                  </p>
                </div>

                <div 
                  onClick={() => {
                    playClickSound();
                    onNavigateToTab('quiz');
                  }}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all cursor-pointer space-y-1 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Practice Set</span>
                    <span className="text-[11px] font-mono text-slate-500 font-semibold">5 Questions</span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-900">
                    Solve 5 Free-Body Diagram inclined planes
                  </h4>
                </div>

                <div 
                  onClick={() => {
                    playClickSound();
                    onNavigateToTab('tutor');
                  }}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all cursor-pointer space-y-1 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Grounded Tutor Review</span>
                    <span className="text-[11px] font-mono text-slate-500 font-semibold">Interactive Q&A</span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-900">
                    Ask QIRA about Static vs Kinetic Friction
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Diagnostic & Mastery Export Modal */}
      <StudentMasteryReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        studentName={studentName}
        studentId="sim-student-b"
        masteryMap={masteryMap}
      />
    </div>
  );
};
