import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID;
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2";
const REQUESTED_STAGE = process.argv.find((arg) => arg.startsWith("--stage="))?.split("=")[1];
const FORCE_RECREATE = process.argv.includes("--force");
const REQUEST_TIMEOUT_MS = Number(process.env.ELEVENLABS_TIMEOUT_MS || 45000);
const MAX_RETRIES = Number(process.env.ELEVENLABS_RETRIES || 3);

const lessons = [
  ["stage-2", [["اَ", "a"], ["اُو", "uu"], ["اِي", "ii"], ["بَ", "ba"], ["بَا", "baa"], ["بِي", "bii"], ["بُو", "buu"], ["اَبْ", "ab"]]],
  ["stage-3", [["آ", "aa"], ["ءَ", "a"], ["أَ", "a"], ["إِ", "i"], ["بَّ", "bba"], ["بُّ", "bbu"], ["بِّي", "bbii"], ["ءَا", "aa"]]],
  ["stage-4", [
    ["تُوتٌ", "tutun"], ["بَيْتٌ", "baytun"], ["ثَابِتٌ", "thaabitun"], ["إِثْبَاتٌ", "ithbaatun"],
    ["تَ", "ta"], ["تِ", "ti"], ["تُ", "tu"], ["تَا", "taa"], ["تِي", "tii"], ["تُو", "tuu"],
    ["أَتْ", "at"], ["إِتْ", "it"], ["أُتْ", "ut"],
    ["ثَ", "sa"], ["ثِ", "si"], ["ثُ", "su"], ["ثَا", "saa"], ["ثِي", "sii"], ["ثُو", "suu"],
    ["أَثْ", "as"], ["إِثْ", "is"], ["أُثْ", "us"],
    ["تَوْبًا", "tawban"], ["ثَوْبًا", "sawban"], ["تُوتًا", "tuutan"],
    ["بُيُوتٌ", "buyuutun"], ["ثَبَتَ", "sabata"], ["إِثْبَاتٌ", "isbaatun"]
  ]],
  ["stage-5", [["أَخٌ", "akhun"], ["أَجَابَ", "ajaaba"], ["تَحْتَ", "tahta"], ["أُخْتٌ", "ukhtun"]]],
  ["stage-6", [["ذُبَابٌ", "zubaabun"], ["أَخَذَ", "akhaza"], ["أَدَبٌ", "adabun"], ["أَحَدٌ", "ahadun"]]],
  ["stage-7", [["خَبَرٌ", "khabarun"], ["رِيحٌ", "riihun"], ["خُبْزٌ", "khubzun"], ["أَرُزٌّ", "aruzzun"]]],
  ["stage-8", [["دَرْسٌ", "darsun"], ["سِتٌّ", "sittun"], ["بَشَرٌ", "basharun"], ["شَرِبَ", "shariba"]]],
  ["stage-9", [["أَرْضٌ", "ardun"], ["ضَرَبَ", "daraba"], ["صَبْرٌ", "sabrun"], ["بَصِيرٌ", "basiirun"]]],
  ["stage-10", [["خَطَرٌ", "khatarun"], ["نَظَرَ", "nazara"], ["طَبِيبٌ", "tabiibun"], ["صِرَاطٌ", "siraatun"]]],
  ["stage-11", [["غُرَابٌ", "ghuraabun"], ["صَغِيرٌ", "saghiirun"], ["عَبْدٌ", "abdun"], ["عِنَبٌ", "inabun"]]],
  ["stage-12", [["سَفَرٌ", "safarun"], ["فَقِيرٌ", "faqiirun"], ["قَامُوسٌ", "qaamuusun"], ["قَفَصٌ", "qafasun"]]],
  ["stage-13", [["كَلْبٌ", "kalbun"], ["كِتَابٌ", "kitaabun"], ["لَبَنٌ", "labanun"], ["لَيْلٌ", "laylun"]]],
  ["stage-14", [["مَكْتَبٌ", "maktabun"], ["بِنْتٌ", "bintun"], ["بَنْكٌ", "bankun"], ["مَنْزِلٌ", "manzilun"]]],
  ["stage-15", [["هُوَ", "huwa"], ["هِيَ", "hiya"], ["هُمْ", "hum"], ["هُنَّ", "hunna"]]],
];

if (!API_KEY || !VOICE_ID) {
  console.error("ELEVENLABS_API_KEY va ELEVENLABS_VOICE_ID kerak.");
  console.error("PowerShell namunasi:");
  console.error('$env:ELEVENLABS_API_KEY="API_KALIT"; $env:ELEVENLABS_VOICE_ID="VOICE_ID"; node tools/generate-reading-audio.mjs');
  process.exit(1);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fileExists(file) {
  try {
    const info = await stat(file);
    return info.size > 0;
  } catch {
    return false;
  }
}

async function createSpeech(text) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: MODEL_ID,
        language_code: "ar",
        voice_settings: {
          stability: 0.72,
          similarity_boost: 0.78,
          style: 0.18,
          use_speaker_boost: true,
        },
      }),
    });
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`ElevenLabs xatosi (${response.status}): ${detail}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

async function createSpeechWithRetry(text) {
  let lastError;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      return await createSpeech(text);
    } catch (error) {
      lastError = error;
      console.warn(`Urinish ${attempt}/${MAX_RETRIES} muvaffaqiyatsiz: ${error.message}`);
      if (attempt < MAX_RETRIES) await wait(1500 * attempt);
    }
  }
  throw lastError;
}

const selectedLessons = REQUESTED_STAGE
  ? lessons.filter(([stageId]) => stageId === REQUESTED_STAGE)
  : lessons;

if (REQUESTED_STAGE && selectedLessons.length === 0) {
  console.error(`Bunday dars topilmadi: ${REQUESTED_STAGE}`);
  console.error(`Mavjud darslar: ${lessons.map(([stageId]) => stageId).join(", ")}`);
  process.exit(1);
}

for (const [stageId, words] of selectedLessons) {
  const dir = path.join("assets", "reading", stageId);
  await mkdir(dir, { recursive: true });

  for (const [index, [word, transliteration]] of words.entries()) {
    const file = path.join(dir, `word-${String(index + 1).padStart(2, "0")}.mp3`);
    if (!FORCE_RECREATE && await fileExists(file)) {
      console.log(`skip ${stageId} · ${word} (${transliteration}) → ${file}`);
      continue;
    }
    console.log(`${stageId} · ${word} (${transliteration}) → ${file}`);
    const audio = await createSpeechWithRetry(word);
    await writeFile(file, audio);
  }
}

console.log("Barcha o‘qish mashqlari audiolari yaratildi.");
