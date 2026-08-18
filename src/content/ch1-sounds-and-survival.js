export default {
  id: "sounds-survival",
  title: "Sounds & Survival Kit",
  subchapters: [
    {
      id: "sounds-of-japanese",
      title: "The Sounds: Easy to Say, Easy to Get Wrong",
      body: `## Good news: Japanese is one of the easiest languages to *pronounce*

There are only five vowels, no tones, and almost no consonant clusters. If you say each
part clearly and evenly, you will be understood. The traps are not hard sounds — they are
**length** and **rhythm**.

### The five vowels (never change)

| Vowel | Say it like | Example |
|-------|-------------|---------|
| **a** | f**a**ther | *asa* — morning |
| **i** | mach**i**ne | *ichi* — one |
| **u** | fl**u**te (lips relaxed, not rounded) | *umi* — sea |
| **e** | b**e**d | *eki* — station |
| **o** | m**o**re | *otoko* — man |

Unlike English, these **never** shift depending on spelling. *A* is always "ah". This is
why romaji is reliable enough for a tourist: what you read is what you say.

### Everything is built from beats (morae)

Japanese is not counted in syllables but in **morae** — equal-length beats. Almost every
beat is a consonant + vowel: *ka, ki, ku, ke, ko / sa, shi, su, se, so / ta, chi, tsu, te,
to …* plus standalone vowels.

Three things also count as a **full beat of their own**:

| Thing | Written | Sounds like | Example |
|-------|---------|-------------|---------|
| **n** | ん | a held "n" | *ho-n* (book) = 2 beats |
| **long vowel** | ー or doubled | hold twice as long | *o-o-ki-i* (big) = 4 beats |
| **small tsu** | っ | a beat of silence before the consonant | *ki-t-te* (stamp) = 3 beats |

Say every beat with the **same length and the same stress**. English speakers instinctively
stress a syllable (kah-RAH-oh-kee); Japanese wants a flat, metronome-like *ka-ra-o-ke*.

### Length changes meaning — this is the #1 mistake

| Short | Meaning | Long | Meaning |
|-------|---------|------|---------|
| *biru* | building | *biiru* | beer |
| *obasan* | aunt / middle-aged lady | *obaasan* | grandmother / old lady |
| *ojisan* | uncle / mister | *ojiisan* | grandfather / old man |
| *kite* | come / wear | *kiite* | listen / ask |

Ordering "*biru o kudasai*" asks for a building. Hold the vowel: "*biiru*".

### Pitch accent: nice to have, not required

Japanese distinguishes some words by **pitch** (high/low), not stress:

| Word | Pitch | Meaning |
|------|-------|---------|
| *ame* | HIgh-low | rain |
| *ame* | low-HIgh | candy |
| *hashi* | HIgh-low | chopsticks |
| *hashi* | low-HIgh | bridge |

Do not lose sleep over this. Context carries you — nobody hands you a bridge at dinner.
Getting it wrong sounds like a foreign accent, not gibberish.

### Four sounds worth practising

- **r** (*ra ri ru re ro*) — a single quick tap of the tongue, like the *tt* in American
  "bu**tt**er". It is neither English R nor L.
- **fu** (*ふ*) — blow gently between your lips; it is not an English F made with the teeth.
- **tsu** (*つ*) — the *ts* in "ca**ts**", but at the start of a word: *tsu-na-mi*.
- **n** before p/b/m drifts toward "m": *sen-pai* sounds like "sempai". Natural, ignore it.

### Vowels that quietly disappear

Between voiceless consonants, **i** and **u** are often whispered away. This is why
recordings never sound like the romaji:

| Written | Actually sounds like |
|---------|----------------------|
| *desu* | "dess" |
| *desu ka* | "dess ka" |
| *suki* | "ski" |
| *shita* | "shta" |
| *arigatou gozaimasu* | "arigatoh gozaimass" |

You can pronounce the vowels fully and still be understood — but knowing this helps you
*hear* what people say back to you, which is the harder half of a conversation.
`,
      quizTitle: "Hearing and saying it right",
      flashcards: [
        {
          front: "What is a mora, and why should a beginner care?",
          back: `A **mora** is the beat Japanese rhythm is counted in — usually one consonant + one vowel (*ka*, *shi*, *to*). Say every beat with **equal length and no stress**.

Three extras count as their own full beat: **ん (n)**, a **long vowel**, and the **small っ** (a beat of silence). So *kitte* (stamp) = ki-t-te = 3 beats, while *kite* (come) = 2.`
        },
        {
          front: "Why is *biiru* vs *biru* the classic beginner disaster?",
          back: `Vowel **length is meaning** in Japanese. *biiru* (long i) = beer; *biru* (short i) = building. Same for *obasan* (aunt) vs *obaasan* (grandmother) and *ojisan* (mister) vs *ojiisan* (grandfather).

English speakers under-hold long vowels because English uses stress instead of length. Deliberately hold doubled vowels for two beats.`
        },
        {
          front: "How do you pronounce the Japanese **r**?",
          back: `A single **flap** of the tongue tip against the ridge behind the upper teeth — like the *tt* in American English "butter" or "ladder". It is **not** an English R (no lip rounding) and not an L, though it sits between them to an English ear.`
        },
        {
          front: "Why does *desu* sound like \"dess\" and *suki* like \"ski\"?",
          back: `**Vowel devoicing.** The vowels **i** and **u** are whispered or dropped between voiceless consonants (k, s, t, h, p) and at the end of a word. So *desu* → "dess", *shita* → "shta", *arigatou gozaimasu* → "arigatoh gozaimass".

Pronouncing them fully is still understood — but knowing it helps you *hear* native speech.`
        },
        {
          front: "Does Japanese have word stress like English?",
          back: `No. Japanese has **pitch accent** (beats are high or low), not stress (loud/long). Some words differ only by pitch — *ame* HL = rain, *ame* LH = candy; *hashi* HL = chopsticks, *hashi* LH = bridge.

For a tourist this is optional: wrong pitch sounds accented, not incomprehensible. Flat, even delivery beats English-style stress.`
        }
      ],
      quiz: [
        {
          question: "How many beats (morae) are in *gakkou* (school)?",
          options: ["2", "3", "4", "5"],
          answer: 2,
          explanation: `**4**: *ga-k-ko-u*. The small っ (the doubled k) is a full beat of silence, and the long *ou* adds a beat. Written in kana it is がっこう — four kana, four beats. That one-kana-one-beat rule is the whole rhythm system.`
        },
        {
          question: "You want a beer and say *biru o kudasai*. What did you just ask for, and how do you fix it?",
          answer: `You asked for a **building** (*biru* = building, from English "building"). Beer is **biiru** (ビール) with a **long** *i* — two beats.

Fix: hold the vowel for a full extra beat — "bii-ru". Vowel length is not decoration in Japanese, it changes the word.`
        },
        {
          question: "Which of these is the best advice for sounding intelligible as a beginner?",
          options: [
            "Master pitch accent before speaking",
            "Stress the syllable that feels natural, like in English",
            "Give every beat the same length and don't stress anything",
            "Speak fast so the vowels blend together"
          ],
          answer: 2,
          explanation: `Even, unstressed beats are what make Japanese intelligible. English-style stress (ka-RA-o-ke) distorts vowel lengths, which *are* meaningful. Pitch accent is a polish step — plenty of perfectly understood foreigners never fully acquire it.`
        }
      ]
    },
    {
      id: "first-phrases",
      title: "The 20 Phrases That Cover Most of a Trip",
      body: `## If you learn nothing else, learn these

You can survive a two-week trip on this list plus pointing. Everything later in this course
just makes you more precise.

### Greetings and courtesies

| Japanese | Romaji | Use it when |
|----------|--------|-------------|
| おはようございます | *ohayou gozaimasu* | Good morning (until ~10am) |
| こんにちは | *konnichiwa* | Hello / good day (daytime) |
| こんばんは | *konbanwa* | Good evening |
| ありがとうございます | *arigatou gozaimasu* | Thank you (full, polite form) |
| どうも | *doumo* | Thanks / hi — the all-purpose casual token |
| すみません | *sumimasen* | Excuse me / sorry / thank you — see below |
| はい / いいえ | *hai / iie* | Yes / no |
| お願いします | *onegai shimasu* | Please (do this for me) — the workhorse |
| 大丈夫です | *daijoubu desu* | It's fine / I'm OK / no thanks |
| 失礼します | *shitsurei shimasu* | Excuse me (entering, leaving, interrupting) |

### *Sumimasen* is the single most useful word in Japan

It does at least four jobs:

1. **Getting attention** — calling a waiter, stopping a passer-by. Say it and wait.
2. **Sorry** — bumping someone on a train.
3. **Thank you** — specifically "sorry you went to the trouble for me". Very common when
   someone picks up something you dropped.
4. **Excuse me, coming through** — squeezing past people.

Said briskly it means "hey, over here"; said softly with a small bow it means "sorry".

### Getting through an interaction

| Japanese | Romaji | Meaning |
|----------|--------|---------|
| これをください | *kore o kudasai* | This one, please (while pointing) |
| いくらですか | *ikura desu ka* | How much is it? |
| 〜はどこですか | *… wa doko desu ka* | Where is …? |
| 英語のメニューはありますか | *eigo no menyuu wa arimasu ka* | Do you have an English menu? |
| わかりません | *wakarimasen* | I don't understand |
| 日本語がわかりません | *nihongo ga wakarimasen* | I don't understand Japanese |
| もう一度お願いします | *mou ichido onegai shimasu* | One more time, please |
| ゆっくりお願いします | *yukkuri onegai shimasu* | Slowly, please |
| 英語ができますか | *eigo ga dekimasu ka* | Can you speak English? |
| ちょっと待ってください | *chotto matte kudasai* | Please wait a moment |

### Introducing yourself (30 seconds of prep)

> はじめまして。〜です。イギリスから来ました。よろしくお願いします。
>
> *Hajimemashite. [name] desu. Igirisu kara kimashita. Yoroshiku onegai shimasu.*
>
> "Nice to meet you. I'm [name]. I came from the UK. Pleased to meet you."

*Yoroshiku onegai shimasu* has no English equivalent — it's a social "let's get along /
thanks in advance", used when meeting people and when asking for a favour.

Countries you may need: *Amerika*, *Igirisu* (UK), *Kanada*, *Oosutoraria*, *Doitsu*
(Germany), *Furansu*, *Isuraeru*, *Indo*, *Chuugoku* (China), *Kankoku* (South Korea).

### Around food

| Japanese | Romaji | When |
|----------|--------|------|
| いただきます | *itadakimasu* | Before eating — "I gratefully receive" |
| ごちそうさまでした | *gochisousama deshita* | After eating — "thank you for the meal" |
| おいしいです | *oishii desu* | It's delicious (say it, people light up) |
| お会計お願いします | *o-kaikei onegai shimasu* | The bill, please |

### Goodbye

*Sayounara* is heavier than English "goodbye" — it hints at a long separation. Day to day,
people say **またね** *mata ne* ("see you"), **失礼します** *shitsurei shimasu* (leaving a
shop or office politely), or in shops you simply get **ありがとうございました**
*arigatou gozaimashita* on the way out.
`,
      quizTitle: "Survival phrases",
      flashcards: [
        {
          front: "Name four different jobs the word *sumimasen* does.",
          back: `1. **Excuse me** — getting a waiter's or a stranger's attention.
2. **Sorry** — a small apology (bumping into someone).
3. **Thank you** — "sorry for the trouble you took for me" — extremely common.
4. **Coming through** — squeezing past people.

Tone and volume tell them apart. It is the most useful single word in Japan.`
        },
        {
          front: "How do you say \"This one, please\" while pointing?",
          back: `**これをください** — *kore o kudasai*.

*kore* = this one (near me), *o* marks it as the object, *kudasai* = please give me. Swap in *sore* (that, near you) or *are* (that over there). With a menu and a finger, this orders anything.`
        },
        {
          front: "What does *onegai shimasu* mean and when do you use it?",
          back: `"Please (do this for me)" — a request for an **action or service**. Use it for ordering (*kore o onegai shimasu*), asking for the bill (*o-kaikei onegai shimasu*), or asking someone to repeat (*mou ichido onegai shimasu*).

Contrast with *kudasai*, which is closer to "please **give** me [thing]". In practice both work for ordering; *onegai shimasu* is slightly softer.`
        },
        {
          front: "Why shouldn't you use *sayounara* to say bye to shop staff or new friends?",
          back: `*Sayounara* carries a sense of **long or final parting** — it can sound like "farewell". Everyday alternatives: **mata ne** (see you), **shitsurei shimasu** (polite "excuse me, I'm leaving"), or simply **arigatou gozaimashita** in a shop.`
        },
        {
          front: "What do you say before and after a meal?",
          back: `Before: **いただきます** *itadakimasu* — "I gratefully receive" (hands together; said even when eating alone).

After: **ごちそうさまでした** *gochisousama deshita* — "thank you for the feast", said to the cook or to staff as you leave. Both are near-mandatory politeness rituals and always land well.`
        },
        {
          front: "Give a 3-sentence self-introduction template.",
          back: `**はじめまして。〜です。〜から来ました。よろしくお願いします。**

*Hajimemashite. [name] desu. [country] kara kimashita. Yoroshiku onegai shimasu.*

"Nice to meet you. I'm [name]. I'm from [country]. Pleased to meet you." — *yoroshiku onegai shimasu* has no direct English equivalent; it's a social "let's get along".`
        }
      ],
      quiz: [
        {
          question: "Someone picks up the glove you dropped and hands it back. What's the most natural thing to say?",
          options: [
            "Sayounara",
            "Sumimasen (or arigatou gozaimasu)",
            "Itadakimasu",
            "Hajimemashite"
          ],
          answer: 1,
          explanation: `**Sumimasen** here means "thank you — sorry you went to the trouble", which is the standard Japanese reflex for a favour. *Arigatou gozaimasu* is also perfectly fine. Many Japanese speakers would say both: *"Ah, sumimasen, arigatou gozaimasu."*`
        },
        {
          question: "You're in a restaurant and want to order the dish in the photo. Write the full interaction you'd need.",
          answer: `1. Call staff: **すみません** — *sumimasen* (raise a hand, say it once, clearly).
2. Point and order: **これをください** — *kore o kudasai* (or *kore o onegai shimasu*).
3. If asked something you don't get: **わかりません** — *wakarimasen*, or **英語のメニューはありますか** *eigo no menyuu wa arimasu ka*.
4. Before eating: **いただきます** *itadakimasu*.
5. To pay: **お会計お願いします** *o-kaikei onegai shimasu*.
6. Leaving: **ごちそうさまでした** *gochisousama deshita*.

That's a full restaurant visit with six memorised phrases and a finger.`
        },
        {
          question: "Which phrase means \"Please say that again\"?",
          options: [
            "Yukkuri onegai shimasu",
            "Mou ichido onegai shimasu",
            "Chotto matte kudasai",
            "Daijoubu desu"
          ],
          answer: 1,
          explanation: `*Mou ichido* = "one more time". *Yukkuri onegai shimasu* asks them to slow **down**; *chotto matte kudasai* = "wait a moment"; *daijoubu desu* = "I'm fine / no thanks". Pair the first two: **"Sumimasen, mou ichido, yukkuri onegai shimasu."**`
        }
      ]
    },
    {
      id: "politeness-levels",
      title: "Politeness: Which \"Japanese\" Should You Learn?",
      body: `## Japanese has registers, and you only need one

The same idea can be said many ways, ranked from blunt to ceremonial. Anime and textbooks
teach different rungs of this ladder, which is why learners get confused.

| Level | "I'll eat" | Who uses it |
|-------|-----------|-------------|
| Plain / casual | *taberu* | Friends, family, inner monologue, anime |
| **Polite (-masu / desu)** | ***tabemasu*** | **Strangers, shops, everyone you'll meet. Learn this.** |
| Humble / honorific (keigo) | *itadakimasu* / *meshiagarimasu* | Staff talking to *you*; business |

### Your rule as a visitor: always use polite form

Speak in **-masu / desu** to everyone. It is never rude, never too stiff for a tourist, and
it is what phrasebooks give you. Casual form used with a stranger sounds like a child or a
tough guy; nobody expects a visitor to attempt keigo.

The pattern is simple and mechanical:

| Function | Ending | Example |
|----------|--------|---------|
| Statement (noun/adj) | *desu* | *takai desu* — it's expensive |
| Statement (verb) | *-masu* | *ikimasu* — I go / I'll go |
| Negative | *-masen* | *ikimasen* — I don't go |
| Past | *-mashita* | *ikimashita* — I went |
| Question | add **か** *ka* | *ikimasu ka* — do you go? |

### Keigo is for *listening*, not speaking

Shop and station staff will address you in elaborate honorific language. You don't produce
it, but recognising a few forms stops you freezing:

| You'll hear | Means |
|-------------|-------|
| いらっしゃいませ *irasshaimase* | Welcome! (entering a shop — no reply needed) |
| 少々お待ちください *shoushou omachi kudasai* | Please wait a moment |
| こちらへどうぞ *kochira e douzo* | This way, please |
| どうぞ *douzo* | Go ahead / here you are |
| かしこまりました *kashikomarimashita* | Certainly (your order is understood) |
| お待たせしました *omatase shimashita* | Sorry to keep you waiting |

Note *irasshaimase*: it is a greeting **to customers only**. Answering it is not expected —
a nod is plenty.

### The *o-* / *go-* politeness prefix

Many everyday words wear a polite prefix so often it's practically part of the word:

*o-kane* (money), *o-mizu* (water), *o-cha* (tea), *o-tearai* (toilet), *o-kaikei* (bill),
*o-namae* (your name), *go-chuumon* (your order), *go-yoyaku* (your reservation).

Rough rule: **o-** on native Japanese words, **go-** on Chinese-derived ones. Using it is
polite; forgetting it is not offensive.

### Two things politeness is *not*

- It is **not** about who's older or richer — it tracks **social distance**. Strangers get
  polite form regardless of age.
- It is **not** conveyed by saying "please" more often. Adding *kudasai* to a blunt sentence
  doesn't fix it — the **verb ending** carries the politeness.

### Softening: the real native trick

Japanese politeness leans on **indirectness** more than on formal endings. Compare:

| Blunt | Softer, more natural |
|-------|---------------------|
| *Chigaimasu* (that's wrong) | *Chotto chigaimasu ne* (it's a bit different, isn't it) |
| *Iie* (no) | *Chotto…* (trailing off) |
| *Dame desu* (not allowed) | *Chotto muzukashii desu* (that's a bit difficult) |

Learn to hear **"chotto…"** as a polite **no**. A shopkeeper who says *"Chotto muzukashii
desu ne"* is not inviting you to try harder — the answer is no.
`,
      quizTitle: "Registers and politeness",
      flashcards: [
        {
          front: "Which politeness level should a tourist speak, and why?",
          back: `The **polite -masu / desu** form, with everyone. It is never rude, never overly stiff for a visitor, and it's mechanically simple: *ikimasu / ikimasen / ikimashita / ikimasu ka*.

Plain form (*iku*) with strangers sounds childish or brusque; keigo (honorifics) is for staff addressing you, not for you to produce.`
        },
        {
          front: "What does *irasshaimase* mean, and how do you answer it?",
          back: `"Welcome!" — called out when you enter a shop or restaurant. It is directed at **customers** and expects **no reply**. A small nod is plenty; saying it back is a beginner tell (you would be welcoming them to their own shop).`
        },
        {
          front: "What does *chotto…* mean when someone trails off?",
          back: `It's a polite **no**. Literally "a little…", it signals refusal or difficulty without the harshness of *iie*. Variants: *chotto muzukashii desu* ("a bit difficult") = it can't be done; *chotto…* with a wince = no.

Reading this correctly saves you from pushing on something that has already been declined.`
        },
        {
          front: "What are the *o-* and *go-* prefixes for?",
          back: `Politeness prefixes attached to nouns: *o-mizu* (water), *o-cha* (tea), *o-kane* (money), *o-tearai* (toilet), *o-kaikei* (the bill), *go-chuumon* (your order), *go-yoyaku* (your reservation).

Rough rule: **o-** for native Japanese words, **go-** for Sino-Japanese ones. Many are so fixed that dropping the prefix sounds odd.`
        },
        {
          front: "Give the four polite verb endings for *ikimasu* (to go).",
          back: `- Present/future: **ikimasu** (I go / I'll go)
- Negative: **ikimasen** (I don't / won't go)
- Past: **ikimashita** (I went)
- Past negative: **ikimasen deshita** (I didn't go)

Add **か** *ka* to any of them to make a question: *ikimasu ka?*`
        }
      ],
      quiz: [
        {
          question: "You ask a shop if they can ship your purchase abroad. The clerk draws in a breath through their teeth and says \"Chotto muzukashii desu ne…\". What's the answer?",
          options: [
            "Yes, but it's complicated — ask again",
            "No — that's a polite refusal",
            "They need more information from you",
            "It's expensive but possible"
          ],
          answer: 1,
          explanation: `**It's a no.** Japanese avoids flat refusals; "a bit difficult", a trailing *chotto…*, and the drawn breath are all conventional ways to decline. Pressing further makes both sides uncomfortable — thank them (*arigatou gozaimasu*) and move on.`
        },
        {
          question: "A stranger your own age asks you for directions. Should you answer in casual form (*wakaranai*) since you're peers?",
          options: [
            "Yes, same age means casual is fine",
            "No — politeness tracks social distance, so use *wakarimasen*",
            "Yes, but only if they used casual first",
            "No — you should use keigo (honorifics)"
          ],
          answer: 1,
          explanation: `Japanese registers track **social distance**, not just age. A stranger gets polite form (*wakarimasen*) whatever their age. Keigo would be overkill in the other direction — that's staff-to-customer language, not stranger-to-stranger.`
        },
        {
          question: "Convert \"I didn't eat\" into polite past-negative, given *tabemasu* = I eat.",
          answer: `**食べませんでした** — *tabemasen deshita*.

The pattern: take the *-masu* stem, use **-masen** for the negative, then add **deshita** for the past. So *ikimasu → ikimasen deshita*, *nomimasu → nomimasen deshita*. The past marker sits on the negative ending, not inside the verb.`
        }
      ]
    }
  ]
}
