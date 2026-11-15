import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { Translations } from '../translations';
import { playSound } from '../utils/sound';

interface PrayerTimesWidgetProps {
  t: Translations;
  lang: Language;
  theme: 'dark' | 'light';
  onNotify?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

interface TimingsData {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface HijriDate {
  day: string;
  month: { en: string; ar: string };
  year: string;
  designation: string;
}

const CITY_PRESETS = [
  { city: 'Karachi', country: 'Pakistan', label: 'کراچی (Karachi)', qibla: '258° WSW' },
  { city: 'Lahore', country: 'Pakistan', label: 'لاہور (Lahore)', qibla: '261° WSW' },
  { city: 'Islamabad', country: 'Pakistan', label: 'اسلام آباد (Islamabad)', qibla: '254° WSW' },
  { city: 'Peshawar', country: 'Pakistan', label: 'پشاور (Peshawar)', qibla: '251° WSW' },
  { city: 'Quetta', country: 'Pakistan', label: 'کوئٹہ (Quetta)', qibla: '253° WSW' },
  { city: 'Makkah', country: 'Saudi Arabia', label: 'مکہ مکرمہ (Makkah)', qibla: '0° Kaaba' },
  { city: 'Medina', country: 'Saudi Arabia', label: 'مدینہ منورہ (Medina)', qibla: '175° S' },
  { city: 'Dubai', country: 'United Arab Emirates', label: 'دبئی (Dubai)', qibla: '260° W' },
  { city: 'Kabul', country: 'Afghanistan', label: 'کابل (Kabul)', qibla: '247° WSW' },
  { city: 'London', country: 'United Kingdom', label: 'لندن (London)', qibla: '119° ESE' },
];

export const PrayerTimesWidget: React.FC<PrayerTimesWidgetProps> = ({
  t,
  lang,
  onNotify,
}) => {
  const [selectedCityObj, setSelectedCityObj] = useState(CITY_PRESETS[0]);
  const [school, setSchool] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [gpsActive, setGpsActive] = useState<boolean>(false);
  const [gpsLocationName, setGpsLocationName] = useState<string>('');
  const [geoNotice, setGeoNotice] = useState<string | null>(null);

  const [timings, setTimings] = useState<TimingsData>({
    Fajr: '05:08',
    Sunrise: '06:24',
    Dhuhr: '12:22',
    Asr: '16:35',
    Maghrib: '18:18',
    Isha: '19:35',
  });

  const [hijriDate, setHijriDate] = useState<HijriDate>({
    day: '27',
    month: { en: "Rabi' al-Thani", ar: 'رَبِيعُ الثَّانِي' },
    year: '1448',
    designation: 'AH',
  });

  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [nextPrayerInfo, setNextPrayerInfo] = useState<{
    name: string;
    key: keyof TimingsData;
    time: string;
    diffMins: number;
  }>({
    name: t.asr,
    key: 'Asr',
    time: '16:35',
    diffMins: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const fetchPrayerTimes = async () => {
      setLoading(true);
      try {
        const apiUrl = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(
          selectedCityObj.city
        )}&country=${encodeURIComponent(
          selectedCityObj.country
        )}&method=1&school=${school}`;

        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error('API failed');

        const json = await res.json();
        if (json.data && !isCancelled) {
          const raw = json.data.timings;
          setTimings({
            Fajr: raw.Fajr?.slice(0, 5) || '05:08',
            Sunrise: raw.Sunrise?.slice(0, 5) || '06:24',
            Dhuhr: raw.Dhuhr?.slice(0, 5) || '12:22',
            Asr: raw.Asr?.slice(0, 5) || '16:35',
            Maghrib: raw.Maghrib?.slice(0, 5) || '18:18',
            Isha: raw.Isha?.slice(0, 5) || '19:35',
          });

          if (json.data.date?.hijri) {
            setHijriDate({
              day: json.data.date.hijri.day,
              month: {
                en: json.data.date.hijri.month.en,
                ar: json.data.date.hijri.month.ar,
              },
              year: json.data.date.hijri.year,
              designation: json.data.date.hijri.designation?.abbreviated || 'AH',
            });
          }
        }
      } catch {
        // Keep resilient defaults
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchPrayerTimes();

    return () => {
      isCancelled = true;
    };
  }, [selectedCityObj, school]);

  const showLocationFeedback = (msg: string) => {
    if (onNotify) {
      onNotify(msg, 'info');
    } else {
      setGeoNotice(msg);
      setTimeout(() => setGeoNotice(null), 4000);
    }
  };

  const handleLocateMe = () => {
    playSound('click');
    if (!navigator.geolocation) {
      showLocationFeedback('جیو لوکیشن آپ کے براؤزر میں دستیاب نہیں ہے۔');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const url = `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=1&school=${school}`;
          const res = await fetch(url);
          const json = await res.json();
          if (json.data) {
            const raw = json.data.timings;
            setTimings({
              Fajr: raw.Fajr?.slice(0, 5) || '05:08',
              Sunrise: raw.Sunrise?.slice(0, 5) || '06:24',
              Dhuhr: raw.Dhuhr?.slice(0, 5) || '12:22',
              Asr: raw.Asr?.slice(0, 5) || '16:35',
              Maghrib: raw.Maghrib?.slice(0, 5) || '18:18',
              Isha: raw.Isha?.slice(0, 5) || '19:35',
            });
            setGpsActive(true);
            setGpsLocationName(
              `${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E (GPS)`
            );
            playSound('success');
          }
        } catch {
          showLocationFeedback('GPS کی بنیاد پر اوقات حاصل کرنے میں دشواری پیش آئی۔');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
        showLocationFeedback('مقام کی رسائی کی اجازت نہیں مل سکی۔ برائے مہربانی شہر منتخب کریں۔');
      },
      { timeout: 10000 }
    );
  };

  useEffect(() => {
    const prayerOrder: { key: keyof TimingsData; name: string }[] = [
      { key: 'Fajr', name: t.fajr },
      { key: 'Sunrise', name: t.sunrise },
      { key: 'Dhuhr', name: t.dhuhr },
      { key: 'Asr', name: t.asr },
      { key: 'Maghrib', name: t.maghrib },
      { key: 'Isha', name: t.isha },
    ];

    const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

    let foundNext: {
      name: string;
      key: keyof TimingsData;
      time: string;
      diffMins: number;
    } | null = null;

    for (const p of prayerOrder) {
      const timeStr = timings[p.key];
      if (!timeStr) continue;
      const [h, m] = timeStr.split(':').map(Number);
      const prayerMinutes = h * 60 + m;

      if (prayerMinutes > nowMinutes) {
        foundNext = {
          name: p.name,
          key: p.key,
          time: timeStr,
          diffMins: prayerMinutes - nowMinutes,
        };
        break;
      }
    }

    if (!foundNext) {
      const [fH, fM] = (timings.Fajr || '05:08').split(':').map(Number);
      const fajrTomorrow = 24 * 60 + fH * 60 + fM;
      foundNext = {
        name: t.fajr,
        key: 'Fajr',
        time: timings.Fajr,
        diffMins: fajrTomorrow - nowMinutes,
      };
    }

    setNextPrayerInfo(foundNext);
  }, [currentTime, timings, t]);

  const formatCountdown = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const m = mins % 60;
    if (hours > 0) {
      return `${hours}h ${m}m`;
    }
    return `${m} mins`;
  };

  const prayersList: {
    key: keyof TimingsData;
    label: string;
    arabicLabel: string;
    icon: string;
  }[] = [
    { key: 'Fajr', label: t.fajr, arabicLabel: 'الفجر', icon: '🌅' },
    { key: 'Sunrise', label: t.sunrise, arabicLabel: 'الشروق', icon: '☀️' },
    { key: 'Dhuhr', label: t.dhuhr, arabicLabel: 'الظهر', icon: '🌞' },
    { key: 'Asr', label: t.asr, arabicLabel: 'العصر', icon: '🌤️' },
    { key: 'Maghrib', label: t.maghrib, arabicLabel: 'المغرب', icon: '🌇' },
    { key: 'Isha', label: t.isha, arabicLabel: 'العشاء', icon: '🌙' },
  ];

  return (
    <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#10132C] border border-slate-200 dark:border-[#232852] space-y-5">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-[#232852] pb-4">
        <div className="space-y-1">
          <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-slate-100">
            {t.prayerTimesTitle}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.prayerTimesSubtitle}
          </p>
        </div>

        {/* Hijri Date & Adhan Chime */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#07091B] border border-slate-200 dark:border-[#232852] text-xs font-semibold text-[#B45309] dark:text-[#FBBF24]">
            {hijriDate.day} {lang === 'ar' ? hijriDate.month.ar : hijriDate.month.en}{' '}
            {hijriDate.year} {hijriDate.designation}
          </div>

          <button
            onClick={() => playSound('chime')}
            className="px-3 py-1.5 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-600/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold transition-colors cursor-pointer"
            title={t.playAdhanTone}
          >
            🔔 {t.playAdhanTone}
          </button>
        </div>
      </div>

      {geoNotice && (
        <div className="px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-700 dark:text-amber-300">
          {geoNotice}
        </div>
      )}

      {/* Controls & Next Prayer Countdown */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="flex-1 p-4 rounded-xl bg-slate-50 dark:bg-[#161B3B] border border-slate-200 dark:border-[#232852] flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block">
              {t.nextPrayerLabel}
            </span>
            <div className="text-lg sm:text-xl font-serif font-bold text-slate-900 dark:text-slate-100">
              {nextPrayerInfo.name}{' '}
              <span className="text-sm font-mono tabular-nums font-bold text-[#0E7490] dark:text-[#22D3EE]">
                ({nextPrayerInfo.time})
              </span>
            </div>
          </div>

          <div className="text-end">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-semibold">
              {t.inCountdown}
            </span>
            <span className="text-lg sm:text-xl font-mono tabular-nums font-bold text-[#B45309] dark:text-[#FBBF24]">
              {formatCountdown(nextPrayerInfo.diffMins)}
            </span>
          </div>
        </div>

        {/* Location & School Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={gpsActive ? 'gps' : selectedCityObj.city}
            onChange={(e) => {
              playSound('click');
              setGpsActive(false);
              const found = CITY_PRESETS.find((c) => c.city === e.target.value);
              if (found) setSelectedCityObj(found);
            }}
            className="text-xs font-semibold px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-[#07091B] border border-slate-200 dark:border-[#232852] text-slate-900 dark:text-slate-100 outline-none cursor-pointer"
          >
            {gpsActive && <option value="gps">📍 {gpsLocationName}</option>}
            {CITY_PRESETS.map((c) => (
              <option key={c.city} value={c.city}>
                {c.label}
              </option>
            ))}
          </select>

          <button
            onClick={handleLocateMe}
            className={`px-3 py-2.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              gpsActive
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-slate-100 dark:bg-[#07091B] hover:bg-slate-200 dark:hover:bg-[#161B3B] text-slate-800 dark:text-slate-200 border-slate-200 dark:border-[#232852]'
            }`}
            title={t.locateMe}
          >
            🎯 <span className="hidden sm:inline">{t.locateMe}</span>
          </button>

          <div className="flex items-center rounded-xl p-0.5 bg-slate-100 dark:bg-[#07091B] border border-slate-200 dark:border-[#232852]">
            <button
              onClick={() => {
                playSound('click');
                setSchool(1);
              }}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                school === 1
                  ? 'bg-[#FBBF24] text-[#07091B] font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.schoolHanafi}
            </button>
            <button
              onClick={() => {
                playSound('click');
                setSchool(0);
              }}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                school === 0
                  ? 'bg-[#FBBF24] text-[#07091B] font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.schoolShafii}
            </button>
          </div>
        </div>
      </div>

      {/* 6 Prayer Times Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {prayersList.map((p) => {
          const isNext = nextPrayerInfo.key === p.key;
          const timeValue = timings[p.key] || '--:--';

          return (
            <div
              key={p.key}
              className={`p-3.5 rounded-xl border text-center flex flex-col justify-between space-y-2 transition-colors ${
                isNext
                  ? 'border-[#22D3EE]/60 bg-[#0E7490]/10 dark:bg-[#22D3EE]/10'
                  : 'bg-slate-50 dark:bg-[#161B3B] border-slate-200 dark:border-[#232852]'
              }`}
            >
              <div className="space-y-0.5">
                <span className="text-xl block">{p.icon}</span>
                <span
                  className={`text-xs font-bold block ${
                    isNext
                      ? 'text-[#0E7490] dark:text-[#22D3EE]'
                      : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {p.label}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-serif">
                  {p.arabicLabel}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-[#232852]">
                <span
                  className={`text-base sm:text-lg font-mono tabular-nums font-bold block ${
                    isNext
                      ? 'text-[#0E7490] dark:text-[#22D3EE]'
                      : 'text-[#B45309] dark:text-[#FBBF24]'
                  }`}
                >
                  {loading ? '...' : timeValue}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Meta Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-200 dark:border-[#232852]">
        <div>
          {t.qiblaBearing}:{' '}
          <strong className="text-slate-800 dark:text-slate-200 font-mono tabular-nums">
            {selectedCityObj.qibla}
          </strong>
        </div>
        <div>
          {gpsActive ? gpsLocationName : selectedCityObj.label} · Aladhan API
        </div>
      </div>
    </div>
  );
};
