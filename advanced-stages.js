const ADVANCED_STAGES = {
  stage7: {
    number: 7, slides: "35–39", title: "Ro · Za", subtitle: "Til uchi va sirli tovushlar",
    accent: "#9a506e", activities: 110,
    letters: [
      { name: "Ro", glyph: "ر", forms: ["ر", "ـر"], labels: ["alohida", "oldingi harfga ulangan"], maxraj: "Til uchi tegishli yuqori milkka yaqinlashadi.", zone: "Yuqori old tishlar milki", quality: "Takrir", detail: "Til uchini ortiqcha titratmasdan bir marta aniq urish kerak.", joins: false, line: "Ikki shakli ham satr ustida yoziladi.", dots: "Nuqtasiz", contrast: "Za", a: "رَ", i: "رِ", u: "رُ", aa: "رَا", ii: "رِي", uu: "رُو", sukun: "أَرْ" },
      { name: "Za", glyph: "ز", forms: ["ز", "ـز"], labels: ["alohida", "oldingi harfga ulangan"], maxraj: "Til uchi pastki old tishlarning ichki devoriga yaqinlashadi.", zone: "Pastki old tishlar ichki tomoni", quality: "Sofir", detail: "Havo tor yo‘ldan hushtaksimon sirg‘alib chiqadi.", joins: false, line: "Ikki shakli ham satr ustida yoziladi.", dots: "Bitta nuqta tepada", contrast: "Ro", a: "زَ", i: "زِ", u: "زُ", aa: "زَا", ii: "زِي", uu: "زُو", sukun: "أَزْ" }
    ],
    vocab: [
      ["خَبَرٌ", "Xabar", "assets/vocabulary7/xabar.jpg"], ["رِيحٌ", "Shamol", "assets/vocabulary7/shamol.jpg"],
      ["خُبْزٌ", "Non", "assets/vocabulary7/non.jpg"], ["أَرُزٌّ", "Guruch", "assets/vocabulary7/guruch.jpg"]
    ]
  },
  stage8: {
    number: 8, slides: "40–44", title: "Sin · Shin", subtitle: "Sirg‘alish va havo tarqalishi",
    accent: "#147e87", activities: 114,
    letters: [
      { name: "Sin", glyph: "س", forms: ["س", "سـ", "ـسـ", "ـس"], labels: ["alohida", "so‘z boshi", "so‘z o‘rtasi", "so‘z oxiri"], maxraj: "Til oldi pastki old tishlarning ichki devoriga yaqinlashadi.", zone: "Pastki tishlar ichki tomoni", quality: "Sofir", detail: "Havo ingichka yo‘ldan sirg‘alib chiqadi.", joins: true, line: "Alohida va oxirgi shakl satrdan tushadi; boshi va o‘rtasi satr ustida.", dots: "Nuqtasiz", contrast: "Shin", a: "سَ", i: "سِ", u: "سُ", aa: "سَا", ii: "سِي", uu: "سُو", sukun: "أَسْ" },
      { name: "Shin", glyph: "ش", forms: ["ش", "شـ", "ـشـ", "ـش"], labels: ["alohida", "so‘z boshi", "so‘z o‘rtasi", "so‘z oxiri"], maxraj: "Til o‘rtasi yuqori tanglayning o‘rtasiga yaqinlashadi.", zone: "Til o‘rtasi va yuqori tanglay", quality: "Tafashshiy", detail: "Havo og‘iz bo‘shlig‘iga yoyiladi; sukun bilan yanada aniq seziladi.", joins: true, line: "Alohida va oxirgi shakl satrdan tushadi; boshi va o‘rtasi satr ustida.", dots: "Uch nuqta tepada", contrast: "Sin", a: "شَ", i: "شِ", u: "شُ", aa: "شَا", ii: "شِي", uu: "شُو", sukun: "أَشْ" }
    ],
    vocab: [
      ["دَرْسٌ", "Dars", "assets/vocabulary8/dars.jpg"], ["سِتٌّ", "Olti", "assets/vocabulary8/olti.jpg"],
      ["بَشَرٌ", "Xalq", "assets/vocabulary8/xalq.jpg"], ["شَرِبَ", "Ichdi", "assets/vocabulary8/ichdi.jpg"]
    ]
  },
  stage9: {
    number: 9, slides: "45–49", title: "Sod · Dod", subtitle: "Qalin tovushlar qal’asi",
    accent: "#a66f26", activities: 114,
    letters: [
      { name: "Sod", glyph: "ص", forms: ["ص", "صـ", "ـصـ", "ـص"], labels: ["alohida", "so‘z boshi", "so‘z o‘rtasi", "so‘z oxiri"], maxraj: "Til uchi old tishlar ichiga yaqin, til orqasi esa ko‘tarilgan holda talaffuz qilinadi.", zone: "Til uchi va ko‘tarilgan til orqasi", quality: "Itboq", detail: "Til tanglayga yaqinlashib, tovush qalin va bosimli chiqadi.", joins: true, line: "Barcha shakllari satr ustida boshqariladi.", dots: "Nuqtasiz", contrast: "Dod", a: "صَ", i: "صِ", u: "صُ", aa: "صَا", ii: "صِي", uu: "صُو", sukun: "أَصْ" },
      { name: "Dod", glyph: "ض", forms: ["ض", "ضـ", "ـضـ", "ـض"], labels: ["alohida", "so‘z boshi", "so‘z o‘rtasi", "so‘z oxiri"], maxraj: "Tilning bir yoki ikki yon cheti yuqori jag‘ oziq tishlariga tegadi.", zone: "Til yon cheti va oziq tishlar", quality: "Istitola", detail: "Tovush til yonidan oldinga cho‘zilib oqadi.", joins: true, line: "Barcha shakllari satr ustida boshqariladi.", dots: "Bitta nuqta tepada", contrast: "Sod", a: "ضَ", i: "ضِ", u: "ضُ", aa: "ضَا", ii: "ضِي", uu: "ضُو", sukun: "أَضْ" }
    ],
    vocab: [
      ["أَرْضٌ", "Yer", "assets/vocabulary9/yer.jpg"], ["ضَرَبَ", "Urdi", "assets/vocabulary9/urdi.jpg"],
      ["صَبْرٌ", "Sabr", "assets/vocabulary9/sabr.jpg"], ["بَصِيرٌ", "Ko‘radigan", "assets/vocabulary9/koradigan.jpg"]
    ]
  },
  stage10: {
    number: 10, slides: "50–54", title: "To · Zo", subtitle: "Til uchi va ko‘tarilgan til orqasi",
    accent: "#8d5d38", activities: 114,
    letters: [
      { name: "To", glyph: "ط", forms: ["ط", "طـ", "ـطـ", "ـط"], labels: ["alohida", "so‘z boshi", "so‘z o‘rtasi", "so‘z oxiri"], maxraj: "Til uchi yuqori old tishlarning ichki ildiziga tegadi, til orqasi ko‘tariladi.", zone: "Yuqori old tishlar ildizi", quality: "Iste’lo · Itboq · Qalqala", detail: "Qalin talaffuz qilinadi; sukunli holatda qalqala aks-sadosi seziladi.", joins: true, line: "Barcha shakllari satr ustida.", dots: "Nuqtasiz", contrast: "Zo", a: "طَ", i: "طِ", u: "طُ", aa: "طَا", ii: "طِي", uu: "طُو", sukun: "أَطْ" },
      { name: "Zo", glyph: "ظ", forms: ["ظ", "ظـ", "ـظـ", "ـظ"], labels: ["alohida", "so‘z boshi", "so‘z o‘rtasi", "so‘z oxiri"], maxraj: "Til uchi yuqori old tishlarning uchiga tegadi, til orqasi ko‘tariladi.", zone: "Yuqori old tishlar uchi", quality: "Iste’lo · Itboq", detail: "ذ va ث hududida, ammo til orqasi ko‘tarilib qalin talaffuz qilinadi.", joins: true, line: "Barcha shakllari satr ustida.", dots: "Bitta nuqta tepada", contrast: "To", a: "ظَ", i: "ظِ", u: "ظُ", aa: "ظَا", ii: "ظِي", uu: "ظُو", sukun: "أَظْ" }
    ],
    vocab: [
      ["خَطَرٌ", "Xatar", "assets/vocabulary10/xatar.jpg"], ["نَظَرَ", "Qaradi", "assets/vocabulary10/qaradi.jpg"],
      ["طَبِيبٌ", "Shifokor", "assets/vocabulary10/shifokor.jpg"], ["صِرَاطٌ", "Yo‘l", "assets/vocabulary10/yol.jpg"]
    ]
  },
  stage11: {
    number: 11, slides: "55–59", title: "Ayn · G‘oyn", subtitle: "Halqum ichidagi ikki darvoza",
    accent: "#755c99", activities: 114,
    letters: [
      { name: "Ayn", glyph: "ع", forms: ["ع", "عـ", "ـعـ", "ـع"], labels: ["alohida", "so‘z boshi", "so‘z o‘rtasi", "so‘z oxiri"], maxraj: "Halqumning o‘rta qismi, epiglottis sohasi siqilishi bilan hosil bo‘ladi.", zone: "Halqum o‘rtasi", quality: "Bayniyya", detail: "Shidda bilan raxova orasidagi muvozanatli oqim; ل ن ع م ر guruhidan.", joins: true, line: "Shaklning pastki kosasi alohida va oxirida satrdan tushadi.", dots: "Nuqtasiz", contrast: "G‘oyn", a: "عَ", i: "عِ", u: "عُ", aa: "عَا", ii: "عِي", uu: "عُو", sukun: "أَعْ" },
      { name: "G‘oyn", glyph: "غ", forms: ["غ", "غـ", "ـغـ", "ـغ"], labels: ["alohida", "so‘z boshi", "so‘z o‘rtasi", "so‘z oxiri"], maxraj: "Halqumning yuqori qismi, til ildizi va yumshoq tanglay yaqinligida hosil bo‘ladi.", zone: "Yuqori halqum", quality: "Raxova · Iste’lo", detail: "Havo sirg‘aladi va til orqasi ko‘tarilgani uchun tovush qalinlashadi.", joins: true, line: "Shaklning pastki kosasi alohida va oxirida satrdan tushadi.", dots: "Bitta nuqta tepada", contrast: "Ayn", a: "غَ", i: "غِ", u: "غُ", aa: "غَا", ii: "غِي", uu: "غُو", sukun: "أَغْ" }
    ],
    vocab: [
      ["غُرَابٌ", "Qarg‘a", "assets/vocabulary11/qarga.jpg"], ["صَغِيرٌ", "Kichik", "assets/vocabulary11/kichik.jpg"],
      ["عَبْدٌ", "Qul", "assets/vocabulary11/qul.jpg"], ["عِنَبٌ", "Uzum", "assets/vocabulary11/uzum.jpg"]
    ]
  },
  stage12: {
    number: 12, slides: "60–64", title: "Fa · Qof", subtitle: "Lab darvozasi va til ildizi",
    accent: "#367d69", activities: 114,
    letters: [
      { name: "Fa", glyph: "ف", forms: ["ف", "فـ", "ـفـ", "ـف"], labels: ["alohida", "so‘z boshi", "so‘z o‘rtasi", "so‘z oxiri"], maxraj: "Yuqori old tishlar uchi pastki labning ichki tomoniga tegadi.", zone: "Tish va pastki lab", quality: "Hams · Raxova", detail: "Ovozga havo hamroh bo‘lib, yumshoq sirg‘aladi.", joins: true, line: "Alohida va oxirgi dum satrdan tushadi.", dots: "Bitta nuqta tepada", contrast: "Qof", a: "فَ", i: "فِ", u: "فُ", aa: "فَا", ii: "فِي", uu: "فُو", sukun: "أَفْ" },
      { name: "Qof", glyph: "ق", forms: ["ق", "قـ", "ـقـ", "ـق"], labels: ["alohida", "so‘z boshi", "so‘z o‘rtasi", "so‘z oxiri"], maxraj: "Tilning eng orqa qismi yumshoq tanglayga tegadi.", zone: "Til ildizi va yumshoq tanglay", quality: "Iste’lo · Qalqala", detail: "Tovush qalin; sukunli holatda kuchli qalqala aks-sadosi bor.", joins: true, line: "Alohida va oxirgi kosasi satrdan tushadi.", dots: "Ikki nuqta tepada", contrast: "Fa", a: "قَ", i: "قِ", u: "قُ", aa: "قَا", ii: "قِي", uu: "قُو", sukun: "أَقْ" }
    ],
    vocab: [
      ["سَفَرٌ", "Safar", "assets/vocabulary12/safar.jpg"], ["فَقِيرٌ", "Kambag‘al", "assets/vocabulary12/kambagal.jpg"],
      ["قَامُوسٌ", "Lug‘at", "assets/vocabulary12/lugat.jpg"], ["قَفَصٌ", "Qafas", "assets/vocabulary12/qafas.jpg"]
    ]
  },
  stage13: {
    number: 13, slides: "65–69", title: "Kaf · Lam", subtitle: "Tanglay va til uchining aniq harakati",
    accent: "#4c6b94", activities: 114,
    letters: [
      { name: "Kaf", glyph: "ك", forms: ["ك", "كـ", "ـكـ", "ـك"], labels: ["alohida", "so‘z boshi", "so‘z o‘rtasi", "so‘z oxiri"], maxraj: "Til orqasining oldroq qismi qattiq va yumshoq tanglay chegarasiga tegadi.", zone: "Orqa til va tanglay", quality: "Hams · Shidda", detail: "Havo avval to‘siladi, so‘ng nafas bilan ochiladi; tovush ingichka.", joins: true, line: "Barcha shakllar satr bilan muvozanatda.", dots: "Nuqtasiz", contrast: "Lam", a: "كَ", i: "كِ", u: "كُ", aa: "كَا", ii: "كِي", uu: "كُو", sukun: "أَكْ" },
      { name: "Lam", glyph: "ل", forms: ["ل", "لـ", "ـلـ", "ـل"], labels: ["alohida", "so‘z boshi", "so‘z o‘rtasi", "so‘z oxiri"], maxraj: "Til uchining ikki yoni yuqori old tishlar ortidagi milkka tegadi.", zone: "Til uchi va yuqori milk", quality: "Inxirof", detail: "Oqim tilning ikki yoniga burilib o‘tadi.", joins: true, line: "Alohida va oxirgi shaklning pastki qismi satrdan tushadi.", dots: "Nuqtasiz", contrast: "Kaf", a: "لَ", i: "لِ", u: "لُ", aa: "لَا", ii: "لِي", uu: "لُو", sukun: "أَلْ" }
    ],
    vocab: [
      ["كَلْبٌ", "It", "assets/vocabulary13/it.jpg"], ["كِتَابٌ", "Kitob", "assets/vocabulary13/kitob.jpg"],
      ["لَبَنٌ", "Sut", "assets/vocabulary13/sut.jpg"], ["لَيْلٌ", "Tun", "assets/vocabulary13/tun.jpg"]
    ]
  },
  stage14: {
    number: 14, slides: "70–73", title: "Mim · Nun", subtitle: "Lab va burun rezonansi",
    accent: "#9a5d76", activities: 114,
    letters: [
      { name: "Mim", glyph: "م", forms: ["م", "مـ", "ـمـ", "ـم"], labels: ["alohida", "so‘z boshi", "so‘z o‘rtasi", "so‘z oxiri"], maxraj: "Ikki lab yumilib, tovush burun bo‘shlig‘i rezonansi bilan chiqadi.", zone: "Ikki lab va burun", quality: "G‘unna", detail: "Burun bo‘shlig‘ida jarangdor rezonans hosil bo‘ladi.", joins: true, line: "Alohida va oxiri satrdan tushadi; boshi va o‘rtasi satr ustida.", dots: "Nuqtasiz", contrast: "Nun", a: "مَ", i: "مِ", u: "مُ", aa: "مَا", ii: "مِي", uu: "مُو", sukun: "أَمْ" },
      { name: "Nun", glyph: "ن", forms: ["ن", "نـ", "ـنـ", "ـن"], labels: ["alohida", "so‘z boshi", "so‘z o‘rtasi", "so‘z oxiri"], maxraj: "Til uchi yuqori old tishlar ortidagi milkka tegadi, tovush burunda jaranglaydi.", zone: "Til uchi, milk va burun", quality: "G‘unna", detail: "Til yo‘li berkiladi, ovoz burun bo‘shlig‘idan davom etadi.", joins: true, line: "Alohida va oxiri satrdan tushadi; boshi va o‘rtasi satr ustida.", dots: "Bitta nuqta tepada", contrast: "Mim", a: "نَ", i: "نِ", u: "نُ", aa: "نَا", ii: "نِي", uu: "نُو", sukun: "أَنْ" }
    ],
    vocab: [
      ["مَكْتَبٌ", "Ofis", "assets/vocabulary14/ofis.jpg"], ["بِنْتٌ", "Qiz", "assets/vocabulary14/qiz.jpg"],
      ["بَنْكٌ", "Bank", "assets/vocabulary14/bank.jpg"], ["مَنْزِلٌ", "Manzil", "assets/vocabulary14/manzil.jpg"]
    ]
  },
  stage15: {
    number: 15, slides: "74–76", title: "Ha · Hamza", subtitle: "Ovoz paychalari aniqlik sinovi",
    accent: "#6d7f49", activities: 114,
    letters: [
      { name: "Ha", glyph: "ه", forms: ["ه", "هـ", "ـهـ", "ـه"], labels: ["alohida", "so‘z boshi", "so‘z o‘rtasi", "so‘z oxiri"], maxraj: "Halqumning eng pastki qismi, ovoz paychalari yaqinida hosil bo‘ladi.", zone: "Pastki halqum", quality: "Hams · Raxova", detail: "Nafas yumshoq va uzluksiz chiqadi.", joins: true, line: "O‘rta shakli satrdan pastga tushadi, boshqa shakllari satr atrofida.", dots: "Nuqtasiz", contrast: "Hamza", a: "هَ", i: "هِ", u: "هُ", aa: "هَا", ii: "هِي", uu: "هُو", sukun: "أَهْ" },
      { name: "Hamza", glyph: "ء", forms: ["ء", "أ", "إ", "ؤ"], labels: ["mustaqil", "alif ustida", "alif ostida", "vov ustida"], maxraj: "Ovoz paychalari to‘liq yopilib, keskin ochilishi bilan hosil bo‘ladi.", zone: "Ovoz paychalari", quality: "Shidda", detail: "Havo bir lahza to‘liq to‘siladi va keskin ochiladi; Ha kabi sirg‘almaydi.", joins: false, line: "Hamza kursisiga qarab satr usti yoki ostida joylashadi.", dots: "Nuqtasiz", contrast: "Ha", a: "أَ", i: "إِ", u: "أُ", aa: "آ", ii: "إِي", uu: "أُو", sukun: "أْ" }
    ],
    vocab: [
      ["هُوَ", "U — erkak", "assets/vocabulary15/huwa.jpg"], ["هِيَ", "U — ayol", "assets/vocabulary15/hiya.jpg"],
      ["هُمْ", "Ular — erkaklar", "assets/vocabulary15/hum.jpg"], ["هُنَّ", "Ular — ayollar", "assets/vocabulary15/hunna.jpg"]
    ]
  }
};

window.ADVANCED_STAGES = ADVANCED_STAGES;

function advancedQuestion(question, options, answer, feedback) {
  return { question, options: [...new Set(options)], answer, feedback };
}

function advancedLetterQuestions(letter, other) {
  const yes = letter.joins ? "Ulanadi" : "Ulanmaydi";
  const wrongJoin = letter.joins ? "Ulanmaydi" : "Ulanadi";
  const shapeCount = String(letter.forms.length);
  return [
    advancedQuestion(`${letter.glyph} harfining nomi nima?`, [letter.name, other.name, "Alif"], letter.name, `${letter.glyph} — ${letter.name}.`),
    advancedQuestion(`${letter.name} harfining maxraji qayerda?`, [letter.zone, other.zone, "Faqat burunda"], letter.zone, letter.maxraj),
    advancedQuestion(`${letter.name} maxrajini to‘liq toping.`, [letter.maxraj, other.maxraj, "Ikki lab orasida hosil bo‘ladi."], letter.maxraj, letter.maxraj),
    advancedQuestion(`${letter.name}ning asosiy sifati qaysi?`, [letter.quality, other.quality, "Faqat madd"], letter.quality, letter.detail),
    advancedQuestion(`${letter.quality} nimani anglatadi?`, [letter.detail, other.detail, "Harf doimo yozilmaydi."], letter.detail, letter.detail),
    advancedQuestion(`${letter.name} nechta ko‘rinishda mashq qilinadi?`, [shapeCount, String(other.forms.length), "3"], shapeCount, `${letter.name}: ${shapeCount} ta shakl.`),
    advancedQuestion(`${letter.name} o‘zidan keyingi harfga ulanadimi?`, [yes, wrongJoin, "Faqat tanvinda"], yes, `${letter.name} ${yes.toLowerCase()}.`),
    advancedQuestion(`${letter.name}ning satr qoidasi qaysi?`, [letter.line, other.line, "Har doim satrdan ancha yuqorida"], letter.line, letter.line),
    advancedQuestion(`${letter.name} nuqtalari haqida to‘g‘ri javobni toping.`, [letter.dots, other.dots, "Ikki nuqta pastda"], letter.dots, `${letter.glyph}: ${letter.dots.toLowerCase()}.`),
    advancedQuestion(`${letter.name}ning alohida shaklini toping.`, [letter.forms[0], other.forms[0], letter.forms.at(-1)], letter.forms[0], `${letter.name} alohida: ${letter.forms[0]}.`),
    advancedQuestion(`${letter.name}ning mashq shaklini toping.`, [letter.forms.at(-1), other.forms.at(-1), other.forms[0]], letter.forms.at(-1), `To‘g‘ri shakl: ${letter.forms.at(-1)}.`),
    advancedQuestion(`${letter.a} qanday o‘qiladi?`, [letter.a, other.a, letter.i], letter.a, `${letter.glyph} fatha bilan: ${letter.a}.`),
    advancedQuestion(`${letter.i} qaysi harf-harakat birikmasi?`, [`${letter.name} + kasra`, `${other.name} + kasra`, `${letter.name} + damma`], `${letter.name} + kasra`, `${letter.i} — ${letter.name} va kasra.`),
    advancedQuestion(`${letter.u} qaysi harf-harakat birikmasi?`, [`${letter.name} + damma`, `${other.name} + damma`, `${letter.name} + fatha`], `${letter.name} + damma`, `${letter.u} — ${letter.name} va damma.`)
  ];
}

function advancedContrastQuestions(stage) {
  const [a, b] = stage.letters;
  return [
    advancedQuestion(`${a.name} maxraji qaysi?`, [a.zone, b.zone, "Ikki lab"], a.zone, a.maxraj),
    advancedQuestion(`${b.name} maxraji qaysi?`, [b.zone, a.zone, "Burun bo‘shlig‘i"], b.zone, b.maxraj),
    advancedQuestion(`${a.quality} qaysi harfga tegishli?`, [a.glyph, b.glyph, "ا"], a.glyph, `${a.glyph} — ${a.quality}.`),
    advancedQuestion(`${b.quality} qaysi harfga tegishli?`, [b.glyph, a.glyph, "و"], b.glyph, `${b.glyph} — ${b.quality}.`),
    advancedQuestion(`${a.dots} bo‘lgan harfni toping.`, [a.glyph, b.glyph, "ب"], a.glyph, `${a.glyph}: ${a.dots.toLowerCase()}.`),
    advancedQuestion(`${b.dots} bo‘lgan harfni toping.`, [b.glyph, a.glyph, "ي"], b.glyph, `${b.glyph}: ${b.dots.toLowerCase()}.`),
    advancedQuestion(`${a.a} ni toping.`, [a.a, b.a, a.i], a.a, `${a.name} + fatha.`),
    advancedQuestion(`${b.i} ni toping.`, [b.i, a.i, b.u], b.i, `${b.name} + kasra.`),
    advancedQuestion(`${a.u} ni toping.`, [a.u, b.u, a.a], a.u, `${a.name} + damma.`),
    advancedQuestion(`${b.sukun} qaysi harfning sukunli mashqi?`, [b.name, a.name, "Alif"], b.name, `${b.sukun} — ${b.name}.`),
    advancedQuestion(`Qaysi juftlik to‘g‘ri?`, [`${a.glyph} — ${a.zone}`, `${a.glyph} — ${b.zone}`, `${b.glyph} — ${a.zone}`], `${a.glyph} — ${a.zone}`, a.maxraj),
    advancedQuestion(`Qaysi juftlik to‘g‘ri?`, [`${b.glyph} — ${b.quality}`, `${b.glyph} — ${a.quality}`, `${a.glyph} — ${b.quality}`], `${b.glyph} — ${b.quality}`, b.detail)
  ];
}

function advancedConnectionQuestions(stage) {
  const [a, b] = stage.letters;
  const rows = [a, b, a, b, a, b, a, b, a, b];
  return rows.map((letter, index) => {
    const rule = letter.joins ? "Ko‘prikni saqlash" : "Ulanishni kesish";
    const wrong = letter.joins ? "Ulanishni kesish" : "Ko‘prikni saqlash";
    const prompt = index % 2 ? `${letter.glyph} dan keyin nima qilinadi?` : `${letter.name} uchun ulanish buyrug‘ini tanlang.`;
    return advancedQuestion(prompt, [rule, wrong, "Harakatni o‘chirish"], rule, `${letter.name}: ${letter.joins ? "keyingi harfga ulanadi" : "keyingi harfga ulanmaydi"}.`);
  });
}

function advancedReadingQuestions(stage) {
  const items = [];
  stage.letters.forEach((letter) => {
    [
      [letter.a, `${letter.name} + fatha`], [letter.i, `${letter.name} + kasra`], [letter.u, `${letter.name} + damma`],
      [letter.aa, `${letter.name} + cho‘ziq a`], [letter.ii, `${letter.name} + cho‘ziq i`], [letter.uu, `${letter.name} + cho‘ziq u`],
      [letter.sukun, `${letter.name} sukun bilan`], [`${letter.a}${letter.glyph}ْ`, `${letter.name} ritm mashqi`], [`${letter.u}${letter.glyph}ْ`, `${letter.name} yopiq bo‘g‘in`]
    ].forEach(([word, answer]) => {
      items.push(advancedQuestion(`${word} ni tahlil qiling.`, [answer, `${letter.contrast} mashqi`, "Tanvin mashqi"], answer, `${word}: ${answer}.`));
    });
  });
  stage.vocab.slice(0, 3).forEach(([word, meaning]) => {
    items.push(advancedQuestion(`${word} so‘zining ma’nosi?`, [meaning, ...stage.vocab.map(v => v[1]).filter(x => x !== meaning).slice(0, 2)], meaning, `${word} — ${meaning}.`));
  });
  stage.vocab.slice(1, 4).forEach(([word, meaning]) => {
    items.push(advancedQuestion(`“${meaning}” so‘zini toping.`, [word, ...stage.vocab.map(v => v[0]).filter(x => x !== word).slice(0, 2)], word, `${meaning} — ${word}.`));
  });
  return items.slice(0, 24);
}

function advancedMasteryQuestions(stage) {
  return [...advancedContrastQuestions(stage).slice(0, 6), ...advancedReadingQuestions(stage).slice(18, 24)];
}

function advancedIntroScreen(stage) {
  const [a, b] = stage.letters;
  render(`
    <div class="advanced-hero" style="--stage-accent:${stage.accent}">
      <div class="advanced-orbit" aria-hidden="true">
        <span class="orbit-letter orbit-a">${a.glyph}</span><span class="orbit-letter orbit-b">${b.glyph}</span>
        <i></i><i></i><i></i><div class="orbit-core">${stage.number}</div>
      </div>
      <div>
        <p class="eyebrow">${stage.number}-game · ${stage.slides}-slaydlar</p>
        <h1>${stage.subtitle}</h1>
        <p class="lead">${a.name} va ${b.name}: maxraj xaritasi, sifat animatsiyasi, shakllar tracingi, ulanish qoidasi, rasmli lug‘at va 24 ta o‘qish mashqi.</p>
        <div class="skill-pills"><span>${stage.activities} topshiriq</span><span>2× maxraj</span><span>2× tracing</span><span>4 yangi so‘z</span><span>24 o‘qish</span></div>
        <button id="advancedStart" class="primary-button">Mashg‘ulotni boshlash</button>
      </div>
    </div>`);
  document.querySelector("#advancedStart").onclick = () => { state.step += 1; renderAdvancedStage(); };
}

function advancedLetterScreen(stage, letterIndex) {
  const letter = stage.letters[letterIndex];
  const other = stage.letters[1 - letterIndex];
  runQuestionDeck({
    id: `s${stage.number}-${letter.name}-lesson`, eyebrow: `${letterIndex * 2 + 1}-dars · ${letter.name} maxraj akademiyasi`,
    questions: advancedLetterQuestions(letter, other),
    visual: (_q, index) => `<div class="advanced-mouth" style="--stage-accent:${stage.accent}">
      <div class="mouth-arch"><i class="contact contact-${letterIndex}"></i><b></b></div>
      <div class="air-stream ${letter.joins ? "continuous" : "broken"}"></div>
      <strong class="advanced-glyph">${letter.forms[index % letter.forms.length]}</strong>
      <span>${letter.zone}</span><em>${letter.quality}</em>
    </div>`
  });
}

function advancedTraceScreen(stage, letterIndex) {
  const letter = stage.letters[letterIndex];
  makeStage4TracingScreen({
    id: `s${stage.number}-${letter.name}-trace`, name: letter.name,
    eyebrow: `${letterIndex * 2 + 2}-dars · ${letter.name} yozuv ustaxonasi`,
    forms: letter.forms, labels: letter.labels, ink: stage.accent, className: "advanced-trace-board"
  });
}

function advancedDuelScreen(stage) {
  runQuestionDeck({
    id: `s${stage.number}-duel`, eyebrow: "5-dars · Maxraj dueli",
    questions: advancedContrastQuestions(stage),
    visual: (_q, index) => `<div class="maxraj-duel" style="--stage-accent:${stage.accent}">
      <div><strong>${stage.letters[0].glyph}</strong><span>${stage.letters[0].zone}</span></div>
      <b>VS</b>
      <div><strong>${stage.letters[1].glyph}</strong><span>${stage.letters[1].zone}</span></div>
      <i style="--duel-step:${index}"></i>
    </div>`
  });
}

function advancedConnectionScreen(stage) {
  runQuestionDeck({
    id: `s${stage.number}-connect`, eyebrow: "6-dars · Animatsion ulanish ko‘prigi",
    questions: advancedConnectionQuestions(stage),
    visual: (q, index) => {
      const letter = stage.letters[index % 2];
      return `<div class="connection-lab ${letter.joins ? "keep" : "cut"}" style="--stage-accent:${stage.accent}">
        <span>${letter.glyph}</span><div class="letter-bridge"><i></i><i></i><i></i></div><span>ب</span>
        <strong>${letter.joins ? "ULASH" : "KESISH"}</strong><small>${q.question}</small>
      </div>`;
    }
  });
}

function advancedVocabularyScreen(stage) {
  let index = 0;
  const lessons = stage.vocab.map((v) => ({ type: "learn", v }));
  const recalls = Array.from({ length: 16 }, (_, i) => ({ type: i % 2 ? "meaning" : "word", v: stage.vocab[i % 4] }));
  const deck = [...lessons, ...recalls];
  const body = () => {
    const item = deck[index], [word, meaning, image] = item.v;
    if (item.type === "learn") {
      return `<div class="vocab-learning advanced-vocab" style="--stage-accent:${stage.accent}">
        <div class="vocab-image-frame"><img src="${image}" alt="${meaning}"><div class="memory-rings"></div></div>
        <div><p class="eyebrow">7-dars · Rasmli xotira ${index + 1}/4</p><div class="vocab-word arabic">${word}</div><h2>${meaning}</h2>
        <p class="lead">Rasmni, arabcha yozuvni va ma’noni bir kadr sifatida yodlang.</p>
        <div class="word-segments">${splitGraphemes(word).map(x => `<span>${x}</span>`).join("")}</div>
        <button id="advancedLearn" class="primary-button">Yodladim</button></div></div>`;
    }
    const answerIsWord = item.type === "word";
    const options = shuffle(stage.vocab.map(v => answerIsWord ? v[0] : v[1]));
    return `<div class="vocab-recall advanced-recall" style="--stage-accent:${stage.accent}">
      <div class="recall-main-image"><img src="${image}" alt=""></div>
      <div class="mission-card"><p class="eyebrow">7-dars · Lug‘at sinovi ${index - 3}/16</p>
      <h2>${answerIsWord ? `Rasmga mos arabcha so‘zni toping.` : `${word} so‘zining ma’nosini toping.`}</h2>
      <div class="answer-grid">${options.map(x => `<button class="answer-card ${answerIsWord ? "arabic-option" : ""}" data-value="${x}">${x}</button>`).join("")}</div>
      <div id="advancedVocabFeedback" class="feedback-panel">Xotiradan javob bering.</div></div></div>`;
  };
  render(body());
  const bind = () => {
    const item = deck[index];
    if (item.type === "learn") {
      document.querySelector("#advancedLearn").onclick = () => {
        reward(`s${stage.number}-vocab-learn-${index}`, 12); index += 1;
        screen.querySelector(".screen-content").innerHTML = body(); bind();
      };
      return;
    }
    document.querySelectorAll(".answer-card").forEach(button => button.onclick = () => {
      const correct = item.type === "word" ? item.v[0] : item.v[1];
      if (button.dataset.value === correct) {
        button.classList.add("correct"); reward(`s${stage.number}-vocab-${index}`, 10);
        document.querySelector("#advancedVocabFeedback").textContent = `${item.v[0]} — ${item.v[1]}.`;
        setTimeout(() => {
          index += 1;
          if (index >= deck.length) { state.step += 1; renderAdvancedStage(); }
          else { screen.querySelector(".screen-content").innerHTML = body(); bind(); }
        }, 650);
      } else {
        button.classList.add("wrong"); miss(`Rasm va so‘zni yana bir bor bog‘lang.`, `s${stage.number}-vocab-${index}`);
        setTimeout(() => button.classList.remove("wrong"), 450);
      }
    });
  };
  bind();
}

function advancedReadingScreen(stage) {
  runQuestionDeck({
    id: `s${stage.number}-reading`, eyebrow: "8-dars · 24 kadrli o‘qish marafoni",
    questions: advancedReadingQuestions(stage),
    visual: (q, index) => `<div class="advanced-reader" style="--stage-accent:${stage.accent}">
      <div class="reader-scan"></div><strong class="arabic">${q.question.split(" ")[0]}</strong>
      <span>${String(index + 1).padStart(2, "0")} / 24</span><div class="reader-pulse">${"<i></i>".repeat(5)}</div>
    </div>`
  });
}

function advancedMasteryScreen(stage) {
  runQuestionDeck({
    id: `s${stage.number}-mastery`, eyebrow: "9-dars · Ustozlik imtihoni",
    questions: advancedMasteryQuestions(stage),
    visual: (_q, index) => `<div class="mastery-seal" style="--stage-accent:${stage.accent}">
      <span>${stage.letters[index % 2].glyph}</span><i></i><b>${index + 1}</b>
    </div>`
  });
}

function advancedFinalScreen(stage) {
  const accuracy = state.attempts ? Math.round(state.correct / state.attempts * 100) : 0;
  const stars = accuracy >= 90 ? 3 : accuracy >= 75 ? 2 : 1;
  localStorage.setItem(`fonetika-stage-${stage.number}`, JSON.stringify({ score: state.score, accuracy }));
  render(`<div class="result-layout advanced-final" style="--stage-accent:${stage.accent}">
    <div class="advanced-medal"><span>${stage.letters[0].glyph}</span><span>${stage.letters[1].glyph}</span><i></i></div>
    <p class="eyebrow" style="justify-content:center">${stage.number}-bosqich · ${stage.slides}-slaydlar</p>
    <h2>${stage.title} akademiyasi yakunlandi!</h2>
    <p class="lead" style="margin-inline:auto">Maxraj, sifat, shakl, ulanish, tracing, 4 yangi so‘z va 24 o‘qish mashqi bajarildi.</p>
    <div class="stars">${"★".repeat(stars)}${"☆".repeat(3 - stars)}</div>
    <div class="result-stats"><div class="stat-card"><strong>${state.score}</strong><span>Ball</span></div><div class="stat-card"><strong>${accuracy}%</strong><span>Aniqlik</span></div><div class="stat-card"><strong>${stage.activities}</strong><span>Topshiriq</span></div></div>
    <div class="button-row" style="justify-content:center"><button id="advancedAgain" class="secondary-button">Qayta</button><button id="advancedMenu" class="primary-button">Menyu</button></div>
  </div>`);
  document.querySelector("#advancedAgain").onclick = () => { resetProgress(`stage${stage.number}`); renderAdvancedStage(); };
  document.querySelector("#advancedMenu").onclick = goHome;
}

function renderAdvancedStage() {
  const stage = ADVANCED_STAGES[state.mode];
  if (!stage) return;
  const screens = [
    () => advancedIntroScreen(stage),
    () => advancedLetterScreen(stage, 0),
    () => advancedTraceScreen(stage, 0),
    () => advancedLetterScreen(stage, 1),
    () => advancedTraceScreen(stage, 1),
    () => advancedDuelScreen(stage),
    () => advancedConnectionScreen(stage),
    () => advancedVocabularyScreen(stage),
    () => advancedReadingScreen(stage),
    () => advancedMasteryScreen(stage),
    () => advancedFinalScreen(stage)
  ];
  screens[Math.min(state.step, screens.length - 1)]();
}

