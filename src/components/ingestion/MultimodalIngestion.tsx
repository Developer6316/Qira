import React, { useState } from 'react';
import { IngestedMaterial, SourceCitation, UserRole, GeneratedVideoLecture } from '../../types';
import { 
  FileText, 
  Video, 
  Presentation, 
  UploadCloud, 
  Plus, 
  CheckCircle, 
  Clock, 
  Layers, 
  Eye, 
  Sparkles, 
  FileCode, 
  Tag, 
  Search, 
  Lock, 
  Shield, 
  Play, 
  BookOpen, 
  ArrowRight,
  Zap,
  FileCheck
} from 'lucide-react';
import { synthesizeVideoFromMaterial } from '../../services/materialVideoPipeline';
import { playClickSound, playSuccessChime, playSwooshSound } from '../../utils/soundEffects';

interface MultimodalIngestionProps {
  materials: IngestedMaterial[];
  onAddMaterial: (newMat: IngestedMaterial) => void;
  onOpenCitation: (citation: SourceCitation) => void;
  onNavigateToVideoStudio?: (materialId: string, topic: string) => void;
  userRole?: UserRole;
  onRequestAdminAuth?: (actionName?: string) => void;
  onStudentUploadAndGenerateVideo?: (material: IngestedMaterial, video: GeneratedVideoLecture) => void;
}

export const MultimodalIngestion: React.FC<MultimodalIngestionProps> = ({
  materials,
  onAddMaterial,
  onOpenCitation,
  onNavigateToVideoStudio,
  userRole = 'learner',
  onRequestAdminAuth,
  onStudentUploadAndGenerateVideo
}) => {
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(materials[0]?.id || 'mat-pdf-01');
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customType, setCustomType] = useState<'pdf' | 'video' | 'presentation' | 'article'>('pdf');
  const [customTopic, setCustomTopic] = useState('Rotational Dynamics');
  const [customContent, setCustomContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [generatingVideoId, setGeneratingVideoId] = useState<string | null>(null);

  const selectedMaterial = materials.find(m => m.id === selectedMaterialId) || materials[0];

  const handleOpenAdminUpload = () => {
    playClickSound();
    if (userRole !== 'admin') {
      onRequestAdminAuth?.('Upload Official Course Material');
    } else {
      setIsUploadModalOpen(true);
    }
  };

  const handleOpenStudentUpload = () => {
    playSwooshSound();
    // Default sample content
    setCustomTitle('Rotational_Dynamics_Torque_Notes.pdf');
    setCustomTopic('Rotational Dynamics & Torque');
    setCustomType('pdf');
    setCustomContent(`Rotational Dynamics establishes that angular acceleration α is directly proportional to applied net torque τ_net and inversely proportional to moment of inertia I: τ_net = I · α.\n\nTorque is defined by the cross product τ = r × F = r · F · sin(θ). The moment of inertia I represents the distribution of mass relative to the rotation axis: I = ∫ r² dm. For a solid cylinder, I = (1/2) M R².\n\nRotational kinetic energy K_rot = (1/2) I ω². In rolling without slipping, total kinetic energy is the sum of translational and rotational kinetic energy: K_total = (1/2) M v_cm² + (1/2) I_cm ω².`);
    setIsStudentModalOpen(true);
  };

  const executeIngestAndGenerateVideo = (title: string, topic: string, type: 'pdf' | 'video' | 'presentation' | 'article', content: string) => {
    setIsUploading(true);
    playClickSound();

    setTimeout(() => {
      const paragraphs = content.split('\n\n').filter(p => p.trim().length > 15);
      const chunks = paragraphs.length > 0 ? paragraphs.map((p, idx) => ({
        id: `chunk-usr-${Date.now()}-${idx + 1}`,
        chunkIndex: idx + 1,
        topic,
        conceptId: 'newton-2',
        pageNumber: type === 'pdf' ? idx + 1 : undefined,
        timestamp: type === 'video' ? `0${idx}:30` : undefined,
        timestampSeconds: type === 'video' ? (idx + 1) * 30 : undefined,
        slideNumber: type === 'presentation' ? idx + 1 : undefined,
        content: p.trim(),
        keywords: [topic.toLowerCase(), 'student material', 'grounded chunk']
      })) : [
        {
          id: `chunk-usr-${Date.now()}-1`,
          chunkIndex: 1,
          topic,
          conceptId: 'newton-2',
          pageNumber: 1,
          content: content || `Core concepts and equations for ${topic}. Grounded semantic definitions.`,
          keywords: [topic.toLowerCase(), 'student notes']
        }
      ];

      const newMat: IngestedMaterial = {
        id: `mat-usr-${Date.now()}`,
        title: title.endsWith('.pdf') || title.endsWith('.mp4') || title.endsWith('.pptx') ? title : `${title}.pdf`,
        type,
        uploadedAt: 'Just now',
        sizeMb: Number((Math.random() * 8 + 2).toFixed(1)),
        pageCount: Math.max(1, chunks.length),
        topicsCovered: [topic, 'Student Notes', 'Grounded Tutor'],
        conceptsCount: chunks.length,
        chunksCount: chunks.length,
        status: 'indexed',
        summary: `Student-uploaded material covering ${topic}. Ingested into ${chunks.length} semantic grounding chunks. Fully readable and cited by the Grounded AI Tutor.`,
        chunks
      };

      onAddMaterial(newMat);
      setSelectedMaterialId(newMat.id);

      // Synthesize AI Chalkboard Video Lecture directly
      const synthesizedVideo = synthesizeVideoFromMaterial(newMat);
      playSuccessChime();

      setIsUploading(false);
      setIsStudentModalOpen(false);
      setIsUploadModalOpen(false);

      if (onStudentUploadAndGenerateVideo) {
        onStudentUploadAndGenerateVideo(newMat, synthesizedVideo);
      } else if (onNavigateToVideoStudio) {
        onNavigateToVideoStudio(newMat.id, topic);
      }
    }, 900);
  };

  const handleGenerateVideoForExisting = (mat: IngestedMaterial) => {
    playClickSound();
    setGeneratingVideoId(mat.id);
    setTimeout(() => {
      const synthesizedVideo = synthesizeVideoFromMaterial(mat);
      playSuccessChime();
      setGeneratingVideoId(null);
      if (onStudentUploadAndGenerateVideo) {
        onStudentUploadAndGenerateVideo(mat, synthesizedVideo);
      } else if (onNavigateToVideoStudio) {
        onNavigateToVideoStudio(mat.id, mat.topicsCovered[0] || 'Physics');
      }
    }, 600);
  };

  const sampleMaterialTemplates = [
    {
      title: 'Rotational_Dynamics_Torque_Notes.pdf',
      type: 'pdf' as const,
      topic: 'Rotational Dynamics & Torque',
      content: `Rotational Dynamics establishes that angular acceleration α is directly proportional to applied net torque τ_net and inversely proportional to moment of inertia I: τ_net = I · α.\n\nTorque is defined by the cross product τ = r × F = r · F · sin(θ). The moment of inertia I represents the distribution of mass relative to the rotation axis: I = ∫ r² dm. For a solid cylinder, I = (1/2) M R².\n\nRotational kinetic energy K_rot = (1/2) I ω². In rolling without slipping, total kinetic energy is the sum of translational and rotational kinetic energy: K_total = (1/2) M v_cm² + (1/2) I_cm ω².`
    },
    {
      title: 'Work_Energy_Theorem_Conservation.pdf',
      type: 'pdf' as const,
      topic: 'Work-Energy Theorem & Conservation',
      content: `The Work-Energy Theorem states that the net work done by all external forces acting on a particle equals the change in its kinetic energy: W_net = ΔK = (1/2) m v_final² - (1/2) m v_initial².\n\nWork W is the path integral of force along displacement: W = ∫ F · dr = F · d · cos(θ). A force is conservative if the work done is path-independent, allowing the definition of potential energy U: W_cons = -ΔU.\n\nMechanical Energy Conservation states that when only conservative forces act, total mechanical energy is conserved: E = K + U = constant.`
    },
    {
      title: 'Electromagnetism_Coulombs_Law.pdf',
      type: 'pdf' as const,
      topic: 'Electromagnetism & Coulomb Force',
      content: `Coulomb's Law quantifies the electrostatic force between two stationary electric charges: F = k_e · (|q1 · q2|) / r². The force vector acts along the straight line joining the charges. Like charges repel with positive potential energy, while opposite charges attract.\n\nElectric Field E is defined as the force per unit test charge: E = F / q_0 = k_e · q / r² r_hat. In continuous charge distributions, Gauss's Law states that the net electric flux through any closed Gaussian surface equals the enclosed charge divided by the vacuum permittivity ε_0: Φ_E = ∮ E · dA = Q_enclosed / ε_0.`
    }
  ];

  const filteredChunks = selectedMaterial?.chunks.filter(c => {
    const matchesSearch = c.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  }) || [];

  return (
    <div className="space-y-6">
      {/* Top Banner Overview with Glassmorphism */}
      <div className="glass-panel bg-gradient-to-r from-indigo-600/95 via-indigo-700/95 to-purple-700/95 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-white/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-white/20 text-white border border-white/30 backdrop-blur-xs">
                SYSTEM 1 OF 7
              </span>
              <span className="text-xs text-indigo-100 font-medium">Multimodal Ingestion & Dynamic AI Video Synthesis</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Study Material Ingest & Semantic Grounding Base
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100 max-w-2xl leading-relaxed">
              Upload your lecture notes, textbook chapters, or problem sheets. The cognition engine understands the text, binds citations to the AI Tutor, and automatically synthesizes a chalkboard video lecture!
            </p>
          </div>

          {/* Action Buttons: Student Upload-to-Video & Admin Upload */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleOpenStudentUpload}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-indigo-700 font-bold text-xs shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
              <span>Upload Notes & Synthesize Video 🎥</span>
            </button>

            <button
              type="button"
              onClick={handleOpenAdminUpload}
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-indigo-900/50 hover:bg-indigo-900/70 text-indigo-200 border border-indigo-400/30 text-xs font-bold transition-all cursor-pointer"
            >
              {userRole === 'admin' ? (
                <>
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Admin Course Ingest</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-amber-300" />
                  <span>Admin Upload (🔒)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Student Upload & Auto-Video Synthesis Modal */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-xl border border-white/80 rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/80 bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm tracking-tight">Upload Notes $\to$ Understand $\to$ Synthesize AI Video</h3>
                  <p className="text-xs text-slate-500">QIRA will chunk your notes, ground the AI Tutor, and build a chalkboard video</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsStudentModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-mono p-1 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Quick Template Fill Buttons */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-slate-500 uppercase font-bold">Or Pick a High-Yield STEM Study Topic:</span>
                <div className="flex flex-wrap gap-2">
                  {sampleMaterialTemplates.map((tpl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setCustomTitle(tpl.title);
                        setCustomTopic(tpl.topic);
                        setCustomType(tpl.type);
                        setCustomContent(tpl.content);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 text-xs font-semibold text-slate-700 transition-all cursor-pointer"
                    >
                      {tpl.topic}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Document Title</label>
                  <input
                    type="text"
                    required
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Physics Topic</label>
                  <input
                    type="text"
                    required
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Study Notes / Formula Text / Transcript</label>
                <textarea
                  rows={6}
                  required
                  value={customContent}
                  onChange={(e) => setCustomContent(e.target.value)}
                  placeholder="Paste textbook notes, definitions, formulas, or excerpts..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsStudentModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => executeIngestAndGenerateVideo(customTitle, customTopic, customType, customContent)}
                  disabled={isUploading || !customTitle.trim()}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Ingesting & Synthesizing Video...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Ingest Notes & Auto-Generate Video Lecture</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Material Grid & Chunk Viewer with Glassmorphism */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Material List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
              Course & Student Materials ({materials.length})
            </h3>
            <span className="text-xs text-emerald-700 font-mono flex items-center gap-1 font-semibold">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Active Grounding
            </span>
          </div>

          <div className="space-y-3">
            {materials.map((mat) => {
              const isSelected = mat.id === selectedMaterialId;
              const isGeneratingThis = generatingVideoId === mat.id;

              return (
                <div
                  key={mat.id}
                  className={`glass-card p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-white/95 border-indigo-500 shadow-md shadow-indigo-500/10 ring-2 ring-indigo-500/30'
                      : 'hover:border-slate-300 hover:bg-white/90'
                  }`}
                >
                  <div 
                    onClick={() => {
                      playClickSound();
                      setSelectedMaterialId(mat.id);
                    }}
                    className="flex items-start gap-3 cursor-pointer"
                  >
                    <div className={`p-2.5 rounded-xl ${
                      mat.type === 'pdf' ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                      mat.type === 'video' ? 'bg-sky-50 text-sky-600 border border-sky-200' :
                      'bg-amber-50 text-amber-600 border border-amber-200'
                    }`}>
                      {mat.type === 'pdf' && <FileText className="w-5 h-5" />}
                      {mat.type === 'video' && <Video className="w-5 h-5" />}
                      {mat.type === 'presentation' && <Presentation className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">
                          {mat.type.toUpperCase()}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{mat.uploadedAt}</span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 truncate mt-0.5">{mat.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{mat.summary}</p>
                    </div>
                  </div>

                  {/* 1-Click Action to Synthesize/Open Video for this specific Material */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400">
                      {mat.chunksCount} Grounded Chunks
                    </span>
                    <button
                      type="button"
                      onClick={() => handleGenerateVideoForExisting(mat)}
                      disabled={isGeneratingThis}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold transition-all shadow-2xs cursor-pointer"
                    >
                      {isGeneratingThis ? (
                        <>
                          <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                          <span>Building Video...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 text-indigo-600" />
                          <span>Generate Video Lecture 🎥</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Chunk Semantic Grounding Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-card rounded-2xl p-6 bg-white/90 border border-slate-200/80 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-black text-sm text-slate-900 tracking-tight">
                  Semantic Chunks & OCR Grounding: {selectedMaterial?.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Each chunk is indexed into vector embeddings and dynamically referenced by the AI Tutor
                </p>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter chunk keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 w-48"
                />
              </div>
            </div>

            {/* Chunks List */}
            <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
              {filteredChunks.map((chunk) => (
                <div
                  key={chunk.id}
                  className="p-4 rounded-xl bg-slate-50/80 hover:bg-slate-50 border border-slate-200/80 space-y-2 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                      Chunk #{chunk.chunkIndex} · {chunk.pageNumber ? `Page ${chunk.pageNumber}` : chunk.timestamp ? `Time ${chunk.timestamp}` : 'Slide'}
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenCitation({
                        id: chunk.id,
                        sourceId: selectedMaterial.id,
                        sourceTitle: selectedMaterial.title,
                        sourceType: selectedMaterial.type,
                        pageNumber: chunk.pageNumber,
                        timestamp: chunk.timestamp,
                        snippet: chunk.content,
                        confidence: 0.96
                      })}
                      className="text-[11px] font-mono text-indigo-700 hover:text-indigo-900 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Inspect Citation</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans font-normal">
                    {chunk.content}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {chunk.keywords.map((kw, idx) => (
                      <span key={idx} className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
