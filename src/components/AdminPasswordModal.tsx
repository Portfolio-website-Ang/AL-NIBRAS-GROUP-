import React, { useState, useEffect, useRef } from 'react';
import { Translations } from '../translations';
import { playSound } from '../utils/sound';
import { AL_NIBRAS_LOGO_SRC } from './AlNibrasBrandBanner';
import { Lock, ShieldCheck, Eye, EyeOff, Delete } from 'lucide-react';

interface AdminPasswordModalProps {
  t: Translations;
  onUnlock: () => void;
  onCancel: () => void;
}

export const AdminPasswordModal: React.FC<AdminPasswordModalProps> = ({
  t,
  onUnlock,
  onCancel,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const verifyPin = (value: string) => {
    if (value === '1234') {
      playSound('success');
      setError(false);
      onUnlock();
    } else {
      playSound('alert');
      setError(true);
      setPin('');
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyPin(pin);
  };

  const handleDigit = (digit: string) => {
    if (pin.length >= 6) return;
    playSound('click');
    setError(false);
    const next = pin + digit;
    setPin(next);
    if (next.length === 4 && next === '1234') {
      setTimeout(() => verifyPin(next), 120);
    }
  };

  const handleBackspace = () => {
    playSound('click');
    setError(false);
    setPin((prev) => prev.slice(0, -1));
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#07091B]/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-lock-title"
    >
      <div className="max-w-sm w-full bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] rounded-2xl overflow-hidden shadow-2xl">
        <div className="h-[3px] w-full nibras-accent-bar" />

        <div className="p-6 sm:p-7 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              {!logoError ? (
                <img
                  src={AL_NIBRAS_LOGO_SRC}
                  alt="Al-Nibras Group Emblem"
                  referrerPolicy="no-referrer"
                  onError={() => setLogoError(true)}
                  className="w-11 h-11 rounded-full object-cover ring-1 ring-[#FBBF24]/60 bg-[#07091B] shrink-0"
                />
              ) : (
                <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-[#B45309] dark:text-[#FBBF24] shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
              )}
              <div>
                <h3
                  id="admin-lock-title"
                  className="text-base font-bold text-slate-900 dark:text-slate-100"
                >
                  {t.adminLockTitle}
                </h3>
                <p className="text-xs text-[#0E7490] dark:text-[#22D3EE] font-semibold">
                  {t.roleAdmin}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-lg transition-colors cursor-pointer"
              aria-label={t.close}
            >
              ✕
            </button>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.adminLockDesc}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-pin-input"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                {t.enterPinLabel}
              </label>
              <div className="relative">
                <input
                  ref={inputRef}
                  id="admin-pin-input"
                  type={showPin ? 'text' : 'password'}
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={8}
                  value={pin}
                  onChange={(e) => {
                    setError(false);
                    setPin(e.target.value);
                  }}
                  placeholder="••••"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#07091B] border border-slate-300 dark:border-[#232852] text-slate-900 dark:text-slate-100 font-mono tabular-nums text-center text-lg tracking-[0.4em] outline-none focus:border-[#FBBF24] focus:ring-2 focus:ring-[#FBBF24]/25"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPin((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  aria-label="Toggle visibility"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-3.5 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                {t.invalidPinError}
              </div>
            )}

            {/* Tactile Keypad */}
            <div className="grid grid-cols-3 gap-2" dir="ltr">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleDigit(digit)}
                  className="py-2.5 rounded-xl bg-slate-100 dark:bg-[#161B3B] hover:bg-slate-200 dark:hover:bg-[#1E254D] border border-slate-200 dark:border-[#232852] text-slate-900 dark:text-slate-100 font-mono tabular-nums font-bold text-sm transition-colors cursor-pointer"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={onCancel}
                className="py-2.5 rounded-xl bg-slate-100 dark:bg-[#161B3B] hover:bg-slate-200 dark:hover:bg-[#1E254D] border border-slate-200 dark:border-[#232852] text-slate-600 dark:text-slate-400 font-semibold text-xs transition-colors cursor-pointer"
              >
                {t.cancelBtn}
              </button>
              <button
                type="button"
                onClick={() => handleDigit('0')}
                className="py-2.5 rounded-xl bg-slate-100 dark:bg-[#161B3B] hover:bg-slate-200 dark:hover:bg-[#1E254D] border border-slate-200 dark:border-[#232852] text-slate-900 dark:text-slate-100 font-mono tabular-nums font-bold text-sm transition-colors cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className="py-2.5 rounded-xl bg-slate-100 dark:bg-[#161B3B] hover:bg-slate-200 dark:hover:bg-[#1E254D] border border-slate-200 dark:border-[#232852] text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Backspace"
              >
                <Delete className="w-4 h-4" />
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-[#FBBF24] hover:bg-[#FCD34D] text-[#07091B] font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t.unlockAdminBtn}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
