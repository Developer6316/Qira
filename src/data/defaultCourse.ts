import { IngestedMaterial, ConceptMastery, AssessmentQuestion } from '../types';

export const DEFAULT_INGESTED_MATERIALS: IngestedMaterial[] = [
  {
    id: 'mat-pdf-01',
    title: 'Physics_Fundamentals_Vol1.pdf',
    type: 'pdf',
    uploadedAt: '2026-10-02 09:14 AM',
    sizeMb: 14.8,
    pageCount: 128,
    topicsCovered: ['Kinematics', "Newton's Laws", 'Friction', 'Momentum & Impulse'],
    conceptsCount: 8,
    chunksCount: 24,
    status: 'indexed',
    summary: 'Standard calculus-based textbook covering 1D/2D kinematics, vector force laws, inertial reference frames, static/kinetic friction, and conservation of linear momentum.',
    chunks: [
      {
        id: 'chunk-pdf-1',
        chunkIndex: 1,
        topic: 'Kinematics',
        conceptId: 'pos-time',
        pageNumber: 18,
        content: 'Displacement is the net change in position vector Δr = r_final - r_initial. It is independent of the actual path traversed. Position-time graphs slope represents instantaneous rate of position change.',
        keywords: ['position', 'displacement', 'vector', 'origin', 'coordinates']
      },
      {
        id: 'chunk-pdf-2',
        chunkIndex: 2,
        topic: 'Kinematics',
        conceptId: 'velocity',
        pageNumber: 24,
        content: 'Average velocity is defined as v_avg = Δx / Δt. Instantaneous velocity is the derivative of position with respect to time: v(t) = dx/dt. Velocity is a vector quantity with both magnitude (speed) and directional sign.',
        keywords: ['velocity', 'speed', 'derivative', 'direction', 'rate of change']
      },
      {
        id: 'chunk-pdf-3',
        chunkIndex: 3,
        topic: 'Kinematics',
        conceptId: 'acceleration',
        pageNumber: 31,
        content: 'Acceleration is the time rate of change of velocity: a(t) = dv/dt = d²x/dt². For constant acceleration: v = v₀ + at, and x = x₀ + v₀t + ½at². Crucially, an object can have zero instantaneous velocity while possessing non-zero acceleration (e.g., at the apex of vertical projectile flight).',
        keywords: ['acceleration', 'dv/dt', 'rate of velocity change', 'kinematic equations', 'apex']
      },
      {
        id: 'chunk-pdf-4',
        chunkIndex: 4,
        topic: "Newton's Laws",
        conceptId: 'newton-1',
        pageNumber: 42,
        content: "Newton's First Law (Law of Inertia): An object remains at rest or continues in uniform motion in a straight line unless acted upon by a net external non-zero force: ΣF = 0 implies a = 0 and v = constant. Inertia is quantified by inertial mass m.",
        keywords: ['inertia', 'first law', 'net force zero', 'equilibrium', 'reference frame']
      },
      {
        id: 'chunk-pdf-5',
        chunkIndex: 5,
        topic: "Newton's Laws",
        conceptId: 'newton-2',
        pageNumber: 47,
        content: "Newton's Second Law of Motion states that the acceleration of a body is directly proportional to and in the same direction as the net external force acting on it, and inversely proportional to its mass: ΣF_net = m · a. In component form: ΣF_x = m · a_x and ΣF_y = m · a_y. Note that acceleration 'a' is fundamentally Δv/Δt; without precise calculation of acceleration from velocity changes, force calculations will fail.",
        keywords: ['newtons second law', 'F=ma', 'net force', 'mass', 'acceleration dependency', 'page 47']
      },
      {
        id: 'chunk-pdf-6',
        chunkIndex: 6,
        topic: "Newton's Laws",
        conceptId: 'newton-3',
        pageNumber: 52,
        content: "Newton's Third Law: When body A exerts a force on body B, body B simultaneously exerts an equal in magnitude and opposite in direction force on body A: F_AB = - F_BA. Action-reaction pairs act on different bodies and never cancel each other in single-body free body diagrams.",
        keywords: ['third law', 'action reaction', 'equal opposite', 'interaction pair']
      },
      {
        id: 'chunk-pdf-7',
        chunkIndex: 7,
        topic: 'Friction',
        conceptId: 'friction',
        pageNumber: 58,
        content: 'Static friction opposes impending relative motion up to a maximum threshold f_s,max = μ_s · N. Kinetic friction opposes active sliding motion: f_k = μ_k · N, where N is the contact normal force perpendicular to the interface.',
        keywords: ['friction', 'static friction', 'kinetic friction', 'normal force', 'coefficient']
      },
      {
        id: 'chunk-pdf-8',
        chunkIndex: 8,
        topic: 'Momentum',
        conceptId: 'momentum',
        pageNumber: 68,
        content: 'Linear momentum p = m · v. The generalized form of Newton\'s Second Law states F_net = dp/dt. Impulse J = ∫ F dt = Δp. In an isolated system with ΣF_ext = 0, total linear momentum is strictly conserved.',
        keywords: ['momentum', 'impulse', 'conservation', 'dp/dt', 'collision']
      }
    ]
  },
  {
    id: 'mat-vid-01',
    title: 'Physics_Lecture_04_Newton_Dynamics.mp4',
    type: 'video',
    uploadedAt: '2026-10-02 11:30 AM',
    sizeMb: 84.2,
    duration: '21:30',
    topicsCovered: ['Kinematics to Dynamics Transition', 'Newtonian Mechanics', 'Free-Body Diagrams'],
    conceptsCount: 6,
    chunksCount: 6,
    status: 'indexed',
    summary: 'Video recording of Prof. Lewin dynamics masterclass: covers vector rate of change, dynamic acceleration derivation, and step-by-step force resolution.',
    chunks: [
      {
        id: 'chunk-vid-1',
        chunkIndex: 1,
        topic: 'Kinematics',
        conceptId: 'velocity',
        timestamp: '04:15',
        timestampSeconds: 255,
        content: '[04:15 - 08:42] Lecture segment: Explaining vector velocity versus scalar speed using air-track gliders. Notice how velocity changes direction even if speed remains constant in curved motion.',
        keywords: ['air track', 'vector velocity', 'direction change', 'glider demo']
      },
      {
        id: 'chunk-vid-2',
        chunkIndex: 2,
        topic: 'Kinematics',
        conceptId: 'acceleration',
        timestamp: '08:43',
        timestampSeconds: 523,
        content: '[08:43 - 12:42] Lecture segment: Defining acceleration a = Δv/Δt on the chalkboard. "Do not skip kinematic acceleration! If you cannot compute the rate of change of velocity, you cannot apply F=ma."',
        keywords: ['chalkboard', 'acceleration rate', 'delta v over delta t', 'kinematics grounding']
      },
      {
        id: 'chunk-vid-3',
        chunkIndex: 3,
        topic: "Newton's Laws",
        conceptId: 'newton-2',
        timestamp: '12:43',
        timestampSeconds: 763,
        content: '[12:43 - 16:50] Lecture segment: Newton\'s Second Law demonstration with hanging weight and accelerometer cart. Demonstrating that doubling net tension doubles acceleration when mass is held constant.',
        keywords: ['timestamp 12:43', 'newtons second law', 'cart demo', 'tension', 'F=ma live test']
      },
      {
        id: 'chunk-vid-4',
        chunkIndex: 4,
        topic: "Newton's Laws",
        conceptId: 'free-body',
        timestamp: '16:51',
        timestampSeconds: 1011,
        content: '[16:51 - 21:30] Lecture segment: Drawing Free Body Diagrams on inclined planes. Resolving gravitational weight into mg·sin(θ) along the incline and mg·cos(θ) perpendicular.',
        keywords: ['free body diagram', 'inclined plane', 'mg sin theta', 'normal force']
      }
    ]
  },
  {
    id: 'mat-ppt-01',
    title: 'MIT_Physics_Dynamics_Slides.pptx',
    type: 'presentation',
    uploadedAt: '2026-10-02 02:45 PM',
    sizeMb: 5.6,
    pageCount: 14,
    topicsCovered: ['Newton 2nd Law Equations', 'Coordinate Systems', 'Misconceptions'],
    conceptsCount: 4,
    chunksCount: 4,
    status: 'indexed',
    summary: 'Executive slide deck with high-resolution vector diagrams, common misconception callouts, and step-by-step problem templates.',
    chunks: [
      {
        id: 'chunk-ppt-1',
        chunkIndex: 1,
        topic: "Newton's Laws",
        conceptId: 'newton-2',
        slideNumber: 5,
        content: 'Slide 5: Core Law Summary: F_net = m·a. Common Pitfall: Forgetting that acceleration must be computed from initial & final velocity: a = (v_f - v_i)/Δt before multiplying by mass m.',
        keywords: ['slide 5', 'pitfall', 'velocity prerequisite', 'net force summary']
      },
      {
        id: 'chunk-ppt-2',
        chunkIndex: 2,
        topic: 'Friction',
        conceptId: 'friction',
        slideNumber: 9,
        content: 'Slide 9: Microscopic origin of friction and coefficient table: Steel on steel μ_s=0.74, μ_k=0.57; Rubber on dry concrete μ_s=1.0, μ_k=0.8.',
        keywords: ['slide 9', 'coefficients', 'rubber concrete', 'normal force']
      }
    ]
  }
];

export const INITIAL_STUDENT_MASTERY: Record<string, ConceptMastery> = {
  'pos-time': {
    conceptId: 'pos-time',
    masteryScore: 0.89,
    confidenceInterval: 0.04,
    attemptsCount: 14,
    correctCount: 13,
    lastAssessedAt: '2026-10-04 14:20',
    history: [
      { timestamp: '2026-10-03 10:00', score: 0.82, delta: +0.82, reason: 'Initial diagnostic assessment' },
      { timestamp: '2026-10-04 14:20', score: 0.89, delta: +0.07, reason: 'Displacement quiz passed' }
    ],
    status: 'mastered'
  },
  'velocity': {
    conceptId: 'velocity',
    masteryScore: 0.92,
    confidenceInterval: 0.03,
    attemptsCount: 18,
    correctCount: 17,
    lastAssessedAt: '2026-10-04 15:10',
    history: [
      { timestamp: '2026-10-03 10:30', score: 0.85, delta: +0.85, reason: 'Initial diagnostic' },
      { timestamp: '2026-10-04 15:10', score: 0.92, delta: +0.07, reason: 'Instantaneous velocity test 100%' }
    ],
    status: 'mastered'
  },
  'acceleration': {
    conceptId: 'acceleration',
    masteryScore: 0.42, // Weak prerequisite!
    confidenceInterval: 0.08,
    attemptsCount: 8,
    correctCount: 3,
    lastAssessedAt: '2026-10-04 16:00',
    history: [
      { timestamp: '2026-10-03 11:00', score: 0.54, delta: +0.54, reason: 'Initial diagnostic' },
      { timestamp: '2026-10-04 16:00', score: 0.42, delta: -0.12, reason: 'Failed rate-of-velocity change question' }
    ],
    status: 'critical'
  },
  'newton-1': {
    conceptId: 'newton-1',
    masteryScore: 0.74,
    confidenceInterval: 0.05,
    attemptsCount: 10,
    correctCount: 8,
    lastAssessedAt: '2026-10-04 16:30',
    history: [
      { timestamp: '2026-10-03 14:00', score: 0.70, delta: +0.70, reason: 'Inertia test' },
      { timestamp: '2026-10-04 16:30', score: 0.74, delta: +0.04, reason: 'Equilibrium checks passed' }
    ],
    status: 'competent'
  },
  'newton-2': {
    conceptId: 'newton-2',
    masteryScore: 0.42, // Weak target concept due to acceleration gap!
    confidenceInterval: 0.09,
    attemptsCount: 9,
    correctCount: 3,
    lastAssessedAt: '2026-10-04 17:15',
    history: [
      { timestamp: '2026-10-03 15:00', score: 0.48, delta: +0.48, reason: 'First F=ma problem' },
      { timestamp: '2026-10-04 17:15', score: 0.42, delta: -0.06, reason: 'Failed dynamic force calculation' }
    ],
    status: 'critical'
  },
  'free-body': {
    conceptId: 'free-body',
    masteryScore: 0.65,
    confidenceInterval: 0.06,
    attemptsCount: 7,
    correctCount: 4,
    lastAssessedAt: '2026-10-04 17:30',
    history: [
      { timestamp: '2026-10-04 17:30', score: 0.65, delta: +0.65, reason: 'Inclined plane free-body quiz' }
    ],
    status: 'developing'
  },
  'newton-3': {
    conceptId: 'newton-3',
    masteryScore: 0.68,
    confidenceInterval: 0.06,
    attemptsCount: 6,
    correctCount: 4,
    lastAssessedAt: '2026-10-04 17:45',
    history: [
      { timestamp: '2026-10-04 17:45', score: 0.68, delta: +0.68, reason: 'Action-reaction pair quiz' }
    ],
    status: 'developing'
  },
  'friction': {
    conceptId: 'friction',
    masteryScore: 0.48,
    confidenceInterval: 0.07,
    attemptsCount: 5,
    correctCount: 2,
    lastAssessedAt: '2026-10-04 18:00',
    history: [
      { timestamp: '2026-10-04 18:00', score: 0.48, delta: +0.48, reason: 'Static vs kinetic friction test' }
    ],
    status: 'critical'
  },
  'momentum': {
    conceptId: 'momentum',
    masteryScore: 0.55,
    confidenceInterval: 0.07,
    attemptsCount: 4,
    correctCount: 2,
    lastAssessedAt: '2026-10-04 18:10',
    history: [
      { timestamp: '2026-10-04 18:10', score: 0.55, delta: +0.55, reason: 'Impulse calculation check' }
    ],
    status: 'developing'
  }
};

export const SAMPLE_ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'q-n2-target-fail',
    topic: "Newton's Laws",
    conceptId: 'newton-2',
    conceptName: "Newton's Second Law (F = ma)",
    difficulty: 3,
    type: 'mcq',
    question: 'A 4.0 kg cart initially moving at 3.0 m/s increases its speed uniformly to 15.0 m/s over a time span of 3.0 seconds. What net external force F_net acted on the cart?',
    formulaContext: 'F_net = m · a, where a = (v_f - v_i) / Δt',
    options: [
      {
        id: 'opt-a',
        text: '60.0 N',
        isCorrect: false,
        explanation: 'Incorrect: Multiplied mass directly by final velocity (4 kg × 15 m/s = 60 N) without calculating acceleration Δv/Δt.',
        misconceptionTag: 'confused_velocity_with_acceleration'
      },
      {
        id: 'opt-b',
        text: '16.0 N',
        isCorrect: true,
        explanation: 'Correct! First compute acceleration: a = (15.0 - 3.0)/3.0 = 12.0/3.0 = 4.0 m/s². Then net force F_net = m · a = 4.0 kg × 4.0 m/s² = 16.0 N.',
      },
      {
        id: 'opt-c',
        text: '12.0 N',
        isCorrect: false,
        explanation: 'Incorrect: Calculated only the change in speed (Δv = 12 m/s) and did not divide by time or scale by mass correctly.',
        misconceptionTag: 'missing_time_factor'
      },
      {
        id: 'opt-d',
        text: '20.0 N',
        isCorrect: false,
        explanation: 'Incorrect: Calculated acceleration using final velocity only (15/3 = 5 m/s² -> 4 kg × 5 m/s² = 20 N), neglecting initial velocity.',
        misconceptionTag: 'ignored_initial_velocity'
      }
    ],
    correctAnswer: 'opt-b',
    detailedSolution: 'Step 1: Calculate acceleration using the prerequisite kinematic definition: a = (v_final - v_initial) / Δt = (15.0 m/s - 3.0 m/s) / 3.0 s = 4.0 m/s².\nStep 2: Apply Newton\'s Second Law: F_net = m · a = (4.0 kg) · (4.0 m/s²) = 16.0 N in the direction of motion.',
    source: {
      document: 'Physics_Fundamentals_Vol1.pdf',
      type: 'pdf',
      page: 47
    },
    prerequisiteConceptId: 'acceleration'
  },
  {
    id: 'q-accel-prereq-remedy',
    topic: 'Kinematics',
    conceptId: 'acceleration',
    conceptName: 'Acceleration (Rate of Change of Velocity)',
    difficulty: 2,
    type: 'mcq',
    question: 'A drone moving east at 8.0 m/s slows down to 2.0 m/s east in 2.0 seconds. What is the drone’s acceleration vector?',
    formulaContext: 'a = (v_f - v_i) / Δt',
    options: [
      {
        id: 'opt-acc-a',
        text: '-3.0 m/s² (3.0 m/s² West)',
        isCorrect: true,
        explanation: 'Correct! a = (2.0 - 8.0) / 2.0 = -6.0 / 2.0 = -3.0 m/s², which is directed west opposite to the initial velocity.',
      },
      {
        id: 'opt-acc-b',
        text: '+3.0 m/s² East',
        isCorrect: false,
        explanation: 'Incorrect sign: Since speed decreases from 8.0 to 2.0, the acceleration opposes velocity (negative/westward).',
        misconceptionTag: 'sign_inversion'
      },
      {
        id: 'opt-acc-c',
        text: '5.0 m/s²',
        isCorrect: false,
        explanation: 'Incorrect: Subtracted 8 - 2 = 6, but divided by unknown constant.',
        misconceptionTag: 'calculation_error'
      },
      {
        id: 'opt-acc-d',
        text: '1.0 m/s²',
        isCorrect: false,
        explanation: 'Incorrect: Used 2.0 / 2.0 = 1.0 m/s², ignoring initial velocity.',
        misconceptionTag: 'ignored_initial_velocity'
      }
    ],
    correctAnswer: 'opt-acc-a',
    detailedSolution: 'Acceleration is vector rate of change: a = (v_f - v_i)/Δt = (2.0 - 8.0)/2.0 = -3.0 m/s² (3.0 m/s² directed Westward).',
    source: {
      document: 'Physics_Fundamentals_Vol1.pdf',
      type: 'pdf',
      page: 31
    },
    prerequisiteConceptId: 'velocity'
  },
  {
    id: 'q-n2-retest-success',
    topic: "Newton's Laws",
    conceptId: 'newton-2',
    conceptName: "Newton's Second Law (Retest Challenge)",
    difficulty: 3,
    type: 'mcq',
    question: 'A 5.0 kg sports sled starts from rest (v_0 = 0 m/s) and accelerates along a frictionless horizontal ice track to 18.0 m/s in 6.0 seconds. What constant horizontal net force was applied?',
    formulaContext: 'F_net = m · a = m · (v_f - v_i) / Δt',
    options: [
      {
        id: 'opt-ret-a',
        text: '15.0 N',
        isCorrect: true,
        explanation: 'Correct! a = (18.0 - 0) / 6.0 = 3.0 m/s². Then F_net = 5.0 kg × 3.0 m/s² = 15.0 N.',
      },
      {
        id: 'opt-ret-b',
        text: '90.0 N',
        isCorrect: false,
        explanation: 'Incorrect: Multiplied mass by final velocity (5 kg × 18 m/s = 90 N) instead of using acceleration.',
        misconceptionTag: 'confused_velocity_with_acceleration'
      },
      {
        id: 'opt-ret-c',
        text: '3.0 N',
        isCorrect: false,
        explanation: 'Incorrect: Calculated acceleration (3.0 m/s²) but forgot to multiply by mass m.',
        misconceptionTag: 'missing_mass_multiplier'
      },
      {
        id: 'opt-ret-d',
        text: '30.0 N',
        isCorrect: false,
        explanation: 'Incorrect arithmetic.',
        misconceptionTag: 'arithmetic_error'
      }
    ],
    correctAnswer: 'opt-ret-a',
    detailedSolution: 'Step 1: Calculate acceleration: a = (18.0 - 0.0) / 6.0 s = 3.0 m/s².\nStep 2: Apply Newton\'s 2nd Law: F_net = m · a = 5.0 kg · 3.0 m/s² = 15.0 N.',
    source: {
      document: 'Physics_Fundamentals_Vol1.pdf',
      type: 'pdf',
      page: 47
    },
    prerequisiteConceptId: 'acceleration'
  }
];
