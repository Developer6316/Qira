import React, { useState } from 'react';
import { ActiveTab } from './Header';
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen, 
  MessageSquareQuote, 
  ShieldAlert, 
  GitBranch, 
  FlaskConical,
  Play
} from 'lucide-react';

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tab: ActiveTab) => void;
  onTriggerDemoAction?: (stepIndex: number) => void;
}

export const DemoTourModal: React.FC<DemoTourModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
  onTriggerDemoAction
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const demoSteps = [
    {
      title: 'DEMO 1 — Multimodal Ingestion Engine',
      tab: 'ingest' as ActiveTab,
      icon: BookOpen,
      badge: 'Multimodal Ingest',
      description: 'Upload any study material (PDF textbook, Lecture Video with timestamp sync, or PPT slides). The system automatically transcribes, performs OCR, creates timestamped chunks, and connects them to the knowledge graph.',
      keyProof: 'Shows Physics_Fundamentals.pdf (Ch 1-4), Lecture_04.mp4 (00:00 - 21:30), and MIT_Slides parsed into 34 indexed semantic chunks.',
      actionLabel: 'Explore Ingestion & Chunks'
    },
    {
      title: 'DEMO 2 — Exact Grounded Citation & Video Jump',
      tab: 'tutor' as ActiveTab,
      icon: MessageSquareQuote,
      badge: 'Claim-Level Grounding',
      description: 'Ask the AI tutor to explain Newton’s Second Law. The AI breaks down its response into claim-level verification badges. Clicking any citation opens the exact PDF Page (Page 47) or jumps the video player directly to 12:43.',
      keyProof: 'Exact passage match on Page 47 + synchronized chalkboard OCR at 12:43 timestamp.',
      actionLabel: 'Test Grounded Tutor & Citations'
    },
    {
      title: 'DEMO 3 — The Off-Material Refusal Test',
      tab: 'tutor' as ActiveTab,
      icon: ShieldAlert,
      badge: 'Anti-Hallucination',
      description: 'Ask an off-topic query like "Who invented the telephone?" or "How to make pasta carbonara?". Rather than hallucinating or guessing, the system strictly refuses: "⚠️ Off-Material: Not covered in uploaded physics materials."',
      keyProof: 'Proves rigorous source grounding and 0% out-of-domain hallucination rate.',
      actionLabel: 'Trigger Off-Material Refusal'
    },
    {
      title: 'DEMO 4 — Root-Cause Adaptive Remediation Loop 🔥',
      tab: 'remediation' as ActiveTab,
      icon: GitBranch,
      badge: 'Killer Feature 1',
      description: 'Student fails an F=ma calculation (answers 60N by multiplying mass by velocity). Instead of simply marking it wrong, QIRA traverses the prerequisite knowledge graph, discovers the student doesn’t understand Acceleration (a = Δv/Δt), delivers a mini-lesson from Page 47, quizzes on acceleration, and retests target concept, jumping mastery from 42% to 68%!',
      keyProof: 'Full 5-stage closed-loop remediation with live Bayesian mastery updates.',
      actionLabel: 'Launch Root-Cause Remediation Flow'
    },
    {
      title: 'DEMO 5 — Scientific Proof: RAGAS & Simulated Cohorts',
      tab: 'evaluation' as ActiveTab,
      icon: FlaskConical,
      badge: 'Empirical Verification',
      description: 'Empirical evaluation showing RAGAS metrics (0.94 Faithfulness, 0.91 Relevance, 0.89 Precision) plus a multi-session simulated student cohort experiment (Alex 81% → 95%, Shahul 42% → 78%, Maya 46% → 82%) proving the closed loop changes learning trajectories.',
      keyProof: 'Benchmarked against real test suites and simulated learner state models.',
      actionLabel: 'View Evaluation & Simulated Cohorts'
    }
  ];

  const activeStep = demoSteps[currentStep];

  const handleExecuteStep = () => {
    onNavigateToTab(activeStep.tab);
    if (onTriggerDemoAction) {
      onTriggerDemoAction(currentStep);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-amber-50 via-indigo-50 to-purple-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">5-Step Hackathon Walkthrough Guide</h3>
              <p className="text-xs text-slate-500">Interactive product demo flow</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Tabs Bar */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-50 border-b border-slate-200 overflow-x-auto gap-2">
          {demoSteps.map((step, idx) => {
            const isCurrent = currentStep === idx;
            return (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Demo {idx + 1}</span>
              </button>
            );
          })}
        </div>

        {/* Active Step Showcase */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
              {activeStep.badge}
            </span>
            <span className="text-xs font-mono text-slate-500 font-semibold">Step {currentStep + 1} of 5</span>
          </div>

          <h3 className="text-lg font-bold text-slate-900">
            {activeStep.title}
          </h3>

          <p className="text-xs text-slate-700 leading-relaxed font-sans">
            {activeStep.description}
          </p>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
            <div className="text-[11px] font-mono text-amber-900 font-bold uppercase">
              What This Proves:
            </div>
            <p className="text-xs text-amber-800 font-medium">
              {activeStep.keyProof}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800 disabled:opacity-30"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentStep((prev) => Math.min(demoSteps.length - 1, prev + 1))}
              disabled={currentStep === demoSteps.length - 1}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800 disabled:opacity-30"
            >
              Next Demo
            </button>
          </div>

          <button
            onClick={handleExecuteStep}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
          >
            <span>{activeStep.actionLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
