import React, { useEffect, useState, useRef } from 'react';
import { VideoScene } from '../../types';
import { Volume2, VolumeX, Sparkles, Cpu, Layers, Activity, Radio, Mic } from 'lucide-react';
import { isAudioMuted } from '../../utils/soundEffects';
import { 
  VisemeKey, 
  GestureKey, 
  EyeState, 
  CharacterKeyframeState, 
  VISEME_PARAMS,
  evaluateCharacterStateMachine 
} from './characterStateMachine';
import { audioLipsyncManager, AudioLipsyncState } from './audioLipsyncEngine';

export type AvatarStyle = 'ada' | 'maxwell' | 'quantum-bot';

interface AnimatedInstructorProps {
  isPlaying: boolean;
  currentScene: VideoScene;
  playbackSpeed: number;
  avatarStyle?: AvatarStyle;
  onAvatarStyleChange?: (style: AvatarStyle) => void;
  voiceEnabled?: boolean;
  onToggleVoice?: () => void;
  sceneElapsedSeconds?: number;
}

export const AnimatedInstructor: React.FC<AnimatedInstructorProps> = ({
  isPlaying,
  currentScene,
  playbackSpeed,
  avatarStyle = 'ada',
  onAvatarStyleChange,
  voiceEnabled = true,
  onToggleVoice,
  sceneElapsedSeconds = 0
}) => {
  // State machine active word & progress
  const [currentSpokenWord, setCurrentSpokenWord] = useState<string>('');
  const [wordProgress, setWordProgress] = useState<number>(0);
  const [blinkPhase, setBlinkPhase] = useState<number>(0);
  const [showStateInspector, setShowStateInspector] = useState(false);
  const [manualVisemeOverride, setManualVisemeOverride] = useState<VisemeKey | null>(null);
  const [manualGestureOverride, setManualGestureOverride] = useState<GestureKey | null>(null);

  // Audio-driven lipsync state
  const [audioState, setAudioState] = useState<AudioLipsyncState>({
    audioActive: false,
    amplitude: 0,
    dominantFrequency: 0,
    currentViseme: 'REST',
    mouthOpenness: 0.05,
    mouthWidth: 0.5,
    spectralEnergy: [0.1, 0.1, 0.1, 0.1, 0.1]
  });

  // Initialize Web Audio API on mount or user interaction
  useEffect(() => {
    audioLipsyncManager.initAudio();
  }, []);

  // High-frequency animation ticker for audio amplitude & lipsync state machine
  useEffect(() => {
    let animId: number;

    const tick = () => {
      const sample = audioLipsyncManager.sampleFrame(isPlaying, currentSpokenWord);
      setAudioState(sample);
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, currentSpokenWord]);

  // Fallback word sequencer if SpeechSynthesis boundary events aren't fired by browser
  useEffect(() => {
    if (!isPlaying) {
      setCurrentSpokenWord('');
      setWordProgress(0);
      audioLipsyncManager.setSpokenWord('');
      return;
    }

    const words = currentScene.narrationTranscript.split(/\s+/).filter(w => w.length > 0);
    if (words.length === 0) return;

    let wordIdx = 0;
    const intervalMs = Math.max(140, 260 / playbackSpeed);

    const interval = setInterval(() => {
      const active = words[wordIdx % words.length].replace(/[^a-zA-Z]/g, '');
      setCurrentSpokenWord(active);
      audioLipsyncManager.setSpokenWord(active);
      setWordProgress((prev) => (prev >= 1 ? 0 : prev + 0.35));
      wordIdx++;
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isPlaying, currentScene.narrationTranscript, playbackSpeed]);

  // Periodic blinking state machine ticker
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkPhase(0.9);
      setTimeout(() => setBlinkPhase(0), 180);
    }, 3600);
    return () => clearInterval(blinkInterval);
  }, []);

  // Web Speech API: Voice synthesis grounded in uploaded explanation
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    if (isPlaying && voiceEnabled && !isAudioMuted()) {
      const textToSpeak = `${currentScene.title}. ${currentScene.narrationTranscript}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = Math.min(1.4, Math.max(0.7, 0.95 * playbackSpeed));
      utterance.pitch = avatarStyle === 'ada' ? 1.15 : avatarStyle === 'maxwell' ? 0.9 : 1.35;

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => 
        avatarStyle === 'ada' 
          ? (v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('Female') || v.lang.startsWith('en'))
          : avatarStyle === 'maxwell'
          ? (v.name.includes('David') || v.name.includes('Daniel') || v.name.includes('Male') || v.lang.startsWith('en'))
          : v.lang.startsWith('en')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onboundary = (e) => {
        if (e.name === 'word') {
          const word = textToSpeak.substring(e.charIndex, e.charIndex + e.charLength);
          setCurrentSpokenWord(word);
          audioLipsyncManager.setSpokenWord(word);
          setWordProgress(0.1);
        }
      };

      utterance.onend = () => {
        setCurrentSpokenWord('');
        audioLipsyncManager.setSpokenWord('');
      };

      window.speechSynthesis.speak(utterance);
    } else {
      window.speechSynthesis.cancel();
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPlaying, currentScene.id, voiceEnabled, playbackSpeed, avatarStyle]);

  // Evaluate the Keyframe Animation State Machine
  const autoKeyframe: CharacterKeyframeState = evaluateCharacterStateMachine(
    isPlaying,
    sceneElapsedSeconds,
    currentScene.durationSeconds,
    currentSpokenWord,
    wordProgress,
    blinkPhase,
    avatarStyle
  );

  // Synchronize with real-time audio lipsync state machine
  const activeViseme = manualVisemeOverride || (audioState.audioActive ? audioState.currentViseme : autoKeyframe.viseme);

  const keyframe: CharacterKeyframeState = {
    ...autoKeyframe,
    viseme: activeViseme,
    mouthOpenness: audioState.mouthOpenness,
    mouthWidth: audioState.mouthWidth,
    gesture: manualGestureOverride || autoKeyframe.gesture,
    armAngle: manualGestureOverride === 'POINTING_BOARD' ? 42 :
              manualGestureOverride === 'EMPHASIZING' ? 20 :
              manualGestureOverride === 'THINKING' ? 58 :
              manualGestureOverride === 'WRITING_CHALK' ? 34 : autoKeyframe.armAngle
  };

  // Dynamically compute interpolated mouth path based on audio lipsync state machine
  const generateDynamicMouthPath = (viseme: VisemeKey, openness: number, width: number): string => {
    const cx = 80;
    const cy = 82;
    const rx = Math.max(3, Math.min(10, 6 * width));
    const ry = Math.max(1, Math.min(8, 7 * openness));

    if (viseme === 'REST' || openness < 0.12) {
      return `M ${cx - rx} ${cy} Q ${cx} ${cy + 2}, ${cx + rx} ${cy}`;
    }

    if (viseme === 'OH') {
      // Circular rounded mouth
      return `M ${cx - rx * 0.7} ${cy - ry} C ${cx - rx * 0.7} ${cy + ry}, ${cx + rx * 0.7} ${cy + ry}, ${cx + rx * 0.7} ${cy - ry} C ${cx + rx * 0.7} ${cy - ry * 1.5}, ${cx - rx * 0.7} ${cy - ry * 1.5}, ${cx - rx * 0.7} ${cy - ry} Z`;
    }

    if (viseme === 'AA') {
      // Tall open oval
      return `M ${cx - rx} ${cy - ry * 0.5} C ${cx - rx} ${cy + ry * 1.3}, ${cx + rx} ${cy + ry * 1.3}, ${cx + rx} ${cy - ry * 0.5} C ${cx + rx} ${cy - ry * 1.2}, ${cx - rx} ${cy - ry * 1.2}, ${cx - rx} ${cy - ry * 0.5} Z`;
    }

    if (viseme === 'EE') {
      // Wide stretched slit
      return `M ${cx - rx * 1.2} ${cy - ry * 0.4} C ${cx - rx * 1.2} ${cy + ry * 0.8}, ${cx + rx * 1.2} ${cy + ry * 0.8}, ${cx + rx * 1.2} ${cy - ry * 0.4} C ${cx + rx * 1.2} ${cy - ry * 0.8}, ${cx - rx * 1.2} ${cy - ry * 0.8}, ${cx - rx * 1.2} ${cy - ry * 0.4} Z`;
    }

    if (viseme === 'TH') {
      return `M ${cx - rx} ${cy - ry * 0.4} Q ${cx} ${cy + ry}, ${cx + rx} ${cy - ry * 0.4} Q ${cx} ${cy - ry * 0.6}, ${cx - rx} ${cy - ry * 0.4} Z`;
    }

    // Default / MM: Closed flat line
    return `M ${cx - rx} ${cy} L ${cx + rx} ${cy}`;
  };

  const dynamicMouthPath = generateDynamicMouthPath(keyframe.viseme, keyframe.mouthOpenness, keyframe.mouthWidth);
  const explanationSnippet = currentScene.bulletPoints[0] || currentScene.narrationTranscript.slice(0, 85) + '...';

  return (
    <div className="flex flex-col items-center select-none relative max-w-[270px]">
      {/* Speech Balloon with live lipsync word highlight */}
      <div className="mb-2 w-full bg-slate-900/95 backdrop-blur-md border border-indigo-400/40 rounded-2xl p-2.5 shadow-xl text-left relative animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-800">
          <span className="text-[10px] font-mono font-bold text-indigo-300 flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            {avatarStyle === 'ada' ? 'Prof. Ada' : avatarStyle === 'maxwell' ? 'Dr. Maxwell' : 'Q-Bot'}
          </span>
          <span className="text-[9px] font-mono text-emerald-400 font-bold flex items-center gap-1">
            <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-400" />
            {keyframe.viseme} LIPSYNC
          </span>
        </div>
        
        <p className="text-[11px] text-slate-200 leading-tight font-sans min-h-[32px] flex items-center">
          {isPlaying && keyframe.activeWord ? (
            <span>
              "{explanationSnippet.slice(0, 40)}...{' '}
              <span className="bg-indigo-600/80 text-white px-1 py-0.5 rounded font-bold font-mono text-[10px]">
                {keyframe.activeWord}
              </span>"
            </span>
          ) : (
            <span>"{explanationSnippet}"</span>
          )}
        </p>

        {/* Speech Balloon Pointer Triangle */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-slate-900" />
      </div>

      {/* SVG Animated Character Renderer (Keyframe & Audio Lipsync State-Driven) */}
      <div className="relative w-36 h-48 drop-shadow-2xl">
        <svg
          viewBox="0 0 160 220"
          className="w-full h-full transition-transform duration-150"
          style={{ 
            transform: `translateY(${isPlaying ? '-2px' : '0px'}) rotate(${keyframe.headTilt * 0.4}deg)` 
          }}
        >
          {/* Shadow beneath character */}
          <ellipse cx="80" cy="214" rx="42" ry="6" fill="rgba(0, 0, 0, 0.45)" />

          {/* Torso & Uniform Body */}
          {avatarStyle === 'quantum-bot' ? (
            <g>
              <rect x="52" y="112" width="56" height="74" rx="14" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
              <circle cx="80" cy="148" r="14" fill="#0284c7" />
              <circle cx="80" cy="148" r="8" fill="#38bdf8" className={isPlaying ? 'animate-pulse' : ''} />
              <rect x="74" y="98" width="12" height="16" rx="3" fill="#64748b" />
            </g>
          ) : (
            <g>
              {/* Professor Coat */}
              <path
                d="M44 116 C44 102, 60 98, 80 98 C100 98, 116 102, 116 116 L124 195 C124 198, 120 200, 115 200 L45 200 C40 200, 36 198, 36 195 Z"
                fill={avatarStyle === 'ada' ? '#4338ca' : '#1e293b'}
                stroke="#6366f1"
                strokeWidth="1.5"
              />
              <polygon points="66,98 94,98 80,140" fill="#f8fafc" />
              <polygon points="77,106 83,106 82,130 80,135 78,130" fill={avatarStyle === 'ada' ? '#ec4899' : '#0ea5e9'} />
              <path d="M52 104 L72 152 L60 196" stroke="#e2e8f0" strokeWidth="2" fill="none" />
              <path d="M108 104 L88 152 L100 196" stroke="#e2e8f0" strokeWidth="2" fill="none" />
            </g>
          )}

          {/* Right Arm: Keyframe State Machine Controlled */}
          <g
            style={{
              transformOrigin: '110px 115px',
              transform: `rotate(${keyframe.armAngle}deg)`,
              transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            <path
              d="M108 114 Q135 110, 148 102"
              stroke={avatarStyle === 'quantum-bot' ? '#38bdf8' : avatarStyle === 'ada' ? '#4338ca' : '#1e293b'}
              strokeWidth="10"
              strokeLinecap="round"
            />
            <circle cx="150" cy="100" r="6" fill="#fbcfe8" />
            
            {/* Gesture-Specific Tool: Laser Pointer, Chalk, or Emphatic Palm */}
            {keyframe.gesture === 'WRITING_CHALK' ? (
              <rect x="150" y="96" width="12" height="5" rx="1.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
            ) : keyframe.gesture === 'POINTING_BOARD' ? (
              <g>
                <line x1="150" y1="100" x2="192" y2="74" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
                <circle cx="194" cy="73" r="4.5" fill="#34d399" className="animate-ping" />
                <circle cx="194" cy="73" r="3" fill="#10b981" />
              </g>
            ) : (
              <circle cx="156" cy="98" r="5" fill="#fbcfe8" />
            )}
          </g>

          {/* Left Rest Arm */}
          <path
            d="M48 114 Q32 140, 42 165"
            stroke={avatarStyle === 'quantum-bot' ? '#38bdf8' : avatarStyle === 'ada' ? '#4338ca' : '#1e293b'}
            strokeWidth="9"
            strokeLinecap="round"
          />
          <circle cx="43" cy="167" r="5.5" fill="#fbcfe8" />

          {/* Character Head & Facial Features */}
          <g style={{ transform: `rotate(${keyframe.headTilt}deg)`, transformOrigin: '80px 70px' }}>
            {avatarStyle === 'quantum-bot' ? (
              <g>
                <rect x="52" y="44" width="56" height="52" rx="14" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
                <line x1="80" y1="44" x2="80" y2="24" stroke="#38bdf8" strokeWidth="2.5" />
                <circle cx="80" cy="22" r="5" fill="#38bdf8" className={isPlaying ? 'animate-pulse' : ''} />
                <rect x="60" y="58" width="40" height="14" rx="4" fill="#0284c7" />
                <rect
                  x="63"
                  y="62"
                  width="14"
                  height="6"
                  rx="2"
                  fill="#38bdf8"
                  style={{ opacity: keyframe.eyeState === 'CLOSED' ? 0 : keyframe.eyeState === 'HALF' ? 0.4 : 1 }}
                />
                <rect
                  x="83"
                  y="62"
                  width="14"
                  height="6"
                  rx="2"
                  fill="#38bdf8"
                  style={{ opacity: keyframe.eyeState === 'CLOSED' ? 0 : keyframe.eyeState === 'HALF' ? 0.4 : 1 }}
                />
                {/* Robot Dynamic Lipsync Mouth */}
                <path
                  d={dynamicMouthPath}
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  fill={keyframe.viseme !== 'REST' && keyframe.viseme !== 'MM' ? '#0369a1' : 'none'}
                />
              </g>
            ) : (
              <g>
                <rect x="74" y="90" width="12" height="14" rx="2" fill="#fed7aa" />
                <ellipse cx="80" cy="68" rx="24" ry="28" fill="#fed7aa" />

                {/* Hair */}
                <path
                  d={avatarStyle === 'ada' 
                    ? "M54 62 C54 36, 106 36, 106 62 C108 52, 104 42, 80 40 C58 40, 52 50, 54 62 Z"
                    : "M55 58 C55 36, 105 36, 105 58 C108 48, 98 42, 80 42 C62 42, 53 48, 55 58 Z"}
                  fill={avatarStyle === 'ada' ? '#451a03' : '#334155'}
                />

                {/* Eyebrows */}
                <line x1="68" y1="56" x2="76" y2="54" stroke="#451a03" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="84" y1="54" x2="92" y2="56" stroke="#451a03" strokeWidth="1.8" strokeLinecap="round" />

                {/* Eyeglasses */}
                <rect x="64" y="59" width="14" height="11" rx="3" fill="none" stroke="#6366f1" strokeWidth="1.5" />
                <rect x="82" y="59" width="14" height="11" rx="3" fill="none" stroke="#6366f1" strokeWidth="1.5" />
                <line x1="78" y1="64" x2="82" y2="64" stroke="#6366f1" strokeWidth="1.5" />

                {/* Eyes with Keyframe State (OPEN / HALF / CLOSED) */}
                {keyframe.eyeState === 'CLOSED' ? (
                  <g>
                    <line x1="67" y1="64" x2="75" y2="64" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                    <line x1="85" y1="64" x2="93" y2="64" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                  </g>
                ) : keyframe.eyeState === 'HALF' ? (
                  <g>
                    <path d="M67 64 Q71 67, 75 64" stroke="#1e293b" strokeWidth="2" fill="none" />
                    <path d="M85 64 Q89 67, 93 64" stroke="#1e293b" strokeWidth="2" fill="none" />
                  </g>
                ) : (
                  <g>
                    <circle cx="71" cy="64" r="3" fill="#1e293b" />
                    <circle cx="89" cy="64" r="3" fill="#1e293b" />
                    <circle cx="72" cy="63" r="1" fill="#ffffff" />
                    <circle cx="90" cy="63" r="1" fill="#ffffff" />
                  </g>
                )}

                {/* Nose */}
                <path d="M80 67 Q81 72, 79 74 L82 74" stroke="#d97706" strokeWidth="1.2" fill="none" strokeLinecap="round" />

                {/* Dynamic Keyframe Mouth (Driven by Audio Lipsync State Machine) */}
                <path
                  d={dynamicMouthPath}
                  stroke="#991b1b"
                  strokeWidth="1.6"
                  fill={keyframe.viseme !== 'REST' && keyframe.viseme !== 'MM' ? '#7f1d1d' : 'none'}
                />

                {/* Teeth highlight when mouth is open */}
                {keyframe.mouthOpenness > 0.35 && (
                  <rect x="77" y="78" width="6" height="2" rx="0.5" fill="#ffffff" />
                )}

                {/* Cheeks */}
                <ellipse cx="64" cy="74" rx="3.5" ry="2" fill="rgba(244, 63, 94, 0.25)" />
                <ellipse cx="96" cy="74" rx="3.5" ry="2" fill="rgba(244, 63, 94, 0.25)" />
              </g>
            )}
          </g>
        </svg>
      </div>

      {/* Real-Time Audio Spectral VU Meter Bar */}
      <div className="w-full mt-1 flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-xl px-2.5 py-1 text-[10px] font-mono shadow-md">
        <div className="flex items-center gap-1.5">
          <Mic className={`w-3 h-3 ${isPlaying && voiceEnabled ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
          <span className="text-slate-400 text-[9px]">AUDIO VU:</span>
          <div className="flex items-end gap-1 h-3.5 px-1 bg-slate-950/80 rounded-sm">
            {audioState.spectralEnergy.map((energy, i) => (
              <div key={i} className="w-1 h-3 bg-slate-800 rounded-2xs flex items-end overflow-hidden">
                <div 
                  className="w-full bg-gradient-to-t from-emerald-500 via-sky-400 to-indigo-400 transition-all duration-75"
                  style={{ height: `${Math.max(12, energy * 100)}%` }}
                />
              </div>
            ))}
          </div>
        </div>
        <span className="text-emerald-400 font-bold text-[9px]">
          {Math.round(audioState.amplitude * 100)}% RMS
        </span>
      </div>

      {/* Keyframe Animation State Machine Status HUD */}
      <div className="mt-1 w-full flex flex-col items-center gap-1.5">
        <div className="w-full flex items-center justify-between bg-slate-950/90 border border-indigo-500/30 rounded-xl px-2.5 py-1 text-[10px] font-mono text-slate-300 shadow-md">
          <div className="flex items-center gap-1.5 truncate">
            <Activity className="w-3 h-3 text-indigo-400 shrink-0" />
            <span className="truncate">STATE: [{keyframe.gesture} | {keyframe.viseme}]</span>
          </div>
          <button
            type="button"
            onClick={() => setShowStateInspector(!showStateInspector)}
            className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 border border-indigo-700/50 cursor-pointer"
          >
            {showStateInspector ? 'Hide HUD' : 'HUD'}
          </button>
        </div>

        {/* State Machine Debug & Interactive Keyframe Tester Panel */}
        {showStateInspector && (
          <div className="w-full p-2 rounded-xl bg-slate-950/95 border border-slate-800 text-[10px] font-mono space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-slate-400">
              <span>Lipsync Keyframe Tester:</span>
              <button
                type="button"
                onClick={() => {
                  setManualVisemeOverride(null);
                  setManualGestureOverride(null);
                }}
                className="text-indigo-400 hover:underline"
              >
                Reset Auto
              </button>
            </div>

            {/* Visemes */}
            <div className="space-y-1">
              <span className="text-[9px] text-slate-500 uppercase">Viseme Mouth Shapes:</span>
              <div className="grid grid-cols-3 gap-1">
                {(['REST', 'AA', 'EE', 'OH', 'MM', 'TH'] as VisemeKey[]).map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setManualVisemeOverride(v)}
                    className={`px-1.5 py-0.5 rounded text-[9px] cursor-pointer ${
                      keyframe.viseme === v ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Gestures */}
            <div className="space-y-1">
              <span className="text-[9px] text-slate-500 uppercase">Gesture State:</span>
              <div className="grid grid-cols-2 gap-1">
                {(['IDLE', 'POINTING_BOARD', 'EMPHASIZING', 'THINKING', 'WRITING_CHALK'] as GestureKey[]).map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setManualGestureOverride(g)}
                    className={`px-1.5 py-0.5 rounded text-[8px] truncate cursor-pointer ${
                      keyframe.gesture === g ? 'bg-purple-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {g.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Instructor Controls & Avatar Style Selector */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-700/80 shadow-xs">
          <button
            type="button"
            onClick={() => onAvatarStyleChange?.('ada')}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
              avatarStyle === 'ada'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Switch to Prof. Ada"
          >
            Ada
          </button>

          <button
            type="button"
            onClick={() => onAvatarStyleChange?.('maxwell')}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
              avatarStyle === 'maxwell'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Switch to Dr. Maxwell"
          >
            Maxwell
          </button>

          <button
            type="button"
            onClick={() => onAvatarStyleChange?.('quantum-bot')}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
              avatarStyle === 'quantum-bot'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Switch to Quantum-Bot"
          >
            Q-Bot
          </button>

          <div className="w-px h-3 bg-slate-700 mx-0.5" />

          {/* Voice Audio Speech Toggle */}
          <button
            type="button"
            onClick={onToggleVoice}
            className={`p-1 rounded-lg transition-colors cursor-pointer ${
              voiceEnabled ? 'text-emerald-400 hover:text-emerald-300' : 'text-slate-500 hover:text-slate-400'
            }`}
            title={voiceEnabled ? 'Character Voice Active (Click to Mute Voice)' : 'Character Voice Muted (Click to Enable)'}
          >
            {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
