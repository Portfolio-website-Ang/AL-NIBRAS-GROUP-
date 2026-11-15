import React, { useState } from 'react';
import { CertificateData } from '../types';
import { Translations } from '../translations';
import { AL_NIBRAS_LOGO_SRC } from './AlNibrasBrandBanner';
import { Award, Printer } from 'lucide-react';

interface CertificateModalProps {
  t: Translations;
  certData: CertificateData;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  t,
  certData,
  onClose,
}) => {
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-[#07091B]/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-2xl w-full bg-white dark:bg-[#10132C] border-2 border-[#FBBF24] rounded-3xl overflow-hidden shadow-2xl text-center relative my-8">
        <div className="h-[3px] w-full nibras-accent-bar" />

        <div className="p-6 sm:p-8 space-y-6">
          {/* Certificate Inner Frame */}
          <div className="border border-[#FBBF24]/50 p-6 sm:p-8 rounded-2xl relative bg-slate-50 dark:bg-[#07091B]">
            <div className="absolute top-2.5 left-3 text-[#B45309] dark:text-[#FBBF24] text-xs font-serif opacity-70">❖</div>
            <div className="absolute top-2.5 right-3 text-[#B45309] dark:text-[#FBBF24] text-xs font-serif opacity-70">❖</div>
            <div className="absolute bottom-2.5 left-3 text-[#B45309] dark:text-[#FBBF24] text-xs font-serif opacity-70">❖</div>
            <div className="absolute bottom-2.5 right-3 text-[#B45309] dark:text-[#FBBF24] text-xs font-serif opacity-70">❖</div>

            <div className="mb-3">
              {!logoError ? (
                <img
                  src={AL_NIBRAS_LOGO_SRC}
                  alt="Al-Nibras Group Official Emblem"
                  referrerPolicy="no-referrer"
                  onError={() => setLogoError(true)}
                  className="w-20 h-20 rounded-full object-cover mx-auto ring-2 ring-[#FBBF24]/70 bg-[#07091B]"
                />
              ) : (
                <div className="w-20 h-20 rounded-full mx-auto bg-[#07091B] border-2 border-[#FBBF24] flex items-center justify-center text-[#FBBF24]">
                  <Award className="w-9 h-9" />
                </div>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-[#B45309] dark:text-[#FBBF24] tracking-wider uppercase">
              {t.certificateTitle}
            </h2>
            <p className="text-[11px] text-[#0E7490] dark:text-[#22D3EE] font-bold tracking-widest mt-1">
              AL-NIBRAS GROUP · ALNIBRAS.PK · INNOVATE · EMPOWER · EXECUTE · ELEVATE
            </p>

            <div className="my-6 space-y-2">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                بصدق و مسرت تصدیق کی جاتی ہے کہ محترم / محترمہ
              </p>
              <h3 className="text-2xl sm:text-3xl font-serif font-extrabold text-slate-900 dark:text-[#FDE68A] py-1 border-b border-[#FBBF24]/30 inline-block px-8">
                {certData.recipientName}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 pt-2">
                نے شریعت فنانس بورڈ کی نگرانی میں کامیابی کے ساتھ مکمل کیا اور {certData.score}% گریڈ حاصل کیا برائے
              </p>
              <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
                {certData.courseTitle}
              </h4>
            </div>

            {/* Certificate Footer Stamp & Details */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 dark:text-slate-400 pt-5 border-t border-slate-200 dark:border-[#232852] mt-6">
              <div className="text-center sm:text-start">
                <span>تاریخِ اجراء: </span>
                <strong className="text-slate-900 dark:text-slate-200 font-mono tabular-nums">
                  {certData.issueDate}
                </strong>
              </div>

              <div className="px-4 py-1.5 bg-[#FBBF24]/15 border border-[#FBBF24]/45 text-[#B45309] dark:text-[#FBBF24] font-bold rounded-lg tracking-wider">
                {t.verifiedStamp}
              </div>

              <div className="text-center sm:text-end">
                <span>سند کوڈ: </span>
                <strong className="text-slate-900 dark:text-slate-200 font-mono tabular-nums">
                  {certData.certCode}
                </strong>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.print()}
              className="px-7 py-3 rounded-xl bg-[#FBBF24] hover:bg-[#FCD34D] text-[#07091B] font-bold text-xs transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{t.printCertificate}</span>
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-[#161B3B] hover:bg-slate-200 dark:hover:bg-[#1E254D] border border-slate-200 dark:border-[#232852] text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors whitespace-nowrap cursor-pointer"
            >
              {t.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
