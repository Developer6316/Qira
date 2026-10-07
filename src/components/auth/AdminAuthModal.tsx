import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Shield, Lock, CheckCircle2, AlertCircle, KeyRound, Sparkles, X, UserCheck } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  targetActionName?: string;
}

const CORRECT_USERNAME = 'Developer6316';
const CORRECT_PIN = '6316';

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  targetActionName
}) => {
  const [username, setUsername] = useState('Developer6316');
  const [pinDigits, setPinDigits] = useState(['', '', '', '']);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccessAnim, setIsSuccessAnim] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setPinDigits(['', '', '', '']);
      setErrorMsg(null);
      setIsSuccessAnim(false);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isMounted || !isOpen) return null;

  const handleDigitChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    
    // Only accept numeric digits
    if (val && !/^\d$/.test(val)) return;

    const nextDigits = [...pinDigits];
    nextDigits[index] = val;
    setPinDigits(nextDigits);
    setErrorMsg(null);

    // Auto advance focus
    if (val && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit when 4 digits are entered
    if (val && index === 3 && nextDigits.every(d => d !== '')) {
      validateAndSubmit(username, nextDigits.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pinDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const validateAndSubmit = (u: string, p: string) => {
    if (u.trim() !== CORRECT_USERNAME || p !== CORRECT_PIN) {
      setErrorMsg('Invalid Admin credentials. Please check Username and PIN.');
      setPinDigits(['', '', '', '']);
      inputRefs.current[0]?.focus();
      return;
    }

    setIsSuccessAnim(true);
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 600);
  };

  const handleAutoFill = () => {
    setUsername(CORRECT_USERNAME);
    setPinDigits(['6', '3', '1', '6']);
    setErrorMsg(null);
    validateAndSubmit(CORRECT_USERNAME, '6316');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateAndSubmit(username, pinDigits.join(''));
  };

  return createPortal(
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200 z-10">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-purple-600/10 text-purple-600 border border-purple-200 flex items-center justify-center mx-auto shadow-sm">
            {isSuccessAnim ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-600 animate-in zoom-in" />
            ) : (
              <Shield className="w-7 h-7" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Admin & Educator Authentication
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              {targetActionName 
                ? `Enter credentials to unlock "${targetActionName}"` 
                : 'Enter your Admin credentials to unlock full course management capabilities.'}
            </p>
          </div>
        </div>

        {/* Quick Demo Helper Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 flex items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <div className="font-bold text-purple-900 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-purple-600" />
              <span>Demo Credentials</span>
            </div>
            <div className="text-[11px] font-mono text-purple-700">
              User: <span className="font-bold">Developer6316</span> | PIN: <span className="font-bold">6316</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAutoFill}
            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] transition-all shadow-xs flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3 h-3" />
            <span>Auto Fill</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-slate-600 uppercase">
              Admin Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. Developer6316"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-mono text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-600"
              required
            />
          </div>

          {/* 4-Digit PIN */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-slate-600 uppercase">
                4-Digit Security PIN
              </label>
              <span className="text-[10px] font-mono text-slate-400">Default: 6316</span>
            </div>
            
            <div className="flex items-center justify-center gap-3">
              {[0, 1, 2, 3].map((idx) => (
                <input
                  key={idx}
                  ref={(el) => { inputRefs.current[idx] = el; }}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  value={pinDigits[idx]}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-12 h-14 text-center text-xl font-mono font-black rounded-2xl bg-slate-50 border-2 border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-600 transition-all shadow-xs"
                />
              ))}
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSuccessAnim}
            className={`w-full py-3 rounded-2xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
              isSuccessAnim
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-700 text-white'
            }`}
          >
            {isSuccessAnim ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Authenticated! Switching to Admin...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Verify & Unlock Admin Console</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};
