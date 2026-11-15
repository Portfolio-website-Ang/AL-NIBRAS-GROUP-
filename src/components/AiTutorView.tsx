import React from 'react';
import { Language } from '../types';
import { Translations } from '../translations';
import { playSound } from '../utils/sound';
import { AL_NIBRAS_LOGO_SRC } from './AlNibrasBrandBanner';

interface AiTutorViewProps {
  t: Translations;
  lang: Language;
  theme: 'dark' | 'light';
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'mufti';
  text: string;
  time: string;
}

export const AiTutorView: React.FC<AiTutorViewProps> = ({ t, lang, theme }) => {
  const [query, setQuery] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const [chat, setChat] = React.useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'mufti',
      text: t.muftiGreeting,
      time: 'ابھی',
    },
  ]);

  const chatEndRef = React.useRef<HTMLDivElement>(null);

  const quickPromptsByLang: Record<Language, string[]> = {
    ur: [
      'سونے اور چاندی پر زکوٰۃ کا شرعی نصاب کیا ہے؟',
      'کیا اسٹاک مارکیٹ میں حلال شیئرز خریدنا جائز ہے؟',
      'مضاربہ اور مشارکہ میں کیا بنیادی فرق ہے؟',
      'روایتی بینکوں کا فکسڈ منافع کیوں سود ہے؟',
      'بچوں کو حلال کمائی اور برکت کی عادت کیسے ڈالی جائے؟',
    ],
    en: [
      'What is the Nisab threshold for gold and silver Zakat?',
      'Is trading stocks permitted under Sharia guidelines?',
      'What is the difference between Mudarabah and Musharakah?',
      'Why is fixed conventional bank interest considered Riba?',
      'How to teach halal financial literacy to children?',
    ],
    ps: [
      'د سرو زرو او سپینو زرو د زکات نصاب څومره دی؟',
      'ایا د حلالو شرکتونو اسهام (سټاکس) اخیستل روا دي؟',
      'د مضاربت او مشارکت ترمنځ څه توپیر دی؟',
      'ولې د سودي بانکونو ګټه حرامه ده؟',
      'ماشومانو ته د حلال رزق او سپما لارښوونه څنګه وکړو؟',
    ],
    ar: [
      'ما هو نصاب الذهب والفضة في حساب الزكاة الشرعية؟',
      'هل يجوز الاستثمار في أسهم الشركات المباحة؟',
      'ما الفرق الجوهري بين عقد المضاربة والمشاركة؟',
      'لماذا تعتبر فوائد البنوك التقليدية من الربا المحرم؟',
      'كيف نغرس ثقافة الكسب الحلال والبركة في الأبناء؟',
    ],
  };

  const quickPrompts = quickPromptsByLang[lang] || quickPromptsByLang.ur;

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat, loading]);

  React.useEffect(() => {
    setChat((prev) => {
      if (prev.length === 1 && prev[0].id === 'welcome') {
        return [
          {
            id: 'welcome',
            sender: 'mufti',
            text: t.muftiGreeting,
            time: lang === 'ps' ? 'اوس' : lang === 'ar' ? 'الآن' : lang === 'en' ? 'Now' : 'ابھی',
          },
        ];
      }
      return prev;
    });
  }, [lang, t.muftiGreeting]);

  const speakText = (text: string) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        if (isSpeaking) {
          setIsSpeaking(false);
          return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        if (lang === 'ur') utterance.lang = 'ur-PK';
        else if (lang === 'ar') utterance.lang = 'ar-SA';
        else utterance.lang = 'en-US';
        utterance.rate = 0.95;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
      }
    } catch {
      setIsSpeaking(false);
    }
  };

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || query;
    if (!textToSend.trim() || loading) return;

    playSound('click');
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChat((prev) => [...prev, userMessage]);
    setQuery('');
    setLoading(true);

    try {
      const response = await fetch('/api/ask-mufti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: textToSend, language: lang }),
      });

      if (!response.ok) {
        throw new Error('API failed');
      }

      const data = await response.json();
      const replyText = data.answer || getSmartFallback(textToSend, lang);

      playSound('coin');
      setChat((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'mufti',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      const fallbackReply = getSmartFallback(textToSend, lang);
      playSound('coin');
      setChat((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'mufti',
          text: fallbackReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    playSound('click');
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getSmartFallback = (q: string, userLang: string): string => {
    const low = q.toLowerCase();
    if (userLang === 'ur') {
      if (low.includes('زکو') || low.includes('نصاب')) {
        return 'شریعت کے مطابق زکوٰۃ 2.5٪ کی شرح سے فرض ہے۔ چاندی کا نصاب 595 گرام (تقریباً 184,450 روپے) اور سونے کا نصاب 87.48 گرام (تقریباً 2,140,000 روپے) ہے۔ اگر آپ کے پاس سال بھر یہ رقم یا مالِ تجارت برقرار رہے تو زکوٰۃ واجب الادا ہوگی۔';
      }
      if (low.includes('اسٹاک') || low.includes('شیئر') || low.includes('کرپٹو')) {
        return 'اسٹاکس میں سرمایہ کاری کی 4 بنیادی شرائط ہیں: 1) کاروبار حلال مصنوعات کا ہو۔ 2) سودی قرض کل اثاثوں کے 33٪ سے کم ہو۔ 3) غیر شرعی اثاثے 33٪ سے کم ہوں۔ 4) غیر حلال آمدنی 5٪ سے کم ہو جسے بلا نیتِ ثواب صدقہ کیا جائے۔';
      }
      if (low.includes('مضاربہ') || low.includes('مشارکہ')) {
        return 'مضاربہ میں ایک فریق سرمایہ دار (رب المال) اور دوسرا منتظم (مضارب) ہوتا ہے۔ منافع باہمی طے شدہ شرح سے تقسیم ہوتا ہے اور مالی نقصان صرف سرمایہ دار پر آتا ہے۔ جبکہ مشارکہ میں دونوں فریقین سرمایہ لگاتے ہیں اور نفع و نقصان دونوں شریک ہوتے ہیں۔';
      }
      if (low.includes('سود') || low.includes('بینک')) {
        return 'روایتی بینکوں کا فکسڈ انٹرسٹ "ربوا القرض" ہے جو کہ قرآن مجید (سورۃ البقرۃ: 275) کے تحت قطعی حرام ہے۔ اسلامی بینکنگ میں فکسڈ ریٹ کی بجائے منافع حقیقی تجارت کے نفع و نقصان پر منحصر ہوتا ہے۔';
      }
      return 'اسلامی معیشت کا بنیادی ستون عدل، شفافیت اور نفع و نقصان کی شراکت ہے۔ شریعت میں ہر اس معاملے سے روکا گیا ہے جس میں غرر (دھوکہ یا عدم تعین) یا میسر (جوا) شامل ہو۔';
    }
    return 'According to Islamic Jurisprudence (Fiqh al-Muamalat) and AAOIFI standards, all transactions must be backed by real economic activity, free from Riba (interest), Gharar (excessive ambiguity), and Maysir (gambling). Profit is justified by risk-sharing and asset ownership.';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="text-xs font-bold tracking-wider uppercase text-[#0E7490] dark:text-[#22D3EE] flex items-center justify-center gap-2">
          <img
            src={AL_NIBRAS_LOGO_SRC}
            alt="Al-Nibras Group"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
            className="w-5 h-5 rounded-full object-cover ring-1 ring-[#FBBF24]/60 bg-[#07091B]"
          />
          <span>AAOIFI مصدقہ شرعی اصول و مراجع</span>
        </div>
        <h2 className="text-3xl font-serif font-extrabold gold-gradient-text">
          {t.navAiTutor} — Islamic Jurisprudence &amp; Fintech Advisor
        </h2>
        <p className="text-xs sm:text-sm max-w-xl mx-auto text-slate-600 dark:text-slate-300">
          معروف اسلامی فقہ المعاملات پر تربیت یافتہ اے آئی مفتی سے فوری شرعی رہنمائی حاصل کریں۔
        </p>
      </div>

      {/* Suggested Questions (Interactive Prompt Chips) */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp)}
            className="text-xs px-3.5 py-1.5 rounded-xl border transition-colors bg-white dark:bg-[#10132C] hover:bg-amber-50 dark:hover:bg-[#161B3B] border-slate-200 dark:border-[#232852] hover:border-[#FBBF24] text-slate-700 dark:text-slate-300 hover:text-[#B45309] dark:hover:text-[#FBBF24] cursor-pointer"
          >
            💬 {qp}
          </button>
        ))}
      </div>

      {/* Chat Window */}
      <div
        className={`rounded-2xl overflow-hidden border border-slate-200 dark:border-[#232852] ${
          theme === 'dark' ? 'glass-card-dark' : 'glass-card-light'
        } min-h-[480px] max-h-[600px] flex flex-col justify-between shadow-xl`}
      >
        <div className="h-[3px] w-full nibras-accent-bar shrink-0" />

        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between min-h-0 space-y-4">
          {/* Messages */}
          <div className="overflow-y-auto space-y-4 pr-2 max-h-[430px] custom-scrollbar">
            {chat.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base shadow-sm ${
                      isUser
                        ? 'bg-gradient-to-tr from-[#22D3EE] to-[#10B981] text-[#07091B] font-bold'
                        : 'bg-gradient-to-tr from-[#FBBF24] to-[#B45309] text-[#07091B]'
                    }`}
                  >
                    {isUser ? '👤' : '🕌'}
                  </div>

                  <div
                    className={`max-w-xl p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                      isUser
                        ? 'royal-gradient-btn text-[#07091B] font-bold rounded-tr-none'
                        : 'bg-slate-50 dark:bg-[#07091B] text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-[#232852] rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    <div
                      className={`flex items-center justify-between mt-3 pt-2 border-t text-[10px] ${
                        isUser
                          ? 'border-[#07091B]/15 text-[#07091B]/80'
                          : 'border-slate-200 dark:border-[#232852] text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <span>{msg.time}</span>
                      {!isUser && (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => speakText(msg.text)}
                            className="hover:text-[#0E7490] dark:hover:text-[#22D3EE] flex items-center gap-1.5 text-[11px] font-bold cursor-pointer"
                            title="آواز میں سنیں"
                          >
                            {isSpeaking ? (
                              <span className="flex items-center gap-1">
                                <span className="soundwave-bar h-3" />
                                <span className="soundwave-bar h-4" />
                                <span className="soundwave-bar h-2" />
                              </span>
                            ) : (
                              <span>🔊 {t.speakBtn}</span>
                            )}
                          </button>
                          <button
                            onClick={() => copyMessage(msg.id, msg.text)}
                            className="hover:text-[#B45309] dark:hover:text-[#FBBF24] font-bold cursor-pointer"
                            title="کاپی کریں"
                          >
                            {copiedId === msg.id ? '✓ کاپی ہو گیا' : `📋 ${t.copyBtn}`}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FBBF24] text-[#07091B] flex items-center justify-center text-sm">
                  🕌
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-[#07091B] border border-slate-200 dark:border-[#232852] text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <span>{t.listeningMufti}</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Bar */}
          <div className="pt-4 border-t border-slate-200 dark:border-[#232852] flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t.askAiPlaceholder}
              disabled={loading}
              className="flex-grow px-4 py-3 rounded-xl border border-slate-300 dark:border-[#232852] bg-slate-50 dark:bg-[#07091B] text-slate-900 dark:text-slate-100 text-xs sm:text-sm outline-none focus:border-[#FBBF24] placeholder:text-slate-400"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !query.trim()}
              className={`px-5 py-3 rounded-xl font-bold text-xs transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
                query.trim() && !loading
                  ? 'bg-[#FBBF24] hover:bg-[#FCD34D] text-[#07091B] cursor-pointer'
                  : 'bg-slate-200 dark:bg-[#161B3B] text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>✨</span>
              <span>{t.askAiBtn}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
