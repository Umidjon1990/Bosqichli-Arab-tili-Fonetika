# “Bosqichli arab tili fonetika 2026” qo‘llanmasi asosida interaktiv ta’lim tizimi

## 1. Dastlabki audit

Tahlil qilingan manba:

- 102 ta slayd
- 175 ta rasm va media obyekt
- Harflar, maxrajlar, sifatlar, yozilish shakllari, harakatlar, o‘qish mashqlari, fonetik qoidalar va yakuniy matnlar

Qo‘llanmaning mavjud metodik skeleti:

1. Arab tili va alifbosi haqida kirish
2. Harakatlar va tanvin
3. Alif, vov, ya va cho‘ziq unlilar
4. Harflarni maxraj, sifat va yozilish shakli bilan o‘rganish
5. Har 2–3 harfdan keyin bo‘g‘in, so‘z va tez o‘qish mashqlari
6. Shamsiy va qamariy harflar
7. Vasl hamzasi
8. Bir-biriga yaqin tovushlarni farqlash
9. Vaqf — to‘xtash qoidalari
10. Nun sokin va tanvin bilan bog‘liq qoidalar
11. Yakuniy o‘qish matnlari

Bu kontent interaktiv kurs yaratish uchun yetarlicha boy. Lekin uni slaydlar ketma-ketligida ko‘chirish emas, ko‘nikmalar asosida qayta arxitektura qilish kerak.

## 2. Tavsiya etiladigan mahsulot modeli

Mahsulot uchta qatlamdan iborat bo‘ladi:

### Majburiy metodik tamoyil: faqat o‘tilgan material

Kurs PPT qo‘llanmaning ketma-ketligiga qat’iy bog‘lanadi. O‘quvchi hali o‘tmagan harf, belgi, qoida, bo‘g‘in yoki so‘z hech bir test, quiz, game, chalg‘ituvchi javob yoki yakuniy topshiriqda ishlatilmaydi.

Har bir topshiriqda quyidagi ruxsat nazorati bo‘ladi:

- `introduced_letters` — shu paytgacha o‘tilgan harflar;
- `introduced_marks` — o‘tilgan harakat va belgilar;
- `introduced_rules` — o‘tilgan fonetik qoidalar;
- `allowed_vocabulary` — faqat o‘tilgan elementlardan tuzilgan so‘zlar;
- `forbidden_content` — hali ochilmagan mavzular.

Savol generatori ham, qo‘lda tuzilgan savollar banki ham shu chegaradan chiqmaydi.

Misol:

1. Alif, vov va ya tugaguncha — faqat shu harflar va shu paytgacha tushuntirilgan belgilar.
2. Ba o‘tilgach — yangi testlarning asosiy qismi ba harfiga oid bo‘ladi; takrorlash qismida esa faqat alif, vov, ya va ba ishlatiladi.
3. Ta va sa o‘tilgach — yangi harflarni mustahkamlash bilan birga avvalgi harflar aralashtiriladi.
4. Harflar soni ko‘paygani sari aralash testlar kengayadi, ammo hali o‘tilmagan harflar yopiq qoladi.
5. Tashdid, tanvin, madd, vasl yoki boshqa qoida tushuntirilmaguncha o‘quvchidan ularni bilish talab qilinmaydi.

### A. O‘rgatish

- animatsiyali tushuntirish;
- harf va tovush namoyishi;
- maxrajning og‘iz ichidagi 2D/3D ko‘rinishi;
- harf yozilishining bosqichma-bosqich animatsiyasi;
- to‘g‘ri va xato talaffuzni taqqoslash.

### B. Mashq qildirish

- qisqa, ko‘p formatli mikro-mashqlar;
- audio, vizual, yozuv va o‘qish topshiriqlari;
- o‘xshash tovushlarni qarama-qarshi qo‘yish;
- xatoga mos tushuntirish va qayta mashq.

### C. Baholash va takrorlash

- diagnostik test;
- har bir modul yakunida mastery-test;
- o‘quvchi xatolariga mos adaptiv savollar;
- 1, 3, 7 va 14 kunlik interval takrorlash;
- o‘qituvchi va ota-ona uchun natijalar paneli.

Adaptiv takrorlash ham faqat o‘quvchi ochgan mavzular ichida ishlaydi. Tizim qiyinlikni oshirishi mumkin, lekin dastur bo‘yicha oldinga sakramaydi.

## 2.1. Kitobga bog‘langan test ketma-ketligi

Har bir yangi mavzuda quyidagi sikl qo‘llanadi:

1. **Kirish testi** — faqat avval o‘tilgan materialdan 3–5 ta qisqa takrorlash.
2. **Yangi mavzu namoyishi** — yangi harf yoki qoida tushuntiriladi; hali baholanmaydi.
3. **Sof mashq** — topshiriqlarning 80–100 foizi aynan yangi mavzuga oid.
4. **Nazoratli aralashtirish** — yangi mavzu faqat oldingi o‘tilgan material bilan qo‘shiladi.
5. **Mavzu testi** — yangi ko‘nikmani alohida baholaydi.
6. **Kumulyativ test** — shu nuqtagacha o‘tilgan barcha mavzulardan aralash savollar.
7. **Xato bo‘yicha qayta mashq** — faqat xato qilingan va avval ochilgan ko‘nikmalar.

Tavsiya etiladigan savol nisbati:

- yangi harf yoki qoida: 60%;
- eng yaqin oldingi mavzular: 25%;
- uzoqroq takrorlash: 15%.

Birinchi tanishtirish mashqlarida yangi mavzu ulushi 80–100% bo‘lishi mumkin. Kumulyativ nazoratda esa barcha ochilgan mavzular muvozanatli aralashtiriladi.

## 2.2. Kontentni ochish mexanizmi

Har bir mavzu `locked`, `learning`, `practice`, `mastered` holatlaridan birida bo‘ladi:

- **locked** — hali o‘tilmagan; savollarda umuman ko‘rinmaydi;
- **learning** — yangi tushuntirilgan; faqat boshqariladigan mashqlarda;
- **practice** — oldingi mavzular bilan aralashtirish mumkin;
- **mastered** — interval takrorlash va kumulyativ testlarga qo‘shiladi.

Keyingi mavzu avvalgi mavzu bo‘yicha belgilangan minimal natija bajarilgach ochiladi. O‘qituvchi istasa, bu ketma-ketlikni qo‘lda ham boshqarishi mumkin.

## 3. Kursning asosiy bo‘limlari

### 0-modul. Diagnostika

O‘quvchining harfni tanish, tovushni farqlash, yozish va o‘qish darajasi aniqlanadi. Natijaga ko‘ra kursning boshlanish nuqtasi tavsiya qilinadi.

### 1-modul. Alifbo va belgilar

- 28 ta harf;
- harfning alohida, bosh, o‘rta va oxirgi shakli;
- fatha, kasra, damma;
- sukun, tanvin va tashdid;
- nuqtalar soni va joylashuvi.

### 2-modul. Alif, vov, ya va cho‘ziq unlilar

- qisqa va cho‘ziq unli kontrasti;
- eshitib davomiylikni aniqlash;
- bo‘g‘in konstruktori;
- noto‘g‘ri cho‘zilgan tovushni topish.

Bu modul davomida testlar ichiga keyingi harflar qo‘shilmaydi. Ba harfi faqat qo‘llanmada ba mavzusi boshlanganidan keyin ochiladi.

### 3-modul. Harflar maktabi

Har bir harf uchun alohida mini-modul:

1. Harfni ko‘rish va nomini eshitish
2. Maxraj animatsiyasi
3. Harf sifati
4. To‘rt yozilish shakli
5. Harakatlar bilan talaffuz
6. Sukun, tashdid va madd bilan o‘qish
7. So‘z boshida, o‘rtasida va oxirida topish
8. Yozish mashqi
9. Audio diktant
10. Mastery-test

### 4-modul. Maxraj xaritasi

Harflar tanadagi chiqish joyiga ko‘ra guruhlanadi:

- halqum;
- til;
- lab;
- og‘iz bo‘shlig‘i;
- burun rezonansi.

O‘quvchi interaktiv og‘iz modelida maxrajni tanlaydi, tovushni eshitadi va mos harfni joylashtiradi.

### 5-modul. Harf sifatlari

- shidda;
- raxova;
- bayniyya;
- iste’lo va istifol;
- itboq va infitoh;
- qalqala;
- sofir;
- tafashshiy;
- istitola;
- inhirof;
- g‘unna.

Har bir sifat faqat ta’rif bilan emas, audio-kontrast va vizual havo oqimi orqali o‘rgatiladi.

### 6-modul. O‘xshash tovushlar laboratoriyasi

Qo‘llanmadagi va metodik jihatdan zarur kontrastlar:

- ء / ع
- ه / ح / خ
- ت / ط
- س / ث / ص
- ز / ذ / ظ
- د / ض
- ك / ق
- خ / غ
- ج / ش

Har bir juftlik uchun minimal juftlik, maxraj taqqoslash, audio tanlash, talaffuz va tezkor farqlash mashqlari yaratiladi.

### 7-modul. Qoida laboratoriyasi

- shamsiy va qamariy harflar;
- vasl hamzasi;
- so‘z oxirida to‘xtash;
- nun sokin va tanvin;
- izhor;
- idg‘om;
- ixfo;
- iqlob.

Har bir qoida uchun “ko‘r → eshit → boshqariladigan mashq → mustaqil mashq → matnda qo‘llash” sikli ishlatiladi.

### 8-modul. Ravon o‘qish

Qo‘llanmadagi yakuniy matnlar darajalanadi:

- bo‘g‘inlab o‘qish;
- belgilangan tempda o‘qish;
- audio bilan birga o‘qish;
- audio ortidan takrorlash;
- mustaqil ovoz yozish;
- xatolar bo‘yicha qayta mashq.

## 4. Asosiy game formatlari

1. Harfni ovla — ekrandagi harflar orasidan eshitilganini topish
2. Maxraj xaritasi — harfni og‘iz modelidagi to‘g‘ri nuqtaga olib borish
3. Nuqtani qutqar — harf nuqtalarini to‘g‘ri joylashtirish
4. Shakllar oilasi — bir harfning to‘rt shaklini moslashtirish
5. Harf ustasi — yozilish yo‘nalishi bo‘yicha tracing
6. Tovush detektivi — to‘g‘ri va xato talaffuzni ajratish
7. Minimal juftlik dueli — o‘xshash tovushli ikki so‘zni farqlash
8. Bo‘g‘in fabrikasi — harf va harakatdan bo‘g‘in yasash
9. So‘z konstruktori — alohida shakllarni ulab so‘z yig‘ish
10. Sukun ko‘prigi — bo‘g‘inlarni to‘g‘ri yopib o‘qish
11. Tashdid kuchi — ikki harfni bitta tashdidli shaklga aylantirish
12. Madd taymeri — tovush davomiyligini to‘g‘ri ushlab turish
13. Shams yoki qamar — so‘zlarni ikki guruhga ajratish
14. Vasl poygasi — ikki so‘zni uzmasdan to‘g‘ri ulash
15. Vaqf bekati — qayerda va qanday to‘xtashni tanlash
16. Nun qoidalari missiyasi — keyingi harfga qarab qoidani aniqlash
17. Audio diktant — eshitilgan harf, bo‘g‘in yoki so‘zni yozish
18. Xato ovchisi — noto‘g‘ri harakat, nuqta yoki ulanishni topish
19. Tez o‘qish poygasi — aniqlikni yo‘qotmasdan tempni oshirish
20. Boss challenge — bir nechta ko‘nikmani birlashtirgan yakuniy sinov

## 5. Har bir topshiriq uchun sifat standarti

Har bir savol quyidagi maydonlarga ega bo‘ladi:

- ko‘nikma kodi;
- kitobdagi slayd yoki mavzu tartib raqami;
- savol ochilishi mumkin bo‘lgan eng erta bosqich;
- savolda ishlatishga ruxsat etilgan harflar va qoidalar;
- mavzu va kichik mavzu;
- qiyinlik darajasi;
- savol turi;
- savol matni;
- audio yoki vizual manba;
- to‘g‘ri javob;
- chalg‘ituvchi javoblar;
- har bir xato javobga alohida izoh;
- maksimal urinish soni;
- vaqt mezoni;
- qayta takrorlash sanasi;
- o‘zlashtirish chegarasi.

O‘zlashtirish faqat umumiy ball bilan emas, alohida ko‘nikmalar bo‘yicha o‘lchanadi:

- vizual tanish;
- eshitib tanish;
- talaffuz;
- yozuv;
- qoida;
- ravon o‘qish.

## 6. Hyper-realistik yo‘nalish

“Hyper-realistik” yondashuv bezak emas, fonetikani tushuntiruvchi vosita bo‘lishi kerak:

- anatomik jihatdan tushunarli og‘iz va til modeli;
- talaffuz paytidagi til harakatining animatsiyasi;
- havo oqimi va rezonansning vizual ko‘rinishi;
- professional diktor yozgan studiya audiosi;
- tabiiy qalam izi va siyoh animatsiyasi;
- bolaga mos, lekin haddan tashqari bolalarcha bo‘lmagan muhit;
- to‘g‘ri javobda qisqa va yoqimli mikroanimatsiya;
- xato javobda jazolovchi emas, yo‘naltiruvchi feedback.

## 7. Qo‘llanma bo‘yicha dastlabki tahrir tavsiyalari

Interaktiv kontentga ko‘chirishdan oldin alohida ilmiy-lingvistik tahrir bosqichi zarur.

Dastlab ko‘ringan misollar:

- 25-slaydda sarlavha “Jiim harfi”, ammo matnda “Harf nomi: Saa” deb yozilgan;
- “maxraj/mahraj”, “vov/vaav”, “damma/domma”, “qof/Qof” kabi terminlar bir xil standartga keltirilishi kerak;
- ayrim joylarda harf oralari va arabcha diakritikalar vizual ravishda ajralib qolgan;
- ayrim tarjimalar, minimal juftliklar va transkripsiyalar arab tili mutaxassisi tomonidan qayta tekshirilishi kerak;
- slayd raqamlari va ayrim bo‘sh ko‘rinadigan slaydlar media yoki dizayn qatlamlari bilan birga vizual tekshirilishi kerak;
- nun sokin va tanvin qoidalari to‘liq tizim sifatida bir xil ketma-ketlikda berilishi kerak;
- bir harfga tegishli nazariya, yozuv, audio va mustahkamlash mashqlari yagona shablonda standartlashtirilishi kerak.

## 8. Ishlab chiqish bosqichlari

### 1-bosqich. Ilmiy va metodik audit

- barcha 102 slaydni tekshirish;
- xato va nomuvofiqliklar jadvali;
- terminologiya standarti;
- o‘quv natijalari ro‘yxati;
- har bir materialning qaysi modulga tegishliligini belgilash.

### 2-bosqich. Bitta pilot modul

Pilot sifatida “Alif–Vov–Ya–Ba” bloki tavsiya qilinadi. Sababi: unda harakat, cho‘ziq unli, ikki va to‘rt shaklli harf, lab maxraji, yozish va boshlang‘ich o‘qish birlashadi.

Pilot tarkibi:

- 4 ta mikro-dars;
- 12–16 ta game mexanikasi;
- 80–120 ta savol varianti;
- audio ro‘yxati;
- vizual storyboard;
- diagnostika va yakuniy test;
- o‘quvchi natijalari modeli.

### 3-bosqich. Prototip

- mobil va kompyuter ekranlari;
- asosiy menyu va xarita;
- bitta harf darsi;
- yozish mashqi;
- audio tanlash;
- maxraj animatsiyasi;
- mini-boss;
- natija oynasi.

### 4-bosqich. Sinov

- 5–10 nafar o‘quvchi bilan kuzatuv;
- savol tushunarliligi;
- talaffuz va yozuvdagi real xatolar;
- qiyinlik va vaqt balansi;
- qayta ishlash.

### 5-bosqich. To‘liq ishlab chiqish

Pilot standarti tasdiqlangach, qolgan harflar va qoidalar shu shablon asosida ishlab chiqiladi.

## 9. Birinchi sprint uchun aniq natijalar

1. PPT bo‘yicha to‘liq slaydma-slayd audit jadvali
2. Terminologiya va imlo standarti
3. “Alif–Vov–Ya–Ba” modulining lesson map’i
4. Kamida 100 ta savoldan iborat savollar banki
5. 12 ta game mexanikasi uchun aniq qoidalar
6. Audio yozuvlar ro‘yxati
7. Rasm va animatsiyalar uchun texnik topshiriq
8. O‘quvchi xatolarini baholash modeli
9. Ekranlar xaritasi va birinchi vizual prototip

## 10. Asosiy tavsiya

Darhol barcha 102 slaydni o‘yinga aylantirish xavfli: xatolar, terminologiya va dizayn qarorlari yuzlab ekranlarda takrorlanib ketadi. Avval “Alif–Vov–Ya–Ba” pilotini to‘liq, audio-vizual va metodik jihatdan mukammal qilish kerak. Pilot real o‘quvchilarda sinalgach, u butun mahsulot uchun standart bo‘ladi.

Pilotning o‘zida ham kitob ketma-ketligi buzilmaydi:

- avval alif;
- keyin vov;
- keyin ya;
- so‘ng shu uch harf bo‘yicha oraliq test;
- undan keyin ba;
- ba bo‘yicha alohida mashqlar;
- yakunda faqat alif, vov, ya va ba ishtirokidagi aralash test.
