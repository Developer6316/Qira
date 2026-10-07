import React, { useState, useEffect } from 'react';
import { GeneratedVideoLecture, VideoScene, IngestedMaterial, SourceCitation } from '../../types';
import { generateVideoLecture } from '../../services/api';
import { 
  Video, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Save, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Volume2, 
  ChevronRight, 
  ChevronLeft,
  FastForward,
  Maximize2,
  BookOpen,
  FileText,
  Zap,
  Cpu,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClickSound, playVideoStartSound, playSwooshSound } from '../../utils/soundEffects';
import { AnimatedInstructor, AvatarStyle } from './AnimatedInstructor';

interface VideoLectureStudioProps {
  materials: IngestedMaterial[];
  onSaveVideoToMaterials: (newMat: IngestedMaterial) => void;
  onOpenCitation: (citation: SourceCitation) => void;
  activeLectureOverride?: GeneratedVideoLecture | null;
}

export const VideoLectureStudio: React.FC<VideoLectureStudioProps> = ({
  materials,
  onSaveVideoToMaterials,
  onOpenCitation,
  activeLectureOverride
}) => {
  const [topicInput, setTopicInput] = useState("Newton's Second Law & Acceleration");
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('mat-pdf-01');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Default loaded lecture
  const defaultLecture: GeneratedVideoLecture = {
    id: 'lec-default-01',
    title: "Masterclass: Newton's Second Law & Kinematic Acceleration",
    topic: "Newton's Second Law & Acceleration",
    totalDuration: '04:20',
    totalDurationSeconds: 260,
    createdAt: 'Generated just now',
    sourceMaterialTitle: 'Physics_Fundamentals_Vol1.pdf (Page 47)',
    summary: 'A complete audiovisual conceptual masterclass deriving F_net = m·a from first principles, resolving prerequisite kinematic acceleration (a = Δv/Δt), and demonstrating worked solutions.',
    scenes: [
      {
        id: 'sc-1',
        sceneIndex: 1,
        timestamp: '00:00',
        timestampSeconds: 0,
        durationSeconds: 60,
        title: "1. Coordinate Frame & Vector Displacement",
        chalkboardEquation: '\\Delta \\vec{r} = \\vec{r}_{final} - \\vec{r}_{initial} \\quad \\implies \\quad \\vec{v}(t) = \\frac{d\\vec{r}}{dt}',
        visualTheme: 'kinematics',
        diagramDescription: 'Inertial reference frame with origin (0,0) and instantaneous position vector r(t).',
        bulletPoints: [
          'All mechanical motion is defined relative to an inertial coordinate frame',
          'Displacement Δr is path-independent net change in position vector',
          'Velocity v(t) represents instantaneous tangent rate of displacement dx/dt'
        ],
        narrationTranscript: 'Welcome to this masterclass on Newtonian dynamics. Before calculating dynamic forces, we must establish our spatial coordinates. Displacement measures the straight-line vector change from initial to final position.',
        keyTerms: ['Reference Frame', 'Vector Displacement', 'Velocity Derivative', 'Kinematics']
      },
      {
        id: 'sc-2',
        sceneIndex: 2,
        timestamp: '01:00',
        timestampSeconds: 60,
        durationSeconds: 70,
        title: '2. Kinematic Acceleration: Rate of Velocity Change',
        chalkboardEquation: '\\vec{a}(t) = \\frac{d\\vec{v}}{dt} = \\lim_{\\Delta t \\to 0} \\frac{\\vec{v}_f - \\vec{v}_i}{\\Delta t}',
        visualTheme: 'vectors',
        diagramDescription: 'Velocity-time curve with tangent slope defining instantaneous acceleration a = dv/dt.',
        bulletPoints: [
          'Acceleration a measures how rapidly velocity changes magnitude or direction',
          'Crucial: An object at instantaneous rest (v = 0) can possess non-zero acceleration',
          'Without computing a = (v_f - v_i)/Δt first, force equations cannot be resolved'
        ],
        narrationTranscript: 'Never confuse instantaneous speed with acceleration. Acceleration is the vector derivative of velocity. If a cart speeds up from 3 m/s to 15 m/s in 3 seconds, its acceleration is exactly 4.0 meters per second squared.',
        keyTerms: ['Instantaneous Acceleration', 'dv/dt', 'Delta v / Delta t', 'Vector Rate']
      },
      {
        id: 'sc-3',
        sceneIndex: 3,
        timestamp: '02:10',
        timestampSeconds: 130,
        durationSeconds: 70,
        title: "3. Newton's 2nd Law & Force Proportionality",
        chalkboardEquation: '\\Sigma \\vec{F}_{net} = m \\cdot \\vec{a} = m \\cdot \\left(\\frac{\\Delta \\vec{v}}{\\Delta t}\\right)',
        visualTheme: 'forces',
        diagramDescription: 'Free-body diagram of mass m with applied net force vector F_net inducing acceleration a.',
        bulletPoints: [
          'Net external force is directly proportional to induced acceleration',
          'Inertial mass m acts as the scalar constant of resistance to acceleration',
          'Component decomposition: ΣF_x = m · a_x and ΣF_y = m · a_y'
        ],
        narrationTranscript: 'Here is Newton’s Second Law: Sigma F net equals mass times acceleration. Mass represents inertia. When you double the applied net force on a fixed mass, its acceleration doubles simultaneously.',
        keyTerms: ['Net Force', 'Inertial Mass', 'F=ma', 'Free Body Diagram']
      },
      {
        id: 'sc-4',
        sceneIndex: 4,
        timestamp: '03:20',
        timestampSeconds: 190,
        durationSeconds: 70,
        title: '4. Step-by-Step Worked Problem & Verification',
        chalkboardEquation: 'F_{net} = m \\cdot a = (4.0\\text{ kg}) \\cdot \\left(\\frac{15.0 - 3.0}{3.0}\\text{ m/s}^2\\right) = 16.0\\text{ N}',
        visualTheme: 'dynamics',
        diagramDescription: 'Step-by-step problem solver box showing 4.0 kg cart accelerating along low-friction track.',
        bulletPoints: [
          'Step 1: Calculate acceleration a = (15.0 - 3.0)/3.0 = 4.0 m/s²',
          'Step 2: Multiply mass by acceleration: F_net = 4.0 kg × 4.0 m/s² = 16.0 N',
          'Verified: Avoid multiplying mass directly by final velocity (4 × 15 ≠ 60 N)'
        ],
        narrationTranscript: 'Applying this to our worked problem: for a four-kilogram cart accelerating from three to fifteen meters per second in three seconds, we calculate acceleration first—four meters per second squared—resulting in a net force of sixteen newtons.',
        keyTerms: ['Worked Problem', 'Step-by-Step', 'Calculation Verification', 'F=ma']
      }
    ]
  };

  const [currentLecture, setCurrentLecture] = useState<GeneratedVideoLecture>(defaultLecture);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [avatarStyle, setAvatarStyle] = useState<AvatarStyle>('ada');
  const [characterVoiceEnabled, setCharacterVoiceEnabled] = useState<boolean>(true);

  const currentScene = currentLecture.scenes[currentSceneIndex] || currentLecture.scenes[0];

  // Auto-load newly synthesized lecture if passed from student material ingestion
  useEffect(() => {
    if (activeLectureOverride) {
      setCurrentLecture(activeLectureOverride);
      setCurrentSceneIndex(0);
      setElapsedSeconds(0);
      setIsPlaying(true);
      playVideoStartSound();
    }
  }, [activeLectureOverride]);

  // Playback timer ticker
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => {
          const next = prev + 1 * playbackSpeed;
          if (next >= currentLecture.totalDurationSeconds) {
            setIsPlaying(false);
            return currentLecture.totalDurationSeconds;
          }
          // Update scene index based on elapsed seconds
          const foundIdx = currentLecture.scenes.findIndex((sc, idx) => {
            const nextSc = currentLecture.scenes[idx + 1];
            return next >= sc.timestampSeconds && (!nextSc || next < nextSc.timestampSeconds);
          });
          if (foundIdx !== -1 && foundIdx !== currentSceneIndex) {
            setCurrentSceneIndex(foundIdx);
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, currentLecture, currentSceneIndex]);

  const handleGenerate = async (customTopic?: string) => {
    const targetTopic = customTopic || topicInput;
    if (!targetTopic.trim() || isGenerating) return;

    setIsGenerating(true);
    setIsPlaying(false);
    setElapsedSeconds(0);
    setCurrentSceneIndex(0);

    const activeMat = materials.find(m => m.id === selectedMaterialId);
    const materialContent = activeMat?.chunks.map(c => c.content).join('\n\n') || '';

    try {
      const res = await generateVideoLecture(targetTopic, activeMat?.title, materialContent);
      if (res.lecture) {
        setCurrentLecture(res.lecture);
        setIsSaved(false);
        try {
          confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
        } catch (e) {}
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToCourse = () => {
    const newMaterial: IngestedMaterial = {
      id: `mat-gen-vid-${Date.now()}`,
      title: `${currentLecture.title}.mp4`,
      type: 'video',
      uploadedAt: 'AI Generated',
      sizeMb: 32.4,
      duration: currentLecture.totalDuration,
      topicsCovered: [currentLecture.topic, "Kinematics", "Newton's Laws"],
      conceptsCount: currentLecture.scenes.length,
      chunksCount: currentLecture.scenes.length,
      status: 'indexed',
      summary: currentLecture.summary,
      chunks: currentLecture.scenes.map((sc) => ({
        id: `chunk-gen-${sc.id}`,
        chunkIndex: sc.sceneIndex,
        topic: currentLecture.topic,
        conceptId: 'newton-2',
        timestamp: sc.timestamp,
        timestampSeconds: sc.timestampSeconds,
        content: `[${sc.timestamp}] ${sc.title}: ${sc.narrationTranscript} Chalkboard Formula: ${sc.chalkboardEquation}`,
        keywords: sc.keyTerms
      }))
    };

    onSaveVideoToMaterials(newMaterial);
    setIsSaved(true);
    try {
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.5 } });
    } catch (e) {}
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const jumpToScene = (idx: number) => {
    const targetScene = currentLecture.scenes[idx];
    if (targetScene) {
      setCurrentSceneIndex(idx);
      setElapsedSeconds(targetScene.timestampSeconds);
    }
  };

  const presetTopics = [
    "Newton's Second Law & Acceleration",
    "Incline Plane Free-Body Diagrams & Normal Force",
    "Static vs Kinetic Friction on Concrete",
    "Linear Momentum Conservation & Collisions"
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner (Bright Gradient) */}
      <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-700 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-white/20 text-white border border-white/30 backdrop-blur-xs">
                AI VIDEO LECTURE STUDIO
              </span>
              <span className="text-xs text-sky-100 font-medium">Multimodal Concept Synthesizer & Chalkboard Player</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>AI-Generated Audiovisual Concept Video Studio</span>
            </h2>
            <p className="text-xs sm:text-sm text-sky-100 max-w-2xl leading-relaxed">
              Generate structured, synchronized video lectures based on any uploaded material or topic. The engine creates chalkboard derivations, visual keyframe slides, narration transcripts, and timestamped chapters that can be saved directly into your course library.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveToCourse}
              disabled={isSaved}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-md ${
                isSaved
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 cursor-default'
                  : 'bg-white hover:bg-slate-50 text-indigo-700 hover:shadow-lg active:scale-95'
              }`}
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Saved to Course Materials</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-indigo-600" />
                  <span>+ Ingest Lecture to Library</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Generator Control Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Topic Input Field */}
          <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="Enter any topic or concept to generate a full video lecture..."
              disabled={isGenerating}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors font-medium"
            />

            {/* Source Material Dropdown */}
            <select
              value={selectedMaterialId}
              onChange={(e) => setSelectedMaterialId(e.target.value)}
              disabled={isGenerating}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs text-indigo-700 font-bold focus:outline-none cursor-pointer font-mono"
            >
              {materials.map(m => (
                <option key={m.id} value={m.id}>
                  {m.title} ({m.type.toUpperCase()})
                </option>
              ))}
            </select>

            <button
              onClick={() => handleGenerate()}
              disabled={isGenerating || !topicInput.trim()}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-all disabled:opacity-40"
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing Video Lecture...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Video Lecture</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preset Topic Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold tracking-wider whitespace-nowrap">
            Sample Topics:
          </span>
          {presetTopics.map((pt, i) => (
            <button
              key={i}
              onClick={() => {
                setTopicInput(pt);
                handleGenerate(pt);
              }}
              disabled={isGenerating}
              className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 text-xs font-mono font-medium whitespace-nowrap transition-colors"
            >
              {pt}
            </button>
          ))}
        </div>
      </div>

      {/* Main Video Player & Interactive Chapters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Interactive HD Chalkboard Video Player */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col shadow-md">
            {/* Video Canvas Stage (Dark Chalkboard inset) with Animated Character */}
            <div className="relative min-h-[460px] md:min-h-[500px] bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 p-5 sm:p-6 flex flex-col justify-between overflow-hidden select-none">
              {/* Ambient Chalkboard Texture & Grid Overlay */}
              <div 
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }}
              />

              {/* Top Watermark & Scene Header */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <div className="px-2.5 py-1 rounded-lg bg-indigo-500/30 text-indigo-200 border border-indigo-500/40 text-xs font-mono font-bold">
                    SCENE {currentScene.sceneIndex} / {currentLecture.scenes.length}
                  </div>
                  <span className="text-xs font-semibold text-slate-200 truncate max-w-[200px] sm:max-w-md">
                    {currentScene.title}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-flex px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono items-center gap-1 font-semibold">
                    <UserCheck className="w-3 h-3 text-indigo-400" />
                    {avatarStyle === 'ada' ? 'Prof. Ada' : avatarStyle === 'maxwell' ? 'Dr. Maxwell' : 'Quantum-Bot'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Grounded
                  </span>
                </div>
              </div>

              {/* Central Stage: Animated Instructor Character (Left) + Chalkboard & Formulas (Right) */}
              <div className="my-auto z-10 grid grid-cols-1 md:grid-cols-12 gap-5 items-center w-full max-w-4xl mx-auto py-2">
                {/* Left: Animated Instructor Character with Speech Balloon & Gestures */}
                <div className="md:col-span-4 flex flex-col items-center justify-center">
                  <AnimatedInstructor
                    isPlaying={isPlaying}
                    currentScene={currentScene}
                    playbackSpeed={playbackSpeed}
                    avatarStyle={avatarStyle}
                    onAvatarStyleChange={setAvatarStyle}
                    voiceEnabled={characterVoiceEnabled}
                    onToggleVoice={() => setCharacterVoiceEnabled(!characterVoiceEnabled)}
                    sceneElapsedSeconds={Math.max(0, elapsedSeconds - currentScene.timestampSeconds)}
                  />
                </div>

                {/* Right: Chalkboard Stage */}
                <div className="md:col-span-8 space-y-3.5 text-center">
                  <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/90 border-2 border-indigo-500/40 shadow-2xl backdrop-blur-md space-y-3">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-bold flex items-center justify-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Core Mathematical Governing Derivation</span>
                    </div>
                    
                    {/* Chalkboard LaTeX Formula */}
                    <div className="py-3 px-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-base font-extrabold text-emerald-400 tracking-wide">
                      {currentScene.chalkboardEquation}
                    </div>

                    <p className="text-xs text-slate-300 font-sans italic">
                      "{currentScene.diagramDescription}"
                    </p>
                  </div>

                  {/* Key Takeaways Carousel on Video */}
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {currentScene.bulletPoints.map((bp, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-slate-900/90 text-slate-200 text-xs font-medium border border-slate-700 shadow-sm"
                      >
                        • {bp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Real-Time Narration Subtitle Banner */}
              <div className="z-10 bg-slate-950/90 backdrop-blur-xs rounded-xl p-3.5 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="text-indigo-400 flex items-center gap-1 font-bold">
                    <Volume2 className="w-3.5 h-3.5" /> Character Narration Voice (Spoken Aloud):
                  </span>
                  <span>{formatTime(elapsedSeconds)} / {currentLecture.totalDuration}</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans pl-2 border-l-2 border-indigo-500">
                  "{currentScene.narrationTranscript}"
                </p>
              </div>
            </div>

            {/* Video Player Control Bar */}
            <div className="p-4 bg-white border-t border-slate-200 space-y-3">
              {/* Scrub Track */}
              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const ratio = clickX / rect.width;
                  const targetSecs = ratio * currentLecture.totalDurationSeconds;
                  setElapsedSeconds(targetSecs);
                }}
                className="w-full bg-slate-200 h-2 rounded-full overflow-hidden relative cursor-pointer group"
              >
                <div
                  className="h-full bg-gradient-to-r from-indigo-600 to-sky-500 transition-all duration-100"
                  style={{ width: `${(elapsedSeconds / currentLecture.totalDurationSeconds) * 100}%` }}
                />
              </div>

              {/* Controls row */}
              <div className="flex items-center justify-between text-xs text-slate-700">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-md shadow-indigo-600/20"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => jumpToScene(Math.max(0, currentSceneIndex - 1))}
                    disabled={currentSceneIndex === 0}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => jumpToScene(Math.min(currentLecture.scenes.length - 1, currentSceneIndex + 1))}
                    disabled={currentSceneIndex === currentLecture.scenes.length - 1}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      setElapsedSeconds(0);
                      setCurrentSceneIndex(0);
                      setIsPlaying(false);
                    }}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <span className="font-mono text-indigo-700 text-xs font-bold">
                    {formatTime(elapsedSeconds)} / {currentLecture.totalDuration}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Instructor Character Quick Selector */}
                  <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-[11px] font-mono font-bold">
                    <span className="text-slate-500 px-1">Character:</span>
                    <button
                      type="button"
                      onClick={() => setAvatarStyle('ada')}
                      className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                        avatarStyle === 'ada' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Ada
                    </button>
                    <button
                      type="button"
                      onClick={() => setAvatarStyle('maxwell')}
                      className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                        avatarStyle === 'maxwell' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Maxwell
                    </button>
                    <button
                      type="button"
                      onClick={() => setAvatarStyle('quantum-bot')}
                      className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                        avatarStyle === 'quantum-bot' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Q-Bot
                    </button>
                  </div>

                  {/* Character Voice Audio Speech Toggle */}
                  <button
                    type="button"
                    onClick={() => setCharacterVoiceEnabled(!characterVoiceEnabled)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all border cursor-pointer ${
                      characterVoiceEnabled
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                    title={characterVoiceEnabled ? 'Voice explanation enabled' : 'Voice explanation muted'}
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>{characterVoiceEnabled ? 'Voice ON' : 'Voice OFF'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 font-mono text-[11px] font-semibold">Speed:</span>
                    {[1, 1.25, 1.5, 2].map((sp) => (
                      <button
                        key={sp}
                        onClick={() => setPlaybackSpeed(sp)}
                        className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold transition-colors cursor-pointer ${
                          playbackSpeed === sp
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {sp}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Synchronized Scene Chapters & Timeline */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                  Lecture Chapters ({currentLecture.scenes.length})
                </h3>
              </div>
              <span className="text-xs font-mono text-indigo-700 font-bold">{currentLecture.totalDuration}</span>
            </div>

            <div className="space-y-3">
              {currentLecture.scenes.map((scene, idx) => {
                const isSelected = currentSceneIndex === idx;
                return (
                  <div
                    key={scene.id}
                    onClick={() => jumpToScene(idx)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-500 ring-2 ring-indigo-500/30 shadow-xs'
                        : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {idx + 1}
                        </span>
                        <span>{scene.title.split(':')[0]}</span>
                      </span>

                      <span className="text-[11px] font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200 font-semibold">
                        {scene.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 pl-7 font-sans">
                      {scene.narrationTranscript}
                    </p>

                    <div className="flex flex-wrap gap-1 pl-7 pt-1">
                      {scene.keyTerms.slice(0, 2).map((kt, i) => (
                        <span key={i} className="text-[10px] font-mono text-slate-400">
                          #{kt}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
