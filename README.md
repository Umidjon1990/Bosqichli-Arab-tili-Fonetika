# Bosqichli Arab Tili Fonetika — 1-game

Kitobning 4–8-slaydlari asosida yaratilgan mobil-first interaktiv web-game.

Joriy versiyada audio topshiriqlari mavjud emas. O‘yin 7 ta ketma-ket bo‘limdagi 51 ta yozma va vizual savol/topshiriqdan tashkil topgan.

## 2-bosqich

9–14-slaydlar asosida Alif, Vov, Ya va Ba uchun 86 ta topshiriq:

- maxraj xaritasi;
- ikki va to‘rt shaklli harflar;
- keyingi harfga ulanish/ulanmaslik;
- barmoq yoki sichqoncha bilan harfni izidan yozish;
- harakat va tanvin bilan o‘qish;
- sukunli bo‘g‘inlar;
- yakuniy usta sinovi.

Javoblar har savolda avtomatik aralashtiriladi. To‘g‘ri va xato javoblar uchun nutqsiz qisqa sound effect ishlatiladi.

## 3-bosqich

15–17-slaydlar asosida 72 ta topshiriq:

- tashdidning sukunli + harakatli tarkibi;
- bir xil ikki harfni tashdidli shaklga birlashtirish;
- fatha + Alif = `aa`, kasra + Ya = `ii`, damma + Vov = `uu`;
- hamzaning Alif, Vov, Ya kursisi va mustaqil maskanlari;
- tashdid va madd bilan ritmli o‘qish;
- `بَابٌ`, `اَبٌ`, `بَيْتٌ` yangi so‘zlari;
- yakuniy quvvat sinovi.

## 4-bosqich

18–22-slaydlar asosida Ta va Sa harflari:

- maxraj va havo oqimi animatsiyasi;
- Ta uchun shidda — portlovchi sifat;
- Sa uchun raxova — sirg‘aluvchi sifat;
- to‘rt yozilish shakli va tracing;
- harakat, madd, sukun va tanvin bilan o‘qish;
- 4 ta rasmli yangi so‘z: `تُوتٌ`, `بَيْتٌ`, `ثَابِتٌ`, `إِثْبَاتٌ`;
- lug‘atni qayta chaqirish va vaqtli o‘qish mashqlari;
- yakuniy aralash mastery sinovi.

## 5-bosqich

23–29-slaydlar asosida Ha, Jim va Xo:

- Ha: halqum o‘rtasi va halqumning uch bo‘limi;
- Jim: til o‘rtasi–yuqori tanglay va qalqala;
- Xo: halqum yuqorisi, til negizi va iste’lo;
- uch harf uchun to‘rt shakl va tracing;
- nuqta joylashuvi bo‘yicha farqlash;
- 4 ta rasmli so‘z: `أَخٌ`, `أَجَابَ`, `تَحْتَ`, `أُخْتٌ`;
- 30 ta o‘qish mashqi va yakuniy imtihon.

## Ishga tushirish

Fayllarni oddiy lokal server orqali oching:

```powershell
python -m http.server 4173
```

So‘ng brauzerda `http://localhost:4173` manzilini oching.

## GitHub Pages

1. Ushbu papkani GitHub repository’ga joylang.
2. Repository ichida **Settings → Pages** bo‘limini oching.
3. **Deploy from a branch** ni tanlang.
4. Branch sifatida `main`, papka sifatida `/ (root)` ni tanlang.
5. GitHub bergan HTTPS havolani QR kodga aylantiring.

Ilova tashqi kutubxonalarsiz ishlaydi. GitHub Pages uchun alohida build jarayoni talab qilinmaydi.

## Kontent chegarasi

Bu prototip faqat quyidagilarni sinaydi:

- arab yozuvining o‘ngdan chapga yo‘nalishi;
- alifboda 28 ta harf;
- harfning to‘rt yozilish holati;
- fatha, kasra, damma va sukun;
- tanvinning `an`, `in`, `un` turlari.

Alif, Vov, Ya va boshqa harflar bu bosqichda alohida test qilinmaydi.
