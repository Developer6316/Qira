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
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

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

  const stagesList = [
    { id: 'diagnosed', label: '1. Root Cause Diagnosis' },
    { id: 'reviewing_lesson', label: '2. Grounded Mini-Lesson' },
    { id: 'prereq_quiz', label: '3. Prerequisite Diagnostic' },
    { id: 'retesting_target', label: '4. Target Retest' },
    { id: 'mastery_improved', label: '5. Closed-Loop Victory' },
  ];

  const handlePassPrereq = () => {
    if (prereqAnswer === 'opt-acc-a') {
      onUpdateMastery('acceleration', 0.76, 'Remediation Mini-Quiz passed: Kinematic Acceleration');
      setCurrentStage('retesting_target');
      try {
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  const handlePassRetest = () => {
    if (retestAnswer === 'opt-ret-a') {
      onUpdateMastery('newton-2', 0.68, 'Remediation Retest Passed: Newton Second Law');
      setCurrentStage('mastery_improved');
      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      } catch (e) {}
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner (Bright Gradient) */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-white/20 text-white border border-white/30 backdrop-blur-xs">
                SYSTEM 5: KILLER FEATURE #1
              </span>
              <span className="text-xs text-amber-100 font-medium">Root-Cause Adaptive Remediation Loop</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2 flex-wrap">
              <span>Closed-Loop Root-Cause Diagnosis & Remediation</span>
              <span className="text-xs font-mono font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-md">
                DEMO 4 SHOWCASE
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-amber-100 max-w-2xl leading-relaxed">
              Traditional AI simply marks a wrong answer. QIRA traces the prerequisite graph, detects the upstream gap in <strong className="text-white underline">Acceleration</strong>, remediates it from <strong className="text-white underline">Page 47</strong>, and retests to demonstrate measurable mastery recovery.
            </p>
          </div>

          <button
            onClick={onResetSession}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 self-start md:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
            <span>Reset Demo 4 Flow</span>
          </button>
        </div>
      </div>

      {/* 5-Stage Visual Progress Stepper */}
      <div className="glass-card rounded-2xl p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {stagesList.map((st, idx) => {
            const isCurrent = currentStage === st.id;
            const isCompleted = stagesList.findIndex(s => s.id === currentStage) > idx;

            return (
              <div
                key={st.id}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                  isCurrent
                    ? 'bg-amber-50 border-amber-300 text-amber-900 ring-2 ring-amber-400/30'
                    : isCompleted
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${
                  isCurrent
                    ? 'bg-amber-500 text-white'
                    : isCompleted
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <span className="truncate">{st.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* STAGE 1: DIAGNOSIS */}
      {currentStage === 'diagnosed' && (
        <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-sm font-mono">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <span>STEP 1: STUDENT MISTAKE & PREREQUISITE GAP ANALYSIS</span>
            </div>
            <span className="text-xs font-mono text-slate-500 font-semibold">Target Concept: Newton's 2nd Law (42%)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Failed Submission Card */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-xs font-mono uppercase text-slate-500 font-bold">
                Student's Failed Problem Submission:
              </div>
              <p className="text-xs text-slate-800 font-medium leading-relaxed">
                "{activeSession.failedQuestion.question}"
              </p>
              <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
                <div className="font-bold font-mono">Submitted Answer: 60.0 N (Incorrect)</div>
                <p className="text-[11px] text-rose-700">
                  Student multiplied mass directly by final velocity (4 kg × 15 m/s = 60 N).
                </p>
              </div>
            </div>

            {/* Cognitive Graph Diagnosis */}
            <div className="p-5 rounded-xl bg-slate-50 border border-indigo-200 space-y-3">
              <div className="text-xs font-mono uppercase text-indigo-700 font-bold flex items-center gap-1.5">
                <GitBranch className="w-4 h-4 text-indigo-600" />
                <span>QIRA Prerequisite Dependency Trace:</span>
              </div>

              {/* Visual Dependency Trace */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200 text-xs font-mono shadow-2xs">
                <span className="text-slate-600 font-medium">Velocity (92%)</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
                <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  Acceleration (42% ⚠️ Gap)
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
                <span className="text-amber-800 font-bold">Newton 2nd Law (42%)</span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-sans">
                {activeSession.detectedRootCause.misconceptionExplanation}
              </p>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <button
                  onClick={() => {
                    const cit: SourceCitation = {
                      id: 'cit-diag-p47',
                      sourceId: 'mat-pdf-01',
                      sourceTitle: 'Physics_Fundamentals_Vol1.pdf',
                      sourceType: 'pdf',
                      pageNumber: 47,
                      snippet: activeSession.detectedRootCause.evidenceSnippet,
                      confidence: 0.98
                    };
                    onOpenCitation(cit);
                  }}
                  className="text-indigo-700 hover:text-indigo-900 font-mono font-semibold flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Inspect Source: Page 47</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStage('reviewing_lesson')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <span>Proceed to Grounded Mini-Lesson (Step 2)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 2: GROUNDED MINI-LESSON */}
      {currentStage === 'reviewing_lesson' && (
        <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm font-mono">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span>STEP 2: TARGETED SOURCE-GROUNDED MINI-LESSON</span>
            </div>
            <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 font-bold">
              Grounded in Page 31 & 47
            </span>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              {activeSession.remedialLesson.summary}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeSession.remedialLesson.keyPoints.map((point, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center justify-center font-mono text-xs font-bold">
                    {idx + 1}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans">
                    {point}
                  </p>
                </div>
              ))}
            </div>

            {/* Core Mathematical Derivation */}
            <div className="p-6 rounded-xl bg-indigo-50/50 border border-indigo-200 text-center space-y-2 shadow-2xs">
              <span className="text-xs font-mono uppercase text-indigo-800 font-bold">The Correct Mathematical Sequence:</span>
              <div className="font-mono text-indigo-900 text-sm font-black bg-white py-3 rounded-lg border border-indigo-200 shadow-2xs">
                {'1. a = (v_final - v_initial) / Δt  ⟶  2. ΣF_net = m · a'}
              </div>
              <p className="text-xs text-slate-600 italic">
                Example: Cart accelerates from 3.0 m/s to 15.0 m/s in 3.0s =&gt; a = (15-3)/3 = 4.0 m/s² =&gt; F_net = 4 kg × 4 m/s² = 16.0 N.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStage('diagnosed')}
              className="text-xs font-mono text-slate-500 hover:text-slate-800 font-semibold"
            >
              ← Back to Diagnosis
            </button>
            <button
              onClick={() => setCurrentStage('prereq_quiz')}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/20"
            >
              <span>Take Prerequisite Diagnostic Quiz (Step 3)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 3: PREREQUISITE DIAGNOSTIC QUIZ */}
      {currentStage === 'prereq_quiz' && (
        <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 text-amber-700 font-bold text-sm font-mono">
              <CheckCircle2 className="w-5 h-5 text-amber-600" />
              <span>STEP 3: PREREQUISITE DIAGNOSTIC CHECK (ACCELERATION)</span>
            </div>
            <span className="text-xs font-mono text-slate-500 font-semibold">Passing boosts Acceleration: 42% → 76%</span>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {activeSession.prerequisiteDiagnosticQuestion.question}
            </h3>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-indigo-700 font-bold">
              Formula: a = (v_f - v_i) / Δt
            </div>

            <div className="space-y-3">
              {activeSession.prerequisiteDiagnosticQuestion.options?.map((opt) => {
                const isSelected = prereqAnswer === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setPrereqAnswer(opt.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? opt.isCorrect
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-400/30 font-semibold'
                          : 'bg-indigo-50 border-indigo-400 text-indigo-900 ring-2 ring-indigo-400/30'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 text-sm font-medium">
                      <span className="w-6 h-6 rounded-full bg-white border border-slate-300 flex items-center justify-center font-mono text-xs text-slate-600 font-bold">
                        {opt.id.slice(-1).toUpperCase()}
                      </span>
                      <span>{opt.text}</span>
                    </div>
                    {isSelected && opt.isCorrect && (
                      <span className="text-xs font-mono text-emerald-700 font-bold">✓ CORRECT!</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStage('reviewing_lesson')}
              className="text-xs font-mono text-slate-500 hover:text-slate-800 font-semibold"
            >
              ← Back to Lesson
            </button>
            <button
              onClick={handlePassPrereq}
              disabled={!prereqAnswer}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Verify & Unlock Retest (Step 4)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 4: TARGET RETEST */}
      {currentStage === 'retesting_target' && (
        <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm font-mono">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>STEP 4: TARGET CONCEPT RETEST (NEWTON'S SECOND LAW)</span>
            </div>
            <span className="text-xs font-mono text-emerald-700 font-semibold">Acceleration Mastery Secured (76%)</span>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {SAMPLE_ASSESSMENT_QUESTIONS[2].question}
            </h3>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-indigo-700 font-bold">
              {'Step 1: Compute a = (v_f - v_i)/Δt ⟶ Step 2: Compute F_net = m · a'}
            </div>

            <div className="space-y-3">
              {SAMPLE_ASSESSMENT_QUESTIONS[2].options?.map((opt) => {
                const isSelected = retestAnswer === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setRetestAnswer(opt.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? opt.isCorrect
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-400/30 font-semibold'
                          : 'bg-indigo-50 border-indigo-400 text-indigo-900 ring-2 ring-indigo-400/30'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 text-sm font-medium">
                      <span className="w-6 h-6 rounded-full bg-white border border-slate-300 flex items-center justify-center font-mono text-xs text-slate-600 font-bold">
                        {opt.id.slice(-1).toUpperCase()}
                      </span>
                      <span>{opt.text}</span>
                    </div>
                    {isSelected && opt.isCorrect && (
                      <span className="text-xs font-mono text-emerald-700 font-bold">✓ CORRECT!</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStage('prereq_quiz')}
              className="text-xs font-mono text-slate-500 hover:text-slate-800 font-semibold"
            >
              ← Back to Prereq Quiz
            </button>
            <button
              onClick={handlePassRetest}
              disabled={!retestAnswer}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Submit & Finalize Closed-Loop Proof (Step 5)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 5: CLOSED LOOP VICTORY */}
      {currentStage === 'mastery_improved' && (
        <div className="bg-gradient-to-b from-white via-emerald-50/40 to-white border-2 border-emerald-400 rounded-2xl p-8 sm:p-12 space-y-6 text-center animate-in zoom-in-95 duration-300 shadow-lg">
          <div className="inline-flex p-4 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-300 shadow-md shadow-emerald-500/10">
            <Award className="w-12 h-12" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase">
              Closed-Loop Remediation Verified
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Root-Cause Remediation Complete!
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              The student resolved the prerequisite acceleration gap and successfully passed the target Newton’s Second Law retest.
            </p>
          </div>

          {/* Mastery Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-mono text-slate-500 font-semibold">Prerequisite (Acceleration):</span>
              <div className="flex items-center gap-3">
                <span className="text-lg font-mono text-rose-500 line-through font-bold">42%</span>
                <ArrowRight className="w-4 h-4 text-emerald-600" />
                <span className="text-2xl font-mono font-black text-emerald-600">76%</span>
                <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-bold">
                  +34% Gain
                </span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-mono text-slate-500 font-semibold">Target (Newton's 2nd Law):</span>
              <div className="flex items-center gap-3">
                <span className="text-lg font-mono text-rose-500 line-through font-bold">42%</span>
                <ArrowRight className="w-4 h-4 text-emerald-600" />
                <span className="text-2xl font-mono font-black text-emerald-600">68%</span>
                <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-bold">
                  +26% Gain
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-center gap-4">
            <button
              onClick={() => {
                setCurrentStage('diagnosed');
                setPrereqAnswer(null);
                setRetestAnswer(null);
              }}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold transition-all shadow-md active:scale-95"
            >
              Replay Demo 4 Flow
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
