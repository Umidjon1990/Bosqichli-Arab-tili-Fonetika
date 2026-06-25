O‘qish mashqlari audiolari shu papkaga joylanadi.

Tavsiya qilingan tuzilma:

- `stage-2/word-01.mp3`
- `stage-2/word-02.mp3`
- `stage-3/word-01.mp3`
- `stage-4/word-01.mp3`
- ...
- `stage-15/word-04.mp3`

Har bir darsdagi fayl tartibi `app.js` ichidagi `READING_LESSONS` ro‘yxatiga mos bo‘lishi kerak.

Muhim: ElevenLabs API kaliti sayt ichiga qo‘yilmaydi. MP3lar oldindan yaratiladi va shu papkalarga yuklanadi.

Bitta darsni yaratish namunasi:

```powershell
node .\tools\generate-reading-audio.mjs --stage=stage-4
```

Hamma darslarni yaratish:

```powershell
node .\tools\generate-reading-audio.mjs
```
