export default {
  id: "word-building",
  title: "How Words Are Built",
  subchapters: [
    {
      id: "word-anatomy",
      title: "The Anatomy of a Japanese Word",
      body: `## Words are made of predictable, reusable blocks

Japanese vocabulary looks impenetrable until you notice that the same small pieces recur
everywhere. Once you can spot them, you can guess dozens of words you have never heard.

### Three layers of vocabulary

| Layer | Origin | Feel | Examples |
|-------|--------|------|----------|
| **Native (*wago*)** | Old Japanese | everyday, warm | *mizu* (water), *taberu* (eat), *ookii* (big) |
| **Sino-Japanese (*kango*)** | Borrowed from Chinese | formal, compact, official | *suidou* (water supply), *shokuji* (a meal), *daigaku* (university) |
| **Foreign (*gairaigo*)** | Mostly English | modern, technical, commercial | *hoteru*, *takushii*, *kohii*, *chekku-in* |

Signs and announcements lean on the Sino layer; conversation leans on the native layer;
anything invented in the last century is usually the foreign layer. As a visitor, **the
foreign layer is free vocabulary** — you already know it, you just need the Japanese
pronunciation of it.

### Suffixes that build whole word families

| Suffix | Meaning | Examples |
|--------|---------|----------|
| **〜屋** *-ya* | shop / seller of | *pan-ya* (bakery), *hana-ya* (florist), *sakana-ya* (fishmonger) |
| **〜人** *-jin* | person of a country | *nihon-jin*, *amerika-jin*, *igirisu-jin* |
| **〜語** *-go* | language | *nihon-go*, *ei-go*, *chuugoku-go* |
| **〜駅** *-eki* | station | *Tokyo-eki*, *Kyoto-eki* |
| **〜円** *-en* | yen | *sen-en* (¥1000), *goman-en* (¥50,000) |
| **〜さん** *-san* | Mr/Ms (any gender) | *Tanaka-san*, *o-kyaku-san* (customer) |
| **〜中** *-chuu* | in the middle of | *kouji-chuu* (under construction), *shiyou-chuu* (in use / occupied) |
| **〜口** *-guchi* | entrance / exit | *higashi-guchi* (east exit), *iri-guchi* (entrance), *de-guchi* (exit) |

Learn *higashi / nishi / minami / kita* (east/west/south/north) plus *-guchi* and you can
navigate any Japanese station exit.

### Prefixes worth knowing

- **お〜 / ご〜** *o- / go-* — politeness: *o-mizu*, *o-kane*, *go-chuumon*.
- **大〜** *dai-/oo-* — big: *daigaku* (big-learning = university), *ooame* (heavy rain).
- **小〜** *ko-/shou-* — small: *kozutsumi* (parcel), *shougakkou* (elementary school).
- **不〜** *fu-* — un-/not: *fuben* (inconvenient), *fuanzen* (unsafe).
- **新〜** *shin-* — new: *Shin-Osaka*, *shinkansen* (new-trunk-line = bullet train).

### Compounds: two nouns glued together

Japanese builds new words by simply stacking nouns, exactly like English "toothbrush":

*denwa* (telephone) + *bangou* (number) = **denwa-bangou** (phone number)
*basu* + *tei* (stop) = **basu-tei** (bus stop)
*ryokou* (travel) + *sha* (company) = **ryokou-gaisha** (travel agency)

Notice *sha* → *gaisha*: when two words join, the second often **voices** its first
consonant (h→b/p, k→g, s→z, t→d). *hito* → *-bito*, *kami* → *-gami*, *hana* → *-bana*. You
don't need to produce this; recognising it stops you thinking you've met a new word.

### *suru* turns nouns into verbs

**する** *suru* ("to do") attaches to nouns — mostly Sino-Japanese and loanwords — to make
verbs. This is the most productive verb-making machine in the language:

| Noun | + suru | Meaning |
|------|--------|---------|
| *benkyou* (study) | *benkyou suru* | to study |
| *ryokou* (travel) | *ryokou suru* | to travel |
| *yoyaku* (reservation) | *yoyaku suru* | to reserve |
| *chekku-in* | *chekku-in suru* | to check in |
| *kyanseru* | *kyanseru suru* | to cancel |

Polite form: **shimasu**. So *"Yoyaku shimashita"* = "I made a reservation";
*"Kyanseru shitai desu"* = "I want to cancel".

This means **any borrowed English noun can become a verb**: *koushin suru*, *saabu suru*,
*kopii suru*. If you're stuck for a verb, try the English noun + *shimasu* — it works
surprisingly often.
`,
      quizTitle: "Word building blocks",
      flashcards: [
        {
          front: "What are the three vocabulary layers of Japanese?",
          back: `1. **Native (*wago*)** — everyday, warm: *mizu*, *taberu*, *ookii*.
2. **Sino-Japanese (*kango*)** — formal, compact, used on signs and in announcements: *suidou*, *shokuji*, *daigaku*.
3. **Foreign (*gairaigo*)** — mostly English, modern and commercial: *hoteru*, *takushii*, *chekku-in*.

The third layer is free vocabulary for an English speaker — you only need the Japanese pronunciation.`
        },
        {
          front: "What does *suru* do, and why is it a beginner's best friend?",
          back: `**suru** ("to do") turns a **noun into a verb**: *benkyou suru* (study), *yoyaku suru* (reserve), *chekku-in suru* (check in), *kyanseru suru* (cancel).

Polite form **shimasu**. It works on borrowed English nouns too, so when you don't know a verb, try *[English noun] + shimasu* — it very often lands.`
        },
        {
          front: "What do the suffixes *-ya*, *-jin*, *-go*, and *-guchi* mean?",
          back: `- **-ya** = shop: *pan-ya* (bakery), *hana-ya* (florist).
- **-jin** = person from a country: *nihon-jin*, *igirisu-jin*.
- **-go** = language: *nihon-go*, *ei-go*.
- **-guchi** = entrance/exit: *iri-guchi* (entrance), *de-guchi* (exit), *higashi-guchi* (east exit).

Combine *-guchi* with *kita/minami/higashi/nishi* (N/S/E/W) to navigate any station.`
        },
        {
          front: "Why does *ryokou + kaisha* become *ryokou-gaisha*?",
          back: `**Sequential voicing** (*rendaku*): when words compound, the second element often voices its first consonant — k→g, s→z, t→d, h→b/p.

*hito* → *-bito*, *kami* → *-gami*, *hana* → *-bana*, *kaisha* → *-gaisha*. You don't need to produce it deliberately; recognising it stops a familiar word from sounding brand new.`
        },
        {
          front: "What does *-chuu* mean on a sign?",
          back: `"In the middle of / currently". *kouji-**chuu*** = under construction, *shiyou-**chuu*** = in use (on a toilet door: occupied), *eigyou-**chuu*** = open for business, *junbi-**chuu*** = getting ready (not open yet).

Spotting *中* on a sign tells you something is ongoing — very useful for shop doors.`
        }
      ],
      quiz: [
        {
          question: "You see a shop sign ending in 〜屋 (*-ya*). What does it tell you?",
          options: [
            "It's a station",
            "It's a shop selling that thing",
            "It's closed",
            "It's a person's surname"
          ],
          answer: 1,
          explanation: `**-ya** marks a shop or seller: *pan-ya* (bakery), *sakana-ya* (fish shop), *hon-ya* (bookshop), *izakaya* (a "stay-drink shop" = pub). It does double duty in surnames, but on a shopfront it's the shop meaning.`
        },
        {
          question: "You need to say \"I want to cancel\" about a booking. Build it from the loanword *kyanseru*.",
          answer: `**キャンセルしたいです。** — *Kyanseru shitai desu.*

Steps: loanword noun *kyanseru* + **suru** (to do) = *kyanseru suru* → the "want to" form **shitai** → polite *desu*.

Related: *Yoyaku o kyanseru shitai desu* ("I'd like to cancel my reservation"), *Yoyaku shimashita* ("I made a reservation"), *Chekku-in shitai desu* ("I'd like to check in").`
        },
        {
          question: "Which of these is *not* how Japanese builds new words?",
          options: [
            "Stacking two nouns (denwa + bangou)",
            "Adding suru to a noun to make a verb",
            "Changing the vowel inside the root (sing/sang/sung)",
            "Borrowing an English word and adapting the sounds"
          ],
          answer: 2,
          explanation: `Internal vowel change (sing/sang/sung, foot/feet) is a Germanic pattern with essentially no Japanese equivalent. Japanese builds by **stacking** (compounds), **attaching** (*suru*, *-ya*, *-jin*, *o-*), and **borrowing**. That regularity is what makes its word-formation easy to guess.`
        }
      ]
    },
    {
      id: "adjectives",
      title: "Adjectives: Two Kinds, and One Behaves Like a Verb",
      body: `## Japanese has two adjective types, and they conjugate differently

This surprises English speakers: one type of Japanese adjective **carries tense itself**,
like a verb. There's no "was" separate from the adjective — the adjective changes shape.

### Type 1: *i*-adjectives (end in -い)

*takai* (expensive), *yasui* (cheap), *oishii* (delicious), *atsui* (hot), *samui* (cold),
*ookii* (big), *chiisai* (small), *atarashii* (new), *furui* (old), *tanoshii* (fun),
*isogashii* (busy), *muzukashii* (difficult), *chikai* (near), *tooi* (far).

| Form | Rule | Example (*takai*) |
|------|------|-------------------|
| Present | as-is + *desu* | *takai desu* — it's expensive |
| Negative | -i → **-kunai** | *takakunai desu* — it's not expensive |
| Past | -i → **-katta** | *takakatta desu* — it was expensive |
| Past negative | -i → **-kunakatta** | *takakunakatta desu* — it wasn't expensive |

Note: *desu* here adds **politeness only** — it does not carry the tense. Saying
*"takai deshita"* is a classic error; the past lives **inside** the adjective:
*takakatta desu*.

**Irregular:** *ii* (good) conjugates from its older form *yoi* → *yokunai* (not good),
**yokatta** (was good — also the everyday expression for "oh good! / what a relief"),
*yokunakatta*.

### Type 2: *na*-adjectives (behave like nouns)

*kirei* (pretty/clean), *shizuka* (quiet), *nigiyaka* (lively), *benri* (convenient),
*yuumei* (famous), *genki* (healthy/energetic), *suki* (liked), *kirai* (disliked),
*daijoubu* (fine), *taihen* (tough), *hima* (free/not busy), *anzen* (safe).

They inflect exactly like nouns — the ending sits on *desu*, not on the word:

| Form | Example (*shizuka*) |
|------|---------------------|
| Present | *shizuka desu* — it's quiet |
| Negative | *shizuka ja nai desu* (or *ja arimasen*) |
| Past | *shizuka deshita* |
| Past negative | *shizuka ja nakatta desu* |

The name comes from what happens **before a noun**: they need **な** *na* as glue.

| Type | Before a noun |
|------|---------------|
| *i*-adjective | *takai hoteru* — an expensive hotel |
| *na*-adjective | *shizuka **na** hoteru* — a quiet hotel |

**Trap:** *kirei*, *yuumei* and *kirai* end in -i but are ***na*-adjectives**. Say *kirei
**na** hana* (a pretty flower) and *kirei deshita* (it was pretty), never *"kireikatta"*.

### Making things stronger or weaker

| Word | Meaning | Example |
|------|---------|---------|
| *totemo* | very | *totemo oishii desu* |
| *chotto / sukoshi* | a little | *chotto takai desu* — a bit pricey |
| *amari … -nai* | not very | *amari oishikunai desu* |
| *zenzen … -nai* | not at all | *zenzen wakarimasen* |
| *motto* | more | *motto ookii no* — a bigger one |
| *ichiban* | most / -est | *ichiban yasui no* — the cheapest one |

*amari* and *zenzen* **require a negative** later in the sentence — they're two halves of
one construction.

### Turning adjectives into adverbs

| Type | Rule | Example |
|------|------|---------|
| *i*-adj | -i → **-ku** | *hayai* (fast) → *hayaku* — *hayaku onegai shimasu* (quickly, please) |
| *na*-adj | + **ni** | *kirei* → *kirei ni* — *kirei ni narimashita* (it became clean) |

### Shopping shortcut: *no* = "one"

Instead of repeating the noun, use **の** *no* as "one":

*Motto yasui **no** wa arimasu ka* — "Do you have a cheaper **one**?"
*Chiisai **no** o kudasai* — "The small **one**, please."
*Akai **no** ga ii desu* — "I'd like the red **one**."

This one trick makes shopping conversations dramatically easier.
`,
      quizTitle: "Describing things",
      flashcards: [
        {
          front: "What are the two adjective types, and how do you tell them apart?",
          back: `**i-adjectives** end in **-い** and conjugate themselves: *takai → takakunai → takakatta*.

**na-adjectives** behave like nouns and need **な** before a noun: *shizuka **na** hoteru*; tense goes on *desu*: *shizuka deshita*.

Watch out: *kirei*, *yuumei*, *kirai* end in -i but are **na**-adjectives.`
        },
        {
          front: "How do you say \"it was expensive\" and what's the common mistake?",
          back: `**高かったです** — *takakatta desu*.

The mistake is **"takai deshita"**. With i-adjectives the **past tense lives inside the adjective** (-i → -katta); *desu* only adds politeness. Compare na-adjectives, where the tense really does sit on *desu*: *shizuka deshita*.`
        },
        {
          front: "Conjugate *ii* (good) — why is it irregular?",
          back: `*ii* inflects from its older form **yoi**:

- Negative: **yokunai desu** (not good)
- Past: **yokatta desu** (was good)
- Past negative: **yokunakatta desu**

**「よかった!」** *Yokatta!* is also an everyday exclamation meaning "oh good! / what a relief!"`
        },
        {
          front: "What do *amari* and *zenzen* require?",
          back: `Both need a **negative** later in the sentence — they're half of a two-part construction.

*amari … -nai* = "not very": *amari oishikunai desu*.
*zenzen … -nai* = "not at all": *zenzen wakarimasen*.

Using them with a positive verb sounds broken (though *zenzen* + positive is now common slang meaning "totally").`
        },
        {
          front: "What's the shopping trick with *no* meaning \"one\"?",
          back: `**の** *no* stands in for a noun you've already established, like English "one":

*Motto yasui **no** wa arimasu ka* — "Do you have a cheaper one?"
*Chiisai **no** o kudasai* — "The small one, please."
*Akai **no** ga ii desu* — "I'd like the red one."

It saves you from repeating (or not knowing) the noun.`
        },
        {
          front: "How do you make an adverb from each adjective type?",
          back: `**i-adjective**: -i → **-ku**. *hayai* (fast) → *hayaku*: *Hayaku onegai shimasu* (quickly, please).

**na-adjective**: + **ni**. *kirei* → *kirei ni*; *shizuka* → *shizuka ni*: *Shizuka ni shite kudasai* (please be quiet).`
        }
      ],
      quiz: [
        {
          question: "Which sentence is correct for \"It was delicious\"?",
          options: [
            "Oishii deshita",
            "Oishikatta desu",
            "Oishii datta desu",
            "Oishii na deshita"
          ],
          answer: 1,
          explanation: `*oishii* is an **i-adjective**, so the past tense goes inside it: *oishii* → **oishikatta** + *desu* for politeness. *"Oishii deshita"* is the single most common learner error with adjectives — that pattern belongs to na-adjectives and nouns (*shizuka deshita*, *ame deshita*).`
        },
        {
          question: "Fix this sentence: *\"Kirei katta hoteru deshita.\"* (It was a pretty hotel.)",
          answer: `**きれいなホテルでした。** — *Kirei na hoteru deshita.*

Two errors in the original:
1. *kirei* ends in -i but is a **na-adjective** — it can't take *-katta*.
2. Before a noun, na-adjectives need **な**: *kirei **na** hoteru*.

The tense then sits on *desu* → *deshita*. Other -i-looking na-adjectives with the same trap: *yuumei* (famous), *kirai* (disliked).`
        },
        {
          question: "In a shop, you want to ask for a cheaper one. Which is best?",
          options: [
            "Motto yasui no wa arimasu ka",
            "Motto yasukatta desu",
            "Amari yasui desu",
            "Yasui ja nai desu"
          ],
          answer: 0,
          explanation: `*Motto* (more) + *yasui* (cheap) + **no** ("one") + *wa arimasu ka* ("do you have?") = "Do you have a cheaper one?" — polite, complete, and it avoids naming the item. Option B says "it was cheaper", C is broken (*amari* needs a negative), D says "it isn't cheap", which sounds like a complaint.`
        }
      ]
    },
    {
      id: "verb-groups",
      title: "Verb Shapes: Three Groups, No Person Agreement",
      body: `## The good news first

Japanese verbs **do not change for person or number**. There is no I/you/he-she-it
agreement, no singular/plural. *Tabemasu* means "I eat", "you eat", "they eat", "we will
eat" — context decides.

What verbs *do* change for is **tense, negation, politeness, and mood** — all by swapping
the ending.

### Dictionary form vs polite form

Every verb has a **dictionary form** (what you'd look up: *taberu*, *nomu*, *iku*) and a
**polite form** ending in **-masu** (*tabemasu*, *nomimasu*, *ikimasu*). As a tourist you
speak the *-masu* form, but you need the dictionary form to know **which group** a verb
belongs to — and the group determines every other transformation.

### Group 2 (*ru*-verbs) — the easy ones

End in **-eru** or **-iru**. Drop **ru**, add the ending.

| Dictionary | Polite | Meaning |
|-----------|--------|---------|
| *taberu* | *tabemasu* | eat |
| *miru* | *mimasu* | see, watch |
| *okiru* | *okimasu* | get up |
| *neru* | *nemasu* | sleep |
| *dekiru* | *dekimasu* | can do |

### Group 1 (*u*-verbs) — the big group

Everything else ending in *-u*. The final *u* becomes *i*, then add *masu*:
*nomu → nomi + masu*.

| Dictionary | Polite | Meaning |
|-----------|--------|---------|
| *nomu* | *nomimasu* | drink |
| *iku* | *ikimasu* | go |
| *kau* | *kaimasu* | buy |
| *matsu* | *machimasu* | wait |
| *hanasu* | *hanashimasu* | speak |
| *wakaru* | *wakarimasu* | understand |
| *aru* | *arimasu* | exist (things) |
| *kaeru* | *kaerimasu* | return home |

**Warning:** some verbs *look* like Group 2 but are Group 1 — *kaeru* (return), *hairu*
(enter), *hashiru* (run), *shiru* (know), *kiru* (cut). You just memorise these few.

### Group 3 — exactly two irregular verbs

| Dictionary | Polite | Meaning |
|-----------|--------|---------|
| *suru* | *shimasu* | do |
| *kuru* | *kimasu* | come |

That's the entire irregular verb list. Compare English's hundreds. *suru* is the important
one, because it verbs any noun (*yoyaku shimasu*, *chekku-in shimasu*).

### The 25 verbs that cover a trip

| Verb (polite) | Meaning | Verb (polite) | Meaning |
|---------------|---------|---------------|---------|
| *ikimasu* | go | *kimasu* | come |
| *kaerimasu* | go home/back | *arimasu* | there is (things) |
| *imasu* | there is (people) | *tabemasu* | eat |
| *nomimasu* | drink | *kaimasu* | buy |
| *mimasu* | see, watch | *kikimasu* | listen, ask |
| *hanashimasu* | speak | *wakarimasu* | understand |
| *shimasu* | do | *machimasu* | wait |
| *aimasu* | meet | *tsukaimasu* | use |
| *norimasu* | ride, board | *orimasu* | get off |
| *iremasu* | put in | *dashimasu* | take out, send |
| *moraimasu* | receive | *agemasu* | give |
| *shirimasu* | know | *sagashimasu* | look for |
| *tsukimasu* | arrive | | |

### Two verbs English speakers keep mixing up

- ***norimasu*** takes **に** *ni*, not *o*: *Densha **ni** norimasu* — "I board the train."
- ***aimasu*** (meet) also takes **に**: *Tomodachi **ni** aimasu* — "I meet a friend."

Some Japanese verbs simply come with a fixed particle that doesn't match the English one.
Learn the verb and its particle as a single unit: *… ni norimasu*, *… ni aimasu*,
*… ga wakarimasu*, *… ga dekimasu*.
`,
      quizTitle: "Verb groups",
      flashcards: [
        {
          front: "How do Japanese verbs handle person and number?",
          back: `They **don't** — there is no agreement at all. *Tabemasu* covers "I eat / you eat / she eats / we'll eat". Context (and the dropped subject) supplies who.

Verbs change only for **tense, negation, politeness, and mood** — all by swapping the ending.`
        },
        {
          front: "What are the three verb groups?",
          back: `**Group 2 (*ru*-verbs)**: end in -eru/-iru; drop *ru*, add *masu*. *taberu → tabemasu*, *miru → mimasu*.

**Group 1 (*u*-verbs)**: final *u* → *i*, add *masu*. *nomu → nomimasu*, *iku → ikimasu*, *kau → kaimasu*.

**Group 3**: only two irregulars — *suru → shimasu*, *kuru → kimasu*.`
        },
        {
          front: "Which verbs look like Group 2 but are actually Group 1?",
          back: `*kaeru* (return home), *hairu* (enter), *hashiru* (run), *shiru* (know), *kiru* (cut), *iru* (need).

They end in -eru/-iru like Group 2 verbs but conjugate as Group 1: *kaeru → **kaerimasu*** (not *"kaemasu"*). This short list is just memorised.`
        },
        {
          front: "Which particle goes with *norimasu* (ride) and *aimasu* (meet)?",
          back: `Both take **に** *ni*, not the *o* an English speaker expects:

*Densha **ni** norimasu* — I board the train.
*Tomodachi **ni** aimasu* — I meet a friend.

Learn verb + particle as one unit. Others: *… ga wakarimasu* (understand), *… ga dekimasu* (can do).`
        },
        {
          front: "Why is *suru* the most valuable verb to know?",
          back: `Because it converts **nouns into verbs**, and the noun can be Sino-Japanese *or* a borrowed English word: *yoyaku shimasu* (reserve), *chekku-in shimasu* (check in), *kyanseru shimasu* (cancel), *ryokou shimasu* (travel).

It's one of only two irregular verbs (*suru → shimasu*, *kuru → kimasu*) — and it multiplies your vocabulary by the size of your noun list.`
        }
      ],
      quiz: [
        {
          question: "What's the polite form of *nomu* (to drink)?",
          options: ["nomumasu", "nomimasu", "nomemasu", "nonmasu"],
          answer: 1,
          explanation: `*nomu* is a **Group 1 (u-verb)**: the final **u** becomes **i**, then *masu* is added → **nomimasu**. Same pattern: *kaku → kakimasu*, *hanasu → hanashimasu*, *matsu → machimasu* (the *tsu* row shifts to *chi*).`
        },
        {
          question: "Why is *kaerimasu* (to return home) the polite form of *kaeru*, not *\"kaemasu\"*?",
          answer: `Because *kaeru* is a **Group 1 verb that disguises itself as Group 2**. It ends in *-eru*, which normally signals a *ru*-verb (drop *ru* → *kaemasu*), but it actually conjugates as a *u*-verb: *kaer-* + *i* + *masu* = **kaerimasu**.

The other common disguised Group 1 verbs are *hairu* (enter), *hashiru* (run), *shiru* (know), *kiru* (cut) and *iru* (need). There's no rule — this handful is simply memorised.`
        },
        {
          question: "Which sentence correctly says \"I'll take (board) the Yamanote line\"?",
          options: [
            "Yamanote-sen o norimasu",
            "Yamanote-sen ni norimasu",
            "Yamanote-sen de norimasu",
            "Yamanote-sen wa norimasu"
          ],
          answer: 1,
          explanation: `*norimasu* is one of the verbs with a fixed **に** *ni*: you "get onto" a vehicle. English uses a direct object ("take the train"), Japanese uses a destination-like particle. Its opposite, *orimasu* (get off), takes **を** *o*: *Shibuya de orimasu* / *densha o orimasu*.`
        }
      ]
    }
  ]
}
