const screen = document.querySelector("#screen");
const progressWrap = document.querySelector("#progressWrap");
const progressBar = document.querySelector("#progressBar");
const progressLabel = document.querySelector("#progressLabel");
const scoreLabel = document.querySelector("#scoreLabel");
const stageLabel = document.querySelector("#stageLabel");
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
const stage3Sections = 8;
const stage3Activities = 72;
const stage4Sections = 10;
const stage4Activities = 104;
const arabicLetters = ["ا","ب","ت","ث","ج","ح","خ","د","ذ","ر","ز","س","ش","ص","ض","ط","ظ","ع","غ","ف","ق","ك","ل","م","ن","و","ه","ي"];

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function splitGraphemes(text) {
  if (typeof Intl !== "undefined" && Intl.Segmenter) {
    return [...new Intl.Segmenter("ar", { granularity: "grapheme" }).segment(text)].map(item => item.segment);
  }
  return [...text];
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
  const active = ["stage2", "stage3", "stage4"].includes(state.mode) || (state.step > 0 && state.step < totalSteps);
  progressWrap.classList.toggle("hidden", !active);
  homeButton.classList.toggle("hidden", state.mode === "stage1" && state.step === 0);
  if (state.mode === "stage2") {
    stageLabel.textContent = "Fonetika · 2-bosqich";
    progressLabel.textContent = `${Math.min(state.step + 1, stage2Sections)} / ${stage2Sections} BO‘LIM · ${stage2Activities} TOPSHIRIQ`;
    progressBar.style.width = `${Math.min(100, ((state.step + 1) / stage2Sections) * 100)}%`;
  } else if (state.mode === "stage3") {
    stageLabel.textContent = "Fonetika · 3-bosqich";
    progressLabel.textContent = `${Math.min(state.step + 1, stage3Sections)} / ${stage3Sections} BO‘LIM · ${stage3Activities} TOPSHIRIQ`;
    progressBar.style.width = `${Math.min(100, ((state.step + 1) / stage3Sections) * 100)}%`;
  } else if (state.mode === "stage4") {
    stageLabel.textContent = "Fonetika · 4-bosqich";
    progressLabel.textContent = `${Math.min(state.step + 1, stage4Sections)} / ${stage4Sections} BO‘LIM · ${stage4Activities} TOPSHIRIQ`;
    progressBar.style.width = `${Math.min(100, ((state.step + 1) / stage4Sections) * 100)}%`;
  } else {
    stageLabel.textContent = "Fonetika · 1-bosqich";
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

function resetProgress(mode) {
  state.mode = mode;
  state.step = 0;
  state.score = 0;
  state.correct = 0;
  state.attempts = 0;
  state.streak = 0;
  state.mistakes = {};
  state.completed.clear();
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
          <button id="stage3Button" class="secondary-button" type="button">3-bosqich: Tashdid · Madd · Hamza</button>
          <button id="stage4Button" class="secondary-button" type="button">4-bosqich: Ta · Sa · Yangi so‘zlar</button>
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
    resetProgress("stage2");
    renderStage2();
  });
  document.querySelector("#stage3Button").addEventListener("click", () => {
    resetProgress("stage3");
    renderStage3();
  });
  document.querySelector("#stage4Button").addEventListener("click", () => {
    resetProgress("stage4");
    renderStage4();
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
              renderActiveMode();
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

function renderActiveMode() {
  if (state.mode === "stage4") {
    renderStage4();
  } else if (state.mode === "stage3") {
    renderStage3();
  } else if (state.mode === "stage2") {
    renderStage2();
  } else {
    renderStep();
  }
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

function stage3IntroScreen() {
  render(`
    <div class="stage3-hero">
      <div class="stage3-reactor" aria-hidden="true">
        <div class="reactor-ring ring-a"></div>
        <div class="reactor-ring ring-b"></div>
        <div class="reactor-symbol shadda-symbol">ّ</div>
        <div class="reactor-symbol madd-symbol">آ</div>
        <div class="reactor-symbol hamza-symbol">ء</div>
        <div class="reactor-core">3</div>
      </div>
      <div>
        <p class="eyebrow">3-game · 15–17-slaydlar</p>
        <h1>Tovush quvvati laboratoriyasi</h1>
        <p class="lead">Tashdid harfni ikki marta kuchaytiradi, madd tovushni cho‘zadi, hamza esa to‘rt xil maskanda ko‘rinadi. So‘ng ularni o‘qish maydonida birlashtiramiz.</p>
        <div class="skill-pills">
          <span>Tashdid sintezi</span><span>aa · ii · uu</span><span>Hamza maskani</span><span>Ritmli o‘qish</span>
        </div>
        <button id="stage3Start" class="primary-button" type="button">Laboratoriyani ishga tushirish</button>
      </div>
    </div>
  `);
  document.querySelector("#stage3Start").addEventListener("click", () => {
    state.step = 1;
    renderStage3();
  });
}

function tashdidRulesScreen() {
  const questions = [
    { question: "Tashdid belgisi qaysi?", options: ["ّ", "ْ", "ً", "ٰ"], answer: "ّ", feedback: "ّ — tashdid belgisi." },
    { question: "Tashdid harfning qayeriga qo‘yiladi?", options: ["Ustiga", "Pastiga", "Yoniga"], answer: "Ustiga", feedback: "Tashdid harf ustiga qo‘yiladi." },
    { question: "Tashdid nimani bildiradi?", options: ["Harf ikki marta kelganini", "Harf cho‘zilishini", "Harf tushib qolishini"], answer: "Harf ikki marta kelganini", feedback: "Tashdid bir xil harf ketma-ket ikki marta kelganini bildiradi." },
    { question: "Tashdid tarkibidagi birinchi harf qanday bo‘ladi?", options: ["Sukunli", "Fathali", "Tanvinli"], answer: "Sukunli", feedback: "Birinchi harf sukunli bo‘ladi." },
    { question: "Tashdid tarkibidagi ikkinchi harf qanday bo‘ladi?", options: ["Harakatli", "Harakatsiz", "Faqat tanvinli"], answer: "Harakatli", feedback: "Ikkinchi harf fatha, kasra yoki damma bilan keladi." },
    { question: "وْ + وَ birikmasining ixcham ko‘rinishi qaysi?", options: ["وَّ", "وَ", "وْ"], answer: "وَّ", feedback: "وْ + وَ = وَّ." },
    { question: "يْ + يَ birikmasining ixcham ko‘rinishi qaysi?", options: ["يَّ", "يَ", "يْ"], answer: "يَّ", feedback: "يْ + يَ = يَّ." },
    { question: "بْ + بُ qanday yoziladi?", options: ["بُّ", "بُ", "بْ"], answer: "بُّ", feedback: "Birinchi Ba sukunli, ikkinchisi dammali: بُّ." },
    { question: "Tashdidli harfni o‘qishda tovush...", options: ["Kuchayib ikki urinishda chiqadi", "Butunlay tushib qoladi", "Faqat cho‘ziladi"], answer: "Kuchayib ikki urinishda chiqadi", feedback: "Tashdid harfni ikki bosqichda: yopilish va ochilish bilan kuchaytiradi." },
    { question: "Qaysi shaklda tashdid bor?", options: ["بَّ", "بَ", "بْ"], answer: "بَّ", feedback: "بَّ shaklida Ba ustida tashdid va fatha bor." },
  ];
  runQuestionDeck({
    id: "shadda-rule",
    eyebrow: "1-laboratoriya · Tashdid anatomiyasi",
    questions,
    visual: (q, index) => `
      <div class="shadda-anatomy">
        <div class="pulse-letter">${["بَّ","وِّ","يُّ"][index % 3]}</div>
        <div class="double-beat"><i></i><i></i></div>
        <p><span>1</span> sukunli yopilish <b>+</b> <span>2</span> harakatli ochilish</p>
      </div>
    `,
  });
}

function tashdidFusionScreen() {
  const questions = [
    { question: "وْ + وَ ni birlashtiring.", options: ["وَّ", "وِّ", "وُّ"], answer: "وَّ", feedback: "Fathali ikkinchi Vov sabab natija وَّ." },
    { question: "وْ + وِ ni birlashtiring.", options: ["وَّ", "وِّ", "وُّ"], answer: "وِّ", feedback: "Kasrali ikkinchi Vov sabab natija وِّ." },
    { question: "وْ + وُ ni birlashtiring.", options: ["وَّ", "وِّ", "وُّ"], answer: "وُّ", feedback: "Dammali ikkinchi Vov sabab natija وُّ." },
    { question: "يْ + يَ ni birlashtiring.", options: ["يَّ", "يِّ", "يُّ"], answer: "يَّ", feedback: "Fathali ikkinchi Ya sabab natija يَّ." },
    { question: "يْ + يِ ni birlashtiring.", options: ["يَّ", "يِّ", "يُّ"], answer: "يِّ", feedback: "Kasrali ikkinchi Ya sabab natija يِّ." },
    { question: "يْ + يُ ni birlashtiring.", options: ["يَّ", "يِّ", "يُّ"], answer: "يُّ", feedback: "Dammali ikkinchi Ya sabab natija يُّ." },
    { question: "بْ + بَ ni birlashtiring.", options: ["بَّ", "بِّ", "بُّ"], answer: "بَّ", feedback: "بْ + بَ = بَّ." },
    { question: "بْ + بِ ni birlashtiring.", options: ["بَّ", "بِّ", "بُّ"], answer: "بِّ", feedback: "بْ + بِ = بِّ." },
  ];
  runQuestionDeck({
    id: "shadda-fusion",
    eyebrow: "2-laboratoriya · Tashdid pressi",
    questions,
    visual: (q, index) => {
      const pairs = [["وْ","وَ"],["وْ","وِ"],["وْ","وُ"],["يْ","يَ"],["يْ","يِ"],["يْ","يُ"],["بْ","بَ"],["بْ","بِ"]];
      return `
        <div class="fusion-press">
          <div class="fusion-piece">${pairs[index][0]}</div>
          <div class="press-core"><span>ّ</span><i></i></div>
          <div class="fusion-piece">${pairs[index][1]}</div>
          <div class="fusion-energy"></div>
        </div>
      `;
    },
  });
}

function maddLabScreen() {
  const questions = [
    { question: "Cho‘ziq unli nima qiladi?", options: ["Tovushni cho‘zadi", "Harfni ikki marta ayttiradi", "Tovushni o‘chiradi"], answer: "Tovushni cho‘zadi", feedback: "Madd unli tovushni cho‘zib talaffuz qilishga xizmat qiladi." },
    { question: "Fatha bilan mos cho‘ziq harf qaysi?", options: ["Alif", "Vov", "Ya"], answer: "Alif", feedback: "Fatha + Alif = aa." },
    { question: "Kasra bilan mos cho‘ziq harf qaysi?", options: ["Ya", "Alif", "Vov"], answer: "Ya", feedback: "Kasra + Ya = ii." },
    { question: "Damma bilan mos cho‘ziq harf qaysi?", options: ["Vov", "Ya", "Alif"], answer: "Vov", feedback: "Damma + Vov = uu." },
    { question: "بَ + ا qanday o‘qiladi?", options: ["baa", "bii", "buu"], answer: "baa", feedback: "بَ + ا = بَا, ya’ni baa." },
    { question: "بِ + ي qanday o‘qiladi?", options: ["bii", "baa", "buu"], answer: "bii", feedback: "بِ + ي = بِي, ya’ni bii." },
    { question: "بُ + و qanday o‘qiladi?", options: ["buu", "bii", "baa"], answer: "buu", feedback: "بُ + و = بُو, ya’ni buu." },
    { question: "Qaysi birikma cho‘ziq “aa” beradi?", options: ["بَا", "بِي", "بُو"], answer: "بَا", feedback: "بَا — baa." },
    { question: "Qaysi birikma cho‘ziq “ii” beradi?", options: ["بِي", "بَا", "بُو"], answer: "بِي", feedback: "بِي — bii." },
    { question: "Qaysi birikma cho‘ziq “uu” beradi?", options: ["بُو", "بِي", "بَا"], answer: "بُو", feedback: "بُو — buu." },
    { question: "Fatha + Vov mos madd juftligimi?", options: ["Yo‘q", "Ha", "Faqat tashdid bilan"], answer: "Yo‘q", feedback: "Fatha uchun mos cho‘ziq harf Alif." },
    { question: "Kasra + Alif mos madd juftligimi?", options: ["Yo‘q", "Ha", "Faqat tanvin bilan"], answer: "Yo‘q", feedback: "Kasra uchun mos cho‘ziq harf Ya." },
    { question: "Damma + Ya mos madd juftligimi?", options: ["Yo‘q", "Ha", "Faqat sukun bilan"], answer: "Yo‘q", feedback: "Damma uchun mos cho‘ziq harf Vov." },
    { question: "Cho‘ziq unli harfi qachon madd vazifasini bajaradi?", options: ["Oldingi qisqa harakat unga mos bo‘lsa", "Har doim", "Faqat so‘z oxirida"], answer: "Oldingi qisqa harakat unga mos bo‘lsa", feedback: "Madd harfi oldingi harakat bilan mos kelgandagina cho‘ziq unli bo‘ladi." },
  ];
  runQuestionDeck({
    id: "madd",
    eyebrow: "3-laboratoriya · Madd energiya yo‘li",
    questions,
    visual: (q, index) => `
      <div class="madd-tunnel">
        <div class="short-pulse">${["بَ","بِ","بُ"][index % 3]}</div>
        <div class="madd-wave"><i></i><i></i><i></i></div>
        <div class="long-pulse">${["بَا","بِي","بُو"][index % 3]}</div>
        <div class="duration-scale"><span>qisqa</span><b></b><span>cho‘ziq</span></div>
      </div>
    `,
  });
}

function hamzaLabScreen() {
  const questions = [
    { question: "Hamza belgisi qaysi?", options: ["ء", "ع", "ا", "ّ"], answer: "ء", feedback: "ء — hamza belgisi." },
    { question: "Hamza belgisi qaysi harfning bosh qismidan olingan?", options: ["ع", "ا", "و"], answer: "ع", feedback: "Hamza belgisi ع harfining bosh qismidan olingan." },
    { question: "Hamza mustaqil shaklda o‘zgaradimi?", options: ["Yo‘q, bir xil yoziladi", "Ha, to‘rt shaklga ulanadi", "Faqat oxirida o‘zgaradi"], answer: "Yo‘q, bir xil yoziladi", feedback: "Mustaqil hamza bir xil shaklda yoziladi." },
    { question: "Hamza boshqa harfga birikadimi?", options: ["Yo‘q", "Ha", "Faqat Yaga"], answer: "Yo‘q", feedback: "Hamza belgisi o‘zi hech bir harfga birikmaydi." },
    { question: "Hamza imloda nechta asosiy ko‘rinishda uchraydi?", options: ["To‘rt", "Ikki", "Olti"], answer: "To‘rt", feedback: "Alif, Vov, Ya kursisi va mustaqil shakl — to‘rt ko‘rinish." },
    { question: "Kasrali boshlang‘ich hamza Alifning qayerida yoziladi?", options: ["Ostida", "Ustida", "Yonida"], answer: "Ostida", feedback: "Kasrali hamza Alif ostida yoziladi: إِ." },
    { question: "Fathali hamza Alif bilan qanday ko‘rinadi?", options: ["أَ", "إِ", "ؤَ"], answer: "أَ", feedback: "Fathali hamza Alif ustida: أَ." },
    { question: "Dammali hamza Alif bilan qanday ko‘rinadi?", options: ["أُ", "إُ", "ئُ"], answer: "أُ", feedback: "Dammali hamza Alif ustida yoziladi: أُ." },
    { question: "Vov kursisidagi hamza qaysi?", options: ["ؤ", "ئ", "أ"], answer: "ؤ", feedback: "ؤ — Vov ustidagi hamza." },
    { question: "Ya kursisidagi hamza qaysi?", options: ["ئ", "ؤ", "إ"], answer: "ئ", feedback: "ئ — Ya kursisidagi hamza." },
    { question: "Mustaqil hamza qaysi?", options: ["ء", "أ", "ؤ"], answer: "ء", feedback: "ء — mustaqil hamza." },
    { question: "Qaysi shaklda hamza Alif ostida?", options: ["إ", "أ", "ؤ"], answer: "إ", feedback: "إ shaklida hamza Alif ostida." },
    { question: "Qaysi qatorda hamzaning to‘rt maskani berilgan?", options: ["أ · ؤ · ئ · ء", "ا · و · ي · ب", "َ · ِ · ُ · ْ"], answer: "أ · ؤ · ئ · ء", feedback: "Hamzaning maskanlari: Alif, Vov, Ya kursisi va mustaqil." },
    { question: "Hamza belgisini muomalaga kiritgan olim kim?", options: ["Xalil ibn Ahmad Farohidiy", "Ibn Sino", "Al-Xorazmiy"], answer: "Xalil ibn Ahmad Farohidiy", feedback: "Qo‘llanmada hamza belgisi Xalil ibn Ahmad Farohidiy tomonidan joriy qilingani aytiladi." },
  ];
  runQuestionDeck({
    id: "hamza",
    eyebrow: "4-laboratoriya · Hamza maskanlari",
    questions,
    visual: (q, index) => `
      <div class="hamza-orbit">
        <div class="hamza-seat alif-seat">أ</div>
        <div class="hamza-seat waw-seat">ؤ</div>
        <div class="hamza-seat ya-seat">ئ</div>
        <div class="hamza-seat solo-seat">ء</div>
        <div class="hamza-core">${["ء","إ","ؤ","ئ"][index % 4]}</div>
        <div class="seat-path"></div>
      </div>
    `,
  });
}

function stage3ReadingScreen() {
  const questions = [
    { question: "وَا qanday o‘qiladi?", options: ["waa", "wii", "wuu"], answer: "waa", feedback: "وَا — waa." },
    { question: "وِي qanday o‘qiladi?", options: ["wii", "waa", "wuu"], answer: "wii", feedback: "وِي — wii." },
    { question: "وُو qanday o‘qiladi?", options: ["wuu", "wii", "waa"], answer: "wuu", feedback: "وُو — wuu." },
    { question: "يَا qanday o‘qiladi?", options: ["yaa", "yii", "yuu"], answer: "yaa", feedback: "يَا — yaa." },
    { question: "يِي qanday o‘qiladi?", options: ["yii", "yaa", "yuu"], answer: "yii", feedback: "يِي — yii." },
    { question: "يُو qanday o‘qiladi?", options: ["yuu", "yii", "yaa"], answer: "yuu", feedback: "يُو — yuu." },
    { question: "اَوَّ qanday o‘qiladi?", options: ["awwa", "awi", "awu"], answer: "awwa", feedback: "اَوَّ — awwa." },
    { question: "اَوِّ qanday o‘qiladi?", options: ["awwi", "awwa", "awwu"], answer: "awwi", feedback: "اَوِّ — awwi." },
    { question: "اَوُّ qanday o‘qiladi?", options: ["awwu", "awwi", "awwa"], answer: "awwu", feedback: "اَوُّ — awwu." },
    { question: "اَيَّ qanday o‘qiladi?", options: ["ayya", "ayyi", "ayyu"], answer: "ayya", feedback: "اَيَّ — ayya." },
    { question: "اَيِّ qanday o‘qiladi?", options: ["ayyi", "ayya", "ayyu"], answer: "ayyi", feedback: "اَيِّ — ayyi." },
    { question: "اَيُّ qanday o‘qiladi?", options: ["ayyu", "ayyi", "ayya"], answer: "ayyu", feedback: "اَيُّ — ayyu." },
    { question: "بَا qanday o‘qiladi?", options: ["baa", "bii", "buu"], answer: "baa", feedback: "بَا — baa." },
    { question: "بِي qanday o‘qiladi?", options: ["bii", "baa", "buu"], answer: "bii", feedback: "بِي — bii." },
    { question: "بُو qanday o‘qiladi?", options: ["buu", "bii", "baa"], answer: "buu", feedback: "بُو — buu." },
    { question: "بَابٌ so‘zining ma’nosi nima?", options: ["Eshik", "Ota", "Uy"], answer: "Eshik", feedback: "بَابٌ — eshik." },
    { question: "اَبٌ so‘zining ma’nosi nima?", options: ["Ota", "Eshik", "Uy"], answer: "Ota", feedback: "اَبٌ — ota." },
    { question: "بَيْتٌ so‘zining ma’nosi nima?", options: ["Uy", "Ota", "Eshik"], answer: "Uy", feedback: "بَيْتٌ — uy. Bu 17-slaydda yangi so‘z sifatida berilgan." },
  ];
  runQuestionDeck({
    id: "read3",
    eyebrow: "5-laboratoriya · Ritmli o‘qish",
    questions,
    visual: (q, index) => `
      <div class="rhythm-reader">
        <div class="reading-token arabic">${q.question.split(" ")[0]}</div>
        <div class="rhythm-track">
          ${Array.from({ length: index % 3 === 0 ? 3 : 2 }, (_, i) => `<i style="--delay:${i * .18}s"></i>`).join("")}
        </div>
        <p>${index < 6 ? "cho‘ziq unli" : index < 12 ? "tashdid ritmi" : index < 15 ? "madd" : "yangi so‘z"}</p>
      </div>
    `,
  });
}

function stage3MasteryScreen() {
  const questions = [
    { question: "Tashdidning ichki formulasi qaysi?", options: ["Sukunli harf + harakatli harf", "Fatha + Alif", "Kasra + Ya"], answer: "Sukunli harf + harakatli harf", feedback: "Tashdid: birinchi harf sukunli, ikkinchisi harakatli." },
    { question: "بِّ qaysi ikki qismdan tuzilgan?", options: ["بْ + بِ", "بِ + بْ", "بَ + ا"], answer: "بْ + بِ", feedback: "بْ + بِ = بِّ." },
    { question: "Cho‘ziq “aa” formulasi qaysi?", options: ["Fatha + Alif", "Kasra + Ya", "Damma + Vov"], answer: "Fatha + Alif", feedback: "Fatha + Alif = aa." },
    { question: "Cho‘ziq “ii” formulasi qaysi?", options: ["Kasra + Ya", "Fatha + Alif", "Damma + Vov"], answer: "Kasra + Ya", feedback: "Kasra + Ya = ii." },
    { question: "Cho‘ziq “uu” formulasi qaysi?", options: ["Damma + Vov", "Kasra + Ya", "Fatha + Alif"], answer: "Damma + Vov", feedback: "Damma + Vov = uu." },
    { question: "Kasrali hamza Alif bilan qayerda turadi?", options: ["Alif ostida", "Alif ustida", "Vov ustida"], answer: "Alif ostida", feedback: "إِ — kasrali hamza Alif ostida." },
    { question: "Qaysi shakl Ya kursisidagi hamza?", options: ["ئ", "ؤ", "ء"], answer: "ئ", feedback: "ئ — Ya kursisidagi hamza." },
    { question: "اَيُّ qanday o‘qiladi?", options: ["ayyu", "ayya", "ayyi"], answer: "ayyu", feedback: "اَيُّ — ayyu." },
  ];
  runQuestionDeck({
    id: "mastery3",
    eyebrow: "6-laboratoriya · Quvvat sinovi",
    questions,
    layout: "result-layout",
    prompt: "Tashdid, madd, hamza va o‘qishni bitta sinovda birlashtiring.",
  });
}

function stage3FinalScreen() {
  const accuracy = state.attempts ? Math.round((state.correct / state.attempts) * 100) : 0;
  const stars = accuracy >= 90 ? 3 : accuracy >= 75 ? 2 : 1;
  localStorage.setItem("fonetika-stage-3", JSON.stringify({
    score: state.score,
    accuracy,
    completedAt: new Date().toISOString(),
  }));
  render(`
    <div class="result-layout">
      <div class="stage3-medal" aria-hidden="true"><span>ّ</span><span>آ</span><span>ء</span></div>
      <p class="eyebrow" style="justify-content:center">3-bosqich yakuni</p>
      <h2>Tovush muhandisi darajasi ochildi!</h2>
      <p class="lead" style="margin-inline:auto">Siz tashdidni qismlarga ajratdingiz, cho‘ziq unlilarni qurdingiz, hamzaning maskanlarini topdingiz va 17-slayd o‘qishlarini bajardingiz.</p>
      <div class="stars">${"★".repeat(stars)}${"☆".repeat(3 - stars)}</div>
      <div class="result-stats">
        <div class="stat-card"><strong>${state.score}</strong><span>Jami ball</span></div>
        <div class="stat-card"><strong>${accuracy}%</strong><span>Aniqlik</span></div>
        <div class="stat-card"><strong>${state.completed.size}</strong><span>Ko‘nikma</span></div>
      </div>
      <div class="button-row" style="justify-content:center">
        <button id="stage3Again" class="secondary-button" type="button">Qayta mashq</button>
        <button id="stage3Menu" class="primary-button" type="button">Bosh menyu</button>
      </div>
    </div>
  `);
  document.querySelector("#stage3Again").addEventListener("click", () => {
    resetProgress("stage3");
    renderStage3();
  });
  document.querySelector("#stage3Menu").addEventListener("click", goHome);
}

function renderStage3() {
  const screens = [
    stage3IntroScreen,
    tashdidRulesScreen,
    tashdidFusionScreen,
    maddLabScreen,
    hamzaLabScreen,
    stage3ReadingScreen,
    stage3MasteryScreen,
    stage3FinalScreen,
  ];
  screens[Math.min(state.step, screens.length - 1)]();
}

const stage4Vocabulary = [
  { word: "تُوتٌ", meaning: "Tut daraxti / tut mevasi", image: "assets/vocabulary/tut.jpg", color: "#7c385f" },
  { word: "بَيْتٌ", meaning: "Uy", image: "assets/vocabulary/uy.jpg", color: "#bd6d35" },
  { word: "ثَابِتٌ", meaning: "Sobit, bardavom", image: "assets/vocabulary/sobit.jpg", color: "#507953" },
  { word: "إِثْبَاتٌ", meaning: "Isbot", image: "assets/vocabulary/isbot.jpg", color: "#a33d35" },
];

function stage4IntroScreen() {
  render(`
    <div class="stage4-hero">
      <div class="articulation-chamber" aria-hidden="true">
        <div class="jaw-profile">
          <div class="upper-teeth"></div>
          <div class="gum-line"></div>
          <div class="tongue-tip"></div>
          <div class="air-burst"></div>
          <div class="air-stream"></div>
        </div>
        <div class="ta-saa-emblem"><span>ت</span><span>ث</span></div>
      </div>
      <div>
        <p class="eyebrow">4-game · 18–22-slaydlar</p>
        <h1>Ta va Sa talaffuz akademiyasi</h1>
        <p class="lead">Til uchining ikki nozik holati, portlovchi va sirg‘aluvchi sifat, to‘rt yozilish shakli, tracing, tez o‘qish va rasmli lug‘at — barchasi bitta jiddiy darsda.</p>
        <div class="skill-pills">
          <span>Shidda</span><span>Raxova</span><span>Maxraj</span><span>Tracing</span><span>4 yangi so‘z</span>
        </div>
        <button id="stage4Start" class="primary-button" type="button">Akademiyaga kirish</button>
      </div>
    </div>
  `);
  document.querySelector("#stage4Start").addEventListener("click", () => {
    state.step = 1;
    renderStage4();
  });
}

function taLessonScreen() {
  const questions = [
    { question: "ت harfining nomi nima?", options: ["Taa", "Saa", "Baa", "Yaa"], answer: "Taa", feedback: "ت — Taa harfi." },
    { question: "Ta harfining maxrajida tilning qaysi qismi ishlaydi?", options: ["Til uchi", "Til o‘rtasi", "Til ildizi"], answer: "Til uchi", feedback: "Ta talaffuzida til uchi faol ishlaydi." },
    { question: "Til uchi Ta talaffuzida qayerga tegadi?", options: ["Yuqori old tishlar milkiga", "Pastki labga", "Yumshoq tanglayga"], answer: "Yuqori old tishlar milkiga", feedback: "Ta: til uchi yuqori old tishlarning milkiga tegadi." },
    { question: "Ta qaysi sifatga ega?", options: ["Shidda — portlovchi", "Raxova — sirg‘aluvchi", "G‘unna"], answer: "Shidda — portlovchi", feedback: "Ta — shidda, ya’ni portlovchi harf." },
    { question: "Shidda talaffuzida havo nima qiladi?", options: ["Maxrajda to‘planadi", "Erkin sirg‘alib o‘tadi", "Burunga yo‘naladi"], answer: "Maxrajda to‘planadi", feedback: "Maxraj berkilib, havo qisqa muddat to‘planadi." },
    { question: "To‘plangan havo keyin qanday chiqadi?", options: ["Portlab chiqadi", "Sekin yo‘qoladi", "Faqat burundan chiqadi"], answer: "Portlab chiqadi", feedback: "Shidda sifatida havo to‘siq ochilganda portlab chiqadi." },
    { question: "Ta nechta yozilish ko‘rinishiga ega?", options: ["To‘rt", "Ikki", "Uch"], answer: "To‘rt", feedback: "Ta alohida, bosh, o‘rta va oxirgi shaklga ega." },
    { question: "Ta o‘zidan keyingi harfga ulanadimi?", options: ["Ulanadi", "Ulanmaydi", "Faqat fatha bilan"], answer: "Ulanadi", feedback: "Ta o‘zidan keyingi harfga qo‘shib yoziladi." },
    { question: "Ta shakllari satrga nisbatan qayerda?", options: ["Satr ustida", "Satr ostida", "Faqat oxiri ostida"], answer: "Satr ustida", feedback: "Ta harfining barcha shakllari satr ustida yoziladi." },
    { question: "Ta harfining alohida shakli qaysi?", options: ["ت", "ث", "ب", "ن"], answer: "ت", feedback: "Ta alohida: ت." },
    { question: "Ta so‘z boshida qanday yoziladi?", options: ["تـ", "ـتـ", "ـت", "ت"], answer: "تـ", feedback: "Ta so‘z boshida: تـ." },
    { question: "Ta so‘z o‘rtasida qanday yoziladi?", options: ["ـتـ", "تـ", "ـت", "ت"], answer: "ـتـ", feedback: "Ta so‘z o‘rtasida: ـتـ." },
    { question: "Ta so‘z oxirida qanday yoziladi?", options: ["ـت", "تـ", "ـتـ", "ت"], answer: "ـت", feedback: "Ta so‘z oxirida: ـت." },
    { question: "Ta harfida nechta nuqta bor?", options: ["Ikki nuqta yuqorida", "Uch nuqta yuqorida", "Bitta nuqta pastda"], answer: "Ikki nuqta yuqorida", feedback: "Ta ustida ikkita nuqta bor." },
  ];
  runQuestionDeck({
    id: "ta-lesson",
    eyebrow: "1-dars · Ta harfi",
    questions,
    visual: (q, index) => `
      <div class="phonetic-lab ta-lab">
        <div class="phonetic-mouth">
          <div class="teeth-row"></div><div class="tongue-contact"></div><div class="blocked-air"></div>
        </div>
        <div class="quality-badge">SHIDDA</div>
        <div class="hero-glyph">${["ت","تـ","ـتـ","ـت"][index % 4]}</div>
        <div class="burst-particles">${"<i></i>".repeat(7)}</div>
        <p>Til uchi → yuqori old tishlar milki</p>
      </div>
    `,
  });
}

function makeStage4TracingScreen(config) {
  let index = 0;
  const forms = config.forms;
  const body = () => `
    <div class="trace-layout stage4-trace">
      <div>
        <p class="eyebrow">${config.eyebrow}</p>
        <h2>${config.name}: ${config.labels[index]} shaklini yozing</h2>
        <p class="lead">Xira iz bo‘ylab o‘ngdan chapga chizing. Nuqtalar ham harfning ajralmas qismi.</p>
        <div class="trace-stats"><span>${index + 1} / ${forms.length}</span><span id="tracePercent">0%</span></div>
        <div class="button-row">
          <button id="clearTrace" class="secondary-button" type="button">Tozalash</button>
          <button id="finishTrace" class="primary-button" type="button" disabled>Tayyor</button>
        </div>
        <div id="traceFeedback" class="feedback-panel">Harf tanasi va nuqtalarini chizing.</div>
      </div>
      <div class="trace-board ${config.className}">
        <canvas id="traceCanvas" aria-label="${config.name} yozish maydoni"></canvas>
        <div class="writing-direction">←</div>
      </div>
    </div>
  `;
  render(body());

  const bind = () => {
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
      context.fillStyle = "rgba(12,83,96,.12)";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = `700 ${Math.min(width, height) * .55}px "Traditional Arabic", serif`;
      context.fillText(forms[index], width / 2, height / 2);
      context.strokeStyle = "rgba(221,169,65,.25)";
      context.lineWidth = 2;
      context.setLineDash([8, 10]);
      context.beginPath();
      context.moveTo(22, height * .72);
      context.lineTo(width - 22, height * .72);
      context.stroke();
      context.setLineDash([]);
    };
    drawGuide();
    const point = (event) => {
      const bounds = canvas.getBoundingClientRect();
      return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    };
    canvas.addEventListener("pointerdown", (event) => {
      drawing = true; last = point(event); canvas.setPointerCapture(event.pointerId);
    });
    canvas.addEventListener("pointermove", (event) => {
      if (!drawing) return;
      const current = point(event);
      context.strokeStyle = config.ink;
      context.lineWidth = 13;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.beginPath();
      context.moveTo(last.x, last.y);
      context.lineTo(current.x, current.y);
      context.stroke();
      distance += Math.hypot(current.x - last.x, current.y - last.y);
      last = current;
      const percent = Math.min(100, Math.round(distance / 4.3));
      document.querySelector("#tracePercent").textContent = `${percent}%`;
      if (percent >= 78) document.querySelector("#finishTrace").disabled = false;
    });
    const stop = () => { drawing = false; last = null; };
    canvas.addEventListener("pointerup", stop);
    canvas.addEventListener("pointercancel", stop);
    document.querySelector("#clearTrace").addEventListener("click", () => {
      distance = 0; drawGuide();
      document.querySelector("#tracePercent").textContent = "0%";
      document.querySelector("#finishTrace").disabled = true;
    });
    document.querySelector("#finishTrace").addEventListener("click", () => {
      reward(`${config.id}-${index}`, 20);
      index += 1;
      if (index >= forms.length) {
        state.step += 1;
        renderStage4();
      } else {
        screen.querySelector(".screen-content").innerHTML = body();
        bind();
      }
    });
  };
  bind();
}

function taTracingScreen() {
  makeStage4TracingScreen({
    id: "ta-trace", name: "Ta", eyebrow: "2-dars · Ta yozuv ustaxonasi",
    forms: ["ت", "تـ", "ـتـ", "ـت"], labels: ["alohida", "so‘z boshi", "so‘z o‘rtasi", "so‘z oxiri"],
    ink: "#158c88", className: "ta-trace-board",
  });
}

function saaLessonScreen() {
  const questions = [
    { question: "ث harfining qo‘llanmadagi nomi nima?", options: ["Saa", "Taa", "Baa", "Yaa"], answer: "Saa", feedback: "ث — Saa harfi." },
    { question: "Sa harfining maxrajida tilning qaysi qismi ishlaydi?", options: ["Til uchi", "Til o‘rtasi", "Til ildizi"], answer: "Til uchi", feedback: "Sa talaffuzida til uchi ishlaydi." },
    { question: "Sa talaffuzida til uchi qayerga tegadi?", options: ["Yuqori old tishlarning ichiga", "Yuqori milkka", "Pastki labga"], answer: "Yuqori old tishlarning ichiga", feedback: "Sa: til uchi yuqori old tishlarning ichiga yaqinlashadi/tegadi." },
    { question: "Sa qaysi sifatga ega?", options: ["Raxova — sirg‘aluvchi", "Shidda — portlovchi", "Qalqala"], answer: "Raxova — sirg‘aluvchi", feedback: "Sa — raxova, ya’ni sirg‘aluvchi harf." },
    { question: "Raxova talaffuzida havo nima qiladi?", options: ["Erkin sirg‘alib o‘tadi", "To‘liq to‘planadi", "Faqat burunga ketadi"], answer: "Erkin sirg‘alib o‘tadi", feedback: "Maxraj to‘liq berkimasligi sabab havo sirg‘aladi." },
    { question: "Raxova sifati qachon yaqqolroq bilinadi?", options: ["Sukun bilan", "Faqat tanvin bilan", "Faqat madd bilan"], answer: "Sukun bilan", feedback: "Sirg‘aluvchilik sukunli holatda aniqroq seziladi." },
    { question: "Sa nechta yozilish ko‘rinishiga ega?", options: ["To‘rt", "Ikki", "Uch"], answer: "To‘rt", feedback: "Sa to‘rt ko‘rinishli harf." },
    { question: "Sa keyingi harfga ulanadimi?", options: ["Ulanadi", "Ulanmaydi", "Faqat kasrada"], answer: "Ulanadi", feedback: "Sa o‘zidan keyingi harfga ulanadi." },
    { question: "Sa shakllari satrga nisbatan qayerda?", options: ["Satr ustida", "Satr ostida", "Faqat alohida ostida"], answer: "Satr ustida", feedback: "Sa barcha shakllarda satr ustida." },
    { question: "Sa alohida shakli qaysi?", options: ["ث", "ت", "ب", "ن"], answer: "ث", feedback: "Sa alohida: ث." },
    { question: "Sa so‘z boshida qanday yoziladi?", options: ["ثـ", "ـثـ", "ـث", "ث"], answer: "ثـ", feedback: "Sa so‘z boshida: ثـ." },
    { question: "Sa so‘z o‘rtasida qanday yoziladi?", options: ["ـثـ", "ثـ", "ـث", "ث"], answer: "ـثـ", feedback: "Sa so‘z o‘rtasida: ـثـ." },
    { question: "Sa so‘z oxirida qanday yoziladi?", options: ["ـث", "ثـ", "ـثـ", "ث"], answer: "ـث", feedback: "Sa so‘z oxirida: ـث." },
    { question: "Sa harfida nechta nuqta bor?", options: ["Uch nuqta yuqorida", "Ikki nuqta yuqorida", "Bitta nuqta pastda"], answer: "Uch nuqta yuqorida", feedback: "Sa ustida uchta nuqta bor." },
  ];
  runQuestionDeck({
    id: "saa-lesson",
    eyebrow: "3-dars · Sa harfi",
    questions,
    visual: (q, index) => `
      <div class="phonetic-lab saa-lab">
        <div class="phonetic-mouth">
          <div class="teeth-row exposed"></div><div class="tongue-between"></div><div class="flowing-air">${"<i></i>".repeat(5)}</div>
        </div>
        <div class="quality-badge">RAXOVA</div>
        <div class="hero-glyph">${["ث","ثـ","ـثـ","ـث"][index % 4]}</div>
        <p>Til uchi → yuqori old tishlar ichki tomoni</p>
      </div>
    `,
  });
}

function saaTracingScreen() {
  makeStage4TracingScreen({
    id: "saa-trace", name: "Sa", eyebrow: "4-dars · Sa yozuv ustaxonasi",
    forms: ["ث", "ثـ", "ـثـ", "ـث"], labels: ["alohida", "so‘z boshi", "so‘z o‘rtasi", "so‘z oxiri"],
    ink: "#9b4f76", className: "saa-trace-board",
  });
}

function qualityContrastScreen() {
  const questions = [
    { question: "Portlovchi sifatning arabcha nomi?", options: ["Shidda", "Raxova", "G‘unna"], answer: "Shidda", feedback: "Portlovchi sifat — shidda." },
    { question: "Sirg‘aluvchi sifatning arabcha nomi?", options: ["Raxova", "Shidda", "Iste’lo"], answer: "Raxova", feedback: "Sirg‘aluvchi sifat — raxova." },
    { question: "Qaysi harf shidda sifatiga ega?", options: ["ت", "ث", "ي"], answer: "ت", feedback: "Ta — shidda." },
    { question: "Qaysi harf raxova sifatiga ega?", options: ["ث", "ت", "ب"], answer: "ث", feedback: "Sa — raxova." },
    { question: "Qaysi sifatda maxraj berkilib qoladi?", options: ["Shidda", "Raxova", "Madd"], answer: "Shidda", feedback: "Shiddada havo yo‘li vaqtincha to‘siladi." },
    { question: "Qaysi sifatda maxraj to‘liq berkimasligi kerak?", options: ["Raxova", "Shidda", "Tashdid"], answer: "Raxova", feedback: "Raxovada havo erkinroq o‘tadi." },
    { question: "Shar ichidagi siqilgan havoga o‘xshatilgan sifat qaysi?", options: ["Shidda", "Raxova", "Tanvin"], answer: "Shidda", feedback: "Qo‘llanma shiddani havo to‘plangan sharga qiyoslaydi." },
    { question: "Uzoq davom etuvchi havo oqimi qaysi sifatga mos?", options: ["Raxova", "Shidda", "Qalqala"], answer: "Raxova", feedback: "Raxova — davomli sirg‘aluvchi havo." },
    { question: "تْ o‘qilganda nima seziladi?", options: ["Qisqa portlash", "Uzoq havo oqimi", "Burun tovushi"], answer: "Qisqa portlash", feedback: "Sukunli Ta shiddani aniq ko‘rsatadi." },
    { question: "ثْ o‘qilganda nima seziladi?", options: ["Davomli havo oqimi", "Qisqa portlash", "Tovush yo‘qolishi"], answer: "Davomli havo oqimi", feedback: "Sukunli Sa raxovani yaqqol ko‘rsatadi." },
    { question: "Ta va Sa nimasi bilan o‘xshash?", options: ["Ikkalasi to‘rt shaklli va ulanadi", "Ikkalasi ikki shaklli", "Ikkalasi ulanmaydi"], answer: "Ikkalasi to‘rt shaklli va ulanadi", feedback: "Ta va Sa to‘rt shaklli, satr ustida va keyingi harfga ulanadi." },
    { question: "Ta va Sa asosiy farqi nimada?", options: ["Maxraj tafsiloti va sifatida", "Harf sonida", "Yozuv yo‘nalishida"], answer: "Maxraj tafsiloti va sifatida", feedback: "Til uchi joyi va havo oqimi ularni farqlaydi." },
  ];
  runQuestionDeck({
    id: "quality-contrast",
    eyebrow: "5-dars · Havo oqimi dueli",
    questions,
    visual: (q, index) => `
      <div class="airflow-duel">
        <div class="duel-side shidda-side"><strong>تْ</strong><span>SHIDDA</span><div class="burst-orb"></div></div>
        <div class="duel-meter"><i style="--position:${index % 2 ? "70%" : "30%"}"></i></div>
        <div class="duel-side raxova-side"><strong>ثْ</strong><span>RAXOVA</span><div class="stream-lines">${"<b></b>".repeat(4)}</div></div>
      </div>
    `,
  });
}

function vocabularyAcademyScreen() {
  let phase = "learn";
  let index = 0;
  const recallQuestions = [
    { type: "meaning", word: "تُوتٌ", question: "تُوتٌ so‘zining ma’nosi?", options: ["Tut daraxti / tut mevasi", "Uy", "Isbot", "Sobit"], answer: "Tut daraxti / tut mevasi" },
    { type: "meaning", word: "بَيْتٌ", question: "بَيْتٌ so‘zining ma’nosi?", options: ["Uy", "Tut mevasi", "Isbot", "Bardavom"], answer: "Uy" },
    { type: "meaning", word: "ثَابِتٌ", question: "ثَابِتٌ so‘zining ma’nosi?", options: ["Sobit, bardavom", "Uy", "Tut mevasi", "Isbot"], answer: "Sobit, bardavom" },
    { type: "meaning", word: "إِثْبَاتٌ", question: "إِثْبَاتٌ so‘zining ma’nosi?", options: ["Isbot", "Uy", "Bardavom", "Tut mevasi"], answer: "Isbot" },
    { type: "word", image: "assets/vocabulary/tut.jpg", question: "Rasmga mos arabcha so‘zni toping.", options: ["تُوتٌ", "بَيْتٌ", "ثَابِتٌ", "إِثْبَاتٌ"], answer: "تُوتٌ" },
    { type: "word", image: "assets/vocabulary/uy.jpg", question: "Rasmga mos arabcha so‘zni toping.", options: ["بَيْتٌ", "تُوتٌ", "إِثْبَاتٌ", "ثَابِتٌ"], answer: "بَيْتٌ" },
    { type: "word", image: "assets/vocabulary/sobit.jpg", question: "Rasmga mos arabcha so‘zni toping.", options: ["ثَابِتٌ", "إِثْبَاتٌ", "بَيْتٌ", "تُوتٌ"], answer: "ثَابِتٌ" },
    { type: "word", image: "assets/vocabulary/isbot.jpg", question: "Rasmga mos arabcha so‘zni toping.", options: ["إِثْبَاتٌ", "ثَابِتٌ", "بَيْتٌ", "تُوتٌ"], answer: "إِثْبَاتٌ" },
    { type: "image", word: "تُوتٌ", question: "تُوتٌ uchun to‘g‘ri rasmni tanlang.", answer: "assets/vocabulary/tut.jpg" },
    { type: "image", word: "بَيْتٌ", question: "بَيْتٌ uchun to‘g‘ri rasmni tanlang.", answer: "assets/vocabulary/uy.jpg" },
    { type: "image", word: "ثَابِتٌ", question: "ثَابِتٌ uchun to‘g‘ri rasmni tanlang.", answer: "assets/vocabulary/sobit.jpg" },
    { type: "image", word: "إِثْبَاتٌ", question: "إِثْبَاتٌ uchun to‘g‘ri rasmni tanlang.", answer: "assets/vocabulary/isbot.jpg" },
    { type: "meaning", word: "بَيْتٌ", question: "“Uy” ma’nosidagi so‘zni toping.", options: ["بَيْتٌ", "تُوتٌ", "ثَابِتٌ", "إِثْبَاتٌ"], answer: "بَيْتٌ" },
    { type: "meaning", word: "تُوتٌ", question: "“Tut mevasi” ma’nosidagi so‘zni toping.", options: ["تُوتٌ", "بَيْتٌ", "إِثْبَاتٌ", "ثَابِتٌ"], answer: "تُوتٌ" },
    { type: "meaning", word: "ثَابِتٌ", question: "“Sobit, bardavom” ma’nosidagi so‘zni toping.", options: ["ثَابِتٌ", "إِثْبَاتٌ", "بَيْتٌ", "تُوتٌ"], answer: "ثَابِتٌ" },
    { type: "meaning", word: "إِثْبَاتٌ", question: "“Isbot” ma’nosidagi so‘zni toping.", options: ["إِثْبَاتٌ", "ثَابِتٌ", "تُوتٌ", "بَيْتٌ"], answer: "إِثْبَاتٌ" },
  ];

  const learnBody = () => {
    const item = stage4Vocabulary[index];
    return `
      <div class="vocab-learning">
        <div class="vocab-image-frame" style="--accent:${item.color}">
          <img src="${item.image}" alt="${item.meaning}">
          <div class="memory-rings"></div>
        </div>
        <div>
          <p class="eyebrow">6-dars · Yangi so‘z ${index + 1}/4</p>
          <div class="vocab-word arabic">${item.word}</div>
          <h2>${item.meaning}</h2>
          <p class="lead">Rasm, arabcha shakl va ma’noni birgalikda eslab qoling. So‘zni harflarga ajratib kuzating.</p>
          <div class="word-segments">${splitGraphemes(item.word).map(letter => `<span>${letter}</span>`).join("")}</div>
          <button id="memorizedWord" class="primary-button" type="button">Yodladim</button>
        </div>
      </div>
    `;
  };

  const recallBody = () => {
    const q = recallQuestions[index];
    const imageChoices = shuffle(stage4Vocabulary.map(item => item.image));
    return `
      <div class="vocab-recall">
        ${q.image ? `<div class="recall-main-image"><img src="${q.image}" alt=""></div>` : `<div class="recall-word arabic">${q.word || "؟"}</div>`}
        <div class="mission-card">
          <p class="eyebrow">6-dars · Lug‘at xotirasi</p>
          <h2>${q.question}</h2>
          <p class="lead">${index + 1}/16 · So‘zlar endi yordamsiz esga olinadi.</p>
          ${q.type === "image" ? `
            <div class="image-answer-grid">
              ${imageChoices.map(src => `<button class="image-answer" data-value="${src}" type="button"><img src="${src}" alt=""></button>`).join("")}
            </div>
          ` : `
            <div class="answer-grid">
              ${shuffle(q.options).map(option => `<button class="answer-card arabic-option" data-value="${option}" type="button">${option}</button>`).join("")}
            </div>
          `}
          <div id="vocabFeedback" class="feedback-panel">Xotirangizdan javob bering.</div>
        </div>
      </div>
    `;
  };

  render(learnBody());
  const bindLearn = () => {
    document.querySelector("#memorizedWord").addEventListener("click", () => {
      reward(`vocab-learn-${index}`, 10);
      index += 1;
      if (index >= stage4Vocabulary.length) {
        phase = "recall"; index = 0;
        screen.querySelector(".screen-content").innerHTML = recallBody();
        bindRecall();
      } else {
        screen.querySelector(".screen-content").innerHTML = learnBody();
        bindLearn();
      }
    });
  };
  const bindRecall = () => {
    document.querySelectorAll("[data-value]").forEach(button => {
      button.addEventListener("click", () => {
        const q = recallQuestions[index];
        const id = `vocab-recall-${index}`;
        if (button.dataset.value === q.answer) {
          button.classList.add("correct");
          reward(id, 12);
          document.querySelector("#vocabFeedback").textContent = "To‘g‘ri! Rasm, so‘z va ma’no xotirada bog‘landi.";
          setTimeout(() => {
            index += 1;
            if (index >= recallQuestions.length) {
              state.step += 1; renderStage4();
            } else {
              screen.querySelector(".screen-content").innerHTML = recallBody();
              bindRecall();
            }
          }, 700);
        } else {
          button.classList.add("wrong");
          miss("Bu boshqa so‘zga tegishli. Rasm va arabcha shaklni yana solishtiring.", id);
          setTimeout(() => button.classList.remove("wrong"), 500);
        }
      });
    });
  };
  bindLearn();
}

function stage4ReadingScreen() {
  const questions = [
    { question: "تَ qanday o‘qiladi?", options: ["ta", "ti", "tu"], answer: "ta", feedback: "تَ — ta." },
    { question: "تِ qanday o‘qiladi?", options: ["ti", "ta", "tu"], answer: "ti", feedback: "تِ — ti." },
    { question: "تُ qanday o‘qiladi?", options: ["tu", "ti", "ta"], answer: "tu", feedback: "تُ — tu." },
    { question: "تَا qanday o‘qiladi?", options: ["taa", "tii", "tuu"], answer: "taa", feedback: "تَا — taa." },
    { question: "تِي qanday o‘qiladi?", options: ["tii", "taa", "tuu"], answer: "tii", feedback: "تِي — tii." },
    { question: "تُو qanday o‘qiladi?", options: ["tuu", "tii", "taa"], answer: "tuu", feedback: "تُو — tuu." },
    { question: "اَتْ qanday o‘qiladi?", options: ["at", "it", "ut"], answer: "at", feedback: "اَتْ — at." },
    { question: "اِتْ qanday o‘qiladi?", options: ["it", "at", "ut"], answer: "it", feedback: "اِتْ — it." },
    { question: "اُتْ qanday o‘qiladi?", options: ["ut", "it", "at"], answer: "ut", feedback: "اُتْ — ut." },
    { question: "ثَ qanday o‘qiladi?", options: ["sa", "si", "su"], answer: "sa", feedback: "ثَ — sa (qo‘llanma transkripsiyasi)." },
    { question: "ثِ qanday o‘qiladi?", options: ["si", "sa", "su"], answer: "si", feedback: "ثِ — si." },
    { question: "ثُ qanday o‘qiladi?", options: ["su", "si", "sa"], answer: "su", feedback: "ثُ — su." },
    { question: "ثَا qanday o‘qiladi?", options: ["saa", "sii", "suu"], answer: "saa", feedback: "ثَا — saa." },
    { question: "ثِي qanday o‘qiladi?", options: ["sii", "saa", "suu"], answer: "sii", feedback: "ثِي — sii." },
    { question: "ثُو qanday o‘qiladi?", options: ["suu", "sii", "saa"], answer: "suu", feedback: "ثُو — suu." },
    { question: "اَثْ qanday o‘qiladi?", options: ["as", "is", "us"], answer: "as", feedback: "اَثْ — as." },
    { question: "اِثْ qanday o‘qiladi?", options: ["is", "as", "us"], answer: "is", feedback: "اِثْ — is." },
    { question: "اُثْ qanday o‘qiladi?", options: ["us", "is", "as"], answer: "us", feedback: "اُثْ — us." },
    { question: "تَوْبًا ni toping.", options: ["tawban", "sawban", "tuutan"], answer: "tawban", feedback: "تَوْبًا — tawban." },
    { question: "ثَوْبًا ni toping.", options: ["sawban", "tawban", "baytan"], answer: "sawban", feedback: "ثَوْبًا — sawban." },
    { question: "تُوتًا ni toping.", options: ["tuutan", "buutan", "sawban"], answer: "tuutan", feedback: "تُوتًا — tuutan." },
    { question: "بُيُوتٌ ni toping.", options: ["buyuutun", "baytun", "baabun"], answer: "buyuutun", feedback: "بُيُوتٌ — buyuutun." },
    { question: "ثَبَتَ ni toping.", options: ["sabata", "subita", "asbata"], answer: "sabata", feedback: "ثَبَتَ — sabata." },
    { question: "إِثْبَاتٌ ni toping.", options: ["isbaatun", "saabitun", "tuutun"], answer: "isbaatun", feedback: "إِثْبَاتٌ — isbaatun." },
  ];
  runQuestionDeck({
    id: "stage4-reading",
    eyebrow: "7-dars · O‘qish va tezlik",
    questions,
    visual: (q, index) => `
      <div class="speed-reader">
        <div class="speed-word arabic">${q.question.split(" ")[0]}</div>
        <div class="speed-lanes"><i></i><i></i><i></i></div>
        <div class="speed-timer"><span>${index < 9 ? "TA" : index < 18 ? "SA" : "SO‘Z"}</span><b>${String(index + 1).padStart(2, "0")}</b></div>
      </div>
    `,
  });
}

function stage4MasteryScreen() {
  const questions = [
    { question: "Til uchi yuqori old tishlar milkiga tegadigan harf?", options: ["ت", "ث", "ب"], answer: "ت", feedback: "Ta maxraji — yuqori old tishlar milki." },
    { question: "Til uchi yuqori old tishlarning ichiga yaqinlashadigan harf?", options: ["ث", "ت", "و"], answer: "ث", feedback: "Sa maxraji — yuqori old tishlarning ichki tomoni." },
    { question: "Portlovchi sifatli harf qaysi?", options: ["ت", "ث", "ي"], answer: "ت", feedback: "Ta — shidda." },
    { question: "Sirg‘aluvchi sifatli harf qaysi?", options: ["ث", "ت", "ب"], answer: "ث", feedback: "Sa — raxova." },
    { question: "ـتـ qaysi shakl?", options: ["Ta o‘rta", "Sa o‘rta", "Ta oxiri"], answer: "Ta o‘rta", feedback: "ـتـ — Ta o‘rta shakli." },
    { question: "ثـ qaysi shakl?", options: ["Sa bosh", "Ta bosh", "Sa oxiri"], answer: "Sa bosh", feedback: "ثـ — Sa bosh shakli." },
    { question: "تُوتٌ ma’nosi?", options: ["Tut mevasi", "Uy", "Isbot"], answer: "Tut mevasi", feedback: "تُوتٌ — tut." },
    { question: "بَيْتٌ ma’nosi?", options: ["Uy", "Tut", "Bardavom"], answer: "Uy", feedback: "بَيْتٌ — uy." },
    { question: "ثَابِتٌ ma’nosi?", options: ["Sobit, bardavom", "Isbot", "Uy"], answer: "Sobit, bardavom", feedback: "ثَابِتٌ — sobit, bardavom." },
    { question: "إِثْبَاتٌ ma’nosi?", options: ["Isbot", "Uy", "Tut"], answer: "Isbot", feedback: "إِثْبَاتٌ — isbot." },
    { question: "تُو qanday o‘qiladi?", options: ["tuu", "tii", "taa"], answer: "tuu", feedback: "تُو — tuu." },
    { question: "ثِي qanday o‘qiladi?", options: ["sii", "saa", "suu"], answer: "sii", feedback: "ثِي — sii." },
  ];
  runQuestionDeck({
    id: "stage4-mastery",
    eyebrow: "8-dars · Akademiya imtihoni",
    questions,
    layout: "result-layout",
    prompt: "Maxraj, sifat, yozuv, lug‘at va o‘qishni birlashtiring.",
  });
}

function stage4FinalScreen() {
  const accuracy = state.attempts ? Math.round((state.correct / state.attempts) * 100) : 0;
  const stars = accuracy >= 90 ? 3 : accuracy >= 75 ? 2 : 1;
  localStorage.setItem("fonetika-stage-4", JSON.stringify({ score: state.score, accuracy, completedAt: new Date().toISOString() }));
  render(`
    <div class="result-layout">
      <div class="stage4-crown"><span>ت</span><span>ث</span></div>
      <p class="eyebrow" style="justify-content:center">4-bosqich yakuni</p>
      <h2>Talaffuz akademiyasi muvaffaqiyatli tugadi!</h2>
      <p class="lead" style="margin-inline:auto">Siz Ta va Sa maxrajini, shidda–raxova sifatlarini, to‘rt shaklni, yozishni, o‘qishni va 4 ta yangi so‘zni o‘zlashtirdingiz.</p>
      <div class="stars">${"★".repeat(stars)}${"☆".repeat(3 - stars)}</div>
      <div class="result-stats">
        <div class="stat-card"><strong>${state.score}</strong><span>Jami ball</span></div>
        <div class="stat-card"><strong>${accuracy}%</strong><span>Aniqlik</span></div>
        <div class="stat-card"><strong>4/4</strong><span>Yangi so‘z</span></div>
      </div>
      <div class="button-row" style="justify-content:center">
        <button id="stage4Again" class="secondary-button" type="button">Qayta mashq</button>
        <button id="stage4Menu" class="primary-button" type="button">Bosh menyu</button>
      </div>
    </div>
  `);
  document.querySelector("#stage4Again").addEventListener("click", () => { resetProgress("stage4"); renderStage4(); });
  document.querySelector("#stage4Menu").addEventListener("click", goHome);
}

function renderStage4() {
  const screens = [
    stage4IntroScreen,
    taLessonScreen,
    taTracingScreen,
    saaLessonScreen,
    saaTracingScreen,
    qualityContrastScreen,
    vocabularyAcademyScreen,
    stage4ReadingScreen,
    stage4MasteryScreen,
    stage4FinalScreen,
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
  if (state.mode === "stage4") {
    renderStage4();
    return;
  }
  if (state.mode === "stage3") {
    renderStage3();
    return;
  }
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

const stage4Route = location.hash.match(/^#stage4(?:-(\d+))?$/);
const stage3Route = location.hash.match(/^#stage3(?:-(\d+))?$/);
const stage2Route = location.hash.match(/^#stage2(?:-(\d+))?$/);
if (stage4Route) {
  state.mode = "stage4";
  state.step = Math.min(Number(stage4Route[1] || 0), stage4Sections - 1);
} else if (stage3Route) {
  state.mode = "stage3";
  state.step = Math.min(Number(stage3Route[1] || 0), stage3Sections - 1);
} else if (stage2Route) {
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
