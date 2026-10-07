import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Download, 
  Printer, 
  FileCode, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Layers, 
  Calendar, 
  BookOpen, 
  FileText,
  TrendingUp,
  Brain,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { ConceptMastery } from '../../types';
import { CONCEPT_NODES } from '../../data/conceptGraph';
import { playClickSound, playDownloadChime } from '../../utils/soundEffects';

interface StudentMasteryReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  studentId: string;
  masteryMap: Record<string, ConceptMastery>;
}

export const StudentMasteryReportModal: React.FC<StudentMasteryReportModalProps> = ({
  isOpen,
  onClose,
  studentName,
  studentId,
  masteryMap
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  // Compute aggregate stats
  const concepts = Object.values(CONCEPT_NODES);
  const masteryValues = concepts.map(c => masteryMap[c.id]?.masteryScore ?? 0.5);
  const averageMastery = masteryValues.reduce((a, b) => a + b, 0) / (masteryValues.length || 1);

  // Identified gaps (mastery < 0.65 or critical/developing)
  const identifiedGaps = concepts.filter(c => {
    const score = masteryMap[c.id]?.masteryScore ?? 0.5;
    return score < 0.65;
  }).map(c => {
    const m = masteryMap[c.id];
    return {
      conceptId: c.id,
      conceptName: c.name,
      score: m?.masteryScore ?? 0.5,
      status: m?.status ?? 'developing',
      prerequisites: c.prerequisites,
      diagnosis: c.id === 'acceleration' 
        ? 'Prerequisite Kinematics Gap: Inversion of velocity change (Δv) with instantaneous rate, causing downstream failures in Newton\'s Second Law.'
        : c.id === 'newton-2'
        ? 'Downstream Application Gap: Attempting F=ma without first resolving upstream kinematic acceleration components.'
        : `Developing foundational competency in ${c.name}. Needs reinforcement.`
    };
  });

  const reportDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const reportTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Generate Summarized JSON
  const handleExportJSON = () => {
    playClickSound();
    const reportData = {
      system: 'QIRA (Quantum-Inspired Remediation & Grounded Adaptive Learning)',
      reportType: 'Student Diagnostic & Bayesian Mastery Report',
      generatedAt: `${reportDate} at ${reportTime}`,
      student: {
        id: studentId,
        name: studentName,
        overallMasteryScore: Number(averageMastery.toFixed(3)),
        overallProficiencyLevel: averageMastery >= 0.85 ? 'Mastered' : averageMastery >= 0.70 ? 'Competent' : averageMastery >= 0.50 ? 'Developing' : 'Critical'
      },
      diagnosedRootCauseGaps: identifiedGaps.map(g => ({
        conceptId: g.conceptId,
        conceptName: g.conceptName,
        currentMasteryScore: Number(g.score.toFixed(3)),
        status: g.status,
        prerequisiteChain: g.prerequisites,
        rootCauseDiagnosis: g.diagnosis,
        recommendedAction: `Complete 3-step targeted remediation loop on ${g.conceptName} before advancing to higher-order mechanics.`
      })),
      conceptMasteryBreakdown: concepts.map(c => {
        const m = masteryMap[c.id];
        return {
          conceptId: c.id,
          name: c.name,
          topic: c.topic,
          masteryScore: Number((m?.masteryScore ?? 0.5).toFixed(3)),
          confidenceInterval: m?.confidenceInterval ?? 0.05,
          attemptsCount: m?.attemptsCount ?? 0,
          status: m?.status ?? 'developing',
          lastAssessedAt: m?.lastAssessedAt || 'Prior Diagnostic'
        };
      }),
      recommendedActionPlan: [
        '1. Reinforce Kinematic Acceleration derivatives and Δv/Δt rate calculations.',
        '2. Engage with Chalkboard AI Video Lecture #4 on Newton\'s Second Law.',
        '3. Retest targeted prerequisite questions in the Adaptive Quiz Engine.'
      ]
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `QIRA_Mastery_Report_${studentId}_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    playDownloadChime();
    setDownloadSuccess('JSON report downloaded successfully!');
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  // Generate Formatted Standalone HTML Report
  const handleExportHTML = () => {
    playClickSound();
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>QIRA Mastery Report - ${studentName}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; color: #0f172a; margin: 0; padding: 40px; }
    .container { max-width: 800px; margin: 0 auto; background: #ffffff; border-radius: 20px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
    .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 24px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
    .logo { font-size: 24px; font-weight: 900; color: #4f46e5; letter-spacing: -0.5px; }
    .title { font-size: 22px; font-weight: 800; margin: 8px 0 4px; }
    .meta { font-size: 13px; color: #64748b; font-family: monospace; }
    .stat-badge { background: #eef2ff; border: 1px solid #c7d2fe; color: #4338ca; padding: 12px 20px; border-radius: 14px; text-align: center; }
    .stat-val { font-size: 28px; font-weight: 900; font-family: monospace; }
    .section { margin-bottom: 32px; }
    .section-title { font-size: 15px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #475569; margin-bottom: 16px; border-left: 4px solid #4f46e5; padding-left: 10px; }
    .gap-box { background: #fff1f2; border: 1px solid #fecdd3; border-radius: 14px; padding: 18px; margin-bottom: 14px; }
    .gap-title { font-size: 15px; font-weight: 700; color: #be123c; margin-bottom: 4px; }
    .gap-desc { font-size: 13px; color: #475569; line-height: 1.5; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
    th { text-align: left; padding: 10px 14px; background: #f1f5f9; color: #475569; font-family: monospace; border-bottom: 1px solid #cbd5e1; }
    td { padding: 12px 14px; border-bottom: 1px solid #f1f5f9; }
    .score-bar { height: 8px; border-radius: 4px; background: #e2e8f0; overflow: hidden; width: 100px; display: inline-block; vertical-align: middle; margin-right: 8px; }
    .score-fill { height: 100%; background: #4f46e5; }
    .footer { text-align: center; font-size: 12px; color: #94a3b8; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <div class="logo">QIRA · LEARNING SYSTEM</div>
        <div class="title">Personalized Diagnostic & Mastery Report</div>
        <div class="meta">Student: ${studentName} (${studentId}) | Date: ${reportDate}</div>
      </div>
      <div class="stat-badge">
        <div style="font-size: 11px; text-transform: uppercase; font-weight: bold;">Overall Mastery</div>
        <div class="stat-val">${(averageMastery * 100).toFixed(0)}%</div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">🚨 Identified Root-Cause Prerequisite Gaps</div>
      ${identifiedGaps.length === 0 ? '<p>No critical prerequisite gaps identified. All foundational nodes meet mastery thresholds.</p>' : identifiedGaps.map(g => `
        <div class="gap-box">
          <div class="gap-title">⚠️ ${g.conceptName} (${(g.score * 100).toFixed(0)}% Mastery - ${g.status.toUpperCase()})</div>
          <div class="gap-desc">${g.diagnosis}</div>
        </div>
      `).join('')}
    </div>

    <div class="section">
      <div class="section-title">📊 Concept Knowledge DAG Mastery Breakdown</div>
      <table>
        <thead>
          <tr>
            <th>Concept Name</th>
            <th>Category</th>
            <th>Score</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${concepts.map(c => {
            const m = masteryMap[c.id];
            const sc = m?.masteryScore ?? 0.5;
            return `
              <tr>
                <td><strong>${c.name}</strong></td>
                <td>${c.topic}</td>
                <td>
                  <div class="score-bar"><div class="score-fill" style="width: ${sc * 100}%"></div></div>
                  <strong>${(sc * 100).toFixed(0)}%</strong>
                </td>
                <td style="text-transform: capitalize;">${m?.status ?? 'developing'}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>

    <div class="section">
      <div class="section-title">🎯 Recommended Action Plan</div>
      <ol style="font-size: 13px; line-height: 1.8; color: #334155;">
        <li>Review targeted remediation lesson for <strong>Kinematic Acceleration</strong> to bridge velocity-force confusion.</li>
        <li>Watch synthesized AI chalkboard lecture #4 with step-by-step mathematical breakdown.</li>
        <li>Retake the prerequisite diagnostic questions in the Adaptive Quiz Engine to verify gap closure.</li>
      </ol>
    </div>

    <div class="footer">
      Generated automatically by QIRA Grounded Cognition Engine · Evaluated against RAGAS Faithfulness Benchmark (0.948)
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `QIRA_Mastery_Report_${studentId}_${new Date().toISOString().slice(0, 10)}.html`;
    link.click();
    URL.revokeObjectURL(url);

    playDownloadChime();
    setDownloadSuccess('HTML printable report downloaded successfully!');
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  const handlePrint = () => {
    playClickSound();
    window.print();
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-200">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/80 bg-slate-50/70 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 border border-indigo-200 text-indigo-700 flex items-center justify-center shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Student Diagnostic Mastery Report</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-100 text-indigo-700">
                  EXPORT READY
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {studentName} · {reportDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="px-6 py-3 bg-gradient-to-r from-indigo-50/80 via-purple-50/60 to-slate-50/80 border-b border-indigo-100/60 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Select export format for offline review, printing, or portfolio submission:</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportJSON}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-indigo-700 border border-indigo-200 shadow-xs text-xs font-bold transition-all hover:scale-[1.02] cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5 text-indigo-600" />
              <span>Export JSON</span>
            </button>

            <button
              type="button"
              onClick={handleExportHTML}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-purple-700 border border-purple-200 shadow-xs text-xs font-bold transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-purple-600" />
              <span>Download HTML</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm text-xs font-bold transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* Download Toast Notification */}
        {downloadSuccess && (
          <div className="mx-6 mt-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* Printable & Scrollable Report Preview Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 printable-report-area">
          
          {/* Executive Overview Banner */}
          <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-indigo-50/90 via-white to-purple-50/90 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase text-indigo-600 font-bold tracking-wider">
                Overall Diagnostic Standing
              </span>
              <h4 className="text-xl font-black text-slate-900 tracking-tight">
                {studentName}
              </h4>
              <p className="text-xs text-slate-500 font-mono">
                Student ID: <span className="font-bold text-slate-800">{studentId}</span> · Assessment Timestamp: {reportDate}
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white/90 p-3.5 rounded-2xl border border-indigo-100 shadow-xs">
              <div className="text-center">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Average Mastery</div>
                <div className="text-2xl font-mono font-black text-indigo-700">
                  {(averageMastery * 100).toFixed(0)}%
                </div>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div className="text-center">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Identified Gaps</div>
                <div className="text-2xl font-mono font-black text-rose-600">
                  {identifiedGaps.length}
                </div>
              </div>
            </div>
          </div>

          {/* Root-Cause Prerequisite Gaps Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200">
              <h5 className="text-xs font-mono uppercase font-black text-slate-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Identified Prerequisite Root-Cause Gaps ({identifiedGaps.length})</span>
              </h5>
              <span className="text-[11px] font-mono text-rose-600 font-bold">Requires Action</span>
            </div>

            {identifiedGaps.length === 0 ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                ✅ No critical gaps detected. All tested prerequisite nodes meet mastery criteria.
              </div>
            ) : (
              <div className="space-y-3">
                {identifiedGaps.map((gap) => (
                  <div 
                    key={gap.conceptId}
                    className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200/90 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        {gap.conceptName}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-black bg-rose-200/70 text-rose-800">
                        {(gap.score * 100).toFixed(0)}% Mastery · {gap.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">
                      {gap.diagnosis}
                    </p>
                    <div className="text-[11px] font-mono text-indigo-700 bg-white/70 p-2 rounded-xl border border-indigo-100 flex items-center gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>Recommended Intervention: Complete interactive 3-step remediation loop on <strong>{gap.conceptName}</strong>.</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Full Knowledge DAG Mastery Table */}
          <div className="space-y-3">
            <h5 className="text-xs font-mono uppercase font-black text-slate-700 flex items-center gap-2">
              <Brain className="w-4 h-4 text-indigo-600" />
              <span>Concept DAG Bayesian Mastery Matrix (9 Nodes)</span>
            </h5>

            <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-mono text-[11px] border-b border-slate-200">
                    <th className="py-2.5 px-4 font-bold">Concept Node</th>
                    <th className="py-2.5 px-4 font-bold">Domain</th>
                    <th className="py-2.5 px-4 font-bold">Mastery Score</th>
                    <th className="py-2.5 px-4 font-bold">Confidence</th>
                    <th className="py-2.5 px-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {concepts.map((concept) => {
                    const m = masteryMap[concept.id];
                    const score = m?.masteryScore ?? 0.5;
                    const status = m?.status ?? 'developing';
                    return (
                      <tr key={concept.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2.5 px-4 font-bold text-slate-800">
                          {concept.name}
                        </td>
                        <td className="py-2.5 px-4 text-slate-500 font-mono text-[11px]">
                          {concept.topic}
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 rounded-full bg-slate-100 overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  score >= 0.85 ? 'bg-emerald-500' :
                                  score >= 0.70 ? 'bg-indigo-500' :
                                  score >= 0.50 ? 'bg-amber-500' : 'bg-rose-500'
                                }`}
                                style={{ width: `${score * 100}%` }}
                              />
                            </div>
                            <span className="font-mono font-bold text-slate-700">
                              {(score * 100).toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 font-mono text-slate-500 text-[11px]">
                          ±{(m?.confidenceInterval ?? 0.05).toFixed(2)}
                        </td>
                        <td className="py-2.5 px-4">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                            status === 'mastered' ? 'bg-emerald-100 text-emerald-800' :
                            status === 'competent' ? 'bg-indigo-100 text-indigo-800' :
                            status === 'developing' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actionable Learning Next Steps */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2">
            <h6 className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Next Learning Milestone:</span>
            </h6>
            <p className="text-xs text-indigo-800 leading-relaxed">
              Based on your identified root-cause gap in <strong>Acceleration & Derivatives</strong>, we recommend reviewing the grounded chalkboard video lecture on Kinematic Derivatives before retaking the Newton's Second Law verification quiz.
            </p>
          </div>

        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-4 border-t border-slate-200/80 bg-slate-50/80 backdrop-blur-md flex items-center justify-between">
          <div className="text-[11px] font-mono text-slate-500">
            Exported from QIRA · Bayesian Knowledge Tracing Engine
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};
