export default {
  id: "numbers-time",
  title: "Numbers, Counting & Time",
  subchapters: [
    {
      id: "numbers-and-money",
      title: "Numbers and Money",
      body: `## Numbers are regular — until they aren't

The counting system itself is beautifully logical. The irregularities are few, but they hit
exactly the numbers you use most.

### 1 to 10

| # | Japanese | # | Japanese |
|---|----------|---|----------|
| 1 | *ichi* | 6 | *roku* |
| 2 | *ni* | 7 | *nana* (or *shichi*) |
| 3 | *san* | 8 | *hachi* |
| 4 | *yon* (or *shi*) | 9 | *kyuu* (or *ku*) |
| 5 | *go* | 10 | *juu* |

**4, 7 and 9 have two readings.** In everyday speech prefer **yon, nana, kyuu** — they're
clearer and avoid *shi* (which is also "death") and *ku* ("suffering"). But some fixed
expressions demand the other reading: *yoji* (4 o'clock), *shichiji* (7 o'clock), *kuji*
(9 o'clock).

### 11 to 99: pure arithmetic

Build them literally: **11 = 10+1 = *juuichi***, **20 = 2×10 = *nijuu***,
**35 = 3×10+5 = *sanjuugo***, **99 = *kyuujuukyuu***. No new words at all.

### Hundreds, thousands, and the big one: *man*

| Number | Japanese | Note |
|--------|----------|------|
| 100 | *hyaku* | |
| 300 | *sanbyaku* | sound change |
| 600 | *roppyaku* | sound change |
| 800 | *happyaku* | sound change |
| 1,000 | *sen* | |
| 3,000 | *sanzen* | sound change |
| 8,000 | *hassen* | sound change |
| **10,000** | ***ichiman*** | **counting resets here** |
| 100,000 | *juuman* | = 10 man |
| 1,000,000 | *hyakuman* | = 100 man |

**This is the big mental hurdle.** English groups digits in **thousands**; Japanese groups
them in **ten-thousands** (*man*). So ¥30,000 is *sanman-en* ("three man"), and ¥250,000 is
*nijuugoman-en* ("twenty-five man"), not "two hundred fifty thousand".

Trick for reading prices: **chop the last four digits**. What's left is the *man* count.
50,000 → 5|0000 → *goman*. 120,000 → 12|0000 → *juuniman*.

### Money

Yen is **円** *en* (not "yen" when speaking Japanese — say *en*).

| Price | Japanese |
|-------|----------|
| ¥100 | *hyaku-en* |
| ¥500 | *gohyaku-en* |
| ¥980 | *kyuuhyaku-hachijuu-en* |
| ¥1,200 | *sen-nihyaku-en* |
| ¥3,500 | *sanzen-gohyaku-en* |
| ¥10,000 | *ichiman-en* |

Useful money phrases:

| Japanese | Romaji | Meaning |
|----------|--------|---------|
| いくらですか | *Ikura desu ka* | How much is it? |
| 全部でいくらですか | *Zenbu de ikura desu ka* | How much altogether? |
| 高いですね | *Takai desu ne* | That's expensive, isn't it |
| カードで払えますか | *Kaado de haraemasu ka* | Can I pay by card? |
| 現金だけですか | *Genkin dake desu ka* | Cash only? |
| 領収書をください | *Ryoushuusho o kudasai* | Please give me a receipt |
| 別々でお願いします | *Betsubetsu de onegai shimasu* | Separate bills, please |
| 免税できますか | *Menzei dekimasu ka* | Can I get tax-free? |

### Numbers you'll hear rather than say

Staff read prices fast. Two survival tactics:

1. **Look at the register display** — it always shows the total. Nobody minds.
2. Say **「すみません、書いてください」** *Sumimasen, kaite kudasai* ("please write it") or
   hand over a ¥10,000 note and let the change sort itself out.

Also note Japan is still surprisingly **cash-friendly** — many small restaurants, temples
and rural buses are cash only. *Genkin dake* on a sign means exactly that.
`,
      quizTitle: "Numbers and prices",
      flashcards: [
        {
          front: "Count 1 to 10 in Japanese, noting the double readings.",
          back: `*ichi, ni, san, **yon/shi**, go, roku, **nana/shichi**, hachi, **kyuu/ku**, juu*.

Prefer **yon, nana, kyuu** in speech — clearer, and they avoid *shi* ("death") and *ku* ("suffering"). But fixed forms override: *yoji* (4:00), *shichiji* (7:00), *kuji* (9:00).`
        },
        {
          front: "Why is ¥30,000 *sanman-en* and not \"thirty thousand\"?",
          back: `Japanese groups large numbers in **ten-thousands (*man*)**, not thousands. 10,000 = *ichiman*, so 30,000 = *sanman*, 250,000 = *nijuugoman*, 1,000,000 = *hyakuman*.

Reading trick: **chop off the last four digits**; what remains is the *man* count. 120,000 → 12|0000 → *juuniman*.`
        },
        {
          front: "Which hundreds and thousands change their sound?",
          back: `**300 = sanbyaku**, **600 = roppyaku**, **800 = happyaku**; **3,000 = sanzen**, **8,000 = hassen**.

All others are regular (*nihyaku*, *yonhyaku*, *gosen*, *rokusen*). These sound changes make hundreds and thousands easier to say, and they're the same shifts you'll meet in counters.`
        },
        {
          front: "How do you ask how much something costs — and the total?",
          back: `**いくらですか** — *Ikura desu ka* — "How much is it?"
**全部でいくらですか** — *Zenbu de ikura desu ka* — "How much altogether?"

If you can't catch the number: **「すみません、書いてください」** *Sumimasen, kaite kudasai* ("please write it") — or just read the register display.`
        },
        {
          front: "Give four payment phrases for a Japanese shop or restaurant.",
          back: `- **カードで払えますか** *Kaado de haraemasu ka* — can I pay by card?
- **現金だけですか** *Genkin dake desu ka* — is it cash only?
- **別々でお願いします** *Betsubetsu de onegai shimasu* — separate bills please.
- **領収書をください** *Ryoushuusho o kudasai* — a receipt, please.

Japan remains cash-heavy: small restaurants, temples and rural buses are often *genkin dake*.`
        }
      ],
      quiz: [
        {
          question: "How do you say ¥50,000?",
          options: ["gojuusen-en", "goman-en", "gosen-en", "gohyakuman-en"],
          answer: 1,
          explanation: `Chop the last four digits: 5|0000 → **goman-en**. Japanese counts in units of 10,000 (*man*), so 50,000 is "five man", not "fifty thousand". *Gosen-en* would be ¥5,000.`
        },
        {
          question: "The clerk says a price you can't catch. Give two ways to handle it.",
          answer: `1. **「すみません、もう一度お願いします」** — *Sumimasen, mou ichido onegai shimasu* ("once more, please"), optionally with *yukkuri* (slowly).
2. **「書いてください」** — *Kaite kudasai* ("please write it") — or simply look at the register display, which every Japanese shop shows you.

A practical third option: hand over a ¥10,000 note. Change is always counted back accurately, and nobody thinks less of you for it.`
        },
        {
          question: "Which is 3,500 yen?",
          options: [
            "sanzen-gohyaku-en",
            "sansen-gohyaku-en",
            "sanman-gohyaku-en",
            "sanbyaku-gojuu-en"
          ],
          answer: 0,
          explanation: `3,000 undergoes a sound change: *san + sen* → **sanzen**. So ¥3,500 = *sanzen-gohyaku-en*. Option C would be ¥30,500, and option D is ¥350. The other sound-changed thousand is **hassen** (8,000).`
        }
      ]
    },
    {
      id: "counters",
      title: "Counters: Why You Can't Just Say \"Two\"",
      body: `## Japanese counts things with a classifier attached

You cannot say "two" on its own the way English does. The number fuses with a **counter**
that depends on the shape or nature of the thing — a bit like English "two **sheets** of
paper" or "three **head** of cattle", except Japanese does it for everything.

### The universal escape hatch: the *tsu* counter

The native counting series works for **most physical objects** and is your safety net when
you don't know the right counter:

| # | Japanese | # | Japanese |
|---|----------|---|----------|
| 1 | *hitotsu* | 6 | *muttsu* |
| 2 | *futatsu* | 7 | *nanatsu* |
| 3 | *mittsu* | 8 | *yattsu* |
| 4 | *yottsu* | 9 | *kokonotsu* |
| 5 | *itsutsu* | 10 | *tou* |

> これを二つください。 *Kore o futatsu kudasai.* — Two of these, please.

Beyond ten it reverts to plain numbers + *ko* (*juuichi-ko*). **Learn *hitotsu* to *itsutsu*
and you can shop for anything.**

### People: the counter you can't avoid

| # | Japanese | Note |
|---|----------|------|
| 1 person | *hitori* | irregular |
| 2 people | *futari* | irregular |
| 3 people | *sannin* | regular from here |
| 4 people | *yonin* | |
| 5 people | *gonin* | |

Restaurant staff will ask **「何名様ですか」** *Nan-mei-sama desu ka* or **「何人ですか」**
*Nannin desu ka* ("how many people?"). Answer: **「二人です」** *Futari desu*, or just hold
up fingers — but note the Japanese gesture for numbers starts with the index finger, and
holding up fingers works fine either way.

### The counters worth knowing

| Counter | For | Examples |
|---------|-----|----------|
| **〜つ** *-tsu* | general objects | *hitotsu, futatsu, mittsu* |
| **〜人** *-nin* | people | *hitori, futari, sannin* |
| **〜枚** *-mai* | flat things: tickets, paper, shirts | *ichimai, nimai, sanmai* |
| **〜本** *-hon* | long things: bottles, umbrellas, trains | *ippon, nihon, **sanbon**, **roppon**, **juppon*** |
| **〜杯** *-hai* | cupfuls, glassfuls | *ippai, nihai, **sanbai*** |
| **〜個** *-ko* | small items | *ikko, niko, sanko* |
| **〜台** *-dai* | machines, cars | *ichidai, nidai* |
| **〜泊** *-haku* | nights of a stay | *ippaku, nihaku, **sanpaku*** |
| **〜階** *-kai* | floors of a building | *ikkai, nikai, **sangai*** |
| **〜番** *-ban* | number/rank, platforms | *ichiban, niban* |

### The sound changes are the hard part

Numbers 1, 3, 6, 8 and 10 routinely mutate before a counter:

| | 1 | 3 | 6 | 8 | 10 |
|---|---|---|---|---|---|
| **-hon** | *ippon* | *sanbon* | *roppon* | *happon* | *juppon* |
| **-hai** | *ippai* | *sanbai* | *roppai* | *happai* | *juppai* |
| **-kai** (floors) | *ikkai* | *sangai* | *rokkai* | *hakkai* | *jukkai* |

Don't drill these. Nobody will misunderstand *"biiru, futatsu"* (two beers via the general
counter) even though a purist would say *nihai*. **The *tsu* counter forgives everything.**

### Ordinals and "number one"

Add **〜番目** *-banme* for "the nth": *ichibanme* (first), *nibanme* (second). And
**一番** *ichiban* alone means "number one / the most": *ichiban yasui no* — the cheapest
one; *ichiban chikai eki* — the nearest station.

### Putting counters in a sentence

The counter usually goes **after the particle**, floating just before the verb:

> ビールを二つください。 *Biiru o futatsu kudasai.* — Two beers, please.
>
> 切符を三枚お願いします。 *Kippu o sanmai onegai shimasu.* — Three tickets, please.
>
> 二泊します。 *Nihaku shimasu.* — I'm staying two nights.
`,
      quizTitle: "Counting things",
      flashcards: [
        {
          front: "What is a counter, and why can't you just say \"two\"?",
          back: `Japanese numbers must attach a **classifier** matching the thing's shape or nature — like English "two **sheets** of paper", but obligatory for everything.

*nimai* (2 flat things), *nihon* (2 long things), *futari* (2 people), *futatsu* (2 general objects). A bare number is used for maths and prices, not for counting objects.`
        },
        {
          front: "Recite the general *tsu* counter 1–5, and why it matters.",
          back: `**hitotsu, futatsu, mittsu, yottsu, itsutsu** (then *muttsu, nanatsu, yattsu, kokonotsu, tou*).

It's the **universal escape hatch**: it works for most physical objects, so when you don't know the specific counter you can always say *"Kore o futatsu kudasai."* Nobody will misunderstand.`
        },
        {
          front: "How do you count people?",
          back: `**hitori** (1), **futari** (2) — both irregular — then regular: **sannin** (3), *yonin* (4), *gonin* (5).

Restaurant staff ask *"Nannin desu ka"* or *"Nan-mei-sama desu ka"* ("how many people?"). Answer *"Futari desu"* — or hold up fingers.`
        },
        {
          front: "What are *-mai*, *-hon*, *-hai* and *-haku* for?",
          back: `- **-mai** — flat things: tickets, paper, shirts (*kippu o sanmai*).
- **-hon** — long things: bottles, umbrellas, train lines (*ippon, nihon, sanbon, roppon*).
- **-hai** — cupfuls/glassfuls (*ippai, nihai, sanbai*).
- **-haku** — nights of a hotel stay (*ippaku, nihaku, sanpaku*).`
        },
        {
          front: "What does *ichiban* mean on its own?",
          back: `"Number one / the most" — it forms superlatives: *ichiban yasui no* (the cheapest one), *ichiban chikai eki* (the nearest station), *ichiban oishii* (the most delicious).

With *-banme* it becomes an ordinal: *nibanme* (the second one). And on a platform sign, *ichiban-sen* is track 1.`
        },
        {
          front: "Where does the counter go in a sentence?",
          back: `After the particle, floating just before the verb:

*Biiru **o futatsu** kudasai.* — Two beers, please.
*Kippu **o sanmai** onegai shimasu.* — Three tickets, please.

It does **not** attach to the noun like an English adjective ("two beers"); it sits next to the verb.`
        }
      ],
      quiz: [
        {
          question: "You want two of the pastry you're pointing at. Which is safest?",
          options: [
            "Kore o ni kudasai",
            "Kore o futatsu kudasai",
            "Kore o nihon kudasai",
            "Kore o futari kudasai"
          ],
          answer: 1,
          explanation: `**futatsu** — the general *tsu* counter — is the safe default for physical objects. A bare number (*ni*) can't count objects; *nihon* is for long cylindrical things; *futari* counts **people**, which would be a memorable thing to order in a bakery.`
        },
        {
          question: "Book a hotel stay of three nights for two people.",
          answer: `**「二人で三泊お願いします」** — *Futari de sanpaku onegai shimasu.* — "For two people, three nights, please."

Pieces: **futari** (2 people — irregular counter), **sanpaku** (3 nights; *-haku* counts nights and 3 mutates to *sanpaku*), *de* marking the group, *onegai shimasu* for the request.

Related: *Yoyaku shite imasu* ("I have a reservation"), *Chekku-in onegai shimasu*, *Nanji made ni chekku-auto desu ka* ("by what time is checkout?").`
        },
        {
          question: "The toilet is on the second floor. Which is correct?",
          options: [
            "Toire wa nikai ni arimasu",
            "Toire wa nimai ni arimasu",
            "Toire wa futatsu ni arimasu",
            "Toire wa nihon ni arimasu"
          ],
          answer: 0,
          explanation: `Floors use **-kai**: *ikkai* (1st), **nikai** (2nd), *sangai* (3rd — note the sound change). *-mai* counts flat objects, *futatsu* is the general counter, and *-hon* counts long objects. Existence with a location takes *ni arimasu*.`
        }
      ]
    },
    {
      id: "time-and-dates",
      title: "Telling Time, Days and Dates",
      body: `## Clock time is easy; the calendar has landmines

### Hours: number + 時 *ji*

*ichiji* (1:00), *niji* (2), **yoji** (4), *goji* (5), *rokuji* (6), **shichiji** (7),
*hachiji* (8), **kuji** (9), *juuji* (10), *juuichiji* (11), *juuniji* (12).

The three irregulars are **4 = yoji** (never *yonji*), **7 = shichiji**, **9 = kuji** (never
*kyuuji*).

### Minutes: number + 分 *fun / pun*

| # | Minutes | # | Minutes |
|---|---------|---|---------|
| 1 | *ippun* | 6 | *roppun* |
| 2 | *nifun* | 7 | *nanafun* |
| 3 | *sanpun* | 8 | *happun* |
| 4 | *yonpun* | 9 | *kyuufun* |
| 5 | *gofun* | 10 | *juppun* |

15 minutes = *juugofun*, 30 = *sanjuppun* or **半** *han* ("half"): *niji han* = 2:30.

Morning/afternoon go **before** the time: **午前** *gozen* (a.m.), **午後** *gogo* (p.m.).
*Gogo sanji* = 3 p.m.

### Time phrases you'll need

| Japanese | Romaji | Meaning |
|----------|--------|---------|
| 何時ですか | *Nanji desu ka* | What time is it? |
| 何時からですか | *Nanji kara desu ka* | From what time? (opening) |
| 何時までですか | *Nanji made desu ka* | Until what time? (closing) |
| 何時に出ますか | *Nanji ni demasu ka* | What time does it leave? |
| 何分かかりますか | *Nanpun kakarimasu ka* | How many minutes does it take? |
| 今 / 後で / 早く | *ima / ato de / hayaku* | now / later / early, quickly |

### Days of the week: the elements

Each day is an element + **曜日** *youbi*:

| Day | Japanese | Literally |
|-----|----------|-----------|
| Monday | *getsuyoubi* | moon |
| Tuesday | *kayoubi* | fire |
| Wednesday | *suiyoubi* | water |
| Thursday | *mokuyoubi* | wood |
| Friday | *kinyoubi* | gold |
| Saturday | *doyoubi* | earth |
| Sunday | *nichiyoubi* | sun |

Memory hook: moon-fire-water-wood-gold-earth-sun. Shops post closing days as e.g.
**水曜定休** (closed Wednesdays).

### Months: just number + 月 *gatsu*

*ichigatsu* (January) through *juunigatsu* (December). Three irregular readings:
**4月 = shigatsu**, **7月 = shichigatsu**, **9月 = kugatsu**.

### Days of the month: the one genuinely irregular list

Days 1–10, plus 14, 20 and 24, use old native readings:

| Date | Japanese | Date | Japanese |
|------|----------|------|----------|
| 1st | *tsuitachi* | 8th | *youka* |
| 2nd | *futsuka* | 9th | *kokonoka* |
| 3rd | *mikka* | 10th | *tooka* |
| 4th | *yokka* | 14th | *juuyokka* |
| 5th | *itsuka* | 20th | *hatsuka* |
| 6th | *muika* | 24th | *nijuuyokka* |
| 7th | *nanoka* | others | number + *nichi* (*juuichinichi*) |

Nobody expects a tourist to have these cold. **Write the date down** or show it on your
phone — that's what locals do with foreigners too.

Full date order is **big to small**: year, month, day. *2026年3月5日* =
*nisen-nijuuroku-nen sangatsu itsuka*.

### Relative time words (no particle needed)

| Past | | Present | | Future | |
|------|---|---------|---|--------|---|
| *ototoi* | day before yesterday | *kyou* | today | *ashita* | tomorrow |
| *kinou* | yesterday | *ima* | now | *asatte* | day after tomorrow |
| *senshuu* | last week | *konshuu* | this week | *raishuu* | next week |
| *sengetsu* | last month | *kongetsu* | this month | *raigetsu* | next month |

Remember: these take **no particle**, but clock times and calendar dates take **に** *ni*.

> 明日の朝、九時に行きます。 *Ashita no asa, kuji ni ikimasu.* — Tomorrow morning, I'll go
> at nine.
`,
      quizTitle: "Time and dates",
      flashcards: [
        {
          front: "Which hours are irregular in Japanese?",
          back: `**4:00 = yoji** (never *yonji*), **7:00 = shichiji**, **9:00 = kuji** (never *kyuuji*).

All other hours are just the number + **時** *ji*: *ichiji, niji, goji, rokuji, hachiji, juuji, juuichiji, juuniji*.`
        },
        {
          front: "How do you say 2:30 and 3 p.m.?",
          back: `**2:30 = 二時半** *niji han* (*han* = half) — or *niji sanjuppun*.
**3 p.m. = 午後三時** *gogo sanji* — *gozen* (a.m.) and *gogo* (p.m.) go **before** the time.

Minutes take 分 *fun/pun* with sound changes: *ippun, nifun, sanpun, yonpun, gofun, roppun, nanafun, happun, kyuufun, juppun*.`
        },
        {
          front: "Name the days of the week and their memory hook.",
          back: `*getsuyoubi* (Mon), *kayoubi* (Tue), *suiyoubi* (Wed), *mokuyoubi* (Thu), *kinyoubi* (Fri), *doyoubi* (Sat), *nichiyoubi* (Sun).

Hook: **moon–fire–water–wood–gold–earth–sun**. Shop signs use them for closing days, e.g. 水曜定休 = closed Wednesdays.`
        },
        {
          front: "What's irregular about days of the month?",
          back: `Days **1–10**, plus **14, 20 and 24**, use old native readings: *tsuitachi* (1st), *futsuka*, *mikka*, *yokka*, *itsuka*, *muika*, *nanoka*, *youka*, *kokonoka*, *tooka*, *juuyokka* (14th), *hatsuka* (20th), *nijuuyokka* (24th).

Everything else is number + **日** *nichi*. Nobody expects a visitor to know these — write the date down or show your phone.`
        },
        {
          front: "How do you ask a shop's opening and closing time?",
          back: `**何時からですか** — *Nanji **kara** desu ka* — "From what time?" (opening).
**何時までですか** — *Nanji **made** desu ka* — "Until what time?" (closing).

Related: *Nanji ni demasu ka* (what time does it depart?), *Nanpun kakarimasu ka* (how many minutes does it take?).`
        },
        {
          front: "Which time expressions take *ni* and which don't?",
          back: `**Take *ni***: clock times, dates, days, months — anything fixed on a clock or calendar. *Kuji **ni**, getsuyoubi **ni**, sangatsu itsuka **ni***.

**No particle**: relative time words — *kyou, ashita, kinou, ima, konshuu, raigetsu, mainichi*.

*Ashita, kuji ni ikimasu* shows both in one sentence.`
        }
      ],
      quiz: [
        {
          question: "How do you say 4 o'clock?",
          options: ["yonji", "shiji", "yoji", "yottsuji"],
          answer: 2,
          explanation: `**yoji** — one of the three irregular hours, along with *shichiji* (7) and *kuji* (9). Note the irregularities differ by counter: 4 minutes is *yon**pun***, and April is *shi**gatsu***. Each counter picks its own reading of 4, 7 and 9.`
        },
        {
          question: "The restaurant sign says 11:30〜14:00, 17:00〜22:00, 水曜定休. What does that tell you, and how would you ask if they're open now?",
          answer: `It's open **11:30–14:00** for lunch and **17:00–22:00** for dinner, and **closed on Wednesdays** (水曜 = *suiyoubi*, 定休 = *teikyuu*, regular closing day). The afternoon gap is standard — many Japanese restaurants close between services (you may see 準備中 *junbi-chuu*, "getting ready", on the door).

To ask: **「今、開いていますか」** — *Ima, aite imasu ka* ("Are you open now?") or **「何時からですか」** *Nanji kara desu ka* ("From what time?").`
        },
        {
          question: "Which sentence correctly says \"I'll go at 9 tomorrow\"?",
          options: [
            "Ashita ni kuji ikimasu",
            "Ashita kuji ni ikimasu",
            "Ashita ni kyuuji ni ikimasu",
            "Ashita no kuji wa ikimasu"
          ],
          answer: 1,
          explanation: `*Ashita* (tomorrow) is a relative time word and takes **no particle**; the clock time takes **に**: *Ashita **kuji ni** ikimasu*. Also note 9 o'clock is **kuji**, not *kyuuji* — so option C is wrong twice over.`
        }
      ]
    }
  ]
}
