import React, { useState, useRef, useEffect } from 'react';
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
  Clock,
  Mic,
  MicOff,
  Radio
} from 'lucide-react';
import { playClickSound, playSuccessChime, playSwooshSound } from '../../utils/soundEffects';

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
  
  // Speech-to-Text Microphone State
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Stop speech recognition when component unmounts
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const startSpeechRecognition = () => {
    setSpeechError(null);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        playClickSound();
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          setInputValue(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone permission denied. Please allow microphone access in your browser settings.');
        } else if (event.error !== 'no-speech') {
          setSpeechError(`Microphone notice: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Error starting speech recognition:', err);
      setSpeechError('Could not start microphone recording. Please check browser permissions.');
      setIsListening(false);
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
    playClickSound();
  };

  const toggleSpeechRecognition = () => {
    if (isListening) {
      stopSpeechRecognition();
    } else {
      startSpeechRecognition();
    }
  };

  // Active chunks filtered by selected material
  const activeMaterial = materials.find(m => m.id === selectedMaterialFilter);
  const scopedChunks = selectedMaterialFilter === 'all' 
    ? materials.flatMap(m => m.chunks) 
    : (activeMaterial?.chunks || materials.flatMap(m => m.chunks));

  const handleSendMessage = async (customPrompt?: string) => {
    if (isListening) {
      stopSpeechRecognition();
    }
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

        {/* Live Speech-to-Text Visual Feedback Banner */}
        {isListening && (
          <div className="px-4 py-2.5 bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-indigo-500/10 border-t border-b border-rose-200/80 flex items-center justify-between text-xs font-mono text-rose-800 animate-in fade-in duration-150">
            <div className="flex items-center gap-2 min-w-0 pr-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shrink-0" />
              <span className="font-bold shrink-0 flex items-center gap-1 text-rose-700">
                <Mic className="w-3.5 h-3.5 animate-pulse" />
                Listening:
              </span>
              <span className="italic truncate text-slate-700">
                "{inputValue || 'Speak your question clearly into microphone...'}"
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Animated Audio Equalizer Wave */}
              <div className="hidden sm:flex items-center gap-0.5 h-3">
                <span className="w-0.5 h-2 bg-rose-500 animate-pulse" />
                <span className="w-0.5 h-3.5 bg-rose-500 animate-pulse delay-75" />
                <span className="w-0.5 h-1.5 bg-rose-500 animate-pulse delay-150" />
                <span className="w-0.5 h-3 bg-rose-500 animate-pulse delay-100" />
                <span className="w-0.5 h-2 bg-rose-500 animate-pulse delay-200" />
              </div>

              <button
                type="button"
                onClick={stopSpeechRecognition}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-800 underline cursor-pointer"
              >
                Done Speaking
              </button>
            </div>
          </div>
        )}

        {/* Speech Recognition Error Notice */}
        {speechError && (
          <div className="px-4 py-2 bg-amber-50 border-t border-b border-amber-200 text-xs font-mono text-amber-900 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{speechError}</span>
            </div>
            <button
              type="button"
              onClick={() => setSpeechError(null)}
              className="text-[10px] font-bold text-amber-700 hover:text-amber-900 underline ml-2 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 sm:gap-3"
          >
            <div className="relative flex-1 flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  isListening 
                    ? "Listening... speaking transcribes live here..." 
                    : "Ask any question from uploaded materials or test off-material refusal..."
                }
                disabled={isLoading}
                className={`w-full bg-slate-50 border rounded-xl pl-4 pr-12 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white transition-all ${
                  isListening
                    ? 'border-rose-400 ring-2 ring-rose-400/20 bg-rose-50/20'
                    : 'border-slate-200 focus:border-indigo-500'
                }`}
              />

              {/* Speech-to-Text Microphone Recording Button */}
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                disabled={isLoading}
                className={`absolute right-2 p-2 rounded-lg transition-all cursor-pointer flex items-center justify-center ${
                  isListening 
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30 animate-pulse' 
                    : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 active:scale-95'
                }`}
                title={isListening ? "Listening... Click to stop recording" : "Record question with microphone (Speech-to-Text)"}
                aria-label={isListening ? "Stop speech recording" : "Record voice question"}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="px-4 sm:px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-md shadow-indigo-600/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer shrink-0"
              title="Send question to Grounded Tutor"
            >
              <span className="hidden sm:inline">Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
