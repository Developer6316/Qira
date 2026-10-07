export type SourceType = 'pdf' | 'video' | 'presentation' | 'article';
export type UserRole = 'learner' | 'admin';

export interface SourceCitation {
  id: string;
  sourceId: string;
  sourceTitle: string;
  sourceType: SourceType;
  pageNumber?: number;
  timestamp?: string; // e.g. "12:43"
  timestampSeconds?: number;
  slideNumber?: number;
  snippet: string;
  confidence: number;
}

export interface GroundedClaim {
  id: string;
  text: string;
  isGrounded: boolean;
  groundingStatus: 'verified' | 'unsupported' | 'extrapolated';
  confidenceScore: number;
  citations: SourceCitation[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isOffMaterialRefusal?: boolean;
  claims?: GroundedClaim[];
  citations?: SourceCitation[];
  groundingScore?: number; // 0 to 1
  retrievalLatencyMs?: number;
}

export interface ConceptNode {
  id: string;
  name: string;
  topic: string;
  chapter: string;
  tier: number; // Level in prerequisite hierarchy (0 to 5)
  prerequisites: string[]; // Concept IDs required before this
  description: string;
  coreFormulas: string[];
  keyTerms: string[];
  primarySource: {
    title: string;
    type: SourceType;
    pageOrTimestamp: string;
    snippet: string;
  };
  sampleQuestionIds: string[];
}

export interface ConceptMastery {
  conceptId: string;
  masteryScore: number; // 0.0 to 1.0 (0% to 100%)
  confidenceInterval: number; // e.g. 0.05
  attemptsCount: number;
  correctCount: number;
  lastAssessedAt: string;
  history: {
    timestamp: string;
    score: number;
    delta: number;
    reason: string;
  }[];
  status: 'critical' | 'developing' | 'competent' | 'mastered';
}

export interface AssessmentQuestion {
  id: string;
  topic: string;
  conceptId: string;
  conceptName: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  type: 'mcq' | 'short_answer' | 'numerical';
  question: string;
  formulaContext?: string;
  options?: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
    misconceptionTag?: string; // e.g. "confused_v_with_a" or "sign_error"
  }[];
  correctAnswer: string;
  detailedSolution: string;
  source: {
    document: string;
    type: SourceType;
    page?: number;
    timestamp?: string;
  };
  prerequisiteConceptId?: string;
}

export interface RemediationSession {
  id: string;
  targetConceptId: string;
  targetConceptName: string;
  failedQuestion: AssessmentQuestion;
  studentAnswer: string;
  detectedRootCause: {
    prerequisiteConceptId: string;
    prerequisiteConceptName: string;
    misconceptionExplanation: string;
    gapType: 'prerequisite_gap' | 'calculation_error' | 'conceptual_inversion';
    evidenceSnippet: string;
    sourceReference: {
      title: string;
      type: SourceType;
      location: string; // e.g. "Page 47" or "Timestamp 12:43"
    };
  };
  remedialLesson: {
    summary: string;
    keyPoints: string[];
    formulaBreakdown: string;
    sourceHighlight: string;
  };
  prerequisiteDiagnosticQuestion: AssessmentQuestion;
  stage: 'diagnosed' | 'reviewing_lesson' | 'prereq_quiz' | 'prereq_passed' | 'retesting_target' | 'mastery_improved';
  initialTargetMastery: number;
  newTargetMastery?: number;
  initialPrereqMastery: number;
  newPrereqMastery?: number;
}

export interface IngestedMaterial {
  id: string;
  title: string;
  type: SourceType;
  uploadedAt: string;
  sizeMb: number;
  pageCount?: number;
  duration?: string;
  topicsCovered: string[];
  conceptsCount: number;
  chunksCount: number;
  status: 'indexed' | 'processing' | 'ready';
  summary: string;
  chunks: {
    id: string;
    chunkIndex: number;
    topic: string;
    conceptId: string;
    pageNumber?: number;
    timestamp?: string;
    timestampSeconds?: number;
    slideNumber?: number;
    content: string;
    keywords: string[];
  }[];
}

export interface SimulatedStudentProfile {
  id: string;
  name: string;
  avatar: string;
  archetype: 'strong_high_prior' | 'struggling_gaps' | 'misconception_prone';
  description: string;
  initialOverallMastery: number;
  conceptMasteryMap: Record<string, number>;
  simulationTrajectory: {
    sessionNumber: number;
    overallMastery: number;
    targetConceptScore: number;
    prereqConceptScore: number;
    actionTaken: string;
    log: string;
  }[];
}

export interface RagasMetrics {
  faithfulness: number;
  answerRelevance: number;
  contextPrecision: number;
  contextRecall: number;
  harmRate: number;
  evaluatedQueriesCount: number;
  lastRunAt: string;
  benchmarkItems: {
    id: string;
    query: string;
    generatedAnswer: string;
    groundTruth: string;
    retrievedContexts: string[];
    faithfulness: number;
    answerRelevance: number;
    isOffMaterial: boolean;
    refusalCorrect: boolean;
  }[];
}

export interface VideoScene {
  id: string;
  sceneIndex: number;
  timestamp: string; // e.g. "00:00", "01:25"
  timestampSeconds: number;
  durationSeconds: number;
  title: string;
  chalkboardEquation: string;
  visualTheme: 'kinematics' | 'dynamics' | 'vectors' | 'forces' | 'energy' | 'general';
  diagramDescription: string;
  bulletPoints: string[];
  narrationTranscript: string;
  keyTerms: string[];
}

export interface GeneratedVideoLecture {
  id: string;
  title: string;
  topic: string;
  totalDuration: string; // e.g. "04:30"
  totalDurationSeconds: number;
  createdAt: string;
  sourceMaterialTitle?: string;
  summary: string;
  scenes: VideoScene[];
  targetConceptId?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  institution?: string;
  studentId?: string;
  createdAt: string;
}


