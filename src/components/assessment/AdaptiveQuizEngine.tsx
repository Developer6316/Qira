import React, { useState } from 'react';
import { AssessmentQuestion, ConceptMastery, SourceCitation } from '../../types';
import { SAMPLE_ASSESSMENT_QUESTIONS } from '../../data/defaultCourse';
import { calculateMasteryUpdate } from '../../data/conceptGraph';
import { 
  CheckSquare, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Sparkles, 
  FileText, 
  RotateCcw, 
  Zap, 
  GitBranch,
  ChevronDown,
  ChevronUp,
  Layers,
  Award,
  BookOpen,
  Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClickSound, playSuccessChime, playSwooshSound } from '../../utils/soundEffects';

interface AdaptiveQuizEngineProps {
  masteryMap: Record<string, ConceptMastery>;
  onUpdateMastery: (conceptId: string, newScore: number, reason: string) => void;
  onOpenCitation: (citation: SourceCitation) => void;
  onTriggerRemediation: (question: AssessmentQuestion, selectedOptionId: string) => void;
}

interface QuestionSubmissionRecord {
  selectedOptionId: string;
  isCorrect: boolean;
  scoreDelta: number;
}

export const AdaptiveQuizEngine: React.FC<AdaptiveQuizEngineProps> = ({
  masteryMap,
  onUpdateMastery,
  onOpenCitation,
  onTriggerRemediation
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  
  // Track submissions per question to show status in side navigator
  const [submissions, setSubmissions] = useState<Record<number, QuestionSubmissionRecord>>({});

  const questions = SAMPLE_ASSESSMENT_QUESTIONS;
  const currentQ = questions[currentQuestionIndex] || questions[0];
  const selectedOption = currentQ.options?.find(o => o.id === selectedOptionId);
  const isCorrect = selectedOption?.isCorrect ?? false;

  const currentConceptMastery = masteryMap[currentQ.conceptId]?.masteryScore ?? 0.5;

  const handleSelectOption = (optionId: string) => {
    if (isSubmitted) return;
    playClickSound();
    setSelectedOptionId(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOptionId || isSubmitted) return;
    playClickSound();
    setIsSubmitted(true);

    const { newScore, delta } = calculateMasteryUpdate(currentConceptMastery, isCorrect, currentQ.difficulty);

    // Save record for navigation indicators
    setSubmissions(prev => ({
      ...prev,
      [currentQuestionIndex]: {
        selectedOptionId,
        isCorrect,
        scoreDelta: delta
      }
    }));

    onUpdateMastery(
      currentQ.conceptId,
      newScore,
      isCorrect ? `Passed ${currentQ.conceptName}` : `Failed ${currentQ.conceptName} (${selectedOption?.misconceptionTag || 'error'})`
    );

    if (isCorrect) {
      playSuccessChime();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch {
        // ignore
      }
    } else {
      playClickSound();
    }
  };

  const handleNextQuestion = () => {
    playClickSound();
    playSwooshSound();
    const nextIdx = (currentQuestionIndex + 1) % questions.length;
    setCurrentQuestionIndex(nextIdx);
    
    // Restore or clear submission state
    if (submissions[nextIdx]) {
      setSelectedOptionId(submissions[nextIdx].selectedOptionId);
      setIsSubmitted(true);
    } else {
      setSelectedOptionId(null);
      setIsSubmitted(false);
    }
  };

  const handleJumpToQuestion = (idx: number) => {
    playClickSound();
    setCurrentQuestionIndex(idx);
    setIsMobileNavOpen(false); // Auto-collapse on mobile after selection
    if (submissions[idx]) {
      setSelectedOptionId(submissions[idx].selectedOptionId);
      setIsSubmitted(true);
    } else {
      setSelectedOptionId(null);
      setIsSubmitted(false);
    }
  };

  const answeredCount = Object.keys(submissions).length;
  const correctCount = Object.values(submissions).filter(s => s.isCorrect).length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Banner (Responsive & Compact) */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/20 text-white border border-white/30 backdrop-blur-xs">
                MODULE 4 OF 7
              </span>
              <span className="text-xs text-indigo-100 font-medium">Bayesian Adaptive Assessment</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
              Adaptive Quiz & Diagnostic Engine
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100 max-w-2xl leading-relaxed">
              Dynamically calibrated to your mastery level. Misconceptions are tagged to instantly pinpoint prerequisite gaps.
            </p>
          </div>

          {/* Quick Progress KPI Pill */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20 self-start md:self-auto text-xs font-mono">
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-indigo-200 uppercase font-bold">Progress</span>
              <span className="font-bold text-white text-sm">{answeredCount} / {questions.length} Answered</span>
            </div>
            <div className="w-px h-7 bg-white/20" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-indigo-200 uppercase font-bold">Accuracy</span>
              <span className="font-bold text-emerald-300 text-sm">
                {answeredCount > 0 ? `${Math.round((correctCount / answeredCount) * 100)}%` : '--'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Collapsible Navigation Header Bar (Visible on < lg screens) */}
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
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                {currentQuestionIndex + 1}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-800 truncate">
                  Question {currentQuestionIndex + 1} of {questions.length}: {currentQ.conceptName}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Tap to view question navigator & concept mastery
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                {isMobileNavOpen ? 'Hide' : 'Questions'}
              </span>
              {isMobileNavOpen ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </div>
          </button>

          {/* Collapsible Drawer Content */}
          {isMobileNavOpen && (
            <div className="p-4 border-t border-slate-100 bg-slate-50/70 space-y-4 animate-in slide-in-from-top-2 duration-150">
              {/* Question selector grid */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono font-bold uppercase text-slate-500">
                  Select Question:
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {questions.map((q, idx) => {
                    const record = submissions[idx];
                    const isCurrent = currentQuestionIndex === idx;

                    return (
                      <button
                        key={q.id || idx}
                        type="button"
                        onClick={() => handleJumpToQuestion(idx)}
                        className={`p-2.5 rounded-xl text-left border text-xs transition-all cursor-pointer flex flex-col justify-between ${
                          isCurrent
                            ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                            : record?.isCorrect
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                            : record && !record.isCorrect
                            ? 'bg-rose-50 border-rose-300 text-rose-900'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-mono font-bold text-xs ${isCurrent ? 'text-white' : 'text-slate-800'}`}>
                            Q{idx + 1}
                          </span>
                          {record?.isCorrect ? (
                            <CheckCircle2 className={`w-3.5 h-3.5 ${isCurrent ? 'text-white' : 'text-emerald-600'}`} />
                          ) : record && !record.isCorrect ? (
                            <XCircle className={`w-3.5 h-3.5 ${isCurrent ? 'text-white' : 'text-rose-600'}`} />
                          ) : null}
                        </div>
                        <span className={`text-[10px] truncate ${isCurrent ? 'text-indigo-100' : 'text-slate-500'}`}>
                          {q.conceptName.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Active Concept Mini Card */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase text-slate-500 font-bold">Active Concept Mastery</span>
                  <span className="font-mono font-bold text-indigo-700">
                    {Math.round(currentConceptMastery * 100)}%
                  </span>
                </div>
                <div className="font-bold text-slate-800">{currentQ.conceptName}</div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                  <div 
                    className="bg-indigo-600 h-full rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min(100, Math.max(5, currentConceptMastery * 100))}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Responsive Grid Layout (Desktop Side-Nav + Stacked Content Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Desktop Side Navigation Column (Visible on lg+) */}
        <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 space-y-4 sticky top-20">
          {/* Question Navigator Card */}
          <div className="glass-card rounded-2xl p-4 border border-slate-200 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold font-mono uppercase text-slate-800">
                  Question Navigator
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                {answeredCount}/{questions.length} Done
              </span>
            </div>

            {/* Questions List */}
            <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                const record = submissions[idx];
                const isCurrent = currentQuestionIndex === idx;

                return (
                  <button
                    key={q.id || idx}
                    type="button"
                    onClick={() => handleJumpToQuestion(idx)}
                    className={`w-full p-2.5 rounded-xl text-left border text-xs transition-all cursor-pointer flex items-center justify-between ${
                      isCurrent
                        ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                        : record?.isCorrect
                        ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950 hover:bg-emerald-100/70'
                        : record && !record.isCorrect
                        ? 'bg-rose-50/80 border-rose-200 text-rose-950 hover:bg-rose-100/70'
                        : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                        isCurrent 
                          ? 'bg-white text-indigo-700' 
                          : 'bg-white border border-slate-200 text-slate-600'
                      }`}>
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className={`font-bold truncate text-xs ${isCurrent ? 'text-white' : 'text-slate-800'}`}>
                          {q.conceptName}
                        </div>
                        <div className={`text-[10px] font-mono capitalize ${isCurrent ? 'text-indigo-200' : 'text-slate-500'}`}>
                          {q.difficulty < 0.4 ? 'Easy' : q.difficulty < 0.7 ? 'Medium' : 'Hard'} · {q.type.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 ml-2">
                      {record?.isCorrect ? (
                        <CheckCircle2 className={`w-4 h-4 ${isCurrent ? 'text-white' : 'text-emerald-600'}`} />
                      ) : record && !record.isCorrect ? (
                        <XCircle className={`w-4 h-4 ${isCurrent ? 'text-white' : 'text-rose-600'}`} />
                      ) : isCurrent ? (
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Concept Mastery Live Card */}
          <div className="glass-card rounded-2xl p-4 border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold font-mono uppercase text-slate-700 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-indigo-600" />
                Concept BKT State
              </span>
              <span className="text-[11px] font-mono font-bold text-indigo-700">
                {Math.round(currentConceptMastery * 100)}%
              </span>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-900">{currentQ.conceptName}</div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1.5">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    currentConceptMastery >= 0.85 ? 'bg-emerald-500' :
                    currentConceptMastery >= 0.70 ? 'bg-sky-500' :
                    currentConceptMastery >= 0.50 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(5, currentConceptMastery * 100))}%` }}
                />
              </div>
            </div>

            <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between pt-1">
              <span>Status: <strong className="capitalize text-slate-800">{masteryMap[currentQ.conceptId]?.status || 'developing'}</strong></span>
              <span>Attempts: {masteryMap[currentQ.conceptId]?.attemptsCount || 0}</span>
            </div>
          </div>
        </aside>

        {/* Stacked Content Cards Column (Mobile & Desktop) */}
        <section className="lg:col-span-8 xl:col-span-9 space-y-4 sm:space-y-5">
          {/* STACKED CARD 1: Question Header & Statement Card */}
          <div className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-4 border border-slate-200 shadow-xs">
            {/* Question Metadata Header */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-mono text-xs font-bold border border-indigo-200">
                  {currentQ.conceptName}
                </span>

                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase ${
                  currentQ.difficulty < 0.4 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                  currentQ.difficulty < 0.7 ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                  'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {currentQ.difficulty < 0.4 ? 'Easy' : currentQ.difficulty < 0.7 ? 'Medium' : 'Hard'} Difficulty
                </span>
              </div>

              <div className="text-xs font-mono text-slate-500 font-medium">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                {currentQ.question}
              </h3>

              {currentQ.formulaContext && (
                <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-indigo-700 font-semibold flex items-center gap-2">
                  <span className="text-slate-400 font-bold shrink-0">Law:</span>
                  <span className="break-words">{currentQ.formulaContext}</span>
                </div>
              )}
            </div>
          </div>

          {/* STACKED CARD 2: Interactive Multiple Choice Options Card */}
          <div className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-3 border border-slate-200 shadow-xs">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold mb-1">
              Select Your Answer:
            </div>

            <div className="space-y-2.5 sm:space-y-3">
              {currentQ.options?.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                let optionStyles = 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800 hover:bg-slate-100/80';

                if (isSelected && !isSubmitted) {
                  optionStyles = 'bg-indigo-50/90 border-indigo-500 text-indigo-950 ring-2 ring-indigo-500/30 font-semibold shadow-2xs';
                } else if (isSubmitted) {
                  if (opt.isCorrect) {
                    optionStyles = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold ring-2 ring-emerald-400/30 shadow-2xs';
                  } else if (isSelected && !opt.isCorrect) {
                    optionStyles = 'bg-rose-50 border-rose-400 text-rose-950 font-bold ring-2 ring-rose-400/30 shadow-2xs';
                  }
                }

                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all cursor-pointer flex items-center justify-between min-h-[52px] select-none ${optionStyles}`}
                  >
                    <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 pr-2">
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-colors ${
                        isSelected && !isSubmitted ? 'bg-indigo-600 text-white' :
                        isSubmitted && opt.isCorrect ? 'bg-emerald-600 text-white' :
                        isSubmitted && isSelected && !opt.isCorrect ? 'bg-rose-600 text-white' :
                        'bg-white border border-slate-300 text-slate-700 shadow-2xs'
                      }`}>
                        {opt.id.slice(-1).toUpperCase()}
                      </div>
                      <span className="text-xs sm:text-sm leading-relaxed">{opt.text}</span>
                    </div>

                    <div className="shrink-0">
                      {isSubmitted && opt.isCorrect && (
                        <span className="text-[11px] font-mono font-bold text-emerald-700 flex items-center gap-1 bg-emerald-100/70 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Correct
                        </span>
                      )}
                      {isSubmitted && isSelected && !opt.isCorrect && (
                        <span className="text-[11px] font-mono font-bold text-rose-700 flex items-center gap-1 bg-rose-100/70 px-2 py-0.5 rounded">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" /> Incorrect
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STACKED CARD 3: Touch-Optimized Response Action Card */}
          <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="text-xs text-slate-500 font-mono font-medium">
              {!isSubmitted 
                ? selectedOptionId ? 'Answer chosen · Ready to submit' : 'Select an answer option to proceed'
                : isCorrect ? '🎉 Correct answer verified!' : '⚠️ Misconception vector detected'}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
              {!isSubmitted ? (
                <button
                  type="button"
                  onClick={handleSubmitAnswer}
                  disabled={!selectedOptionId}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-center"
                >
                  Submit Answer
                </button>
              ) : (
                <>
                  {!isCorrect && (
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound();
                        onTriggerRemediation(currentQ, selectedOptionId!);
                      }}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 text-white text-xs font-bold transition-all shadow-md shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                    >
                      <GitBranch className="w-4 h-4 shrink-0" />
                      <span>Launch Root-Cause Remediation (Demo 4)</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* STACKED CARD 4: Post-Submission Diagnostic & Source Grounding Card */}
          {isSubmitted && (
            <div className={`glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-7 border space-y-3.5 animate-in fade-in duration-200 shadow-xs ${
              isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-200/60">
                <span className="font-bold text-xs font-mono uppercase flex items-center gap-1.5">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-emerald-800">Mastery Assessment: Boosted (+BKT Delta)</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span className="text-rose-800">Root-Cause Vector Identified</span>
                    </>
                  )}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    const cit: SourceCitation = {
                      id: `cit-${currentQ.id}`,
                      sourceId: 'mat-pdf-01',
                      sourceTitle: 'Physics_Fundamentals_Vol1.pdf',
                      sourceType: 'pdf',
                      pageNumber: 47,
                      snippet: currentQ.detailedSolution,
                      confidence: 0.98
                    };
                    onOpenCitation(cit);
                  }}
                  className="text-xs font-mono text-indigo-700 hover:text-indigo-900 font-semibold flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>Page 47 Grounding Reference</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                {currentQ.detailedSolution}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
