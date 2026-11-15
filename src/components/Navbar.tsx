import React, { useState } from 'react';
import { Language, UserRole, TabType } from '../types';
import { Translations } from '../translations';
import { playSound, isAudioMuted, setAudioMuted } from '../utils/sound';
import { AL_NIBRAS_LOGO_SRC } from './AlNibrasBrandBanner';
import { Lock, Sun, Moon, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface NavbarProps {
  t: Translations;
  lang: Language;
  setLang: (lang: Language) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAdminAuthenticated: boolean;
  onLockAdmin: () => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  pendingCount: number;
}

const ROLE_TABS: Record<UserRole, TabType[]> = {
  parent: ['home', 'okKro', 'zakat', 'learn', 'kids', 'aiTutor'],
  kid: ['home', 'okKro', 'kids', 'learn', 'aiTutor'],
  teen: ['home', 'okKro', 'learn', 'kids', 'aiTutor'],
  teacher: ['home', 'learn', 'kids', 'aiTutor'],
  admin: ['home', 'okKro', 'zakat', 'learn', 'aiTutor'],
};

export const Navbar: React.FC<NavbarProps> = ({
  t,
  lang,
  setLang,
  theme,
  setTheme,
  role,
  setRole,
  isAdminAuthenticated,
  onLockAdmin,
  activeTab,
  setActiveTab,
  pendingCount,
}) => {
  const [muted, setMutedState] = useState(isAudioMuted());
  const [logoError, setLogoError] = useState(false);

  const toggleSound = () => {
    const next = !muted;
    setAudioMuted(next);
    setMutedState(next);
    if (!next) playSound('click');
  };

  const allNavItems: { id: TabType; label: string; badge?: number }[] = [
    { id: 'home', label: t.navHome },
    { id: 'okKro', label: t.navOkKro, badge: role === 'parent' || role === 'admin' ? pendingCount : undefined },
    { id: 'zakat', label: t.navZakat },
    { id: 'learn', label: t.navLearn },
    { id: 'kids', label: t.navKids },
    { id: 'aiTutor', label: t.navAiTutor },
  ];

  const allowedTabs = ROLE_TABS[role] || ROLE_TABS.parent;
  const navItems = allNavItems.filter((item) => allowedTabs.includes(item.id));

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#10132C]/95 backdrop-blur-md border-b border-slate-200 dark:border-[#232852] transition-colors">
      {/* 2px Brand Spectrum Top Hairline */}
      <div className="h-[2px] w-full nibras-accent-bar" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Zone 1: Al-Nibras Group Brand Mark */}
        <button
          type="button"
          className="flex items-center gap-2.5 cursor-pointer select-none shrink-0 text-start"
          onClick={() => {
            playSound('click');
            setActiveTab('home');
          }}
        >
          {!logoError ? (
            <img
              src={AL_NIBRAS_LOGO_SRC}
              alt="Al-Nibras Group Emblem"
              referrerPolicy="no-referrer"
              onError={() => setLogoError(true)}
              className="w-10 h-10 rounded-full object-cover ring-1 ring-[#FBBF24]/60 bg-[#07091B] shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#07091B] border border-[#FBBF24]/50 flex items-center justify-center text-[#FBBF24] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
          )}
          <div>
            <span className="text-lg font-serif font-bold text-[#B45309] dark:text-[#FBBF24] leading-tight block">
              {t.appName}
            </span>
            <span className="text-[10px] font-semibold tracking-wider text-[#0E7490] dark:text-[#22D3EE] hidden sm:block">
              {t.subTitle}
            </span>
          </div>
        </button>

        {/* Zone 2: Role-Scoped Navigation Tabs (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playSound('click');
                  setActiveTab(tab.id);
                }}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#FBBF24] text-[#07091B] font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#161B3B] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="px-1.5 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-mono tabular-nums leading-none">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Role Switcher, Language, Theme & Lock Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Role Switcher */}
          <select
            value={role}
            onChange={(e) => {
              playSound('click');
              setRole(e.target.value as UserRole);
            }}
            aria-label={t.activeSeat}
            className="text-xs font-semibold px-2.5 py-2 rounded-lg bg-slate-100 dark:bg-[#07091B] border border-slate-200 dark:border-[#232852] text-slate-900 dark:text-slate-100 outline-none focus:border-[#FBBF24] cursor-pointer max-w-[140px] sm:max-w-none"
          >
            <option value="parent">{t.roleParent}</option>
            <option value="kid">{t.roleKid}</option>
            <option value="teen">{t.roleTeen}</option>
            <option value="teacher">{t.roleTeacher}</option>
            <option value="admin">
              {isAdminAuthenticated ? `🔓 ${t.roleAdmin}` : `🔒 ${t.roleAdmin} (PIN)`}
            </option>
          </select>

          {role === 'admin' && (
            <button
              type="button"
              onClick={() => {
                playSound('click');
                onLockAdmin();
              }}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
              title={t.lockAdminBtn}
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t.lockAdminBtn}</span>
            </button>
          )}

          {/* Language Switcher */}
          <select
            value={lang}
            onChange={(e) => {
              playSound('click');
              setLang(e.target.value as Language);
            }}
            aria-label={t.langName}
            className="text-xs font-semibold px-2.5 py-2 rounded-lg bg-slate-100 dark:bg-[#07091B] border border-slate-200 dark:border-[#232852] text-slate-900 dark:text-slate-100 outline-none focus:border-[#FBBF24] cursor-pointer"
          >
            <option value="ur">اردو</option>
            <option value="ps">پښتو</option>
            <option value="en">EN</option>
            <option value="ar">عربي</option>
          </select>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={() => {
              playSound('click');
              setTheme(theme === 'dark' ? 'light' : 'dark');
            }}
            className="p-2 rounded-lg bg-slate-100 dark:bg-[#07091B] border border-slate-200 dark:border-[#232852] text-slate-700 dark:text-[#FBBF24] hover:bg-slate-200 dark:hover:bg-[#161B3B] transition-colors cursor-pointer"
            title={t.themeToggle}
            aria-label={t.themeToggle}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Audio Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="hidden sm:inline-flex p-2 rounded-lg bg-slate-100 dark:bg-[#07091B] border border-slate-200 dark:border-[#232852] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#161B3B] transition-colors cursor-pointer"
            title={t.soundToggle}
            aria-label={t.soundToggle}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Role-Scoped Nav Strip */}
      <div className="lg:hidden px-4 pb-2.5 flex items-center gap-1.5 overflow-x-auto">
        {navItems.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                playSound('click');
                setActiveTab(tab.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#FBBF24] text-[#07091B] font-bold'
                  : 'bg-slate-100 dark:bg-[#07091B] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#232852]'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[10px] font-mono tabular-nums leading-none">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
