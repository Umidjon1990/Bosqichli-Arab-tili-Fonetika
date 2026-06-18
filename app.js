const screen = document.querySelector("#screen");
const progressWrap = document.querySelector("#progressWrap");
const progressBar = document.querySelector("#progressBar");
const progressLabel = document.querySelector("#progressLabel");
const scoreLabel = document.querySelector("#scoreLabel");
const homeButton = document.querySelector("#homeButton");
const soundButton = document.querySelector("#soundButton");
const toast = document.querySelector("#toast");

const state = {
  step: 0,
  score: 0,
  correct: 0,
  attempts: 0,
  sound: true,
  completed: new Set(),
};

const totalSteps = 8;
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

function speak(text, lang = "uz-UZ") {
  if (!state.sound || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.78;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
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
  const facts = [
    ["28 ta harf", "Arab alifbosidagi harflar soni", true],
    ["O‘ngdan chapga", "Arab yozuvining yo‘nalishi", true],
    ["BMT rasmiy tili", "Arab tili BMT rasmiy tillaridan biri", true],
    ["Katta-kichik harf", "Arab yozuvida alohida katta va kichik harflar bor", false],
  ];

  render(`
    <div>
      <p class="eyebrow">2-xona · Arab tili dunyosi</p>
      <h2>Haqiqat kartalarini toping</h2>
      <p class="lead">To‘g‘ri ma’lumotlarni tanlang. Bitta kartada kichik tuzoq bor.</p>
      <div class="fact-grid">
        ${facts.map((fact, index) => `
          <button class="fact-card" data-correct="${fact[2]}" data-index="${index}" type="button">
            <strong>${fact[0]}</strong><span>${fact[1]}</span>
          </button>
        `).join("")}
      </div>
      <div id="factsFeedback" class="feedback-panel">Kamida uchta to‘g‘ri faktni toping.</div>
      <div class="button-row" style="margin-top:18px; justify-content:flex-end">
        <button id="nextButton" class="primary-button hidden" type="button">Alifbo panoramasiga o‘tish</button>
      </div>
    </div>
  `);

  let selected = 0;
  document.querySelectorAll(".fact-card").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.disabled) return;
      if (button.dataset.correct === "true") {
        button.classList.add("correct");
        button.disabled = true;
        selected += 1;
        reward(`fact-${button.dataset.index}`, 7);
        document.querySelector("#factsFeedback").textContent = "To‘g‘ri! Bu ma’lumot kitobning kirish qismida berilgan.";
        if (selected === 3) document.querySelector("#nextButton").classList.remove("hidden");
      } else {
        button.classList.add("wrong");
        miss("Arab yozuvida katta va kichik harflar farqlanmaydi.");
        setTimeout(() => button.classList.remove("wrong"), 500);
      }
    });
  });
  bindNext();
}

function alphabetScreen() {
  const ring = arabicLetters.map((letter, index) => {
    const angle = `${(360 / arabicLetters.length) * index}deg`;
    return `<span class="letter-chip" style="--angle:${angle}">${letter}</span>`;
  }).join("");

  render(`
    <div class="lesson-layout">
      <div>
        <p class="eyebrow">3-xona · Alifbo panoramasi</p>
        <h2>28 harf — bitta uyg‘un tizim</h2>
        <p class="lead">Hozir harflarning nomini yodlamaymiz. Ular bilan faqat tanishamiz: arab alifbosi 28 ta harfdan iborat.</p>
        <div class="answer-grid">
          <button class="answer-card" data-answer="24" type="button">24 ta harf</button>
          <button class="answer-card" data-answer="28" type="button">28 ta harf</button>
          <button class="answer-card" data-answer="32" type="button">32 ta harf</button>
        </div>
        <div id="alphabetFeedback" class="feedback-panel">To‘g‘ri sonni tanlang.</div>
        <div class="button-row" style="margin-top:18px">
          <button id="nextButton" class="primary-button hidden" type="button">Harf shakllarini ko‘rish</button>
        </div>
      </div>
      <div class="alphabet-orbit" aria-label="28 ta arab harfi panoramasi">
        <div class="letters-ring">${ring}</div>
        <div class="alphabet-core"><div><strong>28</strong><span>ta harf</span></div></div>
      </div>
    </div>
  `);

  document.querySelectorAll(".answer-card").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.answer === "28") {
        button.classList.add("correct");
        reward("alphabet-count", 15);
        document.querySelector("#alphabetFeedback").textContent = "To‘g‘ri! Arab alifbosi 28 ta harfdan iborat.";
        document.querySelector("#nextButton").classList.remove("hidden");
      } else {
        button.classList.add("wrong");
        miss("Yana bir bor markazdagi raqamga qarang.");
        setTimeout(() => button.classList.remove("wrong"), 500);
      }
    });
  });
  bindNext();
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
          document.querySelector("#nextButton").classList.remove("hidden");
        }
      } else {
        card.classList.add("wrong");
        miss(`Avval “${stages[position]}” holatini toping.`);
        setTimeout(() => card.classList.remove("wrong"), 500);
      }
    });
  });

  document.querySelector("#resetSequence").addEventListener("click", reset);
  bindNext();
}

function vowelScreen() {
  const questions = [
    { symbol: "◌َ", name: "Fatha", sound: "a", hint: "yuqorida" },
    { symbol: "◌ِ", name: "Kasra", sound: "i", hint: "pastda" },
    { symbol: "◌ُ", name: "Damma", sound: "u", hint: "yuqorida" },
    { symbol: "◌ْ", name: "Sukun", sound: "unlisiz", hint: "yuqorida" },
  ];
  let index = 0;

  const body = () => `
    <div class="symbol-stage">
      <div id="symbolDisplay" class="symbol-display arabic">${questions[index].symbol}</div>
      <div>
        <p class="eyebrow">5-xona · Harakatlar ustaxonasi</p>
        <h2>Belgining tovushini toping</h2>
        <p class="lead">Bu belgi qaysi qisqa tovushni bildiradi?</p>
        <button id="audioButton" class="audio-button" type="button" aria-label="Tovushni eshitish">▶</button>
        <div class="option-grid">
          ${["a", "i", "u", "unlisiz"].map((option) => `<button class="option-button" data-option="${option}" type="button"><strong>${option}</strong><span>Tovush</span></button>`).join("")}
        </div>
        <div id="vowelFeedback" class="feedback-panel">${index + 1} / ${questions.length} · Belgini diqqat bilan kuzating.</div>
      </div>
    </div>
  `;

  render(body());

  const bind = () => {
    document.querySelector("#audioButton").addEventListener("click", () => {
      speak(questions[index].sound === "unlisiz" ? "sukun" : questions[index].sound);
      const symbol = document.querySelector("#symbolDisplay");
      symbol.classList.remove("pulse");
      void symbol.offsetWidth;
      symbol.classList.add("pulse");
    });

    document.querySelectorAll(".option-button").forEach((button) => {
      button.addEventListener("click", () => {
        const q = questions[index];
        if (button.dataset.option === q.sound) {
          button.classList.add("correct");
          reward(`vowel-${index}`, 10);
          document.querySelector("#vowelFeedback").textContent = `${q.name}: ${q.hint}, “${q.sound}” tovushi.`;
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
          miss(`${q.name} ${q.hint} joylashadi. Yana urinib ko‘ring.`);
          setTimeout(() => button.classList.remove("wrong"), 500);
        }
      });
    });
  };
  bind();
}

function tanwinScreen() {
  const items = [
    { symbol: "◌ً", name: "Ikki fatha", sound: "an", place: "yuqorida" },
    { symbol: "◌ٍ", name: "Ikki kasra", sound: "in", place: "pastda" },
    { symbol: "◌ٌ", name: "Ikki damma", sound: "un", place: "yuqorida" },
  ];
  let index = 0;

  const body = () => `
    <div class="symbol-stage">
      <div id="symbolDisplay" class="symbol-display arabic">${items[index].symbol}</div>
      <div>
        <p class="eyebrow">6-xona · Tanvin laboratoriyasi</p>
        <h2>AN · IN · UN</h2>
        <p class="lead">Tanvin ikkita harakat belgisi bilan yoziladi va odatda so‘z oxirida keladi.</p>
        <button id="audioButton" class="audio-button" type="button" aria-label="Tovushni eshitish">▶</button>
        <div class="option-grid">
          ${["an", "in", "un"].map((option) => `<button class="option-button" data-option="${option}" type="button"><strong>${option}</strong><span>Tanvin tovushi</span></button>`).join("")}
        </div>
        <div id="tanwinFeedback" class="feedback-panel">${index + 1} / ${items.length} · Tovushni tanlang.</div>
      </div>
    </div>
  `;

  render(body());

  const bind = () => {
    document.querySelector("#audioButton").addEventListener("click", () => {
      speak(items[index].sound);
      const symbol = document.querySelector("#symbolDisplay");
      symbol.classList.remove("pulse");
      void symbol.offsetWidth;
      symbol.classList.add("pulse");
    });

    document.querySelectorAll(".option-button").forEach((button) => {
      button.addEventListener("click", () => {
        const item = items[index];
        if (button.dataset.option === item.sound) {
          button.classList.add("correct");
          reward(`tanwin-${index}`, 12);
          document.querySelector("#tanwinFeedback").textContent = `${item.name}: “${item.sound}”, harf ${item.place}.`;
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
          miss(`${item.name} “${item.sound}” deb talaffuz qilinadi.`);
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
    resultScreen,
  ];
  screens[Math.min(state.step, screens.length - 1)]();
}

homeButton.addEventListener("click", goHome);
soundButton.addEventListener("click", () => {
  state.sound = !state.sound;
  soundButton.querySelector("span").textContent = state.sound ? "♪" : "×";
  showToast(state.sound ? "Ovoz yoqildi." : "Ovoz o‘chirildi.");
});

renderStep();

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {
      // O‘yin service worker bo‘lmasa ham to‘liq ishlaydi.
    });
  });
}
