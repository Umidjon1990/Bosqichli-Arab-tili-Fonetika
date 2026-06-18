const screen = document.querySelector("#screen");
const progressWrap = document.querySelector("#progressWrap");
const progressBar = document.querySelector("#progressBar");
const progressLabel = document.querySelector("#progressLabel");
const scoreLabel = document.querySelector("#scoreLabel");
const homeButton = document.querySelector("#homeButton");
const toast = document.querySelector("#toast");

const state = {
  step: 0,
  score: 0,
  correct: 0,
  attempts: 0,
  completed: new Set(),
};

const totalSteps = 9;
const arabicLetters = ["ا","ب","ت","ث","ج","ح","خ","د","ذ","ر","ز","س","ش","ص","ض","ط","ظ","ع","غ","ف","ق","ك","ل","م","ن","و","ه","ي"];

function updateChrome() {
  const active = state.step > 0 && state.step < totalSteps;
  progressWrap.classList.toggle("hidden", !active);
  homeButton.classList.toggle("hidden", state.step === 0);
  progressLabel.textContent = `${Math.min(state.step, totalSteps - 1)} / ${totalSteps - 1}`;
  progressBar.style.width = `${Math.max(0, ((state.step - 1) / (totalSteps - 2)) * 100)}%`;
  scoreLabel.textContent = `${state.score} XP`;
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
    state.completed.add(id);
    state.score += points;
    state.correct += 1;
  }
  updateChrome();
}

function miss(message) {
  state.attempts += 1;
  showToast(message);
}

function next() {
  state.step = Math.min(state.step + 1, totalSteps);
  renderStep();
}

function goHome() {
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
          ${q.options.map((option) => `<button class="answer-card" data-option="${option}" type="button">${option}</button>`).join("")}
        </div>
        <div id="factsFeedback" class="feedback-panel">Kitobning kirish qismidagi ma’lumotni eslang.</div>
      </div>
    });
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
          ${questions[index].options.map((option) => `<button class="answer-card" data-option="${option}" type="button">${option}</button>`).join("")}
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
  const shuffled = [stages[2], stages[0], stages[3], stages[1]];

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
          ${questions[index].options.map((option) => `<button class="option-button" data-option="${option}" type="button"><strong>${option}</strong><span>Javob</span></button>`).join("")}
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
          ${items[index].options.map((option) => `<button class="option-button" data-option="${option}" type="button"><strong>${option}</strong><span>Javob</span></button>`).join("")}
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
        ${questions[index].options.map((option) => `<button class="answer-card" data-option="${option}" type="button">${option}</button>`).join("")}
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
    state.completed.clear();
    renderStep();
  });
  document.querySelector("#finishButton").addEventListener("click", () => {
    showToast("Natija ushbu qurilmada saqlandi.");
  });
}

function renderStep() {
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

renderStep();

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {
      // O‘yin service worker bo‘lmasa ham to‘liq ishlaydi.
    });
  });
}
