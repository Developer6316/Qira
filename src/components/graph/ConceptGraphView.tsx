import React, { useState } from 'react';
import { CONCEPT_NODES, CONCEPT_MAP } from '../../data/conceptGraph';
import { ConceptMastery, SourceCitation, ConceptNode } from '../../types';
import { 
  Network, 
  ArrowDownRight, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Eye, 
  Compass, 
  HelpCircle,
  FileText,
  ChevronRight,
  Sparkles,
  RefreshCw,
  GitBranch
} from 'lucide-react';

interface ConceptGraphViewProps {
  masteryMap: Record<string, ConceptMastery>;
  onOpenCitation: (citation: SourceCitation) => void;
  onLaunchRemediationForNode?: (conceptId: string) => void;
}

export const ConceptGraphView: React.FC<ConceptGraphViewProps> = ({
  masteryMap,
  onOpenCitation,
  onLaunchRemediationForNode
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('newton-2');
  const [highlightPrereqs, setHighlightPrereqs] = useState<boolean>(true);

  const selectedNode = CONCEPT_MAP[selectedNodeId] || CONCEPT_NODES[0];
  const selectedMastery = masteryMap[selectedNodeId] || {
    masteryScore: 0.5,
    status: 'developing'
  };

  const getStatusColor = (score: number) => {
    if (score >= 0.85) return 'text-emerald-700 bg-emerald-50 border-emerald-300';
    if (score >= 0.70) return 'text-emerald-800 bg-emerald-50 border-emerald-200';
    if (score >= 0.50) return 'text-amber-800 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-300';
  };

  const getStatusBadge = (score: number) => {
    if (score >= 0.85) return '🟢 Mastered';
    if (score >= 0.70) return '🟡 Competent';
    if (score >= 0.50) return '🟠 Developing';
    return '🔴 Critical Gap';
  };

  // Group nodes by tier
  const tiers = [0, 1, 2, 3, 4, 5];

  return (
    <div className="space-y-6">
      {/* Top Banner (Bright Gradient) */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-white/20 text-white border border-white/30 backdrop-blur-xs">
                SYSTEM 2 OF 7
              </span>
              <span className="text-xs text-indigo-100 font-medium">Prerequisite Knowledge Graph & Cognitive State</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Dynamic Concept & Prerequisite Dependency Graph
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100 max-w-2xl leading-relaxed">
              Knowledge is a directed acyclic graph. If a student struggles with Newton's 2nd Law (<span className="font-mono text-white underline font-bold">42%</span>), the system traces upstream prerequisites to pinpoint the exact root cause in Acceleration (<span className="font-mono text-white underline font-bold">42%</span>).
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-xs p-3 rounded-xl border border-white/30 text-xs text-white">
            <label className="flex items-center gap-2 cursor-pointer font-semibold">
              <input
                type="checkbox"
                checked={highlightPrereqs}
                onChange={(e) => setHighlightPrereqs(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-0 cursor-pointer"
              />
              <span>Highlight Prerequisite Dependencies</span>
            </label>
          </div>
        </div>
      </div>

      {/* Main Graph & Node Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Visual Hierarchical Knowledge Graph */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                Prerequisite Hierarchy (Tier 0 → Tier 5)
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-500 font-semibold">9 Mechanics Nodes</span>
          </div>

          {/* Hierarchical Tiers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {tiers.map((tier) => {
              const nodesInTier = CONCEPT_NODES.filter(n => n.tier === tier);
              if (nodesInTier.length === 0) return null;

              return (
                <div key={tier} className="space-y-3 p-4 rounded-xl bg-slate-50/70 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase font-bold text-slate-500">
                      Tier {tier}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 font-semibold">
                      {tier === 0 ? 'Foundational' : tier === 1 ? 'Kinematics' : tier === 2 ? 'Dynamics' : 'Advanced'}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {nodesInTier.map((node) => {
                      const isSelected = node.id === selectedNodeId;
                      const score = masteryMap[node.id]?.masteryScore ?? 0.5;
                      const percent = Math.round(score * 100);
                      const isPrereqOfSelected = highlightPrereqs && selectedNode.prerequisites.includes(node.id);

                      return (
                        <div
                          key={node.id}
                          onClick={() => setSelectedNodeId(node.id)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                            isSelected
                              ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-500/30'
                              : isPrereqOfSelected
                              ? 'bg-amber-50/80 border-amber-300 shadow-xs'
                              : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-900 truncate">
                              {node.name}
                            </h4>
                            <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold border ${getStatusColor(score)}`}>
                              {percent}%
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                            <span>{node.prerequisites.length} Prereqs</span>
                            {isPrereqOfSelected && (
                              <span className="text-amber-700 font-bold flex items-center gap-0.5">
                                <AlertTriangle className="w-3 h-3" /> Upstream Prereq
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 4 Cols: Node Inspector Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                  Node Inspector
                </h3>
              </div>
              <span className={`px-2.5 py-0.5 rounded-md font-mono text-xs font-bold border ${getStatusColor(selectedMastery.masteryScore)}`}>
                {getStatusBadge(selectedMastery.masteryScore)}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-mono text-slate-500 uppercase font-bold">Concept Name</span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedNode.name}
                </h4>
              </div>

              <div>
                <span className="text-[11px] font-mono text-slate-500 uppercase font-bold">Description & Scope</span>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                  {selectedNode.description}
                </p>
              </div>

              {/* Upstream Prerequisites List */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-mono text-slate-500 uppercase font-bold">
                  Direct Prerequisites ({selectedNode.prerequisites.length}):
                </span>
                {selectedNode.prerequisites.length === 0 ? (
                  <p className="text-xs text-slate-400 font-mono italic">None (Root Foundational Node)</p>
                ) : (
                  <div className="space-y-2 pt-1">
                    {selectedNode.prerequisites.map((pId) => {
                      const pNode = CONCEPT_MAP[pId];
                      const pScore = masteryMap[pId]?.masteryScore ?? 0.5;
                      return (
                        <div
                          key={pId}
                          onClick={() => setSelectedNodeId(pId)}
                          className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 transition-colors cursor-pointer flex items-center justify-between"
                        >
                          <span className="text-xs font-bold text-slate-800">{pNode?.name || pId}</span>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getStatusColor(pScore)}`}>
                            {Math.round(pScore * 100)}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Primary Source Document Citation Anchor */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-mono text-slate-500 uppercase font-bold">
                  Verified Grounding Anchor:
                </span>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-indigo-700 font-bold truncate max-w-[180px]">
                      {selectedNode.primarySource.title}
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">
                      {selectedNode.primarySource.pageOrTimestamp}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const cit: SourceCitation = {
                        id: `cit-${selectedNode.id}`,
                        sourceId: 'mat-pdf-01',
                        sourceTitle: selectedNode.primarySource.title,
                        sourceType: selectedNode.primarySource.type,
                        pageNumber: selectedNode.primarySource.type === 'pdf' ? 47 : undefined,
                        timestamp: selectedNode.primarySource.type === 'video' ? '12:43' : undefined,
                        snippet: `Verified concept definitions and mathematical derivations for ${selectedNode.name}.`,
                        confidence: 0.98
                      };
                      onOpenCitation(cit);
                    }}
                    className="w-full py-2 rounded-lg bg-white hover:bg-slate-100 text-indigo-700 text-xs font-mono font-bold border border-slate-200 flex items-center justify-center gap-1 transition-colors shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-indigo-600" />
                    <span>View Grounding Anchor</span>
                  </button>
                </div>
              </div>

              {/* Action Button */}
              {selectedMastery.masteryScore < 0.70 && onLaunchRemediationForNode && (
                <div className="pt-2">
                  <button
                    onClick={() => onLaunchRemediationForNode(selectedNode.id)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20"
                  >
                    <GitBranch className="w-4 h-4" />
                    <span>Launch Root-Cause Remediation</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
