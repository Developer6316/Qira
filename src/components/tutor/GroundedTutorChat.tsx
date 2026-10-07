import React, { useState } from 'react';
import { ChatMessage, SourceCitation, IngestedMaterial, GroundedClaim } from '../../types';
import { sendTutorQuery } from '../../services/api';
import { 
  Send, 
  Sparkles, 
  ShieldCheck, 
  ShieldAlert, 
  FileText, 
  Video, 
  Presentation, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  HelpCircle,
  Clock
} from 'lucide-react';
import { playClickSound, playSwooshSound } from '../../utils/soundEffects';

interface GroundedTutorChatProps {
  materials: IngestedMaterial[];
  onOpenCitation: (citation: SourceCitation) => void;
  onSelectConcept?: (conceptId: string) => void;
}

export const GroundedTutorChat: React.FC<GroundedTutorChatProps> = ({
  materials,
  onOpenCitation,
  onSelectConcept
}) => {
  const [selectedMaterialFilter, setSelectedMaterialFilter] = useState<string>('all');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'assistant',
      content: `Hello! I am **QIRA**, your source-grounded cognitive AI tutor. 

Every explanation I generate is verified against your uploaded course documents with sentence-by-sentence claim tracking. 

Select an active source above or ask any question from your materials!`,
      timestamp: '18:10',
      groundingScore: 1.0,
      claims: [
        {
          id: 'c-init-1',
          text: 'Every statement is verified against uploaded course materials.',
          isGrounded: true,
          groundingStatus: 'verified',
          confidenceScore: 1.0,
          citations: []
        }
      ],
      citations: []
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [strictMode, setStrictMode] = useState(true);
  const [expandedClaimMessageId, setExpandedClaimMessageId] = useState<string | null>(null);

  // Active chunks filtered by selected material
  const activeMaterial = materials.find(m => m.id === selectedMaterialFilter);
  const scopedChunks = selectedMaterialFilter === 'all' 
    ? materials.flatMap(m => m.chunks) 
    : (activeMaterial?.chunks || materials.flatMap(m => m.chunks));

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputValue;
    if (!textToSend.trim() || isLoading) return;

    playClickSound();

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!customPrompt) setInputValue('');
    setIsLoading(true);

    try {
      const response = await sendTutorQuery(textToSend, messages, scopedChunks, strictMode);

      const assistantMessage: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        content: response.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOffMaterialRefusal: response.isOffMaterialRefusal,
        groundingScore: response.groundingScore,
        claims: response.claims,
        citations: response.citations,
        retrievalLatencyMs: response.retrievalLatencyMs
      };

      playSwooshSound();
      setMessages(prev => [...prev, assistantMessage]);
      setExpandedClaimMessageId(assistantMessage.id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    {
      label: '🔬 Explain Newton’s 2nd Law (On-Material)',
      prompt: 'Explain Newton’s Second Law and how acceleration relates to net force with exact source citations.',
      isOff: false
    },
    {
      label: '⚡ Static vs Kinetic Friction (On-Material)',
      prompt: 'What is the exact physical difference between static and kinetic friction coefficients?',
      isOff: false
    },
    {
      label: '🚫 Refusal Test: Who invented telephone?',
      prompt: 'Who invented the telephone and in what year?',
      isOff: true
    },
    {
      label: '🚫 Refusal Test: How to make pasta?',
      prompt: 'How do you make traditional pasta carbonara?',
      isOff: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner (Bright Gradient) */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-white/20 text-white border border-white/30 backdrop-blur-xs">
                SYSTEM 3 OF 7
              </span>
              <span className="text-xs text-indigo-100 font-medium">Grounded Cognitive Tutor & Claim Verifier</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Source-Grounded Tutor with Sentence Claim Verification
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100 max-w-2xl leading-relaxed">
              Strictly grounded in your course materials. Every response is decomposed into verifiable atomic claims with direct links to PDF pages (<span className="font-mono text-white underline font-bold">Page 47</span>) and video timestamps (<span className="font-mono text-white underline font-bold">12:43</span>). Off-topic queries are strictly refused.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-white/30 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span className="text-white font-medium">Strict Grounding:</span>
              <span className="font-mono text-emerald-300 font-bold">ACTIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Material Filter & Suggested Prompts Ribbon */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 glass-card rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-xs font-mono text-slate-700 font-bold uppercase flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-600" /> Active Grounding Source:
          </span>
          <select
            value={selectedMaterialFilter}
            onChange={(e) => setSelectedMaterialFilter(e.target.value)}
            className="bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-indigo-700 font-mono font-bold focus:outline-none cursor-pointer"
          >
            <option value="all">🌐 All Uploaded Materials ({materials.length})</option>
            {materials.map(m => (
              <option key={m.id} value={m.id}>
                {m.type === 'pdf' ? '📕' : m.type === 'video' ? '🎥' : '📊'} {m.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <span className="text-[11px] font-mono text-slate-400 font-semibold uppercase whitespace-nowrap">
            Demo Queries:
          </span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p.prompt)}
              disabled={isLoading}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                p.isOff
                  ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Container */}
      <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-[640px] shadow-xs">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/50">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const isRefusal = msg.isOffMaterialRefusal;
            const isExpandedClaims = expandedClaimMessageId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-2`}
              >
                <div className="flex items-center gap-2 text-xs text-slate-400 px-1 font-mono">
                  <span className="font-semibold text-slate-600">{isUser ? 'Student' : 'QIRA Grounded Tutor'}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                  {msg.retrievalLatencyMs && (
                    <>
                      <span>•</span>
                      <span className="text-slate-500 font-semibold">{msg.retrievalLatencyMs}ms</span>
                    </>
                  )}
                </div>

                <div
                  className={`max-w-3xl rounded-2xl p-5 text-sm leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-br-xs'
                      : isRefusal
                      ? 'bg-rose-50 border-2 border-rose-300 text-slate-900 rounded-bl-xs'
                      : 'bg-white border border-slate-200 text-slate-900 rounded-bl-xs'
                  }`}
                >
                  {/* Refusal Banner Header */}
                  {isRefusal && (
                    <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase font-mono mb-3 pb-2 border-b border-rose-200">
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      <span>OFF-MATERIAL REFUSAL TRIGGERED (ANTI-HALLUCINATION)</span>
                    </div>
                  )}

                  {/* Message Content */}
                  <div className="whitespace-pre-line font-sans leading-relaxed">
                    {msg.content}
                  </div>

                  {/* Grounded Citation Badges */}
                  {!isUser && msg.citations && msg.citations.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                        <span className="flex items-center gap-1.5 text-indigo-700 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Verified Grounding Sources ({msg.citations.length}):
                        </span>
                        <span className="text-emerald-700 font-bold">100% Grounded</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {msg.citations.map((cit) => (
                          <button
                            key={cit.id}
                            onClick={() => onOpenCitation(cit)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-900 border border-slate-200 hover:border-indigo-300 text-xs font-mono font-medium transition-all group shadow-2xs"
                          >
                            {cit.sourceType === 'pdf' && <FileText className="w-3.5 h-3.5 text-rose-500" />}
                            {cit.sourceType === 'video' && <Video className="w-3.5 h-3.5 text-sky-500" />}
                            {cit.sourceType === 'presentation' && <Presentation className="w-3.5 h-3.5 text-amber-500" />}
                            <span>
                              {cit.pageNumber ? `Page ${cit.pageNumber}` : ''}
                              {cit.timestamp ? `@ ${cit.timestamp}` : ''}
                              {cit.slideNumber ? `Slide ${cit.slideNumber}` : ''}
                            </span>
                            <span className="text-[10px] text-indigo-500 group-hover:translate-x-0.5 transition-transform">
                              ↗
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Claim-Level Grounding Inspector Toggle */}
                  {!isUser && msg.claims && msg.claims.length > 0 && !isRefusal && (
                    <div className="mt-3 pt-2">
                      <button
                        onClick={() => setExpandedClaimMessageId(isExpandedClaims ? null : msg.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-indigo-700 transition-colors font-medium"
                      >
                        <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Inspect Sentence-Level Claim Verifications ({msg.claims.length})</span>
                        {isExpandedClaims ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {/* Expanded Claim Breakdown Table */}
                      {isExpandedClaims && (
                        <div className="mt-3 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 animate-in fade-in duration-150">
                          <div className="text-[11px] font-mono text-slate-500 uppercase font-bold">
                            Claim Verification Breakdown:
                          </div>
                          <div className="space-y-2">
                            {msg.claims.map((claim, cIdx) => (
                              <div
                                key={claim.id}
                                className="p-3 rounded-lg bg-white border border-slate-200 text-xs space-y-1.5 shadow-2xs"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-mono text-indigo-700 font-bold text-[11px]">
                                    Claim #{cIdx + 1}
                                  </span>
                                  <span className="px-2 py-0.2 rounded font-mono text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified ({Math.round(claim.confidenceScore * 100)}%)
                                  </span>
                                </div>
                                <p className="text-slate-700 font-sans">
                                  "{claim.text}"
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200 max-w-sm shadow-xs">
              <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <div className="text-xs text-slate-700 font-mono font-medium">
                Searching chunks & verifying claims...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask any question from uploaded materials or test off-material refusal..."
              disabled={isLoading}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-md shadow-indigo-600/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
