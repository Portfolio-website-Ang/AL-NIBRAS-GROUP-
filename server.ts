import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Sharia-compliant AI Advisor Endpoint
app.post('/api/ask-mufti', async (req, res) => {
  const { question, language = 'ur' } = req.body;

  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Question is required' });
  }

  if (!ai) {
    // Graceful fallback response if API key is not configured
    return res.json({
      answer: getFallbackAnswer(question, language),
      source: 'offline_fiqh_engine'
    });
  }

  try {
    const prompt = `You are "Mufti AI" (مفتی النبراس), a senior Islamic Jurisprudence (Fiqh al-Muamalat) and Fintech Advisor for the Al Nibras platform.
Your purpose is to give clear, authentic, warm, and Sharia-compliant advice according to classical Sunni jurisprudence (Hanafi, Shafi'i, Maliki, Hanbali) and modern AAOIFI standards.

User Language requested: ${language} (if 'ur' respond in Urdu with respectful Islamic terminology; if 'en' respond in English; if 'ps' in Pashto; if 'ar' in Arabic).
Respond concisely in 3 to 5 clear sentences or bullet points. Include relevant Sharia reasons (e.g. absence of Riba, Gharar, Maysir, risk sharing, or Zakat nisab details).

User Question: "${question}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const reply = response.text || getFallbackAnswer(question, language);
    return res.json({ answer: reply, source: 'gemini' });
  } catch (err: any) {
    console.error('Gemini error:', err?.message || err);
    return res.json({
      answer: getFallbackAnswer(question, language),
      source: 'fallback_error_recovery'
    });
  }
});

function getFallbackAnswer(q: string, lang: string): string {
  const query = q.toLowerCase();
  if (lang === 'ur') {
    if (query.includes('زکو') || query.includes('نصاب') || query.includes('zakat')) {
      return "شریعتِ مطہرہ کے مطابق زکوٰۃ 2.5٪ کی شرح سے چاندی کے نصاب (595 گرام ~ 184,450 روپے) یا سونے کے نصاب (87.48 گرام) سے زائد نقد، سونا، چاندی اور مالِ تجارت پر سال گزرنے کے بعد فرض ہوتی ہے۔ قرض اور بنیادی ضروریات منہا کی جائیں گی۔";
    }
    if (query.includes('سود') || query.includes('ربوا') || query.includes('بینک') || query.includes('riba') || query.includes('interest')) {
      return "اسلام میں ربوا (سود) قطعی طور پر حرام اور کبیرہ گناہ ہے۔ بینک کے فکسڈ منافع والے روایتی کھاتے جائز نہیں۔ اس کے متبادل اسلامی بینکنگ کے مضاربہ یا مشارکہ پر مبنی حلال نفع و نقصان والے اکاؤنٹس استعمال کیے جا سکتے ہیں۔";
    }
    if (query.includes('اسٹاک') || query.includes('شیئر') || query.includes('کرپٹو') || query.includes('stock')) {
      return "اسٹاک مارکیٹ میں سرمایہ کاری کے لیے 4 شرعی شرائط ہیں: 1) کمپنی کا بنیادی کاروبار حلال ہو۔ 2) سود پر مبنی قرض کل اثاثوں کے 33٪ سے کم ہو۔ 3) غیر شرعی سرمایہ کاری 33٪ سے کم ہو۔ 4) غیر شرعی آمدن 5٪ سے کم ہو اور اسے بلا نیتِ ثواب صدقہ کیا جائے۔";
    }
    if (query.includes('مضاربہ') || query.includes('مشارکہ')) {
      return "مضاربہ میں ایک فریق سرمایہ (رب المال) اور دوسرا فریق محنت و مہارت (مضارب) فراہم کرتا ہے۔ منافع طے شدہ تناسب سے تقسیم ہوتا ہے جبکہ مالی نقصان صرف سرمایہ دار برداشت کرتا ہے۔";
    }
    return "اسلامی معیشت کی بنیاد عدل، شفافیت اور نفع و نقصان کی منصفانہ شراکت پر ہے۔ شریعت میں دھوکہ (غرر)، جوا (میسر) اور سود (ربوا) سے پاک حلال روزی کمانے کی تلقین کی گئی ہے۔";
  } else if (lang === 'ar') {
    return "في الفقه المالي الإسلامي، القاعدة الأساسية هي حلّ البيع وتحريم الربا والغرر. يجب أن تكون المعاملات قائمة على العدل والمشاركة الحقيقية في الربح والخسارة.";
  } else if (lang === 'ps') {
    if (query.includes('زکات') || query.includes('نصاب') || query.includes('سرو زرو') || query.includes('سپینو') || query.includes('zakat')) {
      return "د اسلامي شریعت له مخې زکات د ۲.۵٪ په کچه د سپینو زرو په نصاب (۵۹۵ ګرامه ~ ۱۸۴،۴۵۰ روپۍ) یا د سرو زرو په نصاب (۸۷.۴۸ ګرامه) باندې چې یو بشپړ کال پرې تېر شي، فرض دی. پورونه او لومړنۍ اړتیاوې ترې منفي کیږي.";
    }
    if (query.includes('سود') || query.includes('ربوا') || query.includes('بانک') || query.includes('ګټه') || query.includes('riba') || query.includes('interest')) {
      return "په اسلام کې سود (ربوا) قطعي حرام دی او لویه ګناه ده. د دودیزو بانکونو ثابته ګټه سود ګڼل کیږي. د دې پر ځای د اسلامي بانکدارۍ د مضاربت او مشارکت حلالې لارې چارې کارول پکار دي.";
    }
    if (query.includes('اسهام') || query.includes('سټاک') || query.includes('شرکت') || query.includes('تجارت') || query.includes('stock')) {
      return "په حلالو سټاکونو کې پانګونه د شرعي اصولو (AAOIFI) سره سم روا ده، په دې شرط چې د شرکت اصلي کاروبار حلال وي او غیر شرعي پورونه یې تر ۳۳٪ کم وي.";
    }
    if (query.includes('مضاربت') || query.includes('مشارکت') || query.includes('مضاربه')) {
      return "په مضاربت کې یو لوری پانګه (رب المال) او بل لوری کار او مهارت (مضارب) وړاندې کوي. ګټه په ټاکل شوې سلنه وېشل کیږي او مالي زیان یوازې د پانګوال پر غاړه وي.";
    }
    return "اسلامي اقتصاد د عدل، امانتدارۍ او د ګټې او زیان د عادلانه شراکت پر بنسټ ولاړ دی. په شریعت کې له غرر، جوارۍ او سود څخه د پاکې حلالې ګټې امر شوی دی.";
  } else {
    return "According to Islamic Jurisprudence (Fiqh al-Muamalat) and AAOIFI standards, all transactions must be free from Riba (usury/interest), Gharar (excessive ambiguity), and Maysir (gambling). Profit must be earned in proportion to risk and asset ownership.";
  }
}

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
  });
}

start();
