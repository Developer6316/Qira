import { RagasMetrics, SimulatedStudentProfile } from '../types';

export const INITIAL_RAGAS_BENCHMARK: RagasMetrics = {
  faithfulness: 0.942,
  answerRelevance: 0.915,
  contextPrecision: 0.894,
  contextRecall: 0.931,
  harmRate: 0.012,
  evaluatedQueriesCount: 28,
  lastRunAt: '2026-10-04 17:40',
  benchmarkItems: [
    {
      id: 'ragas-1',
      query: "Explain Newton's Second Law and how acceleration relates to net force.",
      generatedAnswer: "Newton's Second Law states that net external force equals mass multiplied by acceleration (ΣF_net = m·a). Acceleration is the time rate of change of velocity (a = dv/dt), so force causes an object's velocity to change proportional to force and inversely proportional to mass.",
      groundTruth: "ΣF = m·a, where acceleration is the derivative dv/dt of velocity and points in the direction of the net force.",
      retrievedContexts: [
        "Physics_Fundamentals_Vol1.pdf (Page 47): ΣF_net = m · a. In component form: ΣF_x = m · a_x.",
        "Physics_Lecture_04_Newton_Dynamics.mp4 (12:43): Doubling net tension doubles acceleration when mass is held constant."
      ],
      faithfulness: 0.98,
      answerRelevance: 0.96,
      isOffMaterial: false,
      refusalCorrect: true
    },
    {
      id: 'ragas-2',
      query: "Who invented the telephone?",
      generatedAnswer: "⚠️ Off-Material Query Refusal: This information is not covered in your uploaded study materials on Newtonian Mechanics and Classical Dynamics. Grounded mode prevents hallucination.",
      groundTruth: "Refusal: Alexander Graham Bell is not mentioned in physics mechanics textbook.",
      retrievedContexts: [],
      faithfulness: 1.0,
      answerRelevance: 1.0,
      isOffMaterial: true,
      refusalCorrect: true
    },
    {
      id: 'ragas-3',
      query: "What is the difference between static and kinetic friction?",
      generatedAnswer: "Static friction prevents impending relative motion between surfaces up to a peak threshold f_s,max = μ_s · N. Once motion starts, kinetic friction f_k = μ_k · N opposes sliding, and typically μ_k < μ_s.",
      groundTruth: "Static friction f_s <= μ_s N opposes impending motion; kinetic friction f_k = μ_k N opposes relative sliding.",
      retrievedContexts: [
        "Physics_Fundamentals_Vol1.pdf (Page 58): Static friction opposes impending relative motion up to f_s,max = μ_s · N."
      ],
      faithfulness: 0.96,
      answerRelevance: 0.94,
      isOffMaterial: false,
      refusalCorrect: true
    },
    {
      id: 'ragas-4',
      query: "How do you cook pasta carbonara?",
      generatedAnswer: "⚠️ Off-Material Query Refusal: Culinary recipes and pasta preparation are outside the scope of your ingested Newtonian Physics materials. The system grounds answers strictly in provided course documents.",
      groundTruth: "Refusal: Cooking recipes are off-topic.",
      retrievedContexts: [],
      faithfulness: 1.0,
      answerRelevance: 1.0,
      isOffMaterial: true,
      refusalCorrect: true
    },
    {
      id: 'ragas-5',
      query: "How does action-reaction pair work on an inclined plane with gravity and normal force?",
      generatedAnswer: "According to Newton's Third Law (Page 52), the normal force on a box from an incline is paired with an equal and opposite force from the box onto the incline. Gravitational pull on the box by Earth is paired with gravitational pull on Earth by the box.",
      groundTruth: "Normal force pair is box-on-plane and plane-on-box. Gravity pair is box-on-Earth and Earth-on-box.",
      retrievedContexts: [
        "Physics_Fundamentals_Vol1.pdf (Page 52): F_AB = - F_BA. Action-reaction pairs act on different bodies and never cancel within single-body diagrams.",
        "Physics_Lecture_04_Newton_Dynamics.mp4 (16:51): Resolving mg components vs normal force."
      ],
      faithfulness: 0.93,
      answerRelevance: 0.92,
      isOffMaterial: false,
      refusalCorrect: true
    }
  ]
};

export const SIMULATED_STUDENT_PROFILES: SimulatedStudentProfile[] = [
  {
    id: 'sim-student-a',
    name: 'Alex (High-Prior Learner)',
    avatar: '👨‍🎓',
    archetype: 'strong_high_prior',
    description: 'Enters with strong foundational calculus and kinematics. Fast mastery progression with minimal prerequisite remediation needed.',
    initialOverallMastery: 0.81,
    conceptMasteryMap: {
      'pos-time': 0.95,
      'velocity': 0.92,
      'acceleration': 0.88,
      'newton-1': 0.85,
      'newton-2': 0.82,
      'free-body': 0.78,
      'newton-3': 0.80,
      'friction': 0.72,
      'momentum': 0.76
    },
    simulationTrajectory: [
      {
        sessionNumber: 1,
        overallMastery: 0.81,
        targetConceptScore: 0.82,
        prereqConceptScore: 0.88,
        actionTaken: 'Baseline diagnostic completed with high precision.',
        log: 'Alex answered 9/10 questions correctly. Minor confusion on incline friction limits.'
      },
      {
        sessionNumber: 2,
        overallMastery: 0.86,
        targetConceptScore: 0.87,
        prereqConceptScore: 0.91,
        actionTaken: 'Completed Advanced Dynamic Systems test.',
        log: 'Quickly solved 2D vector force equations. Mastered normal force decomposition.'
      },
      {
        sessionNumber: 3,
        overallMastery: 0.91,
        targetConceptScore: 0.93,
        prereqConceptScore: 0.94,
        actionTaken: 'Multi-body Atwood machine problem sets.',
        log: 'Calculated coupled accelerations flawlessly. Ready for rotational dynamics.'
      },
      {
        sessionNumber: 4,
        overallMastery: 0.95,
        targetConceptScore: 0.96,
        prereqConceptScore: 0.97,
        actionTaken: 'Final Classical Mechanics AP Benchmark.',
        log: 'Cohort leading score: 95% overall mastery certified.'
      }
    ]
  },
  {
    id: 'sim-student-b',
    name: 'Shahul (Struggling with Prerequisite Gaps)',
    avatar: '👩‍💻',
    archetype: 'struggling_gaps',
    description: 'Struggles with Newton’s Second Law specifically due to a hidden prerequisite gap in kinematic acceleration calculation (a = Δv/Δt).',
    initialOverallMastery: 0.42,
    conceptMasteryMap: {
      'pos-time': 0.82,
      'velocity': 0.78,
      'acceleration': 0.35, // Root cause gap!
      'newton-1': 0.65,
      'newton-2': 0.38, // Cascading failure!
      'free-body': 0.44,
      'newton-3': 0.50,
      'friction': 0.36,
      'momentum': 0.40
    },
    simulationTrajectory: [
      {
        sessionNumber: 1,
        overallMastery: 0.42,
        targetConceptScore: 0.38,
        prereqConceptScore: 0.35,
        actionTaken: 'Initial assessment: F=ma numerical problem failed.',
        log: 'Root Cause Engine identified failure: Shahul multiplied mass by final velocity (F = m · v) instead of computing acceleration (a = Δv/Δt).'
      },
      {
        sessionNumber: 2,
        overallMastery: 0.53,
        targetConceptScore: 0.51,
        prereqConceptScore: 0.68,
        actionTaken: 'Triggered Adaptive Prerequisite Remediation on Acceleration (Page 47 & Video 12:43).',
        log: 'Completed Kinematic Acceleration mini-lesson. Passed diagnostic quiz with 3.0 m/s² West.'
      },
      {
        sessionNumber: 3,
        overallMastery: 0.67,
        targetConceptScore: 0.68,
        prereqConceptScore: 0.79,
        actionTaken: 'Re-tested Newton\'s Second Law with sled problem (5kg @ 3m/s²).',
        log: 'Successfully computed 15.0 N! Prerequisite gap resolved. Newton 2nd Law score surged from 38% to 68%.'
      },
      {
        sessionNumber: 4,
        overallMastery: 0.78,
        targetConceptScore: 0.82,
        prereqConceptScore: 0.86,
        actionTaken: 'Integrated Friction and Free-Body Diagram assessments.',
        log: 'Closed-loop learning proved: Shahul reached 78% overall mastery, a +36% net trajectory boost.'
      }
    ]
  },
  {
    id: 'sim-student-c',
    name: 'Maya (Misconception-Prone Learner)',
    avatar: '🧑‍🔬',
    archetype: 'misconception_prone',
    description: 'Regularly assumes that heavier objects naturally fall faster or that normal force always equals mg (forgetting angles and vertical accelerations).',
    initialOverallMastery: 0.46,
    conceptMasteryMap: {
      'pos-time': 0.80,
      'velocity': 0.72,
      'acceleration': 0.60,
      'newton-1': 0.55,
      'newton-2': 0.45,
      'free-body': 0.32, // Misconception in FBDs!
      'newton-3': 0.40,
      'friction': 0.38,
      'momentum': 0.48
    },
    simulationTrajectory: [
      {
        sessionNumber: 1,
        overallMastery: 0.46,
        targetConceptScore: 0.32,
        prereqConceptScore: 0.55,
        actionTaken: 'Failed inclined plane problem: assumed N = mg instead of mg cos(θ).',
        log: 'Diagnosed persistent coordinate decomposition inversion misconception.'
      },
      {
        sessionNumber: 2,
        overallMastery: 0.58,
        targetConceptScore: 0.52,
        prereqConceptScore: 0.65,
        actionTaken: 'Remediated with Slide 5 and Video 16:51 FBD vector overlay.',
        log: 'Targeted interactive FBD builder showed perpendicular vs parallel gravity components.'
      },
      {
        sessionNumber: 3,
        overallMastery: 0.70,
        targetConceptScore: 0.71,
        prereqConceptScore: 0.76,
        actionTaken: 'Re-tested with 30° incline and elevator acceleration problems.',
        log: 'Maya correctly calculated apparent weight N = m(g + a). Misconception cleared.'
      },
      {
        sessionNumber: 4,
        overallMastery: 0.82,
        targetConceptScore: 0.84,
        prereqConceptScore: 0.88,
        actionTaken: 'Comprehensive Dynamics & Friction master quiz.',
        log: 'Maya climbed from 46% to 82% mastery with zero residual coordinate errors.'
      }
    ]
  }
];
