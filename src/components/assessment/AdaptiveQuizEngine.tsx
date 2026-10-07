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
  GitBranch
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClickSound, playSuccessChime, playSwooshSound } from '../../utils/soundEffects';

interface AdaptiveQuizEngineProps {
  masteryMap: Record<string, ConceptMastery>;
  onUpdateMastery: (conceptId: string, newScore: number, reason: string) => void;
  onOpenCitation: (citation: SourceCitation) => void;
  onTriggerRemediation: (question: AssessmentQuestion, selectedOptionId: string) => void;
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

  const questions = SAMPLE_ASSESSMENT_QUESTIONS;
  const currentQ = questions[currentQuestionIndex] || questions[0];
  const selectedOption = currentQ.options?.find(o => o.id === selectedOptionId);
  const isCorrect = selectedOption?.isCorrect ?? false;

  const handleSelectOption = (optionId: string) => {
    if (isSubmitted) return;
    setSelectedOptionId(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOptionId || isSubmitted) return;
    setIsSubmitted(true);

    const currentConceptMastery = masteryMap[currentQ.conceptId]?.masteryScore ?? 0.5;
    const { newScore, delta } = calculateMasteryUpdate(currentConceptMastery, isCorrect, currentQ.difficulty);

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
      } catch (e) {
        // ignore
      }
    } else {
      playClickSound();
    }
  };

  const handleNextQuestion = () => {
    playSwooshSound();
    setSelectedOptionId(null);
    setIsSubmitted(false);
    setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner (Bright Gradient) */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-white/20 text-white border border-white/30 backdrop-blur-xs">
                SYSTEM 4 OF 7
              </span>
              <span className="text-xs text-indigo-100 font-medium">Adaptive Assessment Engine & Live Grading</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Source-Grounded Adaptive Assessment & Diagnostics
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100 max-w-2xl leading-relaxed">
              Every question is dynamically calibrated to the student's mastery state. Submissions are tagged with precise misconception vectors to diagnose root cause knowledge gaps.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-white/30 text-xs font-mono font-bold text-white">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        {/* Question Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5 flex-wrap">
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

          <span className="text-xs font-mono text-slate-500 font-semibold">
            BKT Difficulty Weight: {currentQ.difficulty}
          </span>
        </div>

        {/* Question Text */}
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            {currentQ.question}
          </h3>
          {currentQ.formulaContext && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-indigo-700 font-semibold">
              Governing Law: {currentQ.formulaContext}
            </div>
          )}
        </div>

        {/* Multiple Choice Options */}
        <div className="space-y-3">
          {currentQ.options?.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            let optionStyles = 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800 hover:bg-slate-100/70';

            if (isSelected && !isSubmitted) {
              optionStyles = 'bg-indigo-50 border-indigo-500 text-indigo-950 ring-2 ring-indigo-500/30 font-semibold shadow-xs';
            } else if (isSubmitted) {
              if (opt.isCorrect) {
                optionStyles = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold ring-2 ring-emerald-400/30 shadow-xs';
              } else if (isSelected && !opt.isCorrect) {
                optionStyles = 'bg-rose-50 border-rose-400 text-rose-950 font-bold ring-2 ring-rose-400/30 shadow-xs';
              }
            }

            return (
              <div
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${optionStyles}`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold transition-colors ${
                    isSelected && !isSubmitted ? 'bg-indigo-600 text-white' :
                    isSubmitted && opt.isCorrect ? 'bg-emerald-600 text-white' :
                    isSubmitted && isSelected && !opt.isCorrect ? 'bg-rose-600 text-white' :
                    'bg-white border border-slate-300 text-slate-700'
                  }`}>
                    {opt.id.slice(-1).toUpperCase()}
                  </div>
                  <span className="text-sm">{opt.text}</span>
                </div>

                {isSubmitted && opt.isCorrect && (
                  <span className="text-xs font-mono font-bold text-emerald-700 flex items-center gap-1 bg-emerald-100/70 px-2 py-0.5 rounded">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Correct
                  </span>
                )}
                {isSubmitted && isSelected && !opt.isCorrect && (
                  <span className="text-xs font-mono font-bold text-rose-700 flex items-center gap-1 bg-rose-100/70 px-2 py-0.5 rounded">
                    <XCircle className="w-4 h-4 text-rose-600" /> Incorrect
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="text-xs text-slate-500 font-mono font-medium">
            {!isSubmitted ? 'Select an answer option to submit' : isCorrect ? 'Answer correct!' : 'Misconception detected'}
          </div>

          <div className="flex items-center gap-3">
            {!isSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedOptionId}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/20 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Submit Answer
              </button>
            ) : (
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                {!isCorrect && (
                  <button
                    onClick={() => onTriggerRemediation(currentQ, selectedOptionId!)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 text-white text-xs font-bold transition-all shadow-md shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <GitBranch className="w-4 h-4" />
                    <span>Launch Root-Cause Remediation (Demo 4)</span>
                  </button>
                )}
                <button
                  onClick={handleNextQuestion}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Post-Submission Feedback Diagnostic */}
        {isSubmitted && (
          <div className={`p-5 rounded-2xl border space-y-3 animate-in fade-in duration-200 ${
            isCorrect ? 'bg-emerald-50/70 border-emerald-200' : 'bg-rose-50/70 border-rose-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs font-mono uppercase flex items-center gap-1.5">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-800">Knowledge Tracing Update: Mastery Boosted</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span className="text-rose-800">Diagnostic Root Cause Vector Identified</span>
                  </>
                )}
              </span>

              <button
                onClick={() => {
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
                className="text-xs font-mono text-indigo-700 hover:text-indigo-900 font-semibold flex items-center gap-1"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                <span>Page 47 Grounding Reference</span>
              </button>
            </div>

            <p className="text-xs text-slate-800 leading-relaxed font-sans">
              {currentQ.detailedSolution}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
