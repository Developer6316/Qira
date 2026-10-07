import React, { useState } from 'react';
import { RemediationSession, SourceCitation, AssessmentQuestion, ConceptMastery } from '../../types';
import { SAMPLE_ASSESSMENT_QUESTIONS } from '../../data/defaultCourse';
import { 
  GitBranch, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  FileText, 
  Video, 
  Sparkles, 
  TrendingUp, 
  Award,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Layers,
  ArrowLeft,
  Check,
  Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClickSound, playSuccessChime, playSwooshSound } from '../../utils/soundEffects';

interface RootCauseRemediationFlowProps {
  session: RemediationSession | null;
  masteryMap: Record<string, ConceptMastery>;
  onUpdateMastery: (conceptId: string, newScore: number, reason: string) => void;
  onOpenCitation: (citation: SourceCitation) => void;
  onResetSession: () => void;
}

export const RootCauseRemediationFlow: React.FC<RootCauseRemediationFlowProps> = ({
  session,
  masteryMap,
  onUpdateMastery,
  onOpenCitation,
  onResetSession
}) => {
  // Default session state if none active
  const defaultSession: RemediationSession = {
    id: 'rem-demo-01',
    targetConceptId: 'newton-2',
    targetConceptName: "Newton's Second Law (F = ma)",
    failedQuestion: SAMPLE_ASSESSMENT_QUESTIONS[0],
    studentAnswer: 'opt-a', // 60.0 N
    detectedRootCause: {
      prerequisiteConceptId: 'acceleration',
      prerequisiteConceptName: 'Acceleration & Velocity Derivatives',
      gapType: 'prerequisite_gap',
      misconceptionExplanation: 'Student computed force by multiplying mass directly by final velocity (4 kg × 15 m/s = 60 N) instead of calculating rate of velocity change (a = Δv/Δt = 4.0 m/s²). The root cause is an upstream kinematic acceleration prerequisite gap.',
      evidenceSnippet: 'Physics_Fundamentals_Vol1.pdf (Page 47): "Note that acceleration a is fundamentally Δv/Δt; without precise calculation of acceleration from velocity changes, force calculations will fail."',
      sourceReference: {
        title: 'Physics_Fundamentals_Vol1.pdf',
        type: 'pdf',
        location: 'Page 47'
      }
    },
    remedialLesson: {
      summary: 'Remediating Kinematic Acceleration (a = Δv / Δt)',
      keyPoints: [
        'Acceleration a is the time rate of velocity change: a = (v_final - v_initial) / Δt.',
        'Net Force F_net is mass times acceleration (m · a), NOT mass times velocity (m · v).',
        'When a 4.0 kg cart speeds from 3 m/s to 15 m/s in 3 s: a = (15 - 3)/3 = 4.0 m/s², so F_net = 4 kg × 4 m/s² = 16.0 N.'
      ],
      formulaBreakdown: 'a = \\frac{\\Delta v}{\\Delta t} = \\frac{v_f - v_i}{\\Delta t} \\implies \\Sigma F_{net} = m \\cdot a',
      sourceHighlight: 'Physics_Fundamentals_Vol1.pdf (Page 31 & 47) + Video Lecture 04 (Timestamp 12:43)'
    },
    prerequisiteDiagnosticQuestion: SAMPLE_ASSESSMENT_QUESTIONS[1],
    stage: 'diagnosed',
    initialTargetMastery: 0.42,
    initialPrereqMastery: 0.42
  };

  const activeSession = session || defaultSession;
  const [currentStage, setCurrentStage] = useState<RemediationSession['stage']>(activeSession.stage || 'diagnosed');
  const [prereqAnswer, setPrereqAnswer] = useState<string | null>(null);
  const [retestAnswer, setRetestAnswer] = useState<string | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const stagesList = [
    { id: 'diagnosed' as const, stepNum: 1, label: 'Root Cause Diagnosis', shortLabel: '1. Diagnosis' },
    { id: 'reviewing_lesson' as const, stepNum: 2, label: 'Grounded Mini-Lesson', shortLabel: '2. Lesson' },
    { id: 'prereq_quiz' as const, stepNum: 3, label: 'Prerequisite Check', shortLabel: '3. Prereq Check' },
    { id: 'retesting_target' as const, stepNum: 4, label: 'Target Retest', shortLabel: '4. Retest' },
    { id: 'mastery_improved' as const, stepNum: 5, label: 'Closed-Loop Proof', shortLabel: '5. Victory' },
  ];

  const currentStageIndex = stagesList.findIndex(s => s.id === currentStage);
  const currentStageInfo = stagesList[currentStageIndex] || stagesList[0];

  const handlePassPrereq = () => {
    if (prereqAnswer === 'opt-acc-a') {
      playSuccessChime();
      onUpdateMastery('acceleration', 0.76, 'Remediation Mini-Quiz passed: Kinematic Acceleration');
      setCurrentStage('retesting_target');
      try {
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    } else {
      playClickSound();
    }
  };

  const handlePassRetest = () => {
    if (retestAnswer === 'opt-ret-a') {
      playSuccessChime();
      onUpdateMastery('newton-2', 0.68, 'Remediation Retest Passed: Newton Second Law');
      setCurrentStage('mastery_improved');
      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      } catch {
        // ignore
      }
    } else {
      playClickSound();
    }
  };

  const handleNavigateStage = (stageId: RemediationSession['stage']) => {
    playClickSound();
    setCurrentStage(stageId);
    setIsMobileNavOpen(false); // auto collapse on mobile after tap
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Banner (Responsive & Crisp) */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/20 text-white border border-white/30 backdrop-blur-xs">
                SYSTEM 5: CORE ADVANTAGE
              </span>
              <span className="text-xs text-amber-100 font-medium">Root-Cause Adaptive Remediation Loop</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-2 flex-wrap">
              <span>Closed-Loop Root-Cause Diagnosis & Remediation</span>
              <span className="text-[11px] font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
                DEMO 4
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-amber-100 max-w-2xl leading-relaxed">
              Traces prerequisite DAG dependencies, detects upstream misconception in <strong className="text-white underline">Acceleration</strong>, remediates directly from <strong className="text-white underline">Page 47</strong>, and verifies mastery recovery.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              onResetSession();
              setCurrentStage('diagnosed');
              setPrereqAnswer(null);
              setRetestAnswer(null);
            }}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 self-start md:self-auto cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
            <span>Reset Demo 4 Flow</span>
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Side-Navigation Bar (Visible on < lg screens) */}
      <div className="lg:hidden">
        <div className="glass-card rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setIsMobileNavOpen(!isMobileNavOpen);
            }}
            className="w-full p-3.5 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-2xs">
                {currentStageInfo.stepNum}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-800 truncate">
                  Step {currentStageInfo.stepNum} of 5: {currentStageInfo.label}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Tap to view 5-stage roadmap & diagnostic graph
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                {isMobileNavOpen ? 'Hide' : 'Stages'}
              </span>
              {isMobileNavOpen ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </div>
          </button>

          {/* Stepper Progress Bar Line */}
          <div className="w-full bg-slate-100 h-1">
            <div 
              className="bg-amber-500 h-1 transition-all duration-300"
              style={{ width: `${((currentStageIndex + 1) / 5) * 100}%` }}
            />
          </div>

          {/* Collapsible Mobile Drawer Content */}
          {isMobileNavOpen && (
            <div className="p-4 border-t border-slate-100 bg-slate-50/70 space-y-4 animate-in slide-in-from-top-2 duration-150">
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono font-bold uppercase text-slate-500">
                  5-Stage Remediation Roadmap:
                </span>
                <div className="space-y-1.5">
                  {stagesList.map((st, idx) => {
                    const isCurrent = currentStage === st.id;
                    const isCompleted = currentStageIndex > idx;

                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => handleNavigateStage(st.id)}
                        className={`w-full p-2.5 rounded-xl text-left border text-xs transition-all cursor-pointer flex items-center justify-between ${
                          isCurrent
                            ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold ring-2 ring-amber-400/30'
                            : isCompleted
                            ? 'bg-emerald-50/90 border-emerald-300 text-emerald-900 font-semibold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${
                            isCurrent ? 'bg-amber-500 text-white' :
                            isCompleted ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {isCompleted ? '✓' : st.stepNum}
                          </div>
                          <span>{st.label}</span>
                        </div>
                        {isCurrent && (
                          <span className="text-[10px] font-mono text-amber-700 uppercase font-bold">Active</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Prerequisite Gap Summary */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-600">
                  <span className="font-bold text-slate-800">Dependency Trace</span>
                  <span className="text-rose-600 font-bold">Acceleration Gap</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-slate-600">Velocity (92%)</span>
                  <span>→</span>
                  <span className="text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded">Accel (42%)</span>
                  <span>→</span>
                  <span className="text-amber-800 font-bold">F=ma (42%)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Desktop Side-Navigation Column + Stacked Content Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Desktop Side Navigation Column (Visible on lg+) */}
        <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 space-y-4 sticky top-20">
          {/* 5-Stage Stepper Roadmap Card */}
          <div className="glass-card rounded-2xl p-4 border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-bold font-mono uppercase text-slate-800">
                  Remediation Flow
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500 font-bold">
                {currentStageIndex + 1} / 5
              </span>
            </div>

            {/* Stepper Vertical List */}
            <div className="space-y-1.5">
              {stagesList.map((st, idx) => {
                const isCurrent = currentStage === st.id;
                const isCompleted = currentStageIndex > idx;

                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => handleNavigateStage(st.id)}
                    className={`w-full p-2.5 rounded-xl text-left border text-xs transition-all cursor-pointer flex items-center justify-between ${
                      isCurrent
                        ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold ring-2 ring-amber-400/30 shadow-2xs'
                        : isCompleted
                        ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950 hover:bg-emerald-100/70 font-semibold'
                        : 'bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold shrink-0 ${
                        isCurrent ? 'bg-amber-500 text-white' :
                        isCompleted ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {isCompleted ? '✓' : st.stepNum}
                      </div>
                      <span className="truncate">{st.label}</span>
                    </div>

                    {isCurrent && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prerequisite Knowledge Trace Card */}
          <div className="glass-card rounded-2xl p-4 border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold font-mono uppercase text-slate-700 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-indigo-600" />
                Root-Cause Diagnostic
              </span>
              <span className="text-[10px] font-mono text-rose-600 font-bold uppercase bg-rose-50 px-1.5 py-0.5 rounded">
                Gap Found
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-[10px] text-slate-500 uppercase">Upstream Dependency</div>
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>Velocity Derivatives</span>
                  <span className="text-emerald-600">92%</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 space-y-1">
                <div className="text-[10px] text-rose-700 uppercase font-bold">Prerequisite Gap (Root Cause)</div>
                <div className="font-bold text-rose-900 flex items-center justify-between">
                  <span>Kinematic Acceleration</span>
                  <span>42% ⚠️</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
                <div className="text-[10px] text-amber-800 uppercase font-bold">Target Failed Concept</div>
                <div className="font-bold text-amber-900 flex items-center justify-between">
                  <span>Newton's Second Law</span>
                  <span>42%</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                playClickSound();
                onOpenCitation({
                  id: 'cit-diag-p47',
                  sourceId: 'mat-pdf-01',
                  sourceTitle: 'Physics_Fundamentals_Vol1.pdf',
                  sourceType: 'pdf',
                  pageNumber: 47,
                  snippet: activeSession.detectedRootCause.evidenceSnippet,
                  confidence: 0.98
                });
              }}
              className="w-full py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Inspect Source Grounding (p.47)</span>
            </button>
          </div>
        </aside>

        {/* Stacked Content Cards Column (Mobile & Desktop) */}
        <section className="lg:col-span-8 xl:col-span-9 space-y-4 sm:space-y-5">
          {/* STAGE 1: DIAGNOSIS */}
          {currentStage === 'diagnosed' && (
            <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
              {/* Stacked Card 1: Problem Submission & Error */}
              <div className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-3.5 border border-slate-200 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-rose-600 font-bold text-xs sm:text-sm font-mono">
                    <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>STEP 1: STUDENT MISTAKE & ROOT-CAUSE ANALYSIS</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">Target Concept: Newton's 2nd Law (42%)</span>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-mono uppercase text-slate-500 font-bold">
                    Problem Where Student Failed:
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                    "{activeSession.failedQuestion.question}"
                  </p>

                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1">
                    <div className="font-bold font-mono text-rose-800 flex items-center gap-1.5">
                      <span>Submitted Answer: 60.0 N (Incorrect)</span>
                    </div>
                    <p className="text-xs text-rose-700 leading-relaxed">
                      The student multiplied mass directly by final velocity (4 kg × 15 m/s = 60 N), failing to calculate the rate of change of velocity (a = Δv/Δt).
                    </p>
                  </div>
                </div>
              </div>

              {/* Stacked Card 2: Cognitive Graph Prerequisite Trace */}
              <div className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-3.5 border border-slate-200 shadow-xs">
                <div className="text-xs font-mono uppercase text-indigo-700 font-bold flex items-center gap-1.5 pb-2 border-b border-slate-100">
                  <GitBranch className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>QIRA Cognitive Graph Dependency Trace</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono flex flex-wrap items-center justify-between gap-2 shadow-2xs">
                  <span className="text-slate-600 font-medium">Velocity (92%)</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                  <span className="text-rose-700 font-bold bg-rose-100/80 px-2 py-0.5 rounded border border-rose-300">
                    Acceleration (42% ⚠️ Gap)
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                  <span className="text-amber-800 font-bold">Newton 2nd Law (42%)</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                  {activeSession.detectedRootCause.misconceptionExplanation}
                </p>
              </div>

              {/* Stacked Card 3: Exact Textbook Evidence Card */}
              <div className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-3.5 border border-indigo-100 bg-indigo-50/20 shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-indigo-100">
                  <span className="text-xs font-mono font-bold uppercase text-indigo-800 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    Verified Grounding Evidence (Page 47)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      onOpenCitation({
                        id: 'cit-diag-p47',
                        sourceId: 'mat-pdf-01',
                        sourceTitle: 'Physics_Fundamentals_Vol1.pdf',
                        sourceType: 'pdf',
                        pageNumber: 47,
                        snippet: activeSession.detectedRootCause.evidenceSnippet,
                        confidence: 0.98
                      });
                    }}
                    className="text-xs font-mono font-bold text-indigo-700 hover:text-indigo-900 underline cursor-pointer"
                  >
                    Open Page
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 italic border-l-2 border-indigo-400 pl-3">
                  "{activeSession.detectedRootCause.evidenceSnippet}"
                </p>
              </div>

              {/* Stacked Action Card */}
              <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200 flex justify-end shadow-xs">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    playSwooshSound();
                    setCurrentStage('reviewing_lesson');
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <span>Proceed to Grounded Mini-Lesson (Step 2)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 2: GROUNDED MINI-LESSON */}
          {currentStage === 'reviewing_lesson' && (
            <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
              {/* Stacked Card 1: Overview */}
              <div className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-3.5 border border-slate-200 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs sm:text-sm font-mono">
                    <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>STEP 2: TARGETED SOURCE-GROUNDED MINI-LESSON</span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 font-bold">
                    Grounded in Page 31 & 47
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {activeSession.remedialLesson.summary}
                </h3>
              </div>

              {/* Stacked Card 2: 3 Key Remedial Principles (Stacked for Mobile) */}
              <div className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-3.5 border border-slate-200 shadow-xs">
                <div className="text-xs font-mono uppercase text-slate-500 font-bold pb-2 border-b border-slate-100">
                  Core Foundational Principles:
                </div>

                <div className="space-y-3">
                  {activeSession.remedialLesson.keyPoints.map((point, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3.5">
                      <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stacked Card 3: Mathematical Derivation Sequence */}
              <div className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-3 border border-indigo-200 bg-indigo-50/30 text-center shadow-xs">
                <span className="text-xs font-mono uppercase text-indigo-800 font-bold">
                  The Two-Step Mathematical Sequence:
                </span>
                <div className="font-mono text-indigo-950 text-xs sm:text-sm font-black bg-white p-4 rounded-xl border border-indigo-200 shadow-2xs break-words">
                  {'1. a = (v_final - v_initial) / Δt  ⟶  2. ΣF_net = m · a'}
                </div>
                <p className="text-xs text-slate-600 italic">
                  Example: Cart accelerates from 3.0 m/s to 15.0 m/s in 3.0s =&gt; a = (15-3)/3 = 4.0 m/s² =&gt; F_net = 4 kg × 4 m/s² = 16.0 N.
                </p>
              </div>

              {/* Stacked Action Card */}
              <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setCurrentStage('diagnosed');
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-mono text-slate-600 hover:text-slate-900 font-semibold border border-slate-200 sm:border-transparent hover:bg-slate-100 cursor-pointer text-center"
                >
                  ← Back to Diagnosis
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    playSwooshSound();
                    setCurrentStage('prereq_quiz');
                  }}
                  className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  <span>Take Prerequisite Diagnostic Quiz (Step 3)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 3: PREREQUISITE DIAGNOSTIC CHECK */}
          {currentStage === 'prereq_quiz' && (
            <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
              {/* Stacked Card 1: Question Statement */}
              <div className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-3.5 border border-slate-200 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-amber-700 font-bold text-xs sm:text-sm font-mono">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>STEP 3: PREREQUISITE DIAGNOSTIC CHECK</span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                    Target: Boost Acceleration (42% → 76%)
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                    {activeSession.prerequisiteDiagnosticQuestion.question}
                  </h3>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-indigo-700 font-bold">
                    Formula Reference: a = (v_f - v_i) / Δt
                  </div>
                </div>
              </div>

              {/* Stacked Card 2: Options (Touch-Friendly) */}
              <div className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-3 border border-slate-200 shadow-xs">
                <div className="text-xs font-mono uppercase text-slate-500 font-bold mb-1">
                  Select Acceleration Vector:
                </div>

                <div className="space-y-2.5 sm:space-y-3">
                  {activeSession.prerequisiteDiagnosticQuestion.options?.map((opt) => {
                    const isSelected = prereqAnswer === opt.id;

                    return (
                      <div
                        key={opt.id}
                        onClick={() => {
                          playClickSound();
                          setPrereqAnswer(opt.id);
                        }}
                        className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all cursor-pointer flex items-center justify-between min-h-[52px] select-none ${
                          isSelected
                            ? opt.isCorrect
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-2 ring-emerald-400/30 font-semibold'
                              : 'bg-indigo-50 border-indigo-400 text-indigo-950 ring-2 ring-indigo-400/30'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800 hover:bg-slate-100/80'
                        }`}
                      >
                        <div className="flex items-center gap-3 text-xs sm:text-sm font-medium pr-2">
                          <span className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                            isSelected && opt.isCorrect ? 'bg-emerald-600 text-white' :
                            isSelected ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-300 text-slate-700'
                          }`}>
                            {opt.id.slice(-1).toUpperCase()}
                          </span>
                          <span>{opt.text}</span>
                        </div>

                        {isSelected && opt.isCorrect && (
                          <span className="text-[11px] font-mono text-emerald-700 font-bold shrink-0 bg-emerald-100 px-2 py-0.5 rounded">
                            ✓ CORRECT
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stacked Action Card */}
              <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setCurrentStage('reviewing_lesson');
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-mono text-slate-600 hover:text-slate-900 font-semibold border border-slate-200 sm:border-transparent hover:bg-slate-100 cursor-pointer text-center"
                >
                  ← Back to Lesson
                </button>
                <button
                  type="button"
                  onClick={handlePassPrereq}
                  disabled={!prereqAnswer}
                  className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>Verify & Unlock Retest (Step 4)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 4: TARGET CONCEPT RETEST */}
          {currentStage === 'retesting_target' && (
            <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
              {/* Stacked Card 1: Problem Statement */}
              <div className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-3.5 border border-slate-200 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs sm:text-sm font-mono">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>STEP 4: TARGET CONCEPT RETEST (NEWTON'S 2ND LAW)</span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Acceleration Prerequisite Secured (76%)
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                    {SAMPLE_ASSESSMENT_QUESTIONS[2].question}
                  </h3>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-indigo-700 font-bold">
                    {'Two-Step Resolution: 1. a = (v_f - v_i)/Δt  ⟶  2. F_net = m · a'}
                  </div>
                </div>
              </div>

              {/* Stacked Card 2: Options */}
              <div className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-3 border border-slate-200 shadow-xs">
                <div className="text-xs font-mono uppercase text-slate-500 font-bold mb-1">
                  Select Net External Force:
                </div>

                <div className="space-y-2.5 sm:space-y-3">
                  {SAMPLE_ASSESSMENT_QUESTIONS[2].options?.map((opt) => {
                    const isSelected = retestAnswer === opt.id;

                    return (
                      <div
                        key={opt.id}
                        onClick={() => {
                          playClickSound();
                          setRetestAnswer(opt.id);
                        }}
                        className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all cursor-pointer flex items-center justify-between min-h-[52px] select-none ${
                          isSelected
                            ? opt.isCorrect
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-2 ring-emerald-400/30 font-semibold'
                              : 'bg-indigo-50 border-indigo-400 text-indigo-950 ring-2 ring-indigo-400/30'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800 hover:bg-slate-100/80'
                        }`}
                      >
                        <div className="flex items-center gap-3 text-xs sm:text-sm font-medium pr-2">
                          <span className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                            isSelected && opt.isCorrect ? 'bg-emerald-600 text-white' :
                            isSelected ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-300 text-slate-700'
                          }`}>
                            {opt.id.slice(-1).toUpperCase()}
                          </span>
                          <span>{opt.text}</span>
                        </div>

                        {isSelected && opt.isCorrect && (
                          <span className="text-[11px] font-mono text-emerald-700 font-bold shrink-0 bg-emerald-100 px-2 py-0.5 rounded">
                            ✓ CORRECT
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stacked Action Card */}
              <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setCurrentStage('prereq_quiz');
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-mono text-slate-600 hover:text-slate-900 font-semibold border border-slate-200 sm:border-transparent hover:bg-slate-100 cursor-pointer text-center"
                >
                  ← Back to Prereq Quiz
                </button>
                <button
                  type="button"
                  onClick={handlePassRetest}
                  disabled={!retestAnswer}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>Submit & Finalize Proof (Step 5)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 5: CLOSED-LOOP VICTORY */}
          {currentStage === 'mastery_improved' && (
            <div className="space-y-4 sm:space-y-5 animate-in zoom-in-95 duration-300">
              {/* Stacked Card 1: Victory Badge Card */}
              <div className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-10 border-2 border-emerald-400 bg-gradient-to-b from-white via-emerald-50/40 to-white text-center space-y-4 shadow-md">
                <div className="inline-flex p-4 rounded-3xl bg-emerald-100 text-emerald-600 border border-emerald-300 shadow-md">
                  <Award className="w-10 h-10 sm:w-12 sm:h-12" />
                </div>

                <div className="space-y-1.5 max-w-xl mx-auto">
                  <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase">
                    Closed-Loop Remediation Verified
                  </span>
                  <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Root-Cause Remediation Complete!
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    The student pinpointed and resolved the prerequisite kinematic acceleration gap, passing the target Newton’s Second Law retest with verified closed-loop mastery recovery.
                  </p>
                </div>
              </div>

              {/* Stacked Card 2 & 3: Before & After Mastery Gains */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Acceleration Gain Card */}
                <div className="glass-card rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2.5">
                  <span className="text-xs font-mono text-slate-500 font-semibold uppercase">
                    Prerequisite: Acceleration
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-base font-mono text-rose-500 line-through font-bold">42%</span>
                    <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-2xl font-mono font-black text-emerald-600">76%</span>
                    <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-bold">
                      +34% Gain
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '76%' }} />
                  </div>
                </div>

                {/* Newton 2nd Law Gain Card */}
                <div className="glass-card rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2.5">
                  <span className="text-xs font-mono text-slate-500 font-semibold uppercase">
                    Target: Newton's 2nd Law
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-base font-mono text-rose-500 line-through font-bold">42%</span>
                    <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-2xl font-mono font-black text-emerald-600">68%</span>
                    <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-bold">
                      +26% Gain
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '68%' }} />
                  </div>
                </div>
              </div>

              {/* Stacked Action Card */}
              <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-center gap-3 shadow-xs">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setCurrentStage('diagnosed');
                    setPrereqAnswer(null);
                    setRetestAnswer(null);
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold transition-all shadow-md active:scale-95 cursor-pointer text-center"
                >
                  Replay Demo 4 Flow
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
