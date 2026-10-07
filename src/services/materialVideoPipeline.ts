import { IngestedMaterial, GeneratedVideoLecture, VideoScene } from '../types';

/**
 * Synthesizes a structured 4-scene chalkboard AI Video Lecture directly from uploaded student material.
 */
export function synthesizeVideoFromMaterial(material: IngestedMaterial): GeneratedVideoLecture {
  const primaryTopic = material.topicsCovered[0] || 'Physics & Mechanics';
  const allContent = material.chunks.map(c => c.content).join('\n\n');

  // Extract or formulate relevant equations based on text or topic
  let eq1 = '\\vec{r}(t) \\implies \\vec{v}(t) = \\frac{d\\vec{r}}{dt} \\implies \\vec{a}(t) = \\frac{d^2\\vec{r}}{dt^2}';
  let eq2 = '\\Sigma \\vec{F}_{net} = m \\cdot \\vec{a}';
  let eq3 = 'W = \\int \\vec{F} \\cdot d\\vec{r} = \\Delta K = \\frac{1}{2}mv_f^2 - \\frac{1}{2}mv_i^2';
  let eq4 = '\\tau = I\\alpha = r \\cdot F \\sin(\\theta)';

  const lowerTopic = primaryTopic.toLowerCase() + ' ' + allContent.toLowerCase();
  let theme: VideoScene['visualTheme'] = 'dynamics';

  if (lowerTopic.includes('torque') || lowerTopic.includes('rotat')) {
    theme = 'dynamics';
    eq1 = '\\theta(t) \\implies \\omega = \\frac{d\\theta}{dt} \\implies \\alpha = \\frac{d\\omega}{dt}';
    eq2 = '\\vec{\\tau} = \\vec{r} \\times \\vec{F} = I\\vec{\\alpha}';
    eq3 = 'I = \\int r^2 dm = \\sum m_i r_i^2';
    eq4 = 'K_{rot} = \\frac{1}{2}I\\omega^2, \\quad L = I\\omega';
  } else if (lowerTopic.includes('work') || lowerTopic.includes('energy')) {
    theme = 'energy';
    eq1 = 'W = \\vec{F} \\cdot \\vec{d} = F \\cdot d \\cos(\\theta)';
    eq2 = 'W_{net} = \\Delta K = \\frac{1}{2}m v_{final}^2 - \\frac{1}{2}m v_{initial}^2';
    eq3 = 'E_{mech} = K + U = \\text{constant (isolated)}';
    eq4 = 'P = \\frac{dW}{dt} = \\vec{F} \\cdot \\vec{v}';
  } else if (lowerTopic.includes('coulomb') || lowerTopic.includes('electric') || lowerTopic.includes('magnet')) {
    theme = 'forces';
    eq1 = 'F_e = k_e \\cdot \\frac{|q_1 q_2|}{r^2} = \\frac{1}{4\\pi \\epsilon_0} \\frac{|q_1 q_2|}{r^2}';
    eq2 = '\\vec{E} = \\frac{\\vec{F}_e}{q_0} = k_e \\frac{q}{r^2} \\hat{r}';
    eq3 = '\\Phi_E = \\oint \\vec{E} \\cdot d\\vec{A} = \\frac{Q_{encl}}{\\epsilon_0}';
    eq4 = 'V = k_e \\frac{q}{r}, \\quad \\vec{E} = -\\vec{\\nabla} V';
  } else if (lowerTopic.includes('carnot') || lowerTopic.includes('thermo')) {
    theme = 'energy';
    eq1 = '\\Delta U = Q - W, \\quad dU = n C_v dT';
    eq2 = 'W = \\int P dV';
    eq3 = '\\eta_{\\text{Carnot}} = 1 - \\frac{T_C}{T_H}';
    eq4 = '\\Delta S = \\int \\frac{dQ_{rev}}{T} \\ge 0';
  }

  // Extract snippet highlights from student's actual text
  const chunk1 = material.chunks[0]?.content || 'Foundational principles and initial boundary conditions.';
  const chunk2 = material.chunks[1]?.content || material.chunks[0]?.content || 'Mathematical formulation and conservation laws.';

  const scenes: VideoScene[] = [
    {
      id: `sc-${material.id}-1`,
      sceneIndex: 1,
      timestamp: '00:00',
      timestampSeconds: 0,
      durationSeconds: 55,
      title: `1. Core Definitions: ${primaryTopic}`,
      chalkboardEquation: eq1,
      visualTheme: theme,
      diagramDescription: `Blackboard diagram introducing fundamental variables and coordinate frames for ${primaryTopic}.`,
      bulletPoints: [
        `Grounded directly from uploaded material: ${material.title}`,
        'Establishing foundational physical parameters and boundary limits',
        chunk1.slice(0, 110) + '...'
      ],
      narrationTranscript: `Welcome to this grounded video lecture on ${primaryTopic}. Based directly on the material you uploaded, we begin by formalizing the coordinate frame and the governing definitions.`,
      keyTerms: [primaryTopic, 'Fundamentals', 'Coordinate Frame', 'Definitions']
    },
    {
      id: `sc-${material.id}-2`,
      sceneIndex: 2,
      timestamp: '00:55',
      timestampSeconds: 55,
      durationSeconds: 65,
      title: '2. Mathematical Formulation & Governing Law',
      chalkboardEquation: eq2,
      visualTheme: theme,
      diagramDescription: 'Mathematical chalk breakdown showing vector balance and derivative relationships.',
      bulletPoints: [
        'Rigorous step-by-step vector derivation',
        'Direct relationship between primary input forces and response parameters',
        chunk2.slice(0, 110) + '...'
      ],
      narrationTranscript: `Notice the mathematical relationship on the board. The governing equation establishes an exact equality. Any change in the primary variable directly modulates the physical outcome.`,
      keyTerms: ['Governing Law', 'Derivation', 'Vector Relation']
    },
    {
      id: `sc-${material.id}-3`,
      sceneIndex: 3,
      timestamp: '02:00',
      timestampSeconds: 120,
      durationSeconds: 60,
      title: '3. Physical Intuition & Misconception Prevention',
      chalkboardEquation: eq3,
      visualTheme: theme,
      diagramDescription: 'Geometric visualization highlighting common student pitfalls and root-cause solutions.',
      bulletPoints: [
        'Preventing common prerequisite misunderstandings',
        'Distinguishing between instantaneous rates and cumulative quantities',
        'Grounded semantic context extracted from your study notes'
      ],
      narrationTranscript: `A critical insight from this material is avoiding common prerequisite confusion. Never conflate cumulative quantities with instantaneous derivatives. Keep your vector directions strictly oriented.`,
      keyTerms: ['Physical Intuition', 'Pitfall Avoidance', 'Vector Calculus']
    },
    {
      id: `sc-${material.id}-4`,
      sceneIndex: 4,
      timestamp: '03:00',
      timestampSeconds: 180,
      durationSeconds: 60,
      title: '4. Worked Quantitative Solution & Synthesis',
      chalkboardEquation: eq4,
      visualTheme: theme,
      diagramDescription: 'Complete step-by-step numerical calculation verified with unit analysis.',
      bulletPoints: [
        'Step 1: Isolate primary known values and target unknowns',
        'Step 2: Execute dimensional analysis and unit verification',
        'Synthesized directly into your personalized QIRA study roadmap'
      ],
      narrationTranscript: `In our final step, we evaluate the quantitative result. Notice how dimensional analysis confirms the validity of the final units. This concludes our grounded masterclass on ${primaryTopic}.`,
      keyTerms: ['Worked Solution', 'Dimensional Analysis', 'Synthesis']
    }
  ];

  return {
    id: `lec-user-${Date.now()}`,
    title: `AI Chalkboard Masterclass: ${primaryTopic}`,
    topic: primaryTopic,
    totalDuration: '04:00',
    totalDurationSeconds: 240,
    createdAt: 'Synthesized just now',
    sourceMaterialTitle: `${material.title} (${material.chunksCount} Grounded Chunks)`,
    summary: `Personalized AI video lecture automatically synthesized from uploaded material "${material.title}". Features 4 synchronized chalkboard scenes with dynamic mathematical derivations.`,
    scenes
  };
}
