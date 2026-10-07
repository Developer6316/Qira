# Student Mastery Export, Upload-to-Video Pipeline & Glassmorphism Aesthetic

A comprehensive enhancement providing full student report exports (summarized JSON & formatted printable HTML/PDF), autonomous student study material ingestion with grounded explanations, auto-generated chalkboard AI video lessons, a luminous glassmorphism theme (`backdrop-blur`, semi-translucent layers), and haptic Web Audio sound effects.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The implementation plan incorporates the user-confirmed decisions:
> - **Report Export Format**: Dual export system with machine-readable summarized JSON file and a rich formatted printable HTML/PDF report with identified root-cause prerequisite gaps and learning trajectory.
> - **Video Generation Trigger**: Direct automatic pipeline: Student Material Upload $\to$ Semantic Grounding & Chunking $\to$ Instant AI Video Studio Lecture Generation.
> - **Visual & Tactile Experience**: Cohesive high-glassmorphism theme (`backdrop-blur-md` / `backdrop-blur-lg`, semi-transparent glass cards, subtle luminous borders) across Dashboard, Grounded Chat, Quiz, and Studio, paired with high-performance Web Audio synthesizers for clicks, quiz chimes, video start, and report downloads.

- **Confirmed Decision 1**: Formatted printable HTML/PDF report and downloadable JSON for student mastery tracking and gap diagnosis.
- **Confirmed Decision 2**: Automatic direct pipeline triggering AI Video Lecture generation immediately upon student material upload.
- **Confirmed Decision 3**: Luminous cohesive glassmorphism container styling with subtle sound effect feedback and toggleable audio mute.

---

### 1. Overview & Core Concept

- **What It Does**: 
  1. **Mastery Export**: Enables students to download their complete Bayesian mastery report as a structured JSON file or open a formatted printable HTML/PDF report complete with concept proficiency, diagnosed prerequisite gaps (e.g. Kinematic Acceleration $\to$ Newton's 2nd Law), and tailored remediation steps.
  2. **Student Material Ingestion**: Students upload course notes, lecture transcripts, or textbook excerpts. The system parses, extracts formulas and topics, and grounds the AI Tutor so it immediately explains and answers based on the student's material.
  3. **Direct Upload-to-Video Synthesis**: Synthesizes synchronized chalkboard video lessons from uploaded materials with dynamic blackboard slides, LaTeX formulas, and audio narration.
  4. **Glassmorphism & Audio Micro-Interactions**: Wraps all core app surfaces in a modern glass aesthetic (`backdrop-blur-xl`, `bg-white/80` or `bg-slate-900/60`, delicate specular borders) with pleasant synthesized sound effects.
- **Target Audience / Persona**: Students studying complex STEM topics requiring personalized diagnostic feedback, custom material ingestion, and multimodal video explanations.
- **Key Value**: Closes the loop from diagnostic evaluation to personalized content ingestion and multi-sensory video instruction in an engaging, modern interface.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  - **Export Flow**: Student navigates to Personalization Dashboard $\to$ clicks "Export Mastery Report" $\to$ views formatted report modal $\to$ 1-click downloads JSON or prints/saves as PDF with chime sound effect.
  - **Upload & Video Flow**: Student opens Study Ingestion or Quick Upload modal $\to$ uploads notes or chooses pre-built topic (e.g. *Rotational Dynamics & Torque*) $\to$ System parses and registers chunks $\to$ Instant video generator creates dynamic blackboard scene $\to$ Automatically routes to AI Video Studio with auto-play chalkboard lecture.
  - **Sound & Smooth UI**: Subtle Web Audio sound effects on button taps, correct quiz answers, video playback, and export completion, with a global mute toggle in the header.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Modern High Glassmorphism — frosted translucent cards, luminous ambient gradients, and crisp typography.
  - *Color Palette & Atmosphere*:
    - Background: Ambient subtle radial gradients (`bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30`).
    - Glass Containers: `bg-white/75 backdrop-blur-md border border-white/60 shadow-xl shadow-indigo-500/5`.
    - Dark Accents & Blackboard: Deep chalkboard slate (`bg-slate-950/85 backdrop-blur-lg border border-slate-800/80`).
    - Primary Accents: Electric Indigo (`#4f46e5`) and Deep Violet (`#7c3aed`).
  - *Typography & Hierarchy*: Sans-serif display headings (`font-black tracking-tight`), monospaced code & metadata labels (`font-mono text-xs font-semibold`), and high-contrast readable body text.

- **Interactive Feedback & Motion**:
  - CSS smooth transitions (`transition-all duration-200 ease-out`).
  - Subtle Web Audio synthesizer: Gentle click tone (soft 440Hz sine blip), celebration chime (E5-G#5-B5 major arpeggio), and download confirmation swoosh.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Zero-Dependency Web Audio Synthesizer vs. Heavy MP3 Assets**:
  - *Chosen Approach*: Use HTML5 Web Audio API (`AudioContext`) with synthesized sine/triangle waves.
  - *Why*: Ultra-fast load times ($<1\text{ms}$ latency), zero network bandwidth/credits, no missing audio file 404s, and volume-controlled audio that works on all devices with an accessible mute toggle.
- **Decision 2: Direct Client-Side JSON & Printable HTML Generation**:
  - *Chosen Approach*: Generate clean downloadable JSON via `URL.createObjectURL(new Blob(...))` and a native print-friendly modal layout with `@media print` rules.
  - *Why*: Instant generation with zero server overhead or third-party PDF compilation latency, perfectly styled for both screen viewing and printing/PDF saving.
- **Decision 3: Integrated Video Synthesis Engine for Uploaded Content**:
  - *Chosen Approach*: Dynamically extract key concepts and formulas from uploaded text/PDF chunks and map them into the `VideoLecture` slide schema with chalkboard canvas rendering and synchronized audio narration.
  - *Why*: Delivers an immediate "Upload $\to$ Watch Video" experience without requiring manual script editing.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        QIRA User Interface (React)                     │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Global Header: Access Role, Student Selector, Audio Mute Toggle   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                │                                       │
│   ┌────────────────────────────┼────────────────────────────┐          │
│   ▼                            ▼                            ▼          │
│ ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐       │
│ │ Personalization  │  │ Study Ingestion  │  │ AI Video Studio  │       │
│ │ Dashboard (Glass)│  │ & Chunker (Glass)│  │ Chalkboard Player│       │
│ └─────────┬────────┘  └────────┬─────────┘  └────────┬─────────┘       │
│           │                    │                     │                 │
│           ▼                    ▼                     ▼                 │
│ ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐       │
│ │ Mastery Report   │  │ Student Material │  │ Auto-Generated   │       │
│ │ Modal (JSON/PDF) │  │ Understanding    │  │ Video Pipeline   │       │
│ └──────────────────┘  └────────┬─────────┘  └──────────────────┘       │
│                                │                                       │
│                                ▼                                       │
│                    ┌───────────────────────┐                           │
│                    │ Course Materials Pool │                           │
│                    │ (Grounds AI Tutor &   │                           │
│                    │ Remediation Engine)   │                           │
│                    └───────────────────────┘                           │
└────────────────────────────────────────────────────────────────────────┘
```

- **Interactive State & Event Mapping**:
  - `soundEffects.ts`: Lightweight audio utility (`playClick`, `playSuccess`, `playSwoosh`, `playChime`, `toggleMute`).
  - `StudentMasteryReportModal.tsx`: Renders formatted printable report, generates JSON blob, triggers `window.print()`.
  - `StudentUploadModal.tsx` & `MultimodalIngestion.tsx`: Ingests custom text or PDF notes, decomposes into semantic chunks, adds to course materials, and emits `onGenerateVideoForMaterial(material)`.
  - `VideoLectureStudio.tsx`: Accepts newly generated lecture object and immediately loads it into the synchronized chalkboard player.
  - Glassmorphism Tailwind styling: Standardized glass utility classes (`glass-card`, `glass-banner`, `backdrop-blur-md`) applied to `Header`, `PersonalizationDashboard`, `GroundedTutorChat`, `AdaptiveQuizEngine`, and `VideoLectureStudio`.
