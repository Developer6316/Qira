import { ConceptNode, ConceptMastery } from '../types';

export const CONCEPT_NODES: ConceptNode[] = [
  {
    id: 'pos-time',
    name: 'Position & Displacement',
    topic: 'Kinematics',
    chapter: 'Chapter 1: 1D Kinematics',
    tier: 0,
    prerequisites: [],
    description: 'Fundamental coordinates, origin reference points, vector displacement Δr = r_final - r_initial versus scalar distance.',
    coreFormulas: ['Δx = x_f - x_i', 's = \\int |v| dt'],
    keyTerms: ['Origin', 'Displacement', 'Vector', 'Scalar Distance', 'Coordinate Frame'],
    primarySource: {
      title: 'Physics_Fundamentals_Vol1.pdf',
      type: 'pdf',
      pageOrTimestamp: 'Page 18',
      snippet: 'Displacement is the net change in position vector Δr = r_final - r_initial. It is independent of path length.'
    },
    sampleQuestionIds: ['q-pos-1']
  },
  {
    id: 'velocity',
    name: 'Average & Instantaneous Velocity',
    topic: 'Kinematics',
    chapter: 'Chapter 1: 1D Kinematics',
    tier: 1,
    prerequisites: ['pos-time'],
    description: 'Time rate of displacement change. Instantaneous derivative v(t) = dx/dt versus scalar speed.',
    coreFormulas: ['v_{avg} = \\frac{\\Delta x}{\\Delta t}', 'v(t) = \\frac{dx}{dt}'],
    keyTerms: ['Instantaneous Velocity', 'Slope of x-t', 'Rate of Change', 'Speed'],
    primarySource: {
      title: 'Physics_Fundamentals_Vol1.pdf',
      type: 'pdf',
      pageOrTimestamp: 'Page 24',
      snippet: 'Average velocity is v_avg = Δx / Δt. Instantaneous velocity is the derivative of position dx/dt.'
    },
    sampleQuestionIds: ['q-vel-1']
  },
  {
    id: 'acceleration',
    name: 'Acceleration & Velocity Derivatives',
    topic: 'Kinematics',
    chapter: 'Chapter 1: 1D Kinematics',
    tier: 2,
    prerequisites: ['velocity'],
    description: 'Vector rate of velocity change: a(t) = dv/dt = d²x/dt². Crucial prerequisite for all dynamic force laws.',
    coreFormulas: ['a = \\frac{\\Delta v}{\\Delta t} = \\frac{v_f - v_i}{\\Delta t}', 'v = v_0 + at', 'x = x_0 + v_0 t + \\frac{1}{2}at^2'],
    keyTerms: ['Acceleration', 'Rate of Velocity Change', 'Slope of v-t', 'Deceleration', 'Apex'],
    primarySource: {
      title: 'Physics_Fundamentals_Vol1.pdf',
      type: 'pdf',
      pageOrTimestamp: 'Page 31',
      snippet: 'Acceleration is dv/dt. An object can have v=0 while maintaining non-zero acceleration.'
    },
    sampleQuestionIds: ['q-accel-prereq-remedy']
  },
  {
    id: 'newton-1',
    name: "Newton's First Law (Inertia)",
    topic: "Newton's Laws",
    chapter: "Chapter 2: Newton's Laws of Motion",
    tier: 2,
    prerequisites: ['pos-time', 'velocity'],
    description: 'Law of inertia: ΣF = 0 implies constant velocity (or rest) in inertial reference frames.',
    coreFormulas: ['\\sum \\vec{F} = 0 \\implies \\vec{a} = 0, \\vec{v} = \\text{const}'],
    keyTerms: ['Inertia', 'Inertial Frame', 'Equilibrium', 'Static vs Dynamic Equilibrium'],
    primarySource: {
      title: 'Physics_Fundamentals_Vol1.pdf',
      type: 'pdf',
      pageOrTimestamp: 'Page 42',
      snippet: 'An object remains in uniform motion unless acted upon by an unbalanced external force.'
    },
    sampleQuestionIds: ['q-n1-1']
  },
  {
    id: 'newton-2',
    name: "Newton's Second Law (F = ma)",
    topic: "Newton's Laws",
    chapter: "Chapter 2: Newton's Laws of Motion",
    tier: 3,
    prerequisites: ['acceleration', 'newton-1'],
    description: 'Net external force causes acceleration proportional to force and inversely proportional to mass: ΣF_net = m·a.',
    coreFormulas: ['\\sum \\vec{F}_{net} = m \\cdot \\vec{a}', '\\vec{a} = \\frac{\\sum \\vec{F}}{m}', '\\vec{F}_{net} = m \\cdot \\frac{d\\vec{v}}{dt}'],
    keyTerms: ['Net Force', 'Inertial Mass', 'Vector Acceleration', 'Proportionality', 'Component Resolution'],
    primarySource: {
      title: 'Physics_Fundamentals_Vol1.pdf',
      type: 'pdf',
      pageOrTimestamp: 'Page 47',
      snippet: "Newton's Second Law: ΣF_net = m·a. Acceleration 'a' is fundamentally Δv/Δt."
    },
    sampleQuestionIds: ['q-n2-target-fail', 'q-n2-retest-success']
  },
  {
    id: 'free-body',
    name: 'Free-Body Diagrams & Normal Force',
    topic: "Newton's Laws",
    chapter: "Chapter 2: Newton's Laws of Motion",
    tier: 4,
    prerequisites: ['newton-1', 'newton-2'],
    description: 'Systematic isolation of forces acting on a body. Resolving gravity, normal force, tension along coordinate axes.',
    coreFormulas: ['N = mg \\cos\\theta', 'F_{\\parallel} = mg \\sin\\theta', '\\sum F_x = m a_x'],
    keyTerms: ['Free Body Diagram', 'Normal Force', 'Incline Angle', 'Component Decomposition', 'Tension'],
    primarySource: {
      title: 'Physics_Lecture_04_Newton_Dynamics.mp4',
      type: 'video',
      pageOrTimestamp: '16:51',
      snippet: 'Drawing Free Body Diagrams: Resolving gravitational weight into components along incline.'
    },
    sampleQuestionIds: ['q-fbd-1']
  },
  {
    id: 'newton-3',
    name: "Newton's Third Law (Action-Reaction)",
    topic: "Newton's Laws",
    chapter: "Chapter 2: Newton's Laws of Motion",
    tier: 4,
    prerequisites: ['newton-2'],
    description: 'Forces always occur in matched interaction pairs acting on two different bodies: F_AB = - F_BA.',
    coreFormulas: ['\\vec{F}_{A \\to B} = - \\vec{F}_{B \\to A}'],
    keyTerms: ['Action-Reaction', 'Interaction Pair', 'Simultaneous Force', 'Different Bodies'],
    primarySource: {
      title: 'Physics_Fundamentals_Vol1.pdf',
      type: 'pdf',
      pageOrTimestamp: 'Page 52',
      snippet: 'Action-reaction pairs act on different bodies and never cancel within a single body FBD.'
    },
    sampleQuestionIds: ['q-n3-1']
  },
  {
    id: 'friction',
    name: 'Static & Kinetic Friction Forces',
    topic: 'Friction',
    chapter: 'Chapter 3: Friction & Circular Motion',
    tier: 5,
    prerequisites: ['free-body', 'newton-2'],
    description: 'Contact resistance between surfaces: static threshold f_s <= μ_s · N and kinetic sliding resistance f_k = μ_k · N.',
    coreFormulas: ['f_{s,max} = \\mu_s N', 'f_k = \\mu_k N', 'f_{net} = F_{applied} - f_k = ma'],
    keyTerms: ['Static Friction', 'Kinetic Friction', 'Friction Coefficient', 'Normal Force Contact'],
    primarySource: {
      title: 'Physics_Fundamentals_Vol1.pdf',
      type: 'pdf',
      pageOrTimestamp: 'Page 58',
      snippet: 'Static friction opposes impending relative motion. Kinetic friction opposes active sliding.'
    },
    sampleQuestionIds: ['q-fric-1']
  },
  {
    id: 'momentum',
    name: 'Linear Momentum & Impulse Conservation',
    topic: 'Momentum',
    chapter: 'Chapter 4: Momentum & Systems of Particles',
    tier: 5,
    prerequisites: ['newton-2', 'newton-3'],
    description: 'Product of mass and velocity: p = m·v. Impulse-momentum theorem J = ∫ F dt = Δp and conservation when F_ext = 0.',
    coreFormulas: ['\\vec{p} = m\\vec{v}', '\\vec{J} = \\int \\vec{F} dt = \\Delta \\vec{p}', '\\sum \\vec{p}_{initial} = \\sum \\vec{p}_{final}'],
    keyTerms: ['Momentum', 'Impulse', 'dp/dt', 'Conservation of Momentum', 'Elastic vs Inelastic'],
    primarySource: {
      title: 'Physics_Fundamentals_Vol1.pdf',
      type: 'pdf',
      pageOrTimestamp: 'Page 68',
      snippet: 'The generalized form of Newton 2nd Law states F_net = dp/dt. Total momentum is conserved in isolated systems.'
    },
    sampleQuestionIds: ['q-mom-1']
  }
];

export const CONCEPT_MAP: Record<string, ConceptNode> = CONCEPT_NODES.reduce((acc, node) => {
  acc[node.id] = node;
  return acc;
}, {} as Record<string, ConceptNode>);

/**
 * Root Cause Diagnosis Algorithm:
 * When student fails a question on targetConceptId, trace the prerequisite graph
 * to find the lowest prerequisite node with weak mastery (< 0.70) or matching misconception.
 */
export function findRootCauseGap(
  targetConceptId: string,
  masteryMap: Record<string, ConceptMastery>,
  misconceptionTag?: string
): {
  prereqConceptId: string;
  prereqConceptName: string;
  reason: string;
  gapType: 'prerequisite_gap' | 'calculation_error' | 'conceptual_inversion';
} {
  const targetNode = CONCEPT_MAP[targetConceptId];
  if (!targetNode) {
    return {
      prereqConceptId: targetConceptId,
      prereqConceptName: 'Current Concept',
      reason: 'Direct concept misunderstanding',
      gapType: 'conceptual_inversion'
    };
  }

  // Specific heuristic for Newton's 2nd Law failure
  if (targetConceptId === 'newton-2') {
    if (misconceptionTag?.includes('velocity') || (masteryMap['acceleration']?.masteryScore || 0) < 0.70) {
      return {
        prereqConceptId: 'acceleration',
        prereqConceptName: 'Acceleration & Velocity Derivatives',
        reason: 'Student failed to compute acceleration a = Δv/Δt before multiplying by mass m. The prerequisite kinematic acceleration definition is missing or weak.',
        gapType: 'prerequisite_gap'
      };
    }
  }

  // Traverse direct prerequisites to find lowest mastery
  let lowestPrereqId: string | null = null;
  let lowestScore = 1.0;

  for (const prereqId of targetNode.prerequisites) {
    const score = masteryMap[prereqId]?.masteryScore ?? 0.5;
    if (score < lowestScore) {
      lowestScore = score;
      lowestPrereqId = prereqId;
    }
  }

  if (lowestPrereqId && lowestScore < 0.70) {
    const prereqNode = CONCEPT_MAP[lowestPrereqId];
    return {
      prereqConceptId: lowestPrereqId,
      prereqConceptName: prereqNode ? prereqNode.name : lowestPrereqId,
      reason: `Prerequisite dependency '${prereqNode?.name}' has low mastery (${Math.round(lowestScore * 100)}%), causing cascading failure in ${targetNode.name}.`,
      gapType: 'prerequisite_gap'
    };
  }

  return {
    prereqConceptId: targetConceptId,
    prereqConceptName: targetNode.name,
    reason: `Target concept direct application error in ${targetNode.name}.`,
    gapType: 'conceptual_inversion'
  };
}

/**
 * Bayesian Mastery Update calculation
 */
export function calculateMasteryUpdate(
  currentMastery: number,
  isCorrect: boolean,
  questionDifficulty: number = 3
): { newScore: number; delta: number } {
  // BKT-inspired Bayesian update parameter weights
  const slip = 0.10; // Probability of accidental mistake on mastered concept
  const guess = 0.20; // Probability of lucky guess
  const diffMultiplier = questionDifficulty / 3;

  let newScore = currentMastery;
  if (isCorrect) {
    const posterior = (currentMastery * (1 - slip)) / (currentMastery * (1 - slip) + (1 - currentMastery) * guess);
    const learningGain = 0.15 * diffMultiplier;
    newScore = posterior + (1 - posterior) * learningGain;
  } else {
    const posterior = (currentMastery * slip) / (currentMastery * slip + (1 - currentMastery) * (1 - guess));
    const learningLoss = 0.10 * diffMultiplier;
    newScore = posterior - posterior * learningLoss;
  }

  newScore = Math.max(0.05, Math.min(0.98, newScore));
  const delta = newScore - currentMastery;
  return {
    newScore: Number(newScore.toFixed(3)),
    delta: Number(delta.toFixed(3))
  };
}
