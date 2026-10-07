/**
 * Simplified Keyframe Animation State Machine for Video Lecture Character Lipsync & Gestures
 */

export type VisemeKey = 'REST' | 'AA' | 'EE' | 'OH' | 'MM' | 'TH';

export type GestureKey = 
  | 'IDLE' 
  | 'POINTING_BOARD' 
  | 'EMPHASIZING' 
  | 'THINKING' 
  | 'WRITING_CHALK';

export type EyeState = 'OPEN' | 'HALF' | 'CLOSED';

export interface CharacterKeyframeState {
  viseme: VisemeKey;
  gesture: GestureKey;
  mouthOpenness: number; // 0.0 (closed) to 1.0 (fully open)
  mouthWidth: number;    // 0.0 (narrow) to 1.0 (wide)
  armAngle: number;      // degrees rotation
  armSecondaryAngle: number;
  eyeState: EyeState;
  headTilt: number;      // degrees
  activeWord: string;
  stateDescription: string;
}

// Preset Mouth Shapes for each Viseme Keyframe
export interface MouthShapeParams {
  openness: number;
  width: number;
  shapePath: string; // SVG path command for mouth
}

export const VISEME_PARAMS: Record<VisemeKey, MouthShapeParams> = {
  REST: {
    openness: 0.1,
    width: 0.5,
    shapePath: 'M 76 82 Q 80 84, 84 82'
  },
  AA: { // Open wide (e.g. "law", "mass", "dot")
    openness: 0.9,
    width: 0.7,
    shapePath: 'M 75 80 C 75 88, 85 88, 85 80 C 85 76, 75 76, 75 80 Z'
  },
  EE: { // Wide horizontal stretch (e.g. "speed", "velocity", "energy")
    openness: 0.45,
    width: 0.95,
    shapePath: 'M 72 81 C 72 85, 88 85, 88 81 C 88 78, 72 78, 72 81 Z'
  },
  OH: { // Rounded lips (e.g. "force", "torque", "orbit")
    openness: 0.8,
    width: 0.4,
    shapePath: 'M 77 79 C 77 87, 83 87, 83 79 C 83 75, 77 75, 77 79 Z'
  },
  MM: { // Pressed lips (e.g. "momentum", "mass", "meters")
    openness: 0.05,
    width: 0.6,
    shapePath: 'M 75 82 L 85 82'
  },
  TH: { // Teeth/tongue contact (e.g. "theorem", "theta", "the")
    openness: 0.35,
    width: 0.75,
    shapePath: 'M 74 81 Q 80 85, 86 81 Q 80 82, 74 81 Z'
  }
};

/**
 * Phoneme Analyzer: Maps raw words from the uploaded explanation into accurate Visemes
 */
export function mapWordToViseme(word: string, charProgress: number = 0.5): VisemeKey {
  if (!word || !word.trim()) return 'REST';

  const clean = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!clean) return 'REST';

  // Sample the phoneme based on progression through the word
  const charIdx = Math.min(clean.length - 1, Math.floor(charProgress * clean.length));
  const char = clean[charIdx] || clean[0];

  // Specific phonetic pairings
  if (clean.includes('th') && (char === 't' || char === 'h')) return 'TH';
  if (['m', 'b', 'p'].includes(char)) return 'MM';
  if (['o', 'u', 'w'].includes(char)) return 'OH';
  if (['a'].includes(char)) return 'AA';
  if (['e', 'i', 'y'].includes(char)) return 'EE';
  
  // Consonants with open vocal tract
  if (['r', 'l', 's', 'c', 'k', 'g'].includes(char)) return 'EE';
  if (['n', 'd', 't'].includes(char)) return 'TH';

  return 'AA';
}

/**
 * Keyframe Animation State Machine: Calculates next character state based on playback elapsed seconds
 */
export function evaluateCharacterStateMachine(
  isPlaying: boolean,
  sceneElapsedSeconds: number,
  sceneDurationSeconds: number,
  currentSpokenWord: string,
  wordProgress: number,
  blinkProgress: number, // 0 to 1
  avatarStyle: 'ada' | 'maxwell' | 'quantum-bot'
): CharacterKeyframeState {
  if (!isPlaying) {
    return {
      viseme: 'REST',
      gesture: 'IDLE',
      mouthOpenness: 0.05,
      mouthWidth: 0.5,
      armAngle: 25,
      armSecondaryAngle: 10,
      eyeState: 'OPEN',
      headTilt: 0,
      activeWord: '',
      stateDescription: 'STATE: [IDLE / LISTENING]'
    };
  }

  // 1. Viseme State Evaluation
  const viseme = mapWordToViseme(currentSpokenWord, wordProgress);
  const visemeConfig = VISEME_PARAMS[viseme];

  // 2. Gesture State Machine based on scene chronological progression
  const sceneProgress = Math.min(1, Math.max(0, sceneElapsedSeconds / (sceneDurationSeconds || 60)));
  let gesture: GestureKey = 'POINTING_BOARD';
  let armAngle = 35;
  let armSecondaryAngle = 15;
  let headTilt = 0;

  if (sceneProgress < 0.18) {
    // Phase 1: Greeting & Concept Overview
    gesture = 'EMPHASIZING';
    armAngle = 18;
    armSecondaryAngle = 25;
    headTilt = 2;
  } else if (sceneProgress < 0.65) {
    // Phase 2: Pointing at Chalkboard Mathematical Derivations
    gesture = 'POINTING_BOARD';
    // Subtle rhythmic oscillation while pointing to terms
    const bob = Math.sin(sceneElapsedSeconds * 2.5) * 6;
    armAngle = 40 + bob;
    armSecondaryAngle = 12;
    headTilt = -3;
  } else if (sceneProgress < 0.85) {
    // Phase 3: Highlighting Critical Pitfalls / Misconceptions
    gesture = 'THINKING';
    armAngle = 55;
    armSecondaryAngle = 40;
    headTilt = 4;
  } else {
    // Phase 4: Worked Problem & Synthesis
    gesture = 'WRITING_CHALK';
    const chalkWiggle = Math.sin(sceneElapsedSeconds * 4) * 4;
    armAngle = 32 + chalkWiggle;
    armSecondaryAngle = 18;
    headTilt = -1;
  }

  // 3. Eye Blinking State Machine
  let eyeState: EyeState = 'OPEN';
  if (blinkProgress > 0.88) {
    eyeState = 'CLOSED';
  } else if (blinkProgress > 0.78) {
    eyeState = 'HALF';
  }

  return {
    viseme,
    gesture,
    mouthOpenness: visemeConfig.openness,
    mouthWidth: visemeConfig.width,
    armAngle,
    armSecondaryAngle,
    eyeState,
    headTilt,
    activeWord: currentSpokenWord,
    stateDescription: `STATE: [GESTURE: ${gesture} | VISEME: ${viseme}]`
  };
}
