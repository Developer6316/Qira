import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Sparkles, 
  GraduationCap, 
  Building2, 
  Globe, 
  AlertCircle,
  HelpCircle,
  ArrowLeft,
  KeyRound,
  Shield,
  Zap,
  Check
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types';
import confetti from 'canvas-confetti';
import { playClickSound, playSuccessChime, playSwooshSound } from '../../utils/soundEffects';

interface AuthPageProps {
  initialMode?: 'login' | 'signup';
  onAuthSuccess: (user: UserProfile) => void;
  onBackToApp: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  onAuthSuccess,
  onBackToApp
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('learner');
  const [institution, setInstitution] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Preset Fast-Fill Accounts
  const demoAccounts = [
    {
      label: '👩‍🎓 Shahul (Learner)',
      name: 'Shahul',
      email: 'shahul.learner@physics.edu',
      role: 'learner' as UserRole,
      studentId: 'sim-student-b',
      institution: 'MIT Physics',
      note: 'Prerequisite Gap Diagnosed (42% mastery)'
    },
    {
      label: '👨‍🎓 Alex (High Mastery)',
      name: 'Alex Newton',
      email: 'alex.highprior@stanford.edu',
      role: 'learner' as UserRole,
      studentId: 'sim-student-a',
      institution: 'Stanford Dept of Physics',
      note: 'Mastery: 81%'
    },
    {
      label: '🧑‍🏫 Dr. Maxwell (Admin & Faculty)',
      name: 'Dr. Robert Maxwell',
      email: 'maxwell.faculty@qira.edu',
      role: 'admin' as UserRole,
      studentId: 'sim-student-b',
      institution: 'QIRA Academic Research Labs',
      note: 'Full Admin Console & Ingestion Privileges'
    }
  ];

  const handleSelectDemoAccount = (demo: typeof demoAccounts[0]) => {
    playClickSound();
    setName(demo.name);
    setEmail(demo.email);
    setPassword('DemoPass2026!');
    setRole(demo.role);
    setInstitution(demo.institution);
    setErrorMessage(null);
  };

  // Password strength calculation
  const calculatePasswordStrength = (pwd: string): { score: number; label: string; color: string } => {
    if (!pwd) return { score: 0, label: 'None', color: 'bg-slate-200' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.match(/[a-z]/) && pwd.match(/[A-Z]/)) score++;
    if (pwd.match(/[0-9]/)) score++;
    if (pwd.match(/[^a-zA-Z0-9]/)) score++;

    if (score <= 1) return { score: 25, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score: 50, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 75, label: 'Good', color: 'bg-sky-500' };
    return { score: 100, label: 'Strong', color: 'bg-emerald-500' };
  };

  const passwordStrength = calculatePasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    setErrorMessage(null);

    // Basic Validation
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid academic or personal email address.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (authMode === 'signup' && !name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (authMode === 'signup' && !agreeTerms) {
      setErrorMessage('Please accept the Terms of Service & Honor Code.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      const authenticatedUser: UserProfile = {
        id: `user-${Date.now()}`,
        name: authMode === 'signup' ? name : (name || email.split('@')[0]),
        email: email.trim().toLowerCase(),
        role: role,
        institution: institution || 'Academic Institute',
        studentId: role === 'learner' ? 'sim-student-b' : undefined,
        createdAt: new Date().toISOString()
      };

      // Save user to localStorage
      try {
        localStorage.setItem('qira_auth_user', JSON.stringify(authenticatedUser));
      } catch (err) {
        console.error('Storage error', err);
      }

      playSuccessChime();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });

      setSuccessMessage(authMode === 'signup' ? 'Account created successfully!' : 'Signed in successfully!');
      
      setTimeout(() => {
        onAuthSuccess(authenticatedUser);
      }, 700);
    }, 800);
  };

  const handleSocialAuth = (provider: string) => {
    playClickSound();
    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      const authenticatedUser: UserProfile = {
        id: `sso-${provider.toLowerCase()}-${Date.now()}`,
        name: `${provider} Scholar`,
        email: `scholar@${provider.toLowerCase()}.edu`,
        role: 'learner',
        institution: `${provider} SSO Verified`,
        studentId: 'sim-student-b',
        createdAt: new Date().toISOString()
      };

      try {
        localStorage.setItem('qira_auth_user', JSON.stringify(authenticatedUser));
      } catch (err) {
        console.error('Storage error', err);
      }

      playSuccessChime();
      confetti({ particleCount: 40, spread: 50 });
      onAuthSuccess(authenticatedUser);
    }, 600);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) return;
    setForgotSubmitted(true);
    playSuccessChime();
    setTimeout(() => {
      setShowForgotPasswordModal(false);
      setForgotSubmitted(false);
      setForgotEmail('');
    }, 2800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8">
      {/* Background ambient lighting */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between z-10 pb-6 border-b border-slate-800/80">
        <button
          type="button"
          onClick={() => {
            playSwooshSound();
            onBackToApp();
          }}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-700/60 transition-all cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Course App</span>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-500/20">
            Q
          </div>
          <span className="font-extrabold tracking-tight text-white text-base">QIRA</span>
          <span className="text-[11px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-bold">
            AUTH PORTAL
          </span>
        </div>

        <div className="text-xs text-slate-400 font-mono hidden sm:block">
          Grounded Physics AI
        </div>
      </div>

      {/* Central Content Grid */}
      <div className="max-w-5xl mx-auto w-full my-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        {/* Left Column: Brand & Value Proposition Showcase */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI-Driven Diagnostic Learning</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Elevate your physics mastery with <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">Grounded AI</span>.
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Sign in to unlock personalized Bayesian prerequisite gap remediation, interactive AI chalkboard video lectures with animated professors, and mathematically verified textbook grounding.
          </p>

          {/* Feature Bullet Points */}
          <div className="space-y-3 pt-2">
            {[
              {
                icon: ShieldCheck,
                title: 'Strict Grounding & Zero Hallucination',
                desc: 'Every derivation is cited with page and timestamp verification.'
              },
              {
                icon: Zap,
                title: 'Bayesian Prerequisite Diagnosis',
                desc: 'Identifies deep root-cause gaps (e.g. Kinematic Acceleration).'
              },
              {
                icon: GraduationCap,
                title: 'Animated Character Video Studio',
                desc: 'Real-time chalkboard derivations with lipsync explanation audio.'
              }
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80 backdrop-blur-xs">
                <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 shrink-0 border border-indigo-500/30">
                  <f.icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{f.title}</h4>
                  <p className="text-[11px] text-slate-400">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Demo Fill Buttons */}
          <div className="pt-2 space-y-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-bold">
              ⚡ 1-Click Demo Profiles:
            </span>
            <div className="flex flex-wrap gap-2">
              {demoAccounts.map((d, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectDemoAccount(d)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 text-slate-200 border border-slate-700 text-xs font-medium transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center gap-1.5"
                >
                  <span>{d.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Authentication Card */}
        <div className="lg:col-span-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
            {/* Top Auth Mode Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 mb-6">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setAuthMode('login');
                  setErrorMessage(null);
                }}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  authMode === 'login'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setAuthMode('signup');
                  setErrorMessage(null);
                }}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  authMode === 'signup'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>Create Account</span>
              </button>
            </div>

            {/* Error / Success Notifications */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* SSO / Social Quick Login Options */}
            <div className="space-y-2 mb-6">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSocialAuth('Google')}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.18 3.665-9.15z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.15C3.25 21.36 7.34 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.27C.46 8.2.005 10.04.005 12s.46 3.8 1.265 5.42l4.01-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.64 1.27 6.58l4.01 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialAuth('GitHub')}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>GitHub</span>
                </button>
              </div>

              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-slate-800 w-full" />
                <span className="bg-slate-900 px-3 text-[11px] font-mono text-slate-500 uppercase tracking-wider relative">
                  Or with email
                </span>
              </div>
            </div>

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Marie Curie"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Academic or Personal Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  {authMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setShowForgotPasswordModal(true)}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password strength meter for sign up */}
                {authMode === 'signup' && password.length > 0 && (
                  <div className="mt-2 space-y-1 animate-in fade-in">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>Strength: {passwordStrength.label}</span>
                      <span>Min 6 characters</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${passwordStrength.color} transition-all duration-300`}
                        style={{ width: `${passwordStrength.score}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Extra Sign Up Fields: Role & Institution */}
              {authMode === 'signup' && (
                <div className="space-y-4 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Account Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRole('learner')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          role === 'learner'
                            ? 'bg-indigo-600/20 border-indigo-500 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold text-xs">
                          <GraduationCap className="w-4 h-4 text-indigo-400" />
                          <span>Student / Learner</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Personalized tutor & adaptive quizzes
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRole('admin')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          role === 'admin'
                            ? 'bg-purple-600/20 border-purple-500 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold text-xs">
                          <Shield className="w-4 h-4 text-purple-400" />
                          <span>Educator / Admin</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Course ingestion & concept editor
                        </p>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      University or Institution (Optional)
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        placeholder="e.g. MIT Physics Lab"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Checkbox Options */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                {authMode === 'login' ? (
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Remember me on this device</span>
                  </label>
                ) : (
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>I accept the Academic Honor Code & Terms</span>
                  </label>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{authMode === 'signup' ? 'Creating Account...' : 'Authenticating...'}</span>
                  </>
                ) : (
                  <>
                    <span>{authMode === 'signup' ? 'Create Free Account' : 'Sign In to QIRA'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Footer switch link */}
            <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
              {authMode === 'login' ? (
                <p>
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setAuthMode('signup');
                      setErrorMessage(null);
                    }}
                    className="text-indigo-400 hover:text-indigo-300 font-bold underline cursor-pointer"
                  >
                    Sign up now
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setAuthMode('login');
                      setErrorMessage(null);
                    }}
                    className="text-indigo-400 hover:text-indigo-300 font-bold underline cursor-pointer"
                  >
                    Log in here
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-white">Reset Account Password</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(false)}
                className="text-slate-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            {forgotSubmitted ? (
              <div className="py-4 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">Password Reset Link Sent!</h4>
                <p className="text-xs text-slate-300">
                  We've dispatched a secure recovery link to <span className="font-mono text-emerald-400">{forgotEmail}</span>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Enter your registered academic email address. We'll send an authentication recovery link to reset your credentials.
                </p>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="student@university.edu"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md cursor-pointer"
                  >
                    Send Recovery Email
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Bottom Footer */}
      <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-500 pt-6 border-t border-slate-800/80 z-10 gap-2">
        <span>© 2026 QIRA Cognitive Learning Systems. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <span className="hover:text-slate-400 cursor-pointer">Security & Privacy</span>
          <span className="hover:text-slate-400 cursor-pointer">Honor Code</span>
          <span className="hover:text-slate-400 cursor-pointer">Institutional SSO</span>
        </div>
      </div>
    </div>
  );
};
