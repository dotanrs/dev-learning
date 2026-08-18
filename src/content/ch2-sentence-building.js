export default {
  id: "sentence-building",
  title: "How a Sentence Is Built",
  subchapters: [
    {
      id: "word-order",
      title: "Word Order: The Verb Goes Last",
      body: `## Japanese is built backwards from English — and that's a feature

English is **Subject–Verb–Object**: "I eat sushi."
Japanese is **Subject–Object–Verb**: "I sushi eat."

> 私は寿司を食べます。
>
> *Watashi wa sushi o tabemasu.* — I sushi eat.

The **verb is always last**. Everything else — who, what, where, when, with whom — piles up
in front of it, each piece tagged by a little word called a **particle** that says what role
it plays.

### Particles are the real grammar

Because every noun carries a tag, **word order between the tagged parts barely matters**:

| Sentence | Meaning |
|----------|---------|
| *Watashi wa ashita Tokyo e ikimasu.* | I go to Tokyo tomorrow. |
| *Ashita watashi wa Tokyo e ikimasu.* | Tomorrow I go to Tokyo. |

Both are fine. What you may **not** do is move the verb. English uses position to show who
did what to whom; Japanese uses tags, which is why it can shuffle freely.

### The two skeleton sentences

Almost everything a tourist says fits one of these two shapes.

**1. A is B** — with *desu*:

> 〜は〜です。 *… wa … desu.*

| Example | Meaning |
|---------|---------|
| *Watashi wa Dan desu.* | I am Dan. |
| *Kore wa nan desu ka.* | What is this? |
| *Toire wa asoko desu.* | The toilet is over there. |
| *Kore wa oishii desu.* | This is delicious. |

**2. Something happens** — with a verb at the end:

> 〜は〜を〜ます。 *… wa … o …masu.*

| Example | Meaning |
|---------|---------|
| *Sushi o tabemasu.* | I('ll) eat sushi. |
| *Eki e ikimasu.* | I('m) go(ing) to the station. |
| *Kore o kaimasu.* | I'll buy this. |

### Leave out everything obvious — especially "I" and "you"

This is the biggest structural difference from English. If context makes it clear,
**Japanese drops it**:

| Full | Natural |
|------|---------|
| *Watashi wa sushi o tabemasu.* | ***Sushi o tabemasu.*** |
| *Anata wa doko e ikimasu ka.* | ***Doko e ikimasu ka.*** |

Sentences with *watashi wa* in every line sound like a language textbook — or like someone
insisting on themselves. Say *watashi wa* only when you're **contrasting**: "*Kare wa
biiru, watashi wa ocha desu*" — he'll have beer, I'll have tea.

**Avoid *anata* ("you") entirely.** It can sound cold or presumptuous. Use the person's
name + *san* (*Tanaka-san wa?*), their role (*sensei*, *o-kyaku-sama*), or just leave it
out — the verb and context carry it.

### Fragments are normal and polite

You do not need full sentences. In a shop, this is complete, natural Japanese:

- *Kore, futatsu.* — Two of these.
- *Eki wa?* — (Where's) the station?
- *Kaado, daijoubu desu ka?* — Is card OK?

A trailing particle with a rising tone does the job of a whole question.
`,
      quizTitle: "Sentence shape",
      flashcards: [
        {
          front: "What is the basic Japanese word order, and what part is fixed?",
          back: `**Subject–Object–Verb**: *Watashi wa sushi o tabemasu* = "I sushi eat".

The one fixed rule is that the **verb (or *desu*) comes last**. Everything before it can be reordered freely, because each noun carries a particle telling you its role.`
        },
        {
          front: "Why does Japanese get away with flexible word order when English can't?",
          back: `Because roles are marked by **particles**, not position. *wa/ga* mark the topic/subject, *o* the object, *ni/e* the destination, *de* the place of action.

English relies on position ("dog bites man" ≠ "man bites dog"), so it can't shuffle. Japanese tags each noun, so only the verb's final position is fixed.`
        },
        {
          front: "Give the two skeleton sentence patterns that cover most tourist speech.",
          back: `1. **A wa B desu** — "A is B": *Kore wa oishii desu* (this is delicious), *Toire wa asoko desu* (the toilet is over there).
2. **[topic wa] [object o] [verb]-masu** — "someone does something": *Sushi o tabemasu*, *Eki e ikimasu*.

Almost every basic sentence is one of these two, plus optional time/place phrases in front.`
        },
        {
          front: "Why shouldn't you say *watashi wa* in every sentence?",
          back: `Japanese **drops anything obvious from context**. If you're clearly talking about yourself, *watashi wa* is redundant and sounds textbook-stiff or self-insistent.

Use it only for **contrast**: *"Kare wa biiru, watashi wa ocha desu"* — he'll have beer, I'll have tea.`
        },
        {
          front: "Why avoid *anata* for \"you\"?",
          back: `*Anata* can sound distant, presumptuous, or oddly intimate (spouses use it). Japanese normally uses the person's **name + san** (*Tanaka-san wa?*), their **role** (*sensei*, *tenchou*), or just **omits it** — context supplies the subject.

Safest tourist habit: leave "you" out entirely.`
        }
      ],
      quiz: [
        {
          question: "Put these pieces into a correct Japanese order: *tabemasu* (eat), *sushi o*, *watashi wa*.",
          options: [
            "Watashi wa tabemasu sushi o",
            "Sushi o watashi wa tabemasu",
            "Watashi wa sushi o tabemasu",
            "Tabemasu watashi wa sushi o"
          ],
          answer: 2,
          explanation: `The verb must come **last**. *Watashi wa sushi o tabemasu*. Option B (*Sushi o watashi wa tabemasu*) is actually grammatical too — particles keep the roles clear, and it just fronts "sushi" for emphasis — but the standard, neutral order is topic → object → verb. Anything with the verb not at the end is wrong.`
        },
        {
          question: "Your friend orders beer; you want tea. Which sentence correctly uses *watashi wa*?",
          options: [
            "Watashi wa ocha desu.",
            "Ocha desu.",
            "Anata wa biiru, watashi wa ocha desu.",
            "Watashi no ocha desu."
          ],
          answer: 0,
          explanation: `*Watashi wa ocha desu* — literally "as for me, it's tea" — is exactly the **contrastive** use *wa* is for. (This is also the famous "I am eel" sentence type: *wa* marks what you're talking about, not what you literally are.) Option C is grammatical but uses *anata*, which sounds cold; you'd say the person's name or drop it. Option D means "it's my tea".`
        },
        {
          question: "In a shop you want two of the item you're pointing at. What is the minimum natural Japanese?",
          answer: `**これ、ふたつ。** — *Kore, futatsu.* ("These, two.")

Slightly more polite: **これを二つください** — *Kore o futatsu kudasai.*

Fragments are entirely normal in Japanese shops — you don't need a subject, and often not even a verb. A noun, a number, and a nod get the job done; *kudasai* adds politeness.`
        }
      ]
    },
    {
      id: "particles",
      title: "Particles: The Ten Tags That Do Everything",
      body: `## Particles are the joints of the language

A particle comes **after** the word it tags. Learn these ten and you can build almost any
basic sentence.

| Particle | Job | Example |
|----------|-----|---------|
| **は** *wa* | topic — "as for…" | *Watashi **wa** Dan desu.* — I'm Dan. |
| **が** *ga* | subject / the new information | *Toire **ga** arimasu.* — There's a toilet. |
| **を** *o* | direct object | *Sushi **o** tabemasu.* — I eat sushi. |
| **に** *ni* | destination, time, location of existence | *Tokyo **ni** ikimasu.* / *Sanji **ni**.* |
| **へ** *e* | direction (toward) | *Eki **e** ikimasu.* — I go to the station. |
| **で** *de* | where an action happens; by means of | *Resutoran **de** tabemasu.* / *Densha **de**.* |
| **の** *no* | possession / linking two nouns | *Watashi **no** kaban* — my bag. |
| **と** *to* | "and" (nouns), "with" | *Sushi **to** biiru.* / *Tomodachi **to**.* |
| **も** *mo* | also, too | *Watashi **mo**.* — Me too. |
| **から / まで** *kara / made* | from / until | *Kyoto **kara** Osaka **made**.* |

### *wa* is written は but pronounced "wa"

The topic particle is written with the kana は (normally read *ha*) but always **pronounced
wa**. Same trick with を (*o*) and へ (*e*). It's the one spelling irregularity worth
knowing.

### *wa* vs *ga* — the famous one

The distinction that eats beginners alive. A working approximation:

- **は *wa*** = "**as for** X, …" — X is the **topic**, already known, the background.
- **が *ga*** = X is the **new**, specific, or emphasised information — the answer.

| Sentence | Feel |
|----------|------|
| *Watashi **wa** Dan desu.* | As for me, I'm Dan. (neutral introduction) |
| *Watashi **ga** Dan desu.* | **I'm** the one who's Dan. (picking me out) |
| *Neko **wa** imasu ka.* | Speaking of cats, are there any? |
| *Neko **ga** imasu.* | There's a cat! (new information) |

Rules of thumb that will serve you for a whole trip:

- Questions with *dare / nani / doko* (who/what/where) take **ga**, and so does the answer:
  *"Dare **ga** ikimasu ka." — "Watashi **ga** ikimasu."*
- Existence and availability take **ga**: *Eigo no menyuu **ga** arimasu ka.*
- Likes, wants and abilities take **ga**: *Sushi **ga** suki desu*, *Nihongo **ga**
  wakarimasu*, *Mizu **ga** hoshii desu*.
- Anything else, default to **wa** and you'll rarely be misunderstood.

### *ni* vs *de* — the other confusable pair

Both can translate as "at/in", but:

- **に *ni*** = a **destination** or a **static location of existence** (with *arimasu /
  imasu*), or a **point in time**.
  *Tokyo **ni** ikimasu* (go to Tokyo) · *Toire wa nikai **ni** arimasu* (the toilet is on
  the 2nd floor) · *Shichiji **ni** ikimasu* (I go at 7).
- **で *de*** = **where an action takes place**, or the **means** used.
  *Resutoran **de** tabemasu* (eat at a restaurant) · *Densha **de** ikimasu* (go by train) ·
  *Nihongo **de** onegai shimasu* (in Japanese, please).

Memory hook: with *de* something **happens**; with *ni* something **is** or is **headed**.

### Time words that skip particles

*Kyou* (today), *ashita* (tomorrow), *kinou* (yesterday), *maiasa* (every morning) take
**no particle**:

> 明日、京都へ行きます。 *Ashita, Kyoto e ikimasu.* — Tomorrow I'm going to Kyoto.

But **clock times and dates take に**: *shichiji **ni***, *getsuyoubi **ni***.

### Sentence-final particles: tone of voice

| Particle | Effect | Example |
|----------|--------|---------|
| **か** *ka* | makes a question | *Ikimasu **ka**.* — Are you going? |
| **ね** *ne* | seeking agreement, "isn't it?" | *Oishii desu **ne**.* — Delicious, isn't it? |
| **よ** *yo* | new info for the listener, "I'm telling you" | *Chigaimasu **yo**.* — That's not right, actually. |

*ne* is social glue — it invites the other person in and softens everything. Use it a lot.
*yo* asserts; use it sparingly, since overuse sounds pushy.
`,
      quizTitle: "Particle practice",
      flashcards: [
        {
          front: "What do the particles *wa, ga, o, ni, de* each mark?",
          back: `- **wa** — topic ("as for X"), the known background.
- **ga** — subject, especially **new** or **identified** information.
- **o** — direct object (the thing acted on).
- **ni** — destination, point in time, or static location with *arimasu/imasu*.
- **de** — where an **action** happens, or the **means** ("by train", "in Japanese").`
        },
        {
          front: "Explain *wa* vs *ga* in one usable rule.",
          back: `**wa** = "as for X" — X is old/known, the topic; the new info is what follows.
**ga** = X **is** the new info — it picks X out as the answer.

Practical triggers for **ga**: question words (*dare ga*, *nani ga*) and their answers; existence (*…ga arimasu*); likes/wants/abilities (*sushi ga suki*, *nihongo ga wakarimasu*). Otherwise default to **wa**.`
        },
        {
          front: "*ni* or *de*: \"I eat at a restaurant\" vs \"I go to a restaurant\"?",
          back: `- *Resutoran **de** tabemasu* — eat **at** a restaurant (**de** = place of an action).
- *Resutoran **ni/e** ikimasu* — go **to** a restaurant (**ni/e** = destination).

Hook: with **de** something *happens*; with **ni** something *is* or is *headed*. Existence also takes *ni*: *toire wa nikai **ni** arimasu*.`
        },
        {
          front: "Why is the topic particle written は but pronounced \"wa\"?",
          back: `A historical spelling that survived the modern kana reforms. Three particles keep old spellings: **は = wa**, **へ = e**, **を = o**.

It only matters for reading signs and menus — spoken, they're simply *wa*, *e*, *o*.`
        },
        {
          front: "What do the sentence-final particles *ka*, *ne*, and *yo* do?",
          back: `- **ka** — turns the sentence into a question: *Ikimasu ka.*
- **ne** — "…isn't it?", seeks agreement and softens: *Oishii desu ne.* Social glue; use freely.
- **yo** — "I'm telling you", presents new info or corrects: *Chigaimasu yo.* Use sparingly — it can sound pushy.`
        },
        {
          front: "Which time expressions take *ni*, and which take no particle?",
          back: `**Take *ni***: clock times, dates, days, months — anything on a calendar or clock. *Shichiji **ni***, *getsuyoubi **ni***, *sangatsu **ni***.

**No particle**: relative time words — *kyou* (today), *ashita* (tomorrow), *kinou* (yesterday), *konshuu* (this week), *maiasa* (every morning).`
        }
      ],
      quiz: [
        {
          question: "Which particle fills the gap? *\"Eigo no menyuu ___ arimasu ka.\"* (Do you have an English menu?)",
          options: ["wa", "ga", "o", "de"],
          answer: 1,
          explanation: `**ga.** Existence and availability with *arimasu / imasu* take **ga** — you're introducing the thing as new information. (*Eigo no menyuu **wa** arimasu ka* is also heard and fine; it adds a contrastive nuance: "an *English* menu — do you have one?")`
        },
        {
          question: "Fill in both gaps: \"I'll go to Kyoto by train tomorrow.\" — *Ashita, densha ___ Kyoto ___ ikimasu.*",
          answer: `**明日、電車で京都へ行きます。** — *Ashita, densha **de** Kyoto **e** (or **ni**) ikimasu.*

- **de** on *densha* = the **means** of doing something ("by train").
- **e** (or **ni**) on *Kyoto* = the **destination**.
- *Ashita* takes **no particle** — relative time words never do.`
        },
        {
          question: "You're at a restaurant table with a friend. Which is the most natural way to say \"This is delicious, isn't it?\"",
          options: [
            "Kore wa oishii desu yo.",
            "Kore wa oishii desu ka.",
            "Kore wa oishii desu ne.",
            "Kore ga oishii desu."
          ],
          answer: 2,
          explanation: `**ne** invites agreement — "delicious, isn't it?" — which is exactly the shared-experience nuance you want. *yo* would assert it as news to them; *ka* would ask a genuine question; *ga* would pick this dish out as *the* delicious one, in contrast to the others.`
        },
        {
          question: "Someone asks *\"Dare ga ikimasu ka\"* (who's going?) and you're going. How do you answer, and why that particle?",
          answer: `**私が行きます。** — *Watashi **ga** ikimasu.*

Question words (*dare*, *nani*, *doko*) take **ga**, and so does the answer, because you are supplying the **new, identifying** information: *I* am the one going.

Saying *watashi **wa** ikimasu* shifts the meaning to "as for me, I'm going (whatever the others do)" — a contrast, not an answer to the question.`
        }
      ]
    },
    {
      id: "questions",
      title: "Asking Questions",
      body: `## Questions are almost free: just add か

There is **no word order change**, no "do/does", no inversion. Take any polite sentence and
put **か** *ka* at the end.

| Statement | Question |
|-----------|----------|
| *Ikimasu.* — I go. | *Ikimasu **ka**.* — Do you go? |
| *Kore wa sushi desu.* — This is sushi. | *Kore wa sushi desu **ka**.* — Is this sushi? |
| *Eigo ga dekimasu.* — You can speak English. | *Eigo ga dekimasu **ka**.* — Can you speak English? |

Because *ka* already marks the question, Japanese doesn't need a rising tone (though people
often use one anyway). In casual speech *ka* is dropped and the pitch rises instead:
*"Iku?"*

### The question words

| Japanese | Romaji | Meaning |
|----------|--------|---------|
| 何 | *nani / nan* | what |
| 誰 | *dare* | who |
| どこ | *doko* | where |
| いつ | *itsu* | when |
| いくら | *ikura* | how much (money) |
| いくつ | *ikutsu* | how many |
| どう | *dou* | how / in what way |
| どうして / なぜ | *doushite / naze* | why |
| どれ / どちら | *dore / dochira* | which one / which of two |
| どんな | *donna* | what kind of |

*nani* becomes *nan* before *desu* and counters: *nan desu ka* (what is it?), *nanji*
(what time), *nannin* (how many people).

### The question word replaces the answer, in place

English moves the question word to the front ("**Where** are you going?"). Japanese leaves
it exactly where the answer would sit:

| Question | Answer |
|----------|--------|
| *Doko e ikimasu ka.* | *Kyoto e ikimasu.* |
| *Nani o tabemasu ka.* | *Sushi o tabemasu.* |
| *Ikura desu ka.* | *Sanzen-en desu.* |

Slot the question word into the answer's position and add *ka*. That's the whole system.

### The tourist's ten questions

| Japanese | Romaji | Meaning |
|----------|--------|---------|
| これは何ですか | *Kore wa nan desu ka* | What is this? |
| いくらですか | *Ikura desu ka* | How much? |
| トイレはどこですか | *Toire wa doko desu ka* | Where's the toilet? |
| 何時ですか | *Nanji desu ka* | What time is it? |
| 何時からですか | *Nanji kara desu ka* | From what time (does it open)? |
| 〜がありますか | *… ga arimasu ka* | Do you have …? |
| 〜はありますか | *… wa arimasu ka* | Is there a …? |
| 写真を撮ってもいいですか | *Shashin o totte mo ii desu ka* | May I take a photo? |
| カードで払えますか | *Kaado de haraemasu ka* | Can I pay by card? |
| これは何が入っていますか | *Kore wa nani ga haitte imasu ka* | What's in this? |

### Answering yes/no is a trap

*Hai* does **not** simply mean "yes". It means "**that's right / what you said is
correct**". With a **negative** question, the two languages flip:

> 「行かないんですか。」 *"Ikanai n desu ka."* — "You're not going?"
>
> 「はい、行きません。」 *"Hai, ikimasen."* — literally "That's right, I'm not going."

In English you'd say "No, I'm not." In Japanese, *hai* confirms the questioner's framing.
This is a real source of confusion — when it matters, **repeat the verb** instead of relying
on *hai / iie*: *"Ikimasen"* or *"Ikimasu."*

### Softer than *iie*

A flat *iie* ("no") is quite direct. Everyday alternatives:

| Phrase | Use |
|--------|-----|
| *Chigaimasu* | "That's different" — correcting a fact |
| *Daijoubu desu* | "I'm fine" — declining an offer |
| *Kekkou desu* | "No thank you" — politely declining (a bag, a refill) |
| *Chotto…* | "Uhh…" — soft refusal |
`,
      quizTitle: "Asking and answering",
      flashcards: [
        {
          front: "How do you turn a Japanese statement into a question?",
          back: `Add **か** *ka* to the end. No word-order change, no auxiliary verb, no inversion.

*Ikimasu* → *Ikimasu **ka***. *Kore wa sushi desu* → *Kore wa sushi desu **ka***.

In casual speech people drop *ka* and just raise the pitch: *"Iku?"*`
        },
        {
          front: "Where does a question word like *doko* go in a Japanese question?",
          back: `**Exactly where the answer would go** — Japanese doesn't front question words the way English does.

*Doko e ikimasu ka* → *Kyoto e ikimasu.*
*Nani o tabemasu ka* → *Sushi o tabemasu.*

Build the answer sentence, swap in the question word, add *ka*.`
        },
        {
          front: "List the core question words.",
          back: `*nani/nan* (what) · *dare* (who) · *doko* (where) · *itsu* (when) · *ikura* (how much money) · *ikutsu* (how many) · *dou* (how) · *doushite* (why) · *dore/dochira* (which) · *donna* (what kind of).

*nani* shortens to *nan* before *desu* and counters: *nan desu ka*, *nanji*, *nannin*.`
        },
        {
          front: "Why is answering *hai* to a negative question confusing?",
          back: `*Hai* means "**that's correct**", not "yes". So to *"Ikanai n desu ka"* ("You're not going?"), the answer **"Hai, ikimasen"** means "Right — I'm not going", where English would say "No, I'm not."

Safest move when it matters: **repeat the verb** — *"Ikimasen"* / *"Ikimasu"* — instead of relying on *hai/iie*.`
        },
        {
          front: "Give three softer ways to say \"no\" than *iie*.",
          back: `- **Chigaimasu** — "that's different" (correcting a fact).
- **Kekkou desu** / **Daijoubu desu** — "no thank you" (declining an offer, a bag, a refill).
- **Chotto…** — trailing off; the standard polite refusal.

A bare *iie* is not rude, but it's blunter than most everyday situations call for.`
        }
      ],
      quiz: [
        {
          question: "How do you ask \"What time does it open?\" at a museum?",
          options: [
            "Nanji desu ka",
            "Nanji kara desu ka",
            "Itsu desu ka",
            "Ikura desu ka"
          ],
          answer: 1,
          explanation: `*Nanji **kara** desu ka* — "from what time is it?" — is the idiomatic way to ask opening time. *Nanji desu ka* just asks the current time; *itsu* asks "when" in general; *ikura* asks the price. The closing time is *nanji **made** desu ka*.`
        },
        {
          question: "Someone asks you *\"Kaado wa tsukaemasen ka\"* (Can't you use a card?) and you indeed can't. What's the least ambiguous reply?",
          answer: `Say the **verb**, not just *hai/iie*: **「使えません」** *"Tsukaemasen"* — "I can't use it."

The trap: *"Hai"* here means "that's right — I can't", the opposite of what an English speaker's "yes" would imply. Because *hai* confirms the **questioner's framing** rather than the fact, negative questions invert between the two languages. Repeating the verb removes all doubt.`
        },
        {
          question: "Build the question \"What's in this?\" (asking about ingredients).",
          answer: `**これは何が入っていますか。** — *Kore wa nani ga haitte imasu ka.*

Breaking it down: *kore wa* (as for this) + *nani ga* (what — question words take *ga*) + *haitte imasu* (is contained / is in it) + *ka*.

A simpler version that also works: **「これは何ですか」** *Kore wa nan desu ka* ("what is this?"), or naming the ingredient you're avoiding: **「豚肉が入っていますか」** *Butaniku ga haitte imasu ka* — "does it contain pork?"`
        }
      ]
    },
    {
      id: "pointing-and-existence",
      title: "Pointing at Things and Saying What Exists",
      body: `## Two toolkits that punch far above their weight

As a tourist you spend a lot of time (a) pointing at things and (b) asking whether something
exists nearby. Japanese has clean, tiny systems for both.

### The ko-so-a-do words

Japanese splits "this/that" three ways by distance, and every set follows the same
**ko- / so- / a- / do-** pattern:

| | near me (ko-) | near you (so-) | over there (a-) | question (do-) |
|---|---|---|---|---|
| **thing** | *kore* (this) | *sore* (that) | *are* (that over there) | *dore* (which) |
| **+ noun** | *kono hito* (this person) | *sono* | *ano* | *dono* |
| **place** | *koko* (here) | *soko* (there) | *asoko* (over there) | *doko* (where) |
| **direction / polite "which"** | *kochira* | *sochira* | *achira* | *dochira* |
| **kind of** | *konna* | *sonna* | *anna* | *donna* |

Two rules that matter:

1. ***kore* stands alone; *kono* needs a noun.** *Kore o kudasai* (this one, please) but
   *Kono kaban o kudasai* (this bag, please). Mixing them (*"kono o kudasai"*) is the
   classic beginner error.
2. **The *so-* series means "near the listener"**, not "medium distance". On the phone,
   whatever is on their end is *sore/soko*.

*kochira* / *sochira* / *achira* are the polite forms — staff will use them constantly
("*kochira e douzo*" = this way please; "*kochira wa…*" = this here is…).

### *Arimasu* and *imasu* — the two "there is"

Japanese picks the verb by whether the thing is **alive**:

| Verb | Used for | Example |
|------|----------|---------|
| **あります** *arimasu* | objects, plants, facilities, abstract things | *Toire ga arimasu.* — There's a toilet. |
| **います** *imasu* | people and animals | *Neko ga imasu.* — There's a cat. |

Plants and vehicles count as inanimate (*basu ga arimasu*) — though a bus **with a driver
you're waiting for** can be *imasu* if you're thinking of the people. Don't over-think it;
picking the wrong one is a mild, easily-understood slip.

Both also mean "**to have**": *Kodomo ga imasu* (I have children), *Yoyaku ga arimasu*
(I have a reservation).

### Location patterns you'll use daily

> 〜は〜にあります。 *… wa … ni arimasu.* — "X is at Y."

| Japanese | Meaning |
|----------|---------|
| *Toire wa doko ni arimasu ka.* | Where is the toilet? |
| *Toire wa nikai ni arimasu.* | The toilet is on the 2nd floor. |
| *Konbini wa eki no chikaku ni arimasu.* | The convenience store is near the station. |

Everyday tourist shortcut: drop the *ni arimasu* and just say **"Toire wa doko desu ka"** —
shorter and equally correct.

### Position words

These attach with **の** *no*: *… no ue* (on top of …), *… no shita* (under), *… no naka*
(inside), *… no soto* (outside), *… no mae* (in front of), *… no ushiro* (behind),
*… no tonari* (next to), *… no chikaku* (near), *… no aida* (between).

> 駅の前にあります。 *Eki no mae ni arimasu.* — It's in front of the station.

### Asking whether they have something

The single most useful shopping question:

> 〜はありますか。 *… wa arimasu ka.* — "Do you have …?"

*Eigo no menyuu wa arimasu ka* (English menu?) · *Beji no ryouri wa arimasu ka* (vegetarian
food?) · *Wai-faii wa arimasu ka* (Wi-Fi?) · *Motto ookii saizu wa arimasu ka* (a bigger
size?)

If the answer is **ありません** *arimasen*, they don't have it. If it's **ございます**
*gozaimasu*, that's the ultra-polite form of *arimasu* — they do.
`,
      quizTitle: "This, that, and what's around",
      flashcards: [
        {
          front: "Lay out the ko-so-a-do system.",
          back: `| | near me | near you | over there | which? |
|---|---|---|---|---|
| thing | *kore* | *sore* | *are* | *dore* |
| + noun | *kono* | *sono* | *ano* | *dono* |
| place | *koko* | *soko* | *asoko* | *doko* |
| polite/direction | *kochira* | *sochira* | *achira* | *dochira* |

The *so-* series means "near **the listener**", not "medium distance".`
        },
        {
          front: "What's the difference between *kore* and *kono*?",
          back: `***kore* stands alone** ("this one"): *Kore o kudasai.*
***kono* must attach to a noun** ("this ___"): *Kono kaban o kudasai.*

Saying *"kono o kudasai"* is the classic beginner mistake — *kono* is left dangling with nothing to modify.`
        },
        {
          front: "When do you use *arimasu* vs *imasu*?",
          back: `**arimasu** — inanimate things: objects, facilities, plants, reservations. *Toire ga arimasu.*
**imasu** — living, moving things: people and animals. *Neko ga imasu.* / *Kodomo ga imasu.*

Both also translate as "**to have**": *Yoyaku ga arimasu* (I have a reservation), *Kodomo ga imasu* (I have kids).`
        },
        {
          front: "What is the most useful shopping question in Japanese?",
          back: `**〜はありますか** — *… wa arimasu ka* — "Do you have …?"

*Eigo no menyuu wa arimasu ka* · *Wai-faii wa arimasu ka* · *Motto ookii saizu wa arimasu ka*.

Answers: **arimasen** = we don't have it; **gozaimasu** = we do (ultra-polite form of *arimasu*).`
        },
        {
          front: "How do you say \"in front of the station\" / \"next to the convenience store\"?",
          back: `Position words attach with **の** *no*:

*eki **no mae*** (in front of the station) · *konbini **no tonari*** (next to the convenience store) · *… no ue* (on) · *… no shita* (under) · *… no naka* (inside) · *… no chikaku* (near) · *… no aida* (between).

Full sentence: *Eki no mae **ni arimasu**.* — "It's in front of the station."`
        }
      ],
      quiz: [
        {
          question: "You're holding a bag you want to buy. Which is correct?",
          options: [
            "Kono o kudasai",
            "Kore no kaban o kudasai",
            "Kono kaban o kudasai",
            "Are kaban o kudasai"
          ],
          answer: 2,
          explanation: `**kono** must be followed by a noun — *kono kaban* ("this bag"). *Kore o kudasai* (without the noun) would also be correct. Option A leaves *kono* dangling; option D misuses *are*, which likewise can't directly modify a noun (that would be *ano kaban*).`
        },
        {
          question: "Fill in the verb: \"Is there a doctor here?\" — *Koko ni isha ga ___ ka.*",
          options: ["arimasu", "imasu", "desu", "shimasu"],
          answer: 1,
          explanation: `A doctor is a **person**, so existence uses **imasu**. *Koko ni isha ga **imasu** ka.* Use *arimasu* for inanimate things — *Koko ni toire ga **arimasu** ka.*`
        },
        {
          question: "Ask a station attendant where the lockers are, then say you understood the answer \"in front of the north exit\".",
          answer: `Ask: **「コインロッカーはどこですか」** — *Koin-rokkaa wa doko desu ka.* (Or the fuller *…wa doko ni arimasu ka.*)

Their answer might be: **「北口の前にあります」** — *Kitaguchi no mae ni arimasu* — "It's in front of the north exit."

Confirm and thank: **「北口ですね。ありがとうございます」** — *Kitaguchi desu ne. Arigatou gozaimasu.* Repeating the key word with **ne** is exactly what natives do to check they heard right.`
        }
      ]
    }
  ]
}
