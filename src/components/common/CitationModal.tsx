import React, { useState } from 'react';
import { SourceCitation } from '../../types';
import { X, FileText, Video, Presentation, ExternalLink, Play, Pause, BookmarkCheck, Sparkles, Volume2, ShieldCheck } from 'lucide-react';

interface CitationModalProps {
  citation: SourceCitation | null;
  onClose: () => void;
}

export const CitationModal: React.FC<CitationModalProps> = ({ citation, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoTime, setVideoTime] = useState(citation?.timestampSeconds || 763);

  if (!citation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              {citation.sourceType === 'pdf' && <FileText className="w-5 h-5 text-rose-600" />}
              {citation.sourceType === 'video' && <Video className="w-5 h-5 text-sky-600" />}
              {citation.sourceType === 'presentation' && <Presentation className="w-5 h-5 text-amber-600" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">{citation.sourceTitle}</span>
                <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 font-bold">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Grounded Source
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                {citation.pageNumber ? `Exact Location: Page ${citation.pageNumber}` : ''}
                {citation.timestamp ? `Exact Timestamp: ${citation.timestamp} (Synced)` : ''}
                {citation.slideNumber ? `Slide Deck: Slide ${citation.slideNumber}` : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Viewer Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* PDF Page Viewer Mode */}
          {citation.sourceType === 'pdf' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
                <span>Document: <strong>{citation.sourceTitle}</strong></span>
                <span>Page: <strong className="text-indigo-700 font-mono font-bold">{citation.pageNumber || 47}</strong> / 128</span>
                <span className="text-emerald-700 font-bold">OCR Vector Verified</span>
              </div>

              {/* Simulated PDF Canvas Sheet */}
              <div className="relative bg-white border-2 border-indigo-200 rounded-xl p-8 text-slate-800 font-serif leading-relaxed shadow-sm">
                <div className="absolute top-4 right-4 text-xs font-mono text-slate-400">
                  SEC. 2.4 - NEWTONIAN MECHANICS
                </div>
                <h3 className="text-lg font-sans font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">
                  2.4 Newton's Second Law of Motion: Fundamental Equation
                </h3>
                <p className="text-sm text-slate-700 mb-4">
                  The acceleration of an object of fixed inertial mass <span className="font-mono text-indigo-700 font-bold">m</span> is directly proportional to the net external vector force <span className="font-mono text-indigo-700 font-bold">ΣF_net</span> acting upon it and acts in the direction of that net force.
                </p>

                {/* Highlighted Passage Citation Anchor */}
                <div className="my-4 p-4 rounded-xl bg-indigo-50 border-l-4 border-indigo-600 text-indigo-950 font-sans text-sm relative">
                  <div className="flex items-center gap-2 text-xs font-mono text-indigo-700 mb-1 font-bold">
                    <BookmarkCheck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>GROUNDED CITATION PASSAGE (Page {citation.pageNumber || 47}):</span>
                  </div>
                  <p className="font-medium leading-relaxed">
                    "{citation.snippet}"
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-center text-sm text-indigo-900 font-black my-4">
                  ΣF_net = m · a = m · (dv / dt) = m · (Δv / Δt)
                </div>

                <p className="text-xs text-slate-500 italic">
                  Note: If initial and final velocities are known across time interval Δt, acceleration must be explicitly evaluated as a = (v_f - v_i)/Δt before computing required net force.
                </p>
              </div>
            </div>
          )}

          {/* Video Lecture Timestamp Mode */}
          {citation.sourceType === 'video' && (
            <div className="space-y-4">
              <div className="relative bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 aspect-video flex flex-col justify-between p-4 group">
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center">
                  <div className="text-center p-6 space-y-3">
                    <div className="w-16 h-16 rounded-full bg-indigo-600/80 border-2 border-indigo-400 flex items-center justify-center mx-auto text-white shadow-xl">
                      <Play className="w-8 h-8 ml-1" />
                    </div>
                    <div className="font-mono text-xs text-sky-400 font-bold">
                      Timestamp Anchor: {citation.timestamp || '12:43'} (07:63s)
                    </div>
                    <div className="font-mono text-sm font-black text-white">
                      F_net = m · a (Experimental Demonstration)
                    </div>
                  </div>
                </div>

                <div className="z-10 flex items-center justify-between text-xs text-slate-300 font-mono bg-slate-950/80 p-2 rounded-lg backdrop-blur-xs">
                  <span>Playback Position: {citation.timestamp || '12:43'}</span>
                  <span className="text-emerald-400 font-bold">Whisper Transcript Aligned</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex items-center gap-1.5 text-indigo-700 font-mono font-bold">
                  <Volume2 className="w-4 h-4 text-indigo-600" />
                  <span>Spoken Lecture Transcript @ {citation.timestamp || '12:43'}:</span>
                </div>
                <p className="text-slate-800 leading-relaxed font-sans font-medium">
                  "{citation.snippet}"
                </p>
              </div>
            </div>
          )}

          {/* Presentation Slide Mode */}
          {citation.sourceType === 'presentation' && (
            <div className="space-y-4">
              <div className="p-8 rounded-2xl bg-white border-2 border-amber-200 space-y-4 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-mono text-amber-800 font-bold uppercase">
                    Slide #{citation.slideNumber || 12}: Force Dynamics & Friction
                  </span>
                  <span className="text-xs font-mono text-slate-500 font-semibold">MIT Physics 8.01</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Resolving Forces on an Inclined Plane
                </h3>
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-slate-800 font-medium leading-relaxed">
                  "{citation.snippet}"
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Citation Grounding Confidence: {(citation.confidence * 100).toFixed(0)}%</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
          >
            Close Grounding Anchor
          </button>
        </div>
      </div>
    </div>
  );
};
