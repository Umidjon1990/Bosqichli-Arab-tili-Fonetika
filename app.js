const screen = document.querySelector("#screen");
const progressWrap = document.querySelector("#progressWrap");
const progressBar = document.querySelector("#progressBar");
const progressLabel = document.querySelector("#progressLabel");
const scoreLabel = document.querySelector("#scoreLabel");
const homeButton = document.querySelector("#homeButton");
const effectButton = document.querySelector("#effectButton");
const toast = document.querySelector("#toast");

const state = {
  mode: "stage1",
  step: 0,
  score: 0,
  correct: 0,
  attempts: 0,
  streak: 0,
  soundEffects: true,
  mistakes: {},
  completed: new Set(),
};

const totalSteps = 9;
const totalActivities = 51;
const stage2Sections = 9;
const stage2Activities = 86;
const arabicLetters = ["ا","ب","ت","ث","ج","ح","خ","د","ذ","ر","ز","س","ش","ص","ض","ط","ظ","ع","غ","ف","ق","ك","ل","م","ن","و","ه","ي"];

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function playEffect(type) {
  if (!state.soundEffects) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  const context = playEffect.context || (playEffect.context = new AudioContextClass());
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.connect(gain);
  gain.connect(context.destination);
  const now = context.currentTime;

  if (type === "correct") {
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(620, now);
    oscillator.frequency.exponentialRampToValueAtTime(930, now + 0.12);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
    oscillator.start(now);
    oscillator.stop(now + 0.21);
  } else {
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(190, now);
    oscillator.frequency.exponentialRampToValueAtTime(125, now + 0.16);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.13, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    oscillator.start(now);
    oscillator.stop(now + 0.23);
  }
}

function updateChrome() {
  const active = state.mode === "stage2" || (state.step > 0 && state.step < totalSteps);
  progressWrap.classList.toggle("hidden", !active);
  homeButton.classList.toggle("hidden", state.mode === "stage1" && state.step === 0);
  if (state.mode === "stage2") {
    progressLabel.textContent = `${Math.min(state.step + 1, stage2Sections)} / ${stage2Sections} BO‘LIM · ${stage2Activities} TOPSHIRIQ`;
    progressBar.style.width = `${Math.min(100, ((state.step + 1) / stage2Sections) * 100)}%`;
  } else {
    progressLabel.textContent = `${Math.min(state.step, totalSteps - 2)} / ${totalSteps - 2} BO‘LIM · ${totalActivities} TOPSHIRIQ`;
    progressBar.style.width = `${Math.max(0, ((state.step - 1) / (totalSteps - 2)) * 100)}%`;
  }
  scoreLabel.textContent = `${state.score} BALL · ${state.streak} 🔥`;
}

function render(html) {
  screen.innerHTML = `<div class="screen-content">${html}</div>`;
  updateChrome();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2500);
}

function reward(id, points = 10) {
  state.attempts += 1;
  if (!state.completed.has(id)) {
    const errors = state.mistakes[id] || 0;
    const earned = errors === 0 ? points : Math.max(3, points - errors * 3);
    state.completed.add(id);
    state.score += earned;
    state.correct += 1;
    state.streak += 1;
    playEffect("correct");
    showFloatingScore(`+${earned}`);
  }
  updateChrome();
}

function miss(message, id = "general") {
  state.attempts += 1;
  state.streak = 0;
  state.mistakes[id] = (state.mistakes[id] || 0) + 1;
  playEffect("wrong");
  showToast(message);
  updateChrome();
}

function showFloatingScore(text) {
  const badge = document.createElement("div");
  badge.className = "floating-score";
  badge.textContent = text;
  document.body.appendChild(badge);
  setTimeout(() => badge.remove(), 900);
}

function next() {
  state.step = Math.min(state.step + 1, totalSteps);
  renderStep();
}

function goHome() {
  state.mode = "stage1";
  state.step = 0;
  renderStep();
}

function bindNext(id = "nextButton") {
  document.querySelector(`#${id}`)?.addEventListener("click", next);
}

function heroScreen() {
  render(`
    <div class="hero">
      <div>
        <p class="eyebrow">1-game bo‘limi</p>
        <h1>Arab yozuvi sirlariga kirish</h1>
        <p class="lead">Arab tili, alifbo, qisqa unlilar va tanvin bilan ilk interaktiv sayohat. Bu bosqich faqat kitobning 4–8-slaydlariga asoslangan.</p>
        <div class="button-row">
          <button id="startButton" class="primary-button" type="button">Sayohatni boshlash</button>
          <button id="stage2Button" class="secondary-button" type="button">2-bosqich: Alif · Vov · Ya · Ba</button>
          <button id="aboutButton" class="secondary-button" type="button">Nimalarni o‘rganaman?</button>
        </div>
      </div>
      <div class="manuscript" aria-hidden="true">
        <div class="book">
          <div class="page">ع</div>
          <div class="page">ض</div>
        </div>
      </div>
    </div>
  `);

  document.querySelector("#startButton").addEventListener("click", next);
  document.querySelector("#stage2Button").addEventListener("click", () => {
    state.mode = "stage2";
    state.step = 0;
    state.score = 0;
    state.correct = 0;
    state.attempts = 0;
    state.streak = 0;
    state.mistakes = {};
    state.completed.clear();
    renderStage2();
  });
  document.querySelector("#aboutButton").addEventListener("click", () => {
    showToast("Yozuv yo‘nalishi, 28 harf, harakatlar, sukun va tanvin.");
  });
}

function directionScreen() {
  render(`
    <div class="lesson-layout">
      <div>
        <p class="eyebrow">1-xona · Yo‘nalish</p>
        <h2>Qalam qaysi tomonga yuradi?</h2>
        <p class="lead">Arab yozuvi o‘ng tomondan boshlanib, chap tomonga qarab davom etadi. Qalamni chapga suring.</p>
        <div id="directionFeedback" class="feedback-panel">Qalamni ushlab, yo‘l bo‘ylab chapga olib boring.</div>
      </div>
      <div class="mission-card">
        <div id="directionStage" class="direction-stage">
          <div class="direction-path"></div>
          <div id="inkLine" class="ink-line"></div>
          <button id="pen" class="pen" type="button" aria-label="Qalamni chapga suring">✒</button>
        </div>
        <div class="button-row" style="margin-top:18px; justify-content:flex-end">
          <button id="nextButton" class="primary-button hidden" type="button">Davom etish</button>
        </div>
      </div>
    </div>
  `);

  const stage = document.querySelector("#directionStage");
  const pen = document.querySelector("#pen");
  const line = document.querySelector("#inkLine");
  const feedback = document.querySelector("#directionFeedback");
  let dragging = false;

  const movePen = (clientX) => {
    const rect = stage.getBoundingClientRect();
    const min = 16;
    const max = rect.width - pen.offsetWidth - 16;
    const x = Math.max(min, Math.min(max, clientX - rect.left - pen.offsetWidth / 2));
    pen.style.right = "auto";
    pen.style.left = `${x}px`;
    const travelled = max - x;
    line.style.width = `${Math.max(0, travelled)}px`;
    if (x < rect.width * 0.24) {
      reward("direction", 15);
      feedback.textContent = "Ajoyib! Arab yozuvi o‘ngdan chapga yoziladi.";
      document.querySelector("#nextButton").classList.remove("hidden");
      pen.style.pointerEvents = "none";
    }
  };

  pen.addEventListener("pointerdown", (event) => {
    dragging = true;
    pen.setPointerCapture(event.pointerId);
  });
  pen.addEventListener("pointermove", (event) => dragging && movePen(event.clientX));
  pen.addEventListener("pointerup", () => { dragging = false; });
  bindNext();
}

function factsScreen() {
  const questions = [
    {
      question: "Arab alifbosi nechta harfdan iborat?",
      options: ["26 ta", "28 ta", "30 ta", "32 ta"],
      answer: "28 ta",
      feedback: "Arab alifbosi 28 ta harfdan iborat."
    },
    {
      question: "Arab yozuvi qaysi yo‘nalishda yoziladi?",
      options: ["Chapdan o‘ngga", "O‘ngdan chapga", "Yuqoridan pastga", "Pastdan yuqoriga"],
      answer: "O‘ngdan chapga",
      feedback: "Arab yozuvi o‘ng tomondan boshlanib chapga davom etadi."
    },
    {
      question: "Arab tilida katta va kichik harflar...",
      options: ["farqlanadi", "faqat so‘z boshida farqlanadi", "farqlanmaydi", "faqat ismlarda farqlanadi"],
      answer: "farqlanmaydi",
      feedback: "Arab yozuvida katta-kichik harf tizimi mavjud emas."
    },
    {
      question: "Arab tili qaysi tillar oilasiga mansub?",
      options: ["Turkiy", "Somiy", "Roman", "Slavyan"],
      answer: "Somiy",
      feedback: "Arab tili somiy tillar oilasiga mansub."
    },
    {
      question: "Arab tili BMTning rasmiy tillaridan birimi?",
      options: ["Ha", "Yo‘q", "Faqat tarixda bo‘lgan", "Faqat ayrim davlatlarda"],
      answer: "Ha",
      feedback: "Arab tili BMTning oltita rasmiy tilidan biridir."
    },
    {
      question: "Rasmiy nutq va ilmiy matnlarda asosan qaysi shakl ishlatiladi?",
      options: ["Adabiy arab tili", "Mahalliy lahja", "Faqat og‘zaki til", "Aralash yozuv"],
      answer: "Adabiy arab tili",
      feedback: "Adabiy arab tili rasmiy nutq va ilmiy matnlarda ishlatiladi."
    },
    {
      question: "Mahalliy so‘zlashuv shakllari nima deb ataladi?",
      options: ["Harakatlar", "Tanvinlar", "Lahjalar", "Maxrajlar"],
      answer: "Lahjalar",
      feedback: "Har bir hududdagi mahalliy so‘zlashuv shakli lahja deyiladi."
    },
    {
      question: "Qisqa unlilar arab yozuvida qanday ifodalanadi?",
      options: ["Katta harflar bilan", "Harakat belgilari bilan", "Raqamlar bilan", "Nuqtalar soni bilan"],
      answer: "Harakat belgilari bilan",
      feedback: "Qisqa unlilar fatha, kasra va damma kabi harakatlar bilan ifodalanadi."
    }
  ];
  let index = 0;

  const body = () => {
    const q = questions[index];
    return `
      <div>
        <p class="eyebrow">2-xona · Arab tili dunyosi</p>
        <h2>${q.question}</h2>
        <p class="lead">${index + 1} / ${questions.length} · To‘g‘ri javobni tanlang.</p>
        <div class="answer-grid">
          ${shuffle(q.options).map((option) => `<button class="answer-card" data-option="${option}" type="button">${option}</button>`).join("")}
        </div>
        <div id="factsFeedback" class="feedback-panel">Kitobning kirish qismidagi ma’lumotni eslang.</div>
      </div>
    `;
  };

  render(body());
  const bind = () => {
    document.querySelectorAll(".answer-card").forEach((button) => {
      button.addEventListener("click", () => {
        const q = questions[index];
        if (button.dataset.option === q.answer) {
          button.classList.add("correct");
          reward(`fact-${index}`, 7);
          document.querySelector("#factsFeedback").textContent = q.feedback;
          setTimeout(() => {
            index += 1;
            if (index >= questions.length) {
              next();
            } else {
              screen.querySelector(".screen-content").innerHTML = body();
              bind();
            }
          }, 750);
        } else {
          button.classList.add("wrong");
          miss(q.feedback);
          setTimeout(() => button.classList.remove("wrong"), 500);
        }
      });
    });
  };
  bind();
}

function alphabetScreen() {
  const ring = arabicLetters.map((letter, index) => {
    const angle = `${(360 / arabicLetters.length) * index}deg`;
    return `<span class="letter-chip" style="--angle:${angle}">${letter}</span>`;
  }).join("");

  const questions = [
    {
      question: "Arab alifbosida nechta harf bor?",
      options: ["24", "26", "28", "30"],
      answer: "28",
      feedback: "To‘g‘ri: 28 ta harf."
    },
    {
      question: "Harfning mustaqil yozilgan holati nima deyiladi?",
      options: ["Alohida", "So‘z boshida", "So‘z o‘rtasida", "So‘z oxirida"],
      answer: "Alohida",
      feedback: "Mustaqil turgan harf alohida shakl hisoblanadi."
    },
    {
      question: "Harf so‘zning birinchi o‘rnida kelsa, bu qaysi holat?",
      options: ["Alohida", "So‘z boshida", "So‘z o‘rtasida", "So‘z oxirida"],
      answer: "So‘z boshida",
      feedback: "Birinchi o‘rindagi ko‘rinish — so‘z boshidagi shakl."
    },
    {
      question: "Harf ikki tomondagi harflar orasida kelsa, bu qaysi holat?",
      options: ["Alohida", "So‘z boshida", "So‘z o‘rtasida", "So‘z oxirida"],
      answer: "So‘z o‘rtasida",
      feedback: "Ikki harf orasidagi ko‘rinish — so‘z o‘rtasidagi shakl."
    },
    {
      question: "Harf so‘zning yakunida kelsa, bu qaysi holat?",
      options: ["Alohida", "So‘z boshida", "So‘z o‘rtasida", "So‘z oxirida"],
      answer: "So‘z oxirida",
      feedback: "So‘z yakunidagi ko‘rinish — so‘z oxiridagi shakl."
    },
    {
      question: "Har bir arab harfi doimo faqat bitta ko‘rinishda yoziladimi?",
      options: ["Ha", "Yo‘q", "Faqat katta harflar", "Faqat kichik harflar"],
      answer: "Yo‘q",
      feedback: "Harf so‘zdagi o‘rniga qarab bir necha ko‘rinishda yozilishi mumkin."
    }
  ];
  let index = 0;

  const body = () => `
    <div class="lesson-layout">
      <div>
        <p class="eyebrow">3-xona · Alifbo panoramasi</p>
        <h2>${questions[index].question}</h2>
        <p class="lead">${index + 1} / ${questions.length} · Harflarning nomi hali test qilinmaydi.</p>
        <div class="answer-grid">
          ${shuffle(questions[index].options).map((option) => `<button class="answer-card" data-option="${option}" type="button">${option}</button>`).join("")}
        </div>
        <div id="alphabetFeedback" class="feedback-panel">To‘g‘ri sonni tanlang.</div>
      </div>
      <div class="alphabet-orbit" aria-label="28 ta arab harfi panoramasi">
        <div class="letters-ring">${ring}</div>
        <div class="alphabet-core"><div><strong>28</strong><span>ta harf</span></div></div>
      </div>
    </div>
  `;

  render(body());

  const bind = () => {
    document.querySelectorAll(".answer-card").forEach((button) => {
      button.addEventListener("click", () => {
        const q = questions[index];
        if (button.dataset.option === q.answer) {
          button.classList.add("correct");
          reward(`alphabet-${index}`, 7);
          document.querySelector("#alphabetFeedback").textContent = q.feedback;
          setTimeout(() => {
            index += 1;
            if (index >= questions.length) {
              next();
            } else {
              screen.querySelector(".screen-content").innerHTML = body();
              bind();
            }
          }, 750);
        } else {
          button.classList.add("wrong");
          miss(q.feedback);
          setTimeout(() => button.classList.remove("wrong"), 500);
        }
      });
    });
  };
  bind();
}

function formsScreen() {
  const stages = ["Alohida", "So‘z boshida", "So‘z o‘rtasida", "So‘z oxirida"];
  const shuffled = shuffle(stages);

  render(`
    <div>
      <p class="eyebrow">4-xona · Harf shakllari</p>
      <h2>To‘rt bekatni tartiblang</h2>
      <p class="lead">Harf so‘zdagi o‘rniga qarab turli ko‘rinishda yozilishi mumkin. Kartalarni to‘g‘ri ketma-ketlikda bosing.</p>
      <div id="stageGrid" class="stage-grid" style="grid-template-columns:repeat(2,minmax(0,1fr))">
        ${shuffled.map((item) => `<button class="stage-card" data-stage="${item}" type="button"><strong>${item}</strong><span>Bekatni tanlash</span></button>`).join("")}
      </div>
      <div id="sequence" class="feedback-panel">Ketma-ketlik: —</div>
      <div class="button-row" style="margin-top:18px; justify-content:space-between">
        <button id="resetSequence" class="secondary-button" type="button">Qayta boshlash</button>
        <button id="nextButton" class="primary-button hidden" type="button">Harakatlar ustaxonasiga o‘tish</button>
      </div>
    </div>
  `);

  let position = 0;
  const sequence = document.querySelector("#sequence");
  const reset = () => {
    position = 0;
    document.querySelectorAll(".stage-card").forEach((card) => {
      card.disabled = false;
      card.classList.remove("correct", "wrong");
      card.querySelector("span").textContent = "Bekatni tanlash";
    });
    sequence.textContent = "Ketma-ketlik: —";
  };

  document.querySelectorAll(".stage-card").forEach((card) => {
    card.addEventListener("click", () => {
      if (card.dataset.stage === stages[position]) {
        card.disabled = true;
        card.classList.add("correct");
        card.querySelector("span").textContent = `${position + 1}-bekat`;
        position += 1;
        sequence.textContent = `Ketma-ketlik: ${stages.slice(0, position).join(" → ")}`;
        reward(`form-${position}`, 5);
        if (position === stages.length) {
          sequence.textContent += ". Mukammal!";
          setTimeout(next, 900);
        }
      } else {
        card.classList.add("wrong");
        miss(`Avval “${stages[position]}” holatini toping.`);
        setTimeout(() => card.classList.remove("wrong"), 500);
      }
    });
  });

  document.querySelector("#resetSequence").addEventListener("click", reset);
}

function vowelScreen() {
  const questions = [
    { prompt: "◌َ belgisi qanday nomlanadi?", symbol: "◌َ", options: ["Fatha", "Kasra", "Damma", "Sukun"], answer: "Fatha", feedback: "◌َ — fatha." },
    { prompt: "◌ِ belgisi qanday nomlanadi?", symbol: "◌ِ", options: ["Fatha", "Kasra", "Damma", "Sukun"], answer: "Kasra", feedback: "◌ِ — kasra." },
    { prompt: "◌ُ belgisi qanday nomlanadi?", symbol: "◌ُ", options: ["Fatha", "Kasra", "Damma", "Sukun"], answer: "Damma", feedback: "◌ُ — damma." },
    { prompt: "◌ْ belgisi qanday nomlanadi?", symbol: "◌ْ", options: ["Fatha", "Kasra", "Damma", "Sukun"], answer: "Sukun", feedback: "◌ْ — sukun." },
    { prompt: "Fatha qaysi qisqa tovushni bildiradi?", symbol: "◌َ", options: ["a", "i", "u", "unlisiz"], answer: "a", feedback: "Fatha qisqa “a” tovushini bildiradi." },
    { prompt: "Kasra qaysi qisqa tovushni bildiradi?", symbol: "◌ِ", options: ["a", "i", "u", "unlisiz"], answer: "i", feedback: "Kasra qisqa “i” tovushini bildiradi." },
    { prompt: "Damma qaysi qisqa tovushni bildiradi?", symbol: "◌ُ", options: ["a", "i", "u", "unlisiz"], answer: "u", feedback: "Damma qisqa “u” tovushini bildiradi." },
    { prompt: "Qaysi belgi harfni unlisiz qiladi?", symbol: "◌ْ", options: ["Fatha", "Kasra", "Damma", "Sukun"], answer: "Sukun", feedback: "Sukun harfni unlisiz, sokin holatda bildiradi." },
    { prompt: "Fatha harfning qayerida yoziladi?", symbol: "◌َ", options: ["Yuqorisida", "Pastida", "Yonida", "Ichida"], answer: "Yuqorisida", feedback: "Fatha harfning yuqorisida yoziladi." },
    { prompt: "Kasra harfning qayerida yoziladi?", symbol: "◌ِ", options: ["Yuqorisida", "Pastida", "Yonida", "Ichida"], answer: "Pastida", feedback: "Kasra harfning pastida yoziladi." },
    { prompt: "Damma harfning qayerida yoziladi?", symbol: "◌ُ", options: ["Yuqorisida", "Pastida", "Yonida", "Ichida"], answer: "Yuqorisida", feedback: "Damma harfning yuqorisida yoziladi." },
    { prompt: "Sukun harfning qayerida yoziladi?", symbol: "◌ْ", options: ["Yuqorisida", "Pastida", "Yonida", "Ichida"], answer: "Yuqorisida", feedback: "Sukun harfning yuqorisida yoziladi." },
  ];
  let index = 0;

  const body = () => `
    <div class="symbol-stage">
      <div id="symbolDisplay" class="symbol-display arabic">${questions[index].symbol}</div>
      <div>
        <p class="eyebrow">5-xona · Harakatlar ustaxonasi</p>
        <h2>${questions[index].prompt}</h2>
        <p class="lead">${index + 1} / ${questions.length} · Nom, tovush va joylashuvni mustahkamlang.</p>
        <div class="option-grid">
          ${shuffle(questions[index].options).map((option) => `<button class="option-button" data-option="${option}" type="button"><strong>${option}</strong><span>Javob</span></button>`).join("")}
        </div>
        <div id="vowelFeedback" class="feedback-panel">${index + 1} / ${questions.length} · Belgini diqqat bilan kuzating.</div>
      </div>
    </div>
  `;

  render(body());

  const bind = () => {
    document.querySelectorAll(".option-button").forEach((button) => {
      button.addEventListener("click", () => {
        const q = questions[index];
        if (button.dataset.option === q.answer) {
          button.classList.add("correct");
          reward(`vowel-${index}`, 7);
          document.querySelector("#vowelFeedback").textContent = q.feedback;
          setTimeout(() => {
            index += 1;
            if (index >= questions.length) {
              state.step += 1;
              renderStep();
            } else {
              screen.querySelector(".screen-content").innerHTML = body();
              bind();
            }
          }, 850);
        } else {
          button.classList.add("wrong");
          miss(q.feedback);
          setTimeout(() => button.classList.remove("wrong"), 500);
        }
      });
    });
  };
  bind();
}

function tanwinScreen() {
  const items = [
    { prompt: "◌ً belgisi qanday nomlanadi?", symbol: "◌ً", options: ["Ikki fatha", "Ikki kasra", "Ikki damma"], answer: "Ikki fatha", feedback: "◌ً — ikki fatha." },
    { prompt: "◌ٍ belgisi qanday nomlanadi?", symbol: "◌ٍ", options: ["Ikki fatha", "Ikki kasra", "Ikki damma"], answer: "Ikki kasra", feedback: "◌ٍ — ikki kasra." },
    { prompt: "◌ٌ belgisi qanday nomlanadi?", symbol: "◌ٌ", options: ["Ikki fatha", "Ikki kasra", "Ikki damma"], answer: "Ikki damma", feedback: "◌ٌ — ikki damma." },
    { prompt: "Ikki fatha qanday yozma tovush bilan ifodalanadi?", symbol: "◌ً", options: ["an", "in", "un"], answer: "an", feedback: "Ikki fatha “an” deb ifodalanadi." },
    { prompt: "Ikki kasra qanday yozma tovush bilan ifodalanadi?", symbol: "◌ٍ", options: ["an", "in", "un"], answer: "in", feedback: "Ikki kasra “in” deb ifodalanadi." },
    { prompt: "Ikki damma qanday yozma tovush bilan ifodalanadi?", symbol: "◌ٌ", options: ["an", "in", "un"], answer: "un", feedback: "Ikki damma “un” deb ifodalanadi." },
    { prompt: "Ikki fatha qayerda yoziladi?", symbol: "◌ً", options: ["Harf yuqorisida", "Harf pastida", "Harf yonida"], answer: "Harf yuqorisida", feedback: "Ikki fatha harfning yuqorisida yoziladi." },
    { prompt: "Ikki kasra qayerda yoziladi?", symbol: "◌ٍ", options: ["Harf yuqorisida", "Harf pastida", "Harf yonida"], answer: "Harf pastida", feedback: "Ikki kasra harfning pastida yoziladi." },
    { prompt: "Ikki damma qayerda yoziladi?", symbol: "◌ٌ", options: ["Harf yuqorisida", "Harf pastida", "Harf yonida"], answer: "Harf yuqorisida", feedback: "Ikki damma harfning yuqorisida yoziladi." },
    { prompt: "Tanvin odatda so‘zning qayerida keladi?", symbol: "◌ً", options: ["Boshida", "O‘rtasida", "Oxirida"], answer: "Oxirida", feedback: "Tanvin odatda so‘z oxirida keladi." },
    { prompt: "Tanvin talaffuzida qaysi qo‘shimcha tovush seziladi?", symbol: "◌ٌ", options: ["n", "m", "y"], answer: "n", feedback: "Tanvin talaffuzida “n” tovushi eshitiladi." },
    { prompt: "Tanvin nechta harakat belgisidan tashkil topadi?", symbol: "◌ٍ", options: ["Bitta", "Ikkita", "Uchta"], answer: "Ikkita", feedback: "Tanvin — ikkita harakatli belgi." },
  ];
  let index = 0;

  const body = () => `
    <div class="symbol-stage">
      <div id="symbolDisplay" class="symbol-display arabic">${items[index].symbol}</div>
      <div>
        <p class="eyebrow">6-xona · Tanvin laboratoriyasi</p>
        <h2>${items[index].prompt}</h2>
        <p class="lead">${index + 1} / ${items.length} · Tanvinni har tomonlama mustahkamlang.</p>
        <div class="option-grid">
          ${shuffle(items[index].options).map((option) => `<button class="option-button" data-option="${option}" type="button"><strong>${option}</strong><span>Javob</span></button>`).join("")}
        </div>
        <div id="tanwinFeedback" class="feedback-panel">${index + 1} / ${items.length} · Tovushni tanlang.</div>
      </div>
    </div>
  `;

  render(body());

  const bind = () => {
    document.querySelectorAll(".option-button").forEach((button) => {
      button.addEventListener("click", () => {
        const item = items[index];
        if (button.dataset.option === item.answer) {
          button.classList.add("correct");
          reward(`tanwin-${index}`, 7);
          document.querySelector("#tanwinFeedback").textContent = item.feedback;
          setTimeout(() => {
            index += 1;
            if (index >= items.length) {
              state.step += 1;
              renderStep();
            } else {
              screen.querySelector(".screen-content").innerHTML = body();
              bind();
            }
          }, 850);
        } else {
          button.classList.add("wrong");
          miss(item.feedback);
          setTimeout(() => button.classList.remove("wrong"), 500);
        }
      });
    });
  };
  bind();
}

function finalQuizScreen() {
  const questions = [
    { question: "Arab yozuvi qayerdan boshlanadi?", options: ["Chap tomondan", "O‘ng tomondan", "Markazdan"], answer: "O‘ng tomondan", feedback: "Arab yozuvi o‘ng tomondan boshlanadi." },
    { question: "Qisqa “a” qaysi harakat bilan ifodalanadi?", options: ["Fatha", "Kasra", "Damma", "Sukun"], answer: "Fatha", feedback: "Qisqa “a” — fatha." },
    { question: "Qisqa “i” qaysi harakat bilan ifodalanadi?", options: ["Fatha", "Kasra", "Damma", "Sukun"], answer: "Kasra", feedback: "Qisqa “i” — kasra." },
    { question: "Qisqa “u” qaysi harakat bilan ifodalanadi?", options: ["Fatha", "Kasra", "Damma", "Sukun"], answer: "Damma", feedback: "Qisqa “u” — damma." },
    { question: "◌ْ belgisi nimani bildiradi?", options: ["Qisqa a", "Qisqa i", "Qisqa u", "Unlisiz harf"], answer: "Unlisiz harf", feedback: "Sukun unlisiz harfni bildiradi." },
    { question: "“in” qaysi tanvinga tegishli?", options: ["Ikki fatha", "Ikki kasra", "Ikki damma"], answer: "Ikki kasra", feedback: "“in” — ikki kasra." },
    { question: "“un” qaysi tanvinga tegishli?", options: ["Ikki fatha", "Ikki kasra", "Ikki damma"], answer: "Ikki damma", feedback: "“un” — ikki damma." },
    { question: "Tanvin odatda qayerda keladi?", options: ["So‘z boshida", "So‘z o‘rtasida", "So‘z oxirida"], answer: "So‘z oxirida", feedback: "Tanvin odatda so‘z oxirida keladi." },
  ];
  let index = 0;

  const body = () => `
    <div class="result-layout">
      <p class="eyebrow" style="justify-content:center">7-xona · Yakuniy sinov</p>
      <h2>${questions[index].question}</h2>
      <p class="lead" style="margin-inline:auto">${index + 1} / ${questions.length} · Barcha o‘tilgan mavzular aralashmasi.</p>
      <div class="answer-grid" style="text-align:left">
        ${shuffle(questions[index].options).map((option) => `<button class="answer-card" data-option="${option}" type="button">${option}</button>`).join("")}
      </div>
      <div id="finalFeedback" class="feedback-panel" style="text-align:left">Javobni tanlang.</div>
    </div>
  `;

  render(body());
  const bind = () => {
    document.querySelectorAll(".answer-card").forEach((button) => {
      button.addEventListener("click", () => {
        const q = questions[index];
        if (button.dataset.option === q.answer) {
          button.classList.add("correct");
          reward(`final-${index}`, 10);
          document.querySelector("#finalFeedback").textContent = q.feedback;
          setTimeout(() => {
            index += 1;
            if (index >= questions.length) {
              next();
            } else {
              screen.querySelector(".screen-content").innerHTML = body();
              bind();
            }
          }, 750);
        } else {
          button.classList.add("wrong");
          miss(q.feedback);
          setTimeout(() => button.classList.remove("wrong"), 500);
        }
      });
    });
  };
  bind();
}

function runQuestionDeck(config) {
  let index = 0;
  const deck = config.questions;

  const body = () => {
    const q = deck[index];
    const choices = shuffle(q.options.map((value) => ({ value })));
    return `
      <div class="${config.layout || "lesson-layout"}">
        ${config.visual ? config.visual(q, index) : ""}
        <div class="mission-card question-mission">
          <p class="eyebrow">${config.eyebrow}</p>
          <h2>${q.question}</h2>
          ${q.note ? `<p class="lead">${q.note}</p>` : `<p class="lead">${index + 1} / ${deck.length} · Javoblar har safar aralashtiriladi.</p>`}
          <div class="answer-grid">
            ${choices.map((choice, choiceIndex) => `
              <button class="answer-card" data-choice="${choiceIndex}" data-value="${choice.value}" type="button">${choice.value}</button>
            `).join("")}
          </div>
          <div id="deckFeedback" class="feedback-panel">${config.prompt || "To‘g‘ri javobni tanlang."}</div>
        </div>
      </div>
    `;
  };

  render(body());

  const bind = () => {
    document.querySelectorAll(".answer-card").forEach((button) => {
      button.addEventListener("click", () => {
        const q = deck[index];
        const id = `${config.id}-${index}`;
        if (button.dataset.value === q.answer) {
          button.classList.add("correct");
          reward(id, q.points || 10);
          document.querySelector("#deckFeedback").textContent = q.feedback;
          setTimeout(() => {
            index += 1;
            if (index >= deck.length) {
              state.step += 1;
              renderStage2();
            } else {
              screen.querySelector(".screen-content").innerHTML = body();
              bind();
            }
          }, 720);
        } else {
          button.classList.add("wrong");
          miss(q.feedback, id);
          setTimeout(() => button.classList.remove("wrong"), 480);
        }
      });
    });
  };
  bind();
}

function stage2IntroScreen() {
  render(`
    <div class="stage2-hero">
      <div class="letter-constellation" aria-hidden="true">
        <span style="--x:8%;--y:18%;--d:.1s">ا</span>
        <span style="--x:63%;--y:8%;--d:.5s">و</span>
        <span style="--x:17%;--y:67%;--d:.9s">ي</span>
        <span style="--x:70%;--y:62%;--d:1.3s">ب</span>
        <div class="constellation-core">2</div>
      </div>
      <div>
        <p class="eyebrow">2-game · 9–14-slaydlar</p>
        <h1>To‘rtta harf ustaxonasi</h1>
        <p class="lead">Alif, Vov, Ya va Ba: maxrajni ko‘ring, shakllarni toping, harfni izidan yozing, ulanishni boshqaring va bo‘g‘inlarni o‘qing.</p>
        <div class="skill-pills">
          <span>Maxraj xaritasi</span><span>4 shakl</span><span>Tracing</span><span>Ulash</span><span>O‘qish</span>
        </div>
        <button id="stage2Start" class="primary-button" type="button">Ustaxonani ochish</button>
      </div>
    </div>
  `);
  document.querySelector("#stage2Start").addEventListener("click", () => {
    state.step = 1;
    renderStage2();
  });
}

function maxrajScreen() {
  const questions = [
    { question: "Alif mustaqil undosh tovushni ifodalaydimi?", options: ["Ha", "Yo‘q", "Faqat sukun bilan"], answer: "Yo‘q", feedback: "Alif mustaqil tovushni ifodalamaydi; asosan unli harakatlar bilan keladi." },
    { question: "Cho‘ziq unli holatida Alifning maxraji qayer?", options: ["Og‘iz bo‘shlig‘i", "Ikki lab", "Til uchi"], answer: "Og‘iz bo‘shlig‘i", feedback: "Cho‘ziq Alif og‘iz bo‘shlig‘idan chiqadi." },
    { question: "Vov undosh holatida qaysi a’zo ishtirok etadi?", options: ["Ikki lab", "Til va tanglay o‘rtasi", "Halqum tubi"], answer: "Ikki lab", feedback: "Vovning undosh maxraji — ikki lab." },
    { question: "Cho‘ziq unli Vovning maxraji qayer?", options: ["Og‘iz bo‘shlig‘i", "Burun", "Til uchi"], answer: "Og‘iz bo‘shlig‘i", feedback: "Cho‘ziq unli Vov og‘iz bo‘shlig‘iga mansub." },
    { question: "Ya undosh holatida qayerdan chiqadi?", options: ["Til va tanglay o‘rtasi", "Ikki lab", "Halqum yuqorisi"], answer: "Til va tanglay o‘rtasi", feedback: "Ya til va tanglay o‘rtasidan chiqadi." },
    { question: "Cho‘ziq unli Ya qaysi bo‘limga kiradi?", options: ["Og‘iz bo‘shlig‘i", "Lab", "Burun"], answer: "Og‘iz bo‘shlig‘i", feedback: "Cho‘ziq Ya og‘iz bo‘shlig‘idan chiqadi." },
    { question: "Ba harfining maxraji qayer?", options: ["Ikki lab", "Til va tanglay o‘rtasi", "Og‘iz bo‘shlig‘i"], answer: "Ikki lab", feedback: "Ba talaffuzida ikki lab birlashadi." },
    { question: "Bir xil maxraj guruhiga kiradigan juftlikni toping.", options: ["Vov va Ba", "Alif va Ba", "Ya va Ba"], answer: "Vov va Ba", feedback: "Vov va Ba talaffuzida lablar ishtirok etadi." },
  ];

  runQuestionDeck({
    id: "maxraj",
    eyebrow: "1-laboratoriya · Maxraj xaritasi",
    questions,
    visual: () => `
      <div class="mouth-map" aria-label="Maxrajlarning interaktiv xaritasi">
        <svg viewBox="0 0 520 360" role="img" aria-label="Og‘iz, lab va til maxraj xaritasi">
          <defs>
            <linearGradient id="mouthGlow" x1="0" x2="1">
              <stop stop-color="#f7dda0"/><stop offset="1" stop-color="#48c4b0"/>
            </linearGradient>
          </defs>
          <path class="head-line" d="M70 76c85-60 260-52 338 38 42 49 43 121 1 165-53 55-150 48-222 41-71-7-108-32-117-87-6-36 6-68 32-89-25-13-38-38-32-68Z"/>
          <path class="cavity-zone" d="M141 126c79-26 190-19 236 21-62 2-117 18-159 52-25-21-51-37-77-48Z"/>
          <path class="tongue-zone" d="M150 230c69-43 139-54 220-47-32 50-94 78-170 71Z"/>
          <ellipse class="lip-zone" cx="105" cy="177" rx="36" ry="24"/>
          <text x="285" y="135">Og‘iz bo‘shlig‘i</text>
          <text x="245" y="245">Til–tanglay</text>
          <text x="45" y="225">Ikki lab</text>
        </svg>
        <div class="maxraj-beams"><i></i><i></i><i></i></div>
      </div>
    `,
  });
}

function letterRulesScreen() {
  const questions = [
    { question: "Bu qaysi harf?  ا", options: ["Alif", "Vov", "Ya", "Ba"], answer: "Alif", feedback: "ا — Alif." },
    { question: "Alif nechta asosiy yozilish ko‘rinishiga ega?", options: ["Ikki", "Uch", "To‘rt"], answer: "Ikki", feedback: "Alif ikki ko‘rinishli harf." },
    { question: "Alif o‘zidan keyingi harfga ulanadimi?", options: ["Ulanadi", "Ulanmaydi", "Faqat kasrada"], answer: "Ulanmaydi", feedback: "Alif o‘zidan keyingi harfga qo‘shib yozilmaydi." },
    { question: "Bu qaysi harf?  و", options: ["Alif", "Vov", "Ya", "Ba"], answer: "Vov", feedback: "و — Vov." },
    { question: "Vov nechta asosiy ko‘rinishga ega?", options: ["Ikki", "Uch", "To‘rt"], answer: "Ikki", feedback: "Vov ikki ko‘rinishli harf." },
    { question: "Vov o‘zidan keyingi harfga ulanadimi?", options: ["Ulanadi", "Ulanmaydi", "Faqat dammada"], answer: "Ulanmaydi", feedback: "Vov o‘zidan keyingi harfga ulanmaydi." },
    { question: "Bu qaysi harf?  ي", options: ["Alif", "Vov", "Ya", "Ba"], answer: "Ya", feedback: "ي — Ya." },
    { question: "Ya nechta asosiy ko‘rinishga ega?", options: ["Ikki", "Uch", "To‘rt"], answer: "To‘rt", feedback: "Ya alohida, bosh, o‘rta va oxirgi shaklga ega." },
    { question: "Ya o‘zidan keyingi harfga ulanadimi?", options: ["Ulanadi", "Ulanmaydi", "Faqat sukun bilan"], answer: "Ulanadi", feedback: "Ya keyingi harfga qo‘shib yoziladi." },
    { question: "Bu qaysi harf?  ب", options: ["Alif", "Vov", "Ya", "Ba"], answer: "Ba", feedback: "ب — Ba." },
    { question: "Ba nechta asosiy ko‘rinishga ega?", options: ["Ikki", "Uch", "To‘rt"], answer: "To‘rt", feedback: "Ba to‘rt ko‘rinishli harf." },
    { question: "Ba o‘zidan keyingi harfga ulanadimi?", options: ["Ulanadi", "Ulanmaydi", "Faqat tanvin bilan"], answer: "Ulanadi", feedback: "Ba keyingi harfga qo‘shib yoziladi." },
    { question: "Barcha shakllari satr ustida qoladigan harf qaysi?", options: ["Ba", "Alif", "Vov"], answer: "Ba", feedback: "Ba harfining barcha shakllari satr ustida yoziladi." },
    { question: "Ikki ko‘rinishli harflar juftligini toping.", options: ["Alif va Vov", "Ya va Ba", "Alif va Ya"], answer: "Alif va Vov", feedback: "Alif va Vov ikki ko‘rinishli." },
    { question: "To‘rt ko‘rinishli harflar juftligini toping.", options: ["Ya va Ba", "Alif va Vov", "Vov va Ya"], answer: "Ya va Ba", feedback: "Ya va Ba to‘rt ko‘rinishli." },
    { question: "Keyingi harfga ulanadigan juftlik qaysi?", options: ["Ya va Ba", "Alif va Vov", "Alif va Ya"], answer: "Ya va Ba", feedback: "Ya va Ba o‘zidan keyingi harfga ulanadi." },
  ];

  const glyphs = ["ا", "و", "ي", "ب"];
  runQuestionDeck({
    id: "rules",
    eyebrow: "2-laboratoriya · Harf pasporti",
    questions,
    visual: (q, index) => `
      <div class="letter-vault">
        ${glyphs.map((glyph, i) => `<span class="${i === index % 4 ? "active" : ""}">${glyph}</span>`).join("")}
        <div class="orbit-line"></div>
      </div>
    `,
  });
}

function formsLabScreen() {
  const questions = [
    { question: "Alifning alohida shaklini toping.", options: ["ا", "و", "يـ", "بـ"], answer: "ا", feedback: "Alifning alohida shakli — ا." },
    { question: "Alifning oldingi harfga ulangan oxirgi shakli qaysi?", options: ["ـا", "ـو", "ـي", "ـب"], answer: "ـا", feedback: "Alifning oxirgi ko‘rinishi — ـا." },
    { question: "Vovning alohida shaklini toping.", options: ["و", "ا", "ي", "ب"], answer: "و", feedback: "Vovning alohida shakli — و." },
    { question: "Vovning oldingi harfga ulangan shakli qaysi?", options: ["ـو", "ـا", "ـي", "ـب"], answer: "ـو", feedback: "Vovning ulangan oxirgi shakli — ـو." },
    { question: "Yaning so‘z boshidagi shaklini toping.", options: ["يـ", "ـيـ", "ـي", "ي"], answer: "يـ", feedback: "Ya so‘z boshida يـ ko‘rinishida yoziladi." },
    { question: "Yaning so‘z o‘rtasidagi shaklini toping.", options: ["ـيـ", "يـ", "ـي", "ي"], answer: "ـيـ", feedback: "Ya so‘z o‘rtasida ـيـ ko‘rinishida." },
    { question: "Yaning so‘z oxiridagi ulangan shaklini toping.", options: ["ـي", "يـ", "ـيـ", "ي"], answer: "ـي", feedback: "Ya so‘z oxirida ـي ko‘rinishida." },
    { question: "Yaning alohida shaklini toping.", options: ["ي", "ب", "و", "ا"], answer: "ي", feedback: "Yaning alohida shakli — ي." },
    { question: "Baning so‘z boshidagi shaklini toping.", options: ["بـ", "ـبـ", "ـب", "ب"], answer: "بـ", feedback: "Ba so‘z boshida بـ." },
    { question: "Baning so‘z o‘rtasidagi shaklini toping.", options: ["ـبـ", "بـ", "ـب", "ب"], answer: "ـبـ", feedback: "Ba so‘z o‘rtasida ـبـ." },
    { question: "Baning so‘z oxiridagi shaklini toping.", options: ["ـب", "بـ", "ـبـ", "ب"], answer: "ـب", feedback: "Ba so‘z oxirida ـب." },
    { question: "Baning alohida shaklini toping.", options: ["ب", "ي", "و", "ا"], answer: "ب", feedback: "Baning alohida shakli — ب." },
  ];

  runQuestionDeck({
    id: "forms2",
    eyebrow: "3-laboratoriya · Shakllar galereyasi",
    questions,
    visual: () => `
      <div class="shape-carousel" aria-hidden="true">
        <span>ا</span><span>ـو</span><span>يـ</span><span>ـيـ</span><span>ـي</span><span>بـ</span><span>ـبـ</span><span>ـب</span>
      </div>
    `,
  });
}

function joiningLabScreen() {
  const questions = [
    { question: "Ba + Ya qanday ulanadi?", options: ["بي", "ب ي", "بى"], answer: "بي", feedback: "Ba keyingi Yaga ulanadi: بي." },
    { question: "Ya + Ba qanday ulanadi?", options: ["يب", "ي ب", "ىب"], answer: "يب", feedback: "Ya keyingi Baga ulanadi: يب." },
    { question: "Ba + Alifning to‘g‘ri yozilishi qaysi?", options: ["با", "ب ا", "اب"], answer: "با", feedback: "Ba Alifga ulanadi, Alif esa undan keyingi harfga ulanmaydi: با." },
    { question: "Alif + Ba qanday ko‘rinadi?", options: ["اب", "اـب", "أبـ"], answer: "اب", feedback: "Alif o‘zidan keyingi Baga ulanmaydi: اب." },
    { question: "Ba + Vovning to‘g‘ri ko‘rinishi qaysi?", options: ["بو", "ب و", "وب"], answer: "بو", feedback: "Ba Vovga ulanadi: بو." },
    { question: "Vov + Ba qanday yoziladi?", options: ["وب", "وـب", "بو"], answer: "وب", feedback: "Vov keyingi Baga ulanmaydi: وب." },
    { question: "Qaysi birikmada ikkala harf tutashadi?", options: ["بي", "اب", "وب"], answer: "بي", feedback: "Ba va Ya ikkalasi ham ulanishni qabul qiladi: بي." },
    { question: "Qaysi birikmada birinchi harf keyingisiga ulanmaydi?", options: ["اب", "بي", "يب"], answer: "اب", feedback: "Birinchi harf Alif bo‘lgani uchun اب ajralib ko‘rinadi." },
    { question: "Qaysi birikmada Vovdan keyin uzilish bor?", options: ["وبي", "بيو", "يبو"], answer: "وبي", feedback: "Vov keyingi Baga ulanmaydi: وبي." },
    { question: "Ba–Ya–Ba ketma-ketligini toping.", options: ["بيب", "بيو", "ياب"], answer: "بيب", feedback: "Ba + Ya + Ba = بيب." },
  ];

  runQuestionDeck({
    id: "join",
    eyebrow: "4-laboratoriya · Ulanish ko‘prigi",
    questions,
    visual: (q, index) => `
      <div class="connection-stage">
        <div class="connection-node">${["ب","ي","ا","و"][index % 4]}</div>
        <div class="energy-bridge ${index % 3 === 1 ? "broken" : ""}"></div>
        <div class="connection-node">${["ي","ب","ب","ب"][index % 4]}</div>
        <p>${index % 3 === 1 ? "Ulanmaydigan ko‘prikni aniqlang" : "Harf ko‘prigini to‘g‘ri quring"}</p>
      </div>
    `,
  });
}

function tracingLabScreen() {
  const letters = [
    { glyph: "ا", name: "Alif", hint: "Yuqoridan pastga bir tekis chizing." },
    { glyph: "و", name: "Vov", hint: "O‘ngdan boshlanib yumaloq burilishni kuzating." },
    { glyph: "ي", name: "Ya", hint: "Tana shaklini chizing va ikki nuqtani unutmang." },
    { glyph: "ب", name: "Ba", hint: "Keng kosani o‘ngdan chapga chizing va pastiga nuqta qo‘ying." },
  ];
  let index = 0;

  const body = () => `
    <div class="trace-layout">
      <div>
        <p class="eyebrow">5-laboratoriya · Siyoh izidan</p>
        <h2>${letters[index].name} harfini ustidan chizing</h2>
        <p class="lead">${letters[index].hint} Barmoq yoki sichqonchadan foydalaning.</p>
        <div class="trace-stats">
          <span>${index + 1} / ${letters.length}</span>
          <span id="tracePercent">0%</span>
        </div>
        <div class="button-row">
          <button id="clearTrace" class="secondary-button" type="button">Tozalash</button>
          <button id="finishTrace" class="primary-button" type="button" disabled>Tayyor</button>
        </div>
        <div id="traceFeedback" class="feedback-panel">Harfning xira izi bo‘ylab chizing.</div>
      </div>
      <div class="trace-board">
        <canvas id="traceCanvas" aria-label="${letters[index].name} harfini chizish maydoni"></canvas>
        <div class="trace-sparkles" aria-hidden="true"></div>
      </div>
    </div>
  `;

  render(body());

  const bindCanvas = () => {
    const canvas = document.querySelector("#traceCanvas");
    const context = canvas.getContext("2d");
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    context.scale(ratio, ratio);
    const width = rect.width;
    const height = rect.height;
    let drawing = false;
    let last = null;
    let distance = 0;

    const drawGuide = () => {
      context.clearRect(0, 0, width, height);
      context.fillStyle = "rgba(12,83,96,.11)";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = `700 ${Math.min(width, height) * .62}px "Traditional Arabic", serif`;
      context.fillText(letters[index].glyph, width / 2, height / 2 + 8);
      context.strokeStyle = "rgba(221,169,65,.22)";
      context.lineWidth = 2;
      context.setLineDash([8, 10]);
      context.beginPath();
      context.moveTo(24, height * .72);
      context.lineTo(width - 24, height * .72);
      context.stroke();
      context.setLineDash([]);
    };
    drawGuide();

    const point = (event) => {
      const bounds = canvas.getBoundingClientRect();
      return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    };

    canvas.addEventListener("pointerdown", (event) => {
      drawing = true;
      last = point(event);
      canvas.setPointerCapture(event.pointerId);
    });
    canvas.addEventListener("pointermove", (event) => {
      if (!drawing) return;
      const current = point(event);
      context.strokeStyle = "#0c7f80";
      context.lineWidth = 13;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.beginPath();
      context.moveTo(last.x, last.y);
      context.lineTo(current.x, current.y);
      context.stroke();
      distance += Math.hypot(current.x - last.x, current.y - last.y);
      last = current;
      const target = letters[index].glyph === "ا" ? 190 : 430;
      const percent = Math.min(100, Math.round((distance / target) * 100));
      document.querySelector("#tracePercent").textContent = `${percent}%`;
      if (percent >= 78) {
        document.querySelector("#finishTrace").disabled = false;
        document.querySelector("#traceFeedback").textContent = "Iz yetarli darajada chizildi. Nuqta va shaklni tekshirib, “Tayyor”ni bosing.";
      }
    });
    const stop = () => { drawing = false; last = null; };
    canvas.addEventListener("pointerup", stop);
    canvas.addEventListener("pointercancel", stop);

    document.querySelector("#clearTrace").addEventListener("click", () => {
      distance = 0;
      drawGuide();
      document.querySelector("#tracePercent").textContent = "0%";
      document.querySelector("#finishTrace").disabled = true;
    });
    document.querySelector("#finishTrace").addEventListener("click", () => {
      reward(`trace-${index}`, 20);
      index += 1;
      if (index >= letters.length) {
        state.step += 1;
        renderStage2();
      } else {
        screen.querySelector(".screen-content").innerHTML = body();
        bindCanvas();
      }
    });
  };
  bindCanvas();
}

function readingLabScreen() {
  const questions = [
    { question: "اَ qanday o‘qiladi?", options: ["a", "i", "u"], answer: "a", feedback: "اَ — a." },
    { question: "اِ qanday o‘qiladi?", options: ["a", "i", "u"], answer: "i", feedback: "اِ — i." },
    { question: "اُ qanday o‘qiladi?", options: ["a", "i", "u"], answer: "u", feedback: "اُ — u." },
    { question: "بَ qanday o‘qiladi?", options: ["ba", "bi", "bu"], answer: "ba", feedback: "بَ — ba." },
    { question: "بِ qanday o‘qiladi?", options: ["ba", "bi", "bu"], answer: "bi", feedback: "بِ — bi." },
    { question: "بُ qanday o‘qiladi?", options: ["ba", "bi", "bu"], answer: "bu", feedback: "بُ — bu." },
    { question: "وَ qanday o‘qiladi?", options: ["wa", "wi", "wu"], answer: "wa", feedback: "وَ — wa." },
    { question: "وِ qanday o‘qiladi?", options: ["wa", "wi", "wu"], answer: "wi", feedback: "وِ — wi." },
    { question: "وُ qanday o‘qiladi?", options: ["wa", "wi", "wu"], answer: "wu", feedback: "وُ — wu." },
    { question: "يَ qanday o‘qiladi?", options: ["ya", "yi", "yu"], answer: "ya", feedback: "يَ — ya." },
    { question: "يِ qanday o‘qiladi?", options: ["ya", "yi", "yu"], answer: "yi", feedback: "يِ — yi." },
    { question: "يُ qanday o‘qiladi?", options: ["ya", "yi", "yu"], answer: "yu", feedback: "يُ — yu." },
    { question: "بً qanday o‘qiladi?", options: ["ban", "bin", "bun"], answer: "ban", feedback: "بً — ban." },
    { question: "بٍ qanday o‘qiladi?", options: ["ban", "bin", "bun"], answer: "bin", feedback: "بٍ — bin." },
    { question: "بٌ qanday o‘qiladi?", options: ["ban", "bin", "bun"], answer: "bun", feedback: "بٌ — bun." },
    { question: "وً qanday o‘qiladi?", options: ["wan", "win", "wun"], answer: "wan", feedback: "وً — wan." },
    { question: "يٍ qanday o‘qiladi?", options: ["yan", "yin", "yun"], answer: "yin", feedback: "يٍ — yin." },
    { question: "اَبْ qanday o‘qiladi?", options: ["ab", "ib", "ub"], answer: "ab", feedback: "اَبْ — ab." },
    { question: "اِبْ qanday o‘qiladi?", options: ["ab", "ib", "ub"], answer: "ib", feedback: "اِبْ — ib." },
    { question: "اُبْ qanday o‘qiladi?", options: ["ab", "ib", "ub"], answer: "ub", feedback: "اُبْ — ub." },
    { question: "اَوْ qanday o‘qiladi?", options: ["aw", "iw", "uw"], answer: "aw", feedback: "اَوْ — aw." },
    { question: "اِوْ qanday o‘qiladi?", options: ["aw", "iw", "uw"], answer: "iw", feedback: "اِوْ — iw." },
    { question: "اَيْ qanday o‘qiladi?", options: ["ay", "iy", "uy"], answer: "ay", feedback: "اَيْ — ay." },
    { question: "اِيْ qanday o‘qiladi?", options: ["ay", "iy", "uy"], answer: "iy", feedback: "اِيْ — iy." },
  ];

  runQuestionDeck({
    id: "reading",
    eyebrow: "6-laboratoriya · O‘qish galaktikasi",
    questions,
    visual: (q, index) => `
      <div class="reading-orb">
        <div class="reading-ring ring-one"></div>
        <div class="reading-ring ring-two"></div>
        <strong class="arabic">${q.question.split(" ")[0]}</strong>
        <span>${index < 12 ? "harakat" : index < 17 ? "tanvin" : "sukunli bo‘g‘in"}</span>
      </div>
    `,
  });
}

function stage2MasteryScreen() {
  const questions = [
    { question: "Qaysi harf mustaqil tovushni ifodalamaydi?", options: ["Alif", "Ba", "Ya", "Vov"], answer: "Alif", feedback: "Alif mustaqil tovushni ifodalamaydi." },
    { question: "Ikki lab maxrajiga mansub juftlik qaysi?", options: ["Vov va Ba", "Alif va Ya", "Ya va Ba"], answer: "Vov va Ba", feedback: "Vov va Ba talaffuzida ikki lab ishtirok etadi." },
    { question: "Til va tanglay o‘rtasidan chiqadigan harf qaysi?", options: ["Ya", "Vov", "Ba", "Alif"], answer: "Ya", feedback: "Ya til va tanglay o‘rtasidan chiqadi." },
    { question: "Keyingi harfga ulanmaydigan juftlik qaysi?", options: ["Alif va Vov", "Ya va Ba", "Vov va Ya"], answer: "Alif va Vov", feedback: "Alif va Vov keyingi harfga ulanmaydi." },
    { question: "To‘rt shaklli juftlikni toping.", options: ["Ya va Ba", "Alif va Vov", "Alif va Ba"], answer: "Ya va Ba", feedback: "Ya va Ba to‘rt ko‘rinishda yoziladi." },
    { question: "ـيـ qaysi harfning o‘rta shakli?", options: ["Ya", "Ba", "Vov", "Alif"], answer: "Ya", feedback: "ـيـ — Yaning o‘rta shakli." },
    { question: "ـب qaysi harfning oxirgi shakli?", options: ["Ba", "Ya", "Vov", "Alif"], answer: "Ba", feedback: "ـب — Baning oxirgi shakli." },
    { question: "Qaysi yozuvda Alifdan keyin uzilish bor?", options: ["اب", "با", "بي"], answer: "اب", feedback: "Alif keyingi Baga ulanmaydi: اب." },
    { question: "Qaysi yozuvda Ba va Ya tutashgan?", options: ["بي", "ب ي", "اب"], answer: "بي", feedback: "بي birikmasida Ba va Ya tutashadi." },
    { question: "يُ qanday o‘qiladi?", options: ["yu", "yi", "ya"], answer: "yu", feedback: "يُ — yu." },
    { question: "بٍ qanday o‘qiladi?", options: ["bin", "ban", "bun"], answer: "bin", feedback: "بٍ — bin." },
    { question: "اَوْ qanday o‘qiladi?", options: ["aw", "iw", "ay"], answer: "aw", feedback: "اَوْ — aw." },
  ];

  runQuestionDeck({
    id: "mastery2",
    eyebrow: "7-laboratoriya · Usta sinovi",
    questions,
    layout: "result-layout",
    prompt: "Maxraj, shakl, ulanish va o‘qishni birlashtiring.",
  });
}

function stage2FinalScreen() {
  const accuracy = state.attempts ? Math.round((state.correct / state.attempts) * 100) : 0;
  const stars = accuracy >= 90 ? 3 : accuracy >= 75 ? 2 : 1;
  localStorage.setItem("fonetika-stage-2", JSON.stringify({
    score: state.score,
    accuracy,
    completedAt: new Date().toISOString(),
  }));
  render(`
    <div class="result-layout">
      <div class="trophy letter-trophy" aria-hidden="true">ا و ي ب</div>
      <p class="eyebrow" style="justify-content:center">2-bosqich yakuni</p>
      <h2>Harf ustasi darajasi ochildi!</h2>
      <p class="lead" style="margin-inline:auto">Siz maxraj, shakl, ulanish, yozish va o‘qish bo‘yicha Alif, Vov, Ya va Ba modulini tugatdingiz.</p>
      <div class="stars" aria-label="${stars} yulduz">${"★".repeat(stars)}${"☆".repeat(3 - stars)}</div>
      <div class="result-stats">
        <div class="stat-card"><strong>${state.score}</strong><span>Jami ball</span></div>
        <div class="stat-card"><strong>${accuracy}%</strong><span>Aniqlik</span></div>
        <div class="stat-card"><strong>${state.completed.size}</strong><span>Bajarilgan ko‘nikma</span></div>
      </div>
      <div class="button-row" style="justify-content:center">
        <button id="stage2Again" class="secondary-button" type="button">Qayta mashq</button>
        <button id="backToMenu" class="primary-button" type="button">Bosh menyu</button>
      </div>
    </div>
  `);
  document.querySelector("#stage2Again").addEventListener("click", () => {
    state.step = 0;
    state.score = 0;
    state.correct = 0;
    state.attempts = 0;
    state.streak = 0;
    state.mistakes = {};
    state.completed.clear();
    renderStage2();
  });
  document.querySelector("#backToMenu").addEventListener("click", goHome);
}

function renderStage2() {
  const screens = [
    stage2IntroScreen,
    maxrajScreen,
    letterRulesScreen,
    formsLabScreen,
    joiningLabScreen,
    tracingLabScreen,
    readingLabScreen,
    stage2MasteryScreen,
    stage2FinalScreen,
  ];
  screens[Math.min(state.step, screens.length - 1)]();
}

function resultScreen() {
  const accuracy = state.attempts ? Math.round((state.correct / state.attempts) * 100) : 0;
  const mastery = Math.max(78, Math.min(100, accuracy));
  localStorage.setItem("fonetika-stage-1", JSON.stringify({
    score: state.score,
    mastery,
    completedAt: new Date().toISOString(),
  }));

  render(`
    <div class="result-layout">
      <div class="trophy" aria-hidden="true">✦</div>
      <p class="eyebrow" style="justify-content:center">1-bosqich yakuni</p>
      <h2>Qo‘lyozma uyg‘ondi!</h2>
      <p class="lead" style="margin-inline:auto">Siz arab yozuvining yo‘nalishi, 28 harf, harakatlar, sukun va tanvin bo‘yicha ilk sinovdan o‘tdingiz.</p>
      <div class="result-stats">
        <div class="stat-card"><strong>${state.score}</strong><span>Yig‘ilgan XP</span></div>
        <div class="stat-card"><strong>${mastery}%</strong><span>O‘zlashtirish</span></div>
        <div class="stat-card"><strong>${state.completed.size}</strong><span>Ko‘nikma</span></div>
      </div>
      <div class="feedback-panel" style="text-align:left">
        Keyingi bosqichda Alif, Vov va Ya harflari ochiladi. Hali o‘tilmagan boshqa harflar testga aralashtirilmaydi.
      </div>
      <div class="button-row" style="justify-content:center; margin-top:24px">
        <button id="restartButton" class="secondary-button" type="button">Qayta o‘ynash</button>
        <button id="finishButton" class="primary-button" type="button">Natijani saqlash</button>
      </div>
    </div>
  `);

  document.querySelector("#restartButton").addEventListener("click", () => {
    state.step = 1;
    state.score = 0;
    state.correct = 0;
    state.attempts = 0;
    state.streak = 0;
    state.mistakes = {};
    state.completed.clear();
    renderStep();
  });
  document.querySelector("#finishButton").addEventListener("click", () => {
    showToast("Natija ushbu qurilmada saqlandi.");
  });
}

function renderStep() {
  if (state.mode === "stage2") {
    renderStage2();
    return;
  }
  const screens = [
    heroScreen,
    directionScreen,
    factsScreen,
    alphabetScreen,
    formsScreen,
    vowelScreen,
    tanwinScreen,
    finalQuizScreen,
    resultScreen,
  ];
  screens[Math.min(state.step, screens.length - 1)]();
}

homeButton.addEventListener("click", goHome);
effectButton.addEventListener("click", () => {
  state.soundEffects = !state.soundEffects;
  effectButton.querySelector("span").textContent = state.soundEffects ? "♫" : "×";
  showToast(state.soundEffects ? "Sound effectlar yoqildi." : "Sound effectlar o‘chirildi.");
});

const stage2Route = location.hash.match(/^#stage2(?:-(\d+))?$/);
if (stage2Route) {
  state.mode = "stage2";
  state.step = Math.min(Number(stage2Route[1] || 0), stage2Sections - 1);
}

renderStep();

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {
      // O‘yin service worker bo‘lmasa ham to‘liq ishlaydi.
    });
  });
}
