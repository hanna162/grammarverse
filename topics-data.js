// ============================================================
// GRAMMARVERSE - DATA TOPIK
// ============================================================
const TOPICS = {
  'ms-kata-nama-am-khas': {
    id: 'ms-kata-nama-am-khas', lang: 'ms', level: 'Beginner', module: 'Kata Nama',
    title: 'Kata Nama Am dan Khas',
    desc: 'Kenal pasti dan gunakan Kata Nama Am serta Kata Nama Khas dengan betul.',
    objective: 'Selepas topik ini, anda boleh membezakan Kata Nama Am dan Khas, dan menulis huruf besar dengan betul.',
    intro: 'Kata Nama Am merujuk secara umum (guru, bandar). Kata Nama Khas merujuk secara spesifik dan sentiasa huruf besar (Kuala Lumpur, Cikgu Aminah).',
    notes: [
      { h: 'Kata Nama Am', b: 'Merujuk sesuatu secara umum. Huruf kecil. Contoh: guru, bandar, sungai, buku.' },
      { h: 'Kata Nama Khas', b: 'Merujuk sesuatu secara spesifik. Huruf besar pada setiap kata utama. Contoh: Kuala Lumpur, Cikgu Aminah, Petronas.' },
      { h: 'Kesilapan Biasa', b: 'Gelaran umum seperti "guru" huruf kecil, tapi "Cikgu Ahmad" (dengan nama) huruf besar.' },
    ],
    mnemonics: [{ t: 'K-Khas = Kapital', tip: 'Khas bermula K, Kapital pun K. Kata Nama Khas = huruf Kapital.' }],
    examples: [
      { t: 'Guru itu mengajar di sekolah.', c: 'Mudah', e: '"Guru" dan "sekolah" ialah Kata Nama Am.' },
      { t: 'Cikgu Aminah mengajar di Sekolah Seri Bintang.', c: 'Mudah', e: '"Cikgu Aminah" dan nama sekolah ialah Kata Nama Khas.' },
      { t: 'Malaysia ialah sebuah negara di Asia Tenggara.', c: 'Sederhana', e: '"Malaysia" dan "Asia Tenggara" ialah Kata Nama Khas.' },
      { t: 'Sungai Pahang ialah sungai terpanjang.', c: 'Sederhana', e: '"Sungai Pahang" khas, "sungai" kedua am.' },
      { t: 'Ibu membeli sayur di pasar pagi.', c: 'Harian', e: 'Semua kata nama di sini adalah am.' },
      { t: 'Buku ini ditulis oleh Datuk Abdullah Hussain.', c: 'Formal', e: '"Datuk Abdullah Hussain" ialah Kata Nama Khas.' },
    ],
    mistakes: [
      { w: 'saya belajar di sekolah kebangsaan bukit bintang.', c: 'Saya belajar di Sekolah Kebangsaan Bukit Bintang.', r: 'Nama rasmi institusi mesti huruf besar.' },
      { w: 'Cikgu itu ialah seorang Guru yang baik.', c: 'Cikgu itu ialah seorang guru yang baik.', r: '"Guru" di sini am, huruf kecil sahaja.' },
      { w: 'Kami tinggal di negara malaysia.', c: 'Kami tinggal di negara Malaysia.', r: 'Nama negara mesti huruf besar.' },
    ],
    exercises: [
      { type: 'mcq', q: 'Pilih Kata Nama Khas: "Ahmad membaca buku di perpustakaan."', opts: ['Ahmad', 'membaca', 'buku', 'perpustakaan'], a: 'Ahmad', e: '"Ahmad" nama khusus seseorang.' },
      { type: 'tf', q: '"Sungai Kelantan" ialah Kata Nama Am.', a: 'Salah', e: 'Ia Khas kerana merujuk sungai tertentu.' },
      { type: 'mcq', q: 'Pilih ayat yang betul.', opts: ['saya tinggal di kuala lumpur', 'Saya tinggal di Kuala Lumpur', 'Saya Tinggal Di Kuala Lumpur', 'saya Tinggal di kuala Lumpur'], a: 'Saya tinggal di Kuala Lumpur', e: 'Hanya nama khas (Kuala Lumpur) dan awal ayat huruf besar.' },
      { type: 'mcq', q: 'Yang manakah Kata Nama Am?', opts: ['Malaysia', 'Petronas', 'bandar', 'Ahmad'], a: 'bandar', e: '"Bandar" merujuk secara umum.' },
    ],
    summary: 'Kata Nama Am = umum, huruf kecil. Kata Nama Khas = spesifik, huruf besar pada setiap kata utama.',
  },

  'ms-kata-kerja-aktif-pasif': {
    id: 'ms-kata-kerja-aktif-pasif', lang: 'ms', level: 'Intermediate', module: 'Kata Kerja',
    title: 'Kata Kerja Aktif dan Pasif',
    desc: 'Bina ayat aktif dan pasif dengan betul.',
    objective: 'Anda boleh menukar ayat aktif ke pasif dan sebaliknya, dengan imbuhan yang betul.',
    intro: 'Ayat aktif fokus kepada pelaku ("Ali membaca buku"). Ayat pasif fokus kepada penerima ("Buku dibaca oleh Ali").',
    notes: [
      { h: 'Ayat Aktif', b: 'Subjek melakukan perbuatan. Kata kerja imbuhan me-. Contoh: Ali membaca buku.' },
      { h: 'Ayat Pasif (orang ketiga)', b: 'Objek jadi subjek. Imbuhan di-, "oleh" pilihan. Contoh: Buku dibaca oleh Ali.' },
      { h: 'Ayat Pasif (diri 1/2)', b: 'Imbuhan ku-/kau-, TIADA "oleh". Contoh: Surat itu kutulis.' },
    ],
    mnemonics: [{ t: 'ME jadi DI', tip: 'Aktif ke Pasif (org ke-3): ME- bertukar DI-, objek pindah ke hadapan.' }],
    examples: [
      { t: 'Ali membaca buku itu.', c: 'Aktif', e: '"Ali" melakukan perbuatan "membaca".' },
      { t: 'Buku itu dibaca oleh Ali.', c: 'Pasif', e: '"Buku" kini subjek, kata kerja jadi "dibaca".' },
      { t: 'Surat itu kutulis.', c: 'Pasif (diri 1)', e: 'Imbuhan "ku-" tanpa "oleh".' },
      { t: 'Guru itu menerangkan tatabahasa.', c: 'Aktif', e: 'Struktur standard Subjek+KK+Objek.' },
      { t: 'Tatabahasa itu diterangkan oleh guru.', c: 'Pasif', e: 'Fokus beralih kepada "tatabahasa".' },
    ],
    mistakes: [
      { w: 'Buku itu kubaca oleh saya.', c: 'Buku itu kubaca.', r: 'Jangan guna "oleh" selepas "ku-".' },
      { w: 'Kucing itu tidur dipandang oleh saya.', c: 'Saya melihat kucing itu tidur.', r: '"Tidur" tiada objek, tak boleh dipasifkan.' },
    ],
    exercises: [
      { type: 'mcq', q: 'Pasif bagi "Guru itu mengajar Bahasa Melayu"?', opts: ['Bahasa Melayu diajar oleh guru itu.', 'Bahasa Melayu mengajar guru itu.', 'Guru itu diajar Bahasa Melayu.', 'Guru mengajarkan.'], a: 'Bahasa Melayu diajar oleh guru itu.', e: 'Objek jadi subjek, me- jadi di-.' },
      { type: 'tf', q: '"Dia menangis dengan kuat" boleh jadi ayat pasif.', a: 'Salah', e: '"Menangis" tiada objek.' },
      { type: 'mcq', q: 'Isi: "Surat itu ___tulis oleh Aminah."', opts: ['di', 'me', 'ku', 'ter'], a: 'di', e: 'Pelaku orang ketiga guna "di-" + "oleh".' },
      { type: 'mcq', q: 'Pasif bagi "Saya memasak sup"?', opts: ['Sup kumasak.', 'Sup dimasak saya.', 'Saya dimasak sup.', 'Sup memasak saya.'], a: 'Sup kumasak.', e: 'Diri pertama guna "ku-" tanpa "oleh".' },
    ],
    summary: 'Aktif: Subjek + me-KK + Objek. Pasif (org3): Objek + di-KK + (oleh) + Pelaku. Pasif (diri1/2): ku-/kau- TANPA "oleh".',
  },

  'ms-kata-adjektif': {
    id: 'ms-kata-adjektif', lang: 'ms', level: 'Beginner', module: 'Kata Adjektif',
    title: 'Kata Adjektif',
    desc: 'Sifat, warna, bentuk, ukuran, perasaan dan jarak.',
    objective: 'Anda boleh mengenal pasti kata adjektif dan guna kata penguat dengan betul.',
    intro: 'Kata Adjektif menerangkan sifat kata nama. Diletakkan SELEPAS kata nama dalam Bahasa Melayu: "baju merah" bukan "merah baju".',
    notes: [
      { h: 'Kategori', b: 'Sifat (baik/rajin), Warna (merah/biru), Bentuk (bulat/leper), Ukuran (besar/kecil), Perasaan (gembira/sedih), Jarak (jauh/dekat).' },
      { h: 'Darjah Perbandingan', b: 'Positif: cantik. Perbandingan: lebih cantik daripada. Superlatif: paling cantik / tercantik.' },
      { h: 'Kesilapan', b: 'Jangan gabung 2 penguat: "sangat cantik sekali" SALAH. Pilih satu sahaja.' },
    ],
    mnemonics: [{ t: 'Bagaimana?', tip: 'Tanya "Bagaimana?" tentang kata nama - jawapannya kata adjektif.' }],
    examples: [
      { t: 'Baju itu cantik.', c: 'Mudah', e: '"Cantik" kata adjektif sifat.' },
      { t: 'Kereta merah itu milik ayah.', c: 'Mudah', e: '"Merah" kata adjektif warna, selepas kata nama.' },
      { t: 'Meja itu sangat besar.', c: 'Sederhana', e: 'Penguat "sangat" + adjektif "besar".' },
      { t: 'Gunung itu lebih tinggi daripada bukit.', c: 'Perbandingan', e: 'Struktur "lebih...daripada".' },
      { t: 'Aminah yang paling rajin di kelas.', c: 'Superlatif', e: '"Paling" tunjuk tahap tertinggi.' },
    ],
    mistakes: [
      { w: 'Cantik baju itu.', c: 'Baju itu cantik.', r: 'Adjektif selepas kata nama dalam BM.' },
      { w: 'Rumah itu sangat besar sekali.', c: 'Rumah itu sangat besar.', r: 'Jangan guna 2 penguat serentak.' },
    ],
    exercises: [
      { type: 'mcq', q: 'Pilih kata adjektif: "Kucing kecil itu tidur di sofa."', opts: ['Kucing', 'kecil', 'tidur', 'sofa'], a: 'kecil', e: '"Kecil" menerangkan ukuran kucing.' },
      { type: 'tf', q: 'Kata adjektif dalam BM diletakkan SEBELUM kata nama.', a: 'Salah', e: 'Ia diletakkan SELEPAS kata nama.' },
      { type: 'mcq', q: 'Bentuk superlatif "pandai"?', opts: ['lebih pandai', 'paling pandai', 'pandai sangat', 'terpandai sekali'], a: 'paling pandai', e: '"Paling + adjektif" ialah struktur superlatif betul.' },
    ],
    summary: 'Kata Adjektif menerangkan sifat/warna/bentuk/ukuran/perasaan/jarak, diletakkan SELEPAS kata nama.',
  },

  'ms-kata-sendi-nama': {
    id: 'ms-kata-sendi-nama', lang: 'ms', level: 'Intermediate', module: 'Kata Tugas',
    title: 'Kata Sendi Nama',
    desc: '"di", "ke", "dari", "pada", "dengan" dan lain-lain.',
    objective: 'Anda boleh membezakan "di" (kata sendi) dengan "di-" (imbuhan) dan guna kata sendi yang tepat.',
    intro: 'Kata Sendi Nama digunakan sebelum kata nama untuk tunjuk tempat, masa, cara. "Di" (kata sendi, berasingan) berbeza dengan "di-" (imbuhan, bercantum).',
    notes: [
      { h: 'Kata Sendi Tempat', b: '"Di" (lokasi), "Ke" (arah tuju), "Dari" (asal). Contoh: di rumah, ke pasar, dari kampung.' },
      { h: 'Kata Sendi Lain', b: '"Pada" (masa), "Dengan" (cara), "Untuk" (tujuan), "Oleh" (pelaku pasif).' },
      { h: '"di" vs "di-"', b: '"di" + kata nama tempat = berasingan (di sekolah). "di-" + kata kerja = bercantum (dibaca).' },
    ],
    mnemonics: [{ t: 'Tempat vs Perbuatan', tip: 'Selepas "di" ada TEMPAT → berasingan. Ada PERBUATAN → bercantum.' }],
    examples: [
      { t: 'Ahmad belajar di perpustakaan.', c: 'Tempat', e: '"Di" lokasi, berasingan.' },
      { t: 'Kami pergi ke Langkawi minggu depan.', c: 'Arah', e: '"Ke" arah tuju.' },
      { t: 'Surat itu datang dari Jepun.', c: 'Asal', e: '"Dari" asal sesuatu.' },
      { t: 'Dia menulis dengan tulisan kemas.', c: 'Cara', e: '"Dengan" cara perbuatan dilakukan.' },
      { t: 'Buku itu dipinjam oleh Aminah.', c: 'Pelaku', e: '"Oleh" pelaku ayat pasif.' },
    ],
    mistakes: [
      { w: 'Dia duduk disekolah sepanjang hari.', c: 'Dia duduk di sekolah sepanjang hari.', r: 'Kata sendi "di" mesti berasingan.' },
      { w: 'Surat itu di tulis oleh Aminah.', c: 'Surat itu ditulis oleh Aminah.', r: 'Imbuhan "di-" mesti bercantum.' },
    ],
    exercises: [
      { type: 'mcq', q: 'Pilih kata sendi betul: "Dia belajar ___ perpustakaan."', opts: ['di', 'ke', 'dari', 'untuk'], a: 'di', e: '"Di" untuk lokasi.' },
      { type: 'tf', q: 'Kata sendi "di" dalam "di sekolah" ditulis bercantum.', a: 'Salah', e: 'Sentiasa berasingan.' },
      { type: 'mcq', q: 'Yang mana kata sendi arah?', opts: ['di', 'ke', 'pada', 'dengan'], a: 'ke', e: '"Ke" menunjukkan arah tuju.' },
    ],
    summary: 'Kata Sendi Nama (di/ke/dari/dengan/untuk) ditulis BERASINGAN sebelum kata nama, tunjuk hubungan tempat/masa/cara.',
  },

  'en-nouns': {
    id: 'en-nouns', lang: 'en', level: 'Beginner', module: 'Nouns',
    title: 'Nouns: Common, Proper, Collective & Countable',
    desc: 'Identify the five main types of nouns.',
    objective: 'You can identify common, proper, collective, countable and uncountable nouns correctly.',
    intro: 'A noun names a person, place, thing or idea. Types: common (general), proper (specific, capitalised), collective (groups), countable (has plural), uncountable (no plural).',
    notes: [
      { h: 'Common Nouns', b: 'General names, lowercase. Examples: teacher, city, book, dog.' },
      { h: 'Proper Nouns', b: 'Specific names, always capitalised. Examples: Mr. Tan, Kuala Lumpur, Monday.' },
      { h: 'Countable vs Uncountable', b: 'Countable has plural (book/books). Uncountable has no plural (water, advice, information).' },
    ],
    mnemonics: [{ t: 'The Spill Test', tip: 'If you can spill/pour it with no clear single unit (water, rice), it\'s usually uncountable.' }],
    examples: [
      { t: 'The teacher walked into the classroom.', c: 'Simple', e: '"Teacher" and "classroom" are common nouns.' },
      { t: 'Mr. Lee teaches at Victoria Institution.', c: 'Simple', e: 'Both are proper nouns, capitalised.' },
      { t: 'The family enjoyed a picnic.', c: 'Simple', e: '"Family" is collective, treated as one unit.' },
      { t: 'I bought three apples and some bread.', c: 'Intermediate', e: '"Apples" countable, "bread" uncountable.' },
      { t: 'She gave me some useful advice.', c: 'Intermediate', e: '"Advice" is always uncountable.' },
    ],
    mistakes: [
      { w: 'She gave me many advices.', c: 'She gave me a lot of advice.', r: '"Advice" has no plural form.' },
      { w: 'I need an information.', c: 'I need some information.', r: 'Uncountable nouns never take "a/an".' },
    ],
    exercises: [
      { type: 'mcq', q: 'Which is a proper noun in: "Ali visited Malaysia"?', opts: ['Ali', 'visited', 'year', 'last'], a: 'Ali', e: 'Specific person\'s name.' },
      { type: 'tf', q: '"Furniture" is a countable noun.', a: 'Salah', e: 'It\'s uncountable - no "furnitures".' },
      { type: 'mcq', q: 'Fill: "How ___ rice do you want?"', opts: ['much', 'many', 'a', 'some'], a: 'much', e: '"Rice" is uncountable, use "much".' },
      { type: 'mcq', q: 'Which is uncountable?', opts: ['book', 'chair', 'water', 'apple'], a: 'water', e: 'No plural form for "water".' },
    ],
    summary: 'Common = general lowercase. Proper = specific capitalised. Countable has plurals; uncountable does not.',
  },

  'en-verbs': {
    id: 'en-verbs', lang: 'en', level: 'Intermediate', module: 'Verbs',
    title: 'Verbs: Action, Helping, Linking',
    desc: 'Action, helping, linking verbs; regular vs irregular.',
    objective: 'You can distinguish action, helping and linking verbs, and form correct past tense.',
    intro: 'A verb shows what the subject does, is, or has. Types: action (physical/mental), helping (support main verb), linking (connect subject to description).',
    notes: [
      { h: 'Action Verbs', b: 'Show doing. Physical: run, jump. Mental: think, believe.' },
      { h: 'Helping Verbs', b: 'Support main verb for tense. be/do/have + modals (can, will, must).' },
      { h: 'Linking Verbs', b: 'Connect subject to description, not action. Example: "The soup smells delicious."' },
    ],
    mnemonics: [{ t: 'The Sense Verb Test', tip: 'If you can replace with "is/am/are" and it still makes sense, it\'s linking: "She looks happy" → "She is happy" ✓' }],
    examples: [
      { t: 'She runs every morning.', c: 'Action', e: '"Runs" shows physical activity.' },
      { t: 'They are studying tonight.', c: 'Helping', e: '"Are" supports main verb "studying".' },
      { t: 'The cake smells wonderful.', c: 'Linking', e: '"Smells" connects "cake" to "wonderful".' },
      { t: 'He went to the market.', c: 'Irregular', e: '"Went" is irregular past of "go".' },
      { t: 'We have finished our homework.', c: 'Helping', e: '"Have" forms present perfect.' },
    ],
    mistakes: [
      { w: 'She feel happy today.', c: 'She feels happy today.', r: 'Must agree with subject: "feels".' },
      { w: 'He goed to the market.', c: 'He went to the market.', r: '"Go" is irregular - "went" not "goed".' },
    ],
    exercises: [
      { type: 'mcq', q: 'Which sentence uses a linking verb?', opts: ['She sings beautifully.', 'She seems tired.', 'She runs daily.', 'She writes letters.'], a: 'She seems tired.', e: '"Seems" connects subject to description.' },
      { type: 'tf', q: '"Go" is a regular verb.', a: 'Salah', e: 'Irregular - past tense is "went".' },
      { type: 'mcq', q: 'Fill: "Yesterday, she ___ rice for lunch."', opts: ['eat', 'eats', 'ate', 'eaten'], a: 'ate', e: '"Eat" irregular past = "ate".' },
      { type: 'mcq', q: 'Which is a helping verb?', opts: ['run', 'have', 'seem', 'write'], a: 'have', e: '"Have" supports main verb tense.' },
    ],
    summary: 'Action = doing. Helping = supports main verb. Linking = connects subject to description, not action.',
  },

  'en-adjectives': {
    id: 'en-adjectives', lang: 'en', level: 'Beginner', module: 'Adjectives',
    title: 'Adjectives: Comparative & Superlative',
    desc: 'Describing words, comparatives and superlatives.',
    objective: 'You can form correct comparative and superlative adjectives.',
    intro: 'Adjectives describe nouns. In English they usually come BEFORE the noun: "a tall building".',
    notes: [
      { h: 'Comparative', b: 'Compares TWO things. Short: +er (taller). Long: more + adj (more beautiful).' },
      { h: 'Superlative', b: 'Compares 3+ things. Short: +est (tallest). Long: most + adj (most beautiful).' },
      { h: 'Irregular Forms', b: 'good→better→best, bad→worse→worst, far→farther→farthest.' },
    ],
    mnemonics: [{ t: 'One vs Two', tip: 'One syllable → -er/-est. Two-or-more syllables → more/most.' }],
    examples: [
      { t: 'She has a beautiful garden.', c: 'Simple', e: '"Beautiful" describes garden, before noun.' },
      { t: 'This building is taller than that one.', c: 'Comparative', e: '"Taller" + "than".' },
      { t: 'Mount Kinabalu is the tallest mountain.', c: 'Superlative', e: '"Tallest" preceded by "the".' },
      { t: 'This exercise is more difficult.', c: 'Comparative', e: '3 syllables uses "more".' },
      { t: 'This is the best restaurant in town.', c: 'Irregular', e: '"Best" is irregular superlative of "good".' },
    ],
    mistakes: [
      { w: 'She is more taller than me.', c: 'She is taller than me.', r: 'Don\'t combine "more" with "-er".' },
      { w: 'This is the most tallest building.', c: 'This is the tallest building.', r: 'Don\'t combine "most" with "-est".' },
    ],
    exercises: [
      { type: 'mcq', q: 'Correct comparative form?', opts: ['She is more tall than him.', 'She is taller than him.', 'She is tallest than him.', 'She is the tall.'], a: 'She is taller than him.', e: 'Short adjective + "-er" + "than".' },
      { type: 'tf', q: '"Good" becomes "gooder" in comparative.', a: 'Salah', e: 'Irregular - it becomes "better".' },
      { type: 'mcq', q: 'Fill: "This is the ___ place I have visited." (beautiful)', opts: ['beautifulest', 'more beautiful', 'most beautiful', 'beautifuller'], a: 'most beautiful', e: '3 syllables uses "most".' },
    ],
    summary: 'Short adjectives: -er/-est. Long adjectives: more/most. Some forms are irregular (good-better-best).',
  },

  'en-prepositions': {
    id: 'en-prepositions', lang: 'en', level: 'Intermediate', module: 'Prepositions',
    title: 'Prepositions: Place, Time & Direction',
    desc: '"in", "on", "at", "to", "from" and more.',
    objective: 'You can choose the correct preposition for place, time and direction.',
    intro: 'Prepositions show relationships to place, time, or direction. "In", "on", "at" are the trickiest for learners.',
    notes: [
      { h: 'Place', b: '"In" = enclosed (in the box, in Malaysia). "On" = surface (on the table). "At" = exact point (at the door).' },
      { h: 'Time', b: '"In" = months/years (in June). "On" = days/dates (on Monday). "At" = clock times (at 7pm). EXCEPTION: "at night".' },
      { h: 'Direction', b: '"To" = toward destination. "From" = origin. "Into"/"Onto" = movement toward inside/surface.' },
    ],
    mnemonics: [{ t: 'Night is Different', tip: '"in the morning/afternoon/evening" BUT "at night" - night always breaks the pattern.' }],
    examples: [
      { t: 'The keys are in the drawer.', c: 'Place', e: '"In" for enclosed space.' },
      { t: 'The book is on the table.', c: 'Place', e: '"On" for a surface.' },
      { t: 'We will meet at the bus stop.', c: 'Place', e: '"At" for exact point.' },
      { t: 'My birthday is in December.', c: 'Time', e: '"In" for months.' },
      { t: 'The train departs at 9:15am.', c: 'Time', e: '"At" for exact clock time.' },
    ],
    mistakes: [
      { w: 'I was born on 1995.', c: 'I was born in 1995.', r: 'Years use "in", not "on".' },
      { w: 'We discussed about the problem.', c: 'We discussed the problem.', r: '"Discuss" already means "talk about".' },
    ],
    exercises: [
      { type: 'mcq', q: 'Choose: "The concert starts ___ 8 o\'clock."', opts: ['in', 'on', 'at', 'to'], a: 'at', e: 'Exact clock times always use "at".' },
      { type: 'tf', q: '"At night" uses the same rule as "in the morning".', a: 'Salah', e: '"Night" is the exception - uses "at" not "in".' },
      { type: 'mcq', q: 'Fill: "She was born ___ 14 February 2010."', opts: ['in', 'on', 'at', 'to'], a: 'on', e: 'Specific dates use "on".' },
    ],
    summary: 'In = general/enclosed. On = surface/specific day. At = exact point/time. "At night" is the key exception.',
  },
};

const MODULES_BY_LANG = {
  ms: ['Kata Nama', 'Kata Kerja', 'Kata Adjektif', 'Kata Tugas'],
  en: ['Nouns', 'Verbs', 'Adjectives', 'Prepositions'],
};
