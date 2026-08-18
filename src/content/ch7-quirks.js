export default {
  id: "quirks",
  title: "Quirks of the Language",
  subchapters: [
    {
      id: "what-japanese-leaves-out",
      title: "What Japanese Leaves Out",
      body: `## Japanese is a language of omission

English forces you to specify things Japanese happily leaves vague. Once you stop trying to
translate every English word, sentences get much shorter — and much more natural.

### No articles

There is no *a* or *the*. *Hon* is "book", "a book", "the book", "books" — whichever the
context needs. Nothing to learn here; just stop looking for them.

### No plurals

*Hon* covers one book or a hundred. If number matters, you say it: *hon o nisatsu* (two
books), *takusan* (many), *sukoshi* (a few).

There are a couple of plural-ish suffixes (*-tachi* for people: *kodomo-tachi*, children),
but they're optional and mostly used with people, not things.

### No verb agreement

*Tabemasu* = I eat, you eat, he eats, we will eat. No conjugation for person or number ever.

### No subject, most of the time

If it's clear from context, it's dropped. This is the biggest adjustment:

| English | Natural Japanese | Literally |
|---------|-----------------|-----------|
| I'm going tomorrow. | *Ashita ikimasu.* | Tomorrow go. |
| Do you understand? | *Wakarimasu ka.* | Understand? |
| It's delicious. | *Oishii desu.* | Delicious is. |
| Where are you going? | *Doko e ikimasu ka.* | Where go? |

Beginners over-specify (*"Watashi wa watashi no kaban o…"*) and it sounds robotic. **If the
listener already knows who you mean, leave it out.**

### Almost no "you"

*Anata* exists but is avoided — it can sound cold, presumptuous, or intimate depending on
context. Instead:

- **Name + さん**: *Tanaka-san wa nani o tabemasu ka* — "What will you (Tanaka) eat?"
- **Role**: *sensei* (teacher/doctor), *tenchou* (manager), *o-kyaku-sama* (customer).
- **Nothing at all**: *Nani o tabemasu ka.*

Notice you use someone's **name even while speaking directly to them** — where English
would switch to "you". This feels odd at first and becomes natural quickly.

### No word for "no" that gets used much

*Iie* exists, but people prefer *chigaimasu* (that's different), *chotto…* (hedging),
*daijoubu desu* (I'm fine), or *kekkou desu* (no thank you). See the next section.

### Names and honorifics

Family name comes **first**: 田中太郎 = Tanaka (family) Tarou (given). People will address
you by family name + *san* unless you're close.

| Suffix | Use |
|--------|-----|
| **〜さん** *-san* | default for anyone, any gender — Mr/Ms |
| **〜さま** *-sama* | very formal — customers (*o-kyaku-sama*), letters |
| **〜ちゃん** *-chan* | small children, close friends (affectionate) |
| **〜くん** *-kun* | boys, junior colleagues |
| **〜先生** *-sensei* | teachers, doctors, professionals |

**Never add *-san* to your own name.** Say *"Dan desu"*, never *"Dan-san desu"* — it's like
calling yourself "Mr Dan". Dropping the suffix on someone else's name, on the other hand, is
oddly familiar; when in doubt, use **-san**.

### What Japanese adds instead

In exchange for all this omission, Japanese marks things English doesn't:

- **Politeness level** — in every single verb ending.
- **Social direction** — giving/receiving verbs track who did a favour for whom
  (*moraimasu*, *kuremasu*, *agemasu*).
- **Speaker attitude** — the sentence-final *ne*, *yo*, *ka*, *na* colour every sentence.
- **In-group vs out-group** — you speak *humbly* about yourself and your company, and
  *honorifically* about the listener's.

The information budget is the same; it's just spent on relationships instead of on
grammatical number.
`,
      quizTitle: "Omission and reference",
      flashcards: [
        {
          front: "What four English features does Japanese simply not have?",
          back: `1. **Articles** — no *a* or *the*.
2. **Plurals** — *hon* = book or books; add a number or *takusan* if it matters.
3. **Verb agreement** — *tabemasu* works for every person and number.
4. **An obligatory subject** — dropped whenever context makes it clear.`
        },
        {
          front: "How do you say \"you\" in Japanese?",
          back: `Usually **you don't**. Options in order of preference:

1. **Nothing** — *Nani o tabemasu ka* ("What will [you] eat?").
2. **Name + さん** — *Tanaka-san wa?* — used even when speaking directly to them.
3. **Role** — *sensei*, *tenchou*, *o-kyaku-sama*.

*Anata* is best avoided — it can read as cold, presumptuous, or oddly intimate.`
        },
        {
          front: "Why does *\"Watashi wa watashi no kaban o mochimasu\"* sound wrong?",
          back: `It over-specifies. Japanese **drops anything recoverable from context**, so the natural sentence is just *"Kaban o mochimasu"* — the "I" and "my" are obvious.

Repeating *watashi* makes you sound like a textbook exercise, or like you're insisting on yourself.`
        },
        {
          front: "What's the rule for *-san*?",
          back: `Attach **-san** to other people's family names (*Tanaka-san*) — it's gender-neutral and the safe default.

**Never attach it to your own name**: say *"Dan desu"*, not *"Dan-san desu"*. Other suffixes: *-sama* (very formal, customers), *-chan* (children, close friends), *-kun* (boys, juniors), *-sensei* (teachers, doctors).`
        },
        {
          front: "What does Japanese mark that English doesn't?",
          back: `- **Politeness** — encoded in every verb ending.
- **Social direction of favours** — *agemasu / kuremasu / moraimasu* track who did what for whom.
- **Speaker attitude** — final particles *ne*, *yo*, *ka*.
- **In-group vs out-group** — humble language about yourself, honorific about the listener.

It spends its grammatical budget on relationships rather than on number and definiteness.`
        }
      ],
      quiz: [
        {
          question: "How do you ask a colleague named Tanaka what they'd like to drink?",
          options: [
            "Anata wa nani o nomimasu ka",
            "Tanaka-san wa nani o nomimasu ka",
            "Kimi wa nani o nomimasu ka",
            "Tanaka wa nani o nomimasu ka"
          ],
          answer: 1,
          explanation: `Japanese uses the person's **name + san** where English uses "you", even in direct address. *Anata* sounds cold or presumptuous, *kimi* is casual/talking-down, and a bare *Tanaka* with no suffix is too familiar for most relationships.`
        },
        {
          question: "Translate as naturally as possible: \"I bought a book yesterday.\"",
          answer: `**「昨日、本を買いました」** — *Kinou, hon o kaimashita.*

Note what disappears: no *watashi* (obvious from context), no article for "a", no plural marking, and *kinou* takes no particle. Literally it's "Yesterday, book bought" — and that is the natural, complete sentence.

You'd only add *watashi wa* if you were **contrasting** with someone else who didn't buy one.`
        },
        {
          question: "Which is the correct way to introduce yourself?",
          options: [
            "Watashi wa Dan-san desu",
            "Dan-sama desu",
            "Dan desu",
            "Watashi no namae wa Dan-san to iimasu"
          ],
          answer: 2,
          explanation: `**Dan desu** — simple and correct. Honorifics (*-san*, *-sama*) are **never** applied to yourself; doing so is like introducing yourself as "Mr Dan". A fuller version is *"Dan to iimasu"* ("I'm called Dan"), which is slightly more formal and equally correct.`
        }
      ]
    },
    {
      id: "softness-and-indirectness",
      title: "Softness, Indirectness and Listening Noises",
      body: `## The grammar is only half of it

You can produce perfect *-masu* forms and still sound abrupt. The other half of Japanese
communication is **hedging, softening and constant listener feedback**.

### Aizuchi: you must make noises while listening

**相槌** *aizuchi* are the little sounds a listener makes to show they're following. In
Japanese, silence while listening reads as **disinterest or disagreement**, not politeness.
Expect a listener to react every few seconds:

| Sound | Meaning |
|-------|---------|
| はい / ええ *hai / ee* | yeah, I'm following |
| うん *un* | mm-hm (casual) |
| そうですね *sou desu ne* | that's right / I see |
| そうですか *sou desu ka* | oh really? |
| なるほど *naruhodo* | I see, that makes sense |
| へえ〜 *hee~* | huh, interesting |

Crucially, **はい during your sentence means "I'm listening", not "I agree"** — and
certainly not "yes, I'll do it". Many a business misunderstanding has started there.

Practise nodding and saying *hai… hai… sou desu ka* while someone talks. It makes you feel
enormously more fluent than your vocabulary justifies.

### Hedging is politeness

Flat statements sound blunt. Native speech is padded:

| Blunt | Padded |
|-------|--------|
| *Chigaimasu.* (Wrong.) | *Chotto chigaimasu ne.* (It's a bit different, isn't it.) |
| *Dame desu.* (No.) | *Chotto muzukashii desu ne.* (It's a bit difficult…) |
| *Wakarimasen.* (I don't know.) | *Chotto wakarimasen…* (I'm not quite sure…) |
| *Ikimasen.* (I'm not going.) | *Chotto yotei ga…* (I have plans, so…) |

**ちょっと** *chotto* — literally "a little" — is the universal cushion. Used alone with a
pained expression, it is a complete, understood **refusal**.

Trailing off is polite too. *"Chotto yotei ga arimasu node…"* ("I have plans, so…") ends
mid-thought deliberately — spelling out the refusal would be harsher than implying it.

### The *ne* / *yo* dial

| Ending | Effect |
|--------|--------|
| **ね** *ne* | "…isn't it?" — invites agreement, shares the floor, softens |
| **よ** *yo* | "I'm telling you" — asserts new information |
| **よね** *yo ne* | "…right?" — assertive but seeking confirmation |

*Ne* is social glue. *"Ii desu ne"* (nice, isn't it), *"Atsui desu ne"* (hot today, isn't
it) — small-talk in Japan runs almost entirely on *ne*. Overusing *yo* sounds pushy;
underusing *ne* sounds cold.

### Apologising as social lubricant

Japanese apologises where English thanks, requests, or says nothing at all:

| Phrase | Register |
|--------|----------|
| すみません *sumimasen* | everyday: excuse me / sorry / thanks |
| ごめんなさい *gomen nasai* | personal apology, softer, more emotional |
| 申し訳ありません *moushiwake arimasen* | formal, serious apology (staff use this) |
| 失礼します *shitsurei shimasu* | "excuse my rudeness" — entering, leaving, interrupting |

Saying *sumimasen* when someone helps you isn't self-deprecation — it acknowledges the
trouble they took. Under-apologising reads as inconsiderate more than over-apologising reads
as weak.

### Modesty on the receiving end

Compliments are deflected, not accepted:

> 「日本語が上手ですね！」 *"Nihongo ga jouzu desu ne!"* — "Your Japanese is good!"
>
> 「いえいえ、まだまだです。」 *"Ie ie, madamada desu."* — "No no, I've a long way to go."

You will hear *"Nihongo ga jouzu desu ne"* after saying approximately four words. It's
encouragement, not an assessment. The graceful replies are *"Ie ie, madamada desu"* or
simply *"Arigatou gozaimasu"* with a small laugh.

### Bowing, briefly

A small nod of the head covers virtually everything a tourist needs. Deeper and slower =
more respect or more apology. You don't need to study angles — but do **stop walking** when
someone bows to you, and return something. Bowing while on the phone is normal and you will
see it constantly.
`,
      quizTitle: "Sounding natural",
      flashcards: [
        {
          front: "What is *aizuchi* and why does it matter?",
          back: `**相槌** — the listening noises a Japanese listener makes every few seconds: *hai*, *ee*, *un*, *sou desu ne*, *naruhodo*, *hee~*.

Silence while listening reads as **disinterest or disagreement**, not politeness. Nodding and dropping in *hai… sou desu ka* makes you sound far more fluent than your vocabulary alone would.`
        },
        {
          front: "What does *hai* mean when someone says it while you're still talking?",
          back: `"**I'm listening / go on**" — not "I agree" and definitely not "yes, I'll do that".

It's backchannel feedback, the equivalent of English "mm-hm". Reading it as consent is a classic cross-cultural misunderstanding, especially in business.`
        },
        {
          front: "Why is *chotto* the most useful social word in Japanese?",
          back: `It's the universal **cushion**. As a hedge it softens: *chotto chigaimasu ne* (it's a bit different), *chotto wakarimasen* (I'm not quite sure), *chotto takai desu* (a bit expensive).

Alone, with a pained expression and a trailing tone, **"chotto…" is a complete refusal** — and everyone understands it as one.`
        },
        {
          front: "What's the difference between *ne* and *yo*?",
          back: `**ね** *ne* — "…isn't it?", invites agreement and softens. Small talk runs on it: *Atsui desu ne*, *Ii desu ne*.

**よ** *yo* — "I'm telling you", asserts information the listener doesn't have: *Chigaimasu yo*.

Overusing *yo* sounds pushy; underusing *ne* sounds cold and flat.`
        },
        {
          front: "Someone says *\"Nihongo ga jouzu desu ne!\"* — how do you reply?",
          back: `Deflect rather than accept: **「いえいえ、まだまだです」** *Ie ie, madamada desu* ("No no, I've a long way to go") — or simply **「ありがとうございます」** with a small laugh.

The compliment is encouragement (you'll get it after four words of Japanese), not an assessment. Modest deflection is the expected move.`
        },
        {
          front: "Name three apology phrases and when each is used.",
          back: `- **すみません** *sumimasen* — everyday: excuse me / sorry / thank you.
- **ごめんなさい** *gomen nasai* — a more personal, emotional apology.
- **申し訳ありません** *moushiwake arimasen* — formal and serious; staff use it toward customers.

Plus **失礼します** *shitsurei shimasu* — "excuse my rudeness" when entering, leaving, or interrupting.`
        }
      ],
      quiz: [
        {
          question: "You explain your plan and the other person keeps saying \"hai… hai…\". What can you conclude?",
          options: [
            "They agree with the plan",
            "They're committing to do it",
            "They're following what you're saying",
            "They want you to stop talking"
          ],
          answer: 2,
          explanation: `*Hai* as backchannel (*aizuchi*) means "**I'm following**" — nothing more. Agreement needs an explicit *"Sou shimashou"* ("let's do that") or *"Wakarimashita"* ("understood, I'll do it"). Mistaking listening noises for consent is one of the most common misreadings of Japanese conversation.`
        },
        {
          question: "You invite a Japanese acquaintance to dinner and they say \"Kinyoubi wa chotto yotei ga arimasu node…\" and trail off. What happened?",
          answer: `They **declined** — politely and completely.

*Chotto* + a reason + *node* ("because…") + trailing off is the standard refusal shape. Finishing the sentence ("…so I can't come") would be needlessly blunt, so the speaker stops and lets you infer it.

The graceful response is to accept it immediately: **「そうですか、また今度お願いします」** *Sou desu ka, mata kondo onegai shimasu* ("I see — another time, then"). Pushing for a different day right away puts them in the awkward position of refusing twice.`
        },
        {
          question: "Which sentence is the most natural small talk on a hot day?",
          options: [
            "Atsui desu yo.",
            "Atsui desu ne.",
            "Atsui desu ka.",
            "Atsui desu."
          ],
          answer: 1,
          explanation: `**ね** *ne* invites shared agreement — "hot, isn't it?" — which is exactly what small talk is for. *Yo* would assert the heat as news to someone who can obviously feel it, *ka* asks a genuine question, and the bare statement lands flat and a little cold.`
        }
      ]
    },
    {
      id: "traps-for-english-speakers",
      title: "Traps for English Speakers",
      body: `## The mistakes everyone makes, collected in one place

### Katakana English is a false friend

Thousands of English words have been borrowed — but many have shifted meaning. Using the
English sense will confuse people:

| Japanese | Sounds like | Actually means |
|----------|-------------|----------------|
| マンション *manshon* | mansion | apartment block |
| バイキング *baikingu* | viking | buffet |
| コンセント *konsento* | consent | power outlet |
| サイン *sain* | sign | signature / autograph |
| スマート *sumaato* | smart | slim, slender |
| ナイーブ *naiibu* | naive | sensitive, delicate |
| クレーム *kureemu* | claim | a complaint |
| ハンドル *handoru* | handle | steering wheel |
| バイク *baiku* | bike | motorcycle (a bicycle is *jitensha*) |
| ペンション *penshon* | pension | a small guesthouse |
| サービス *saabisu* | service | free of charge, on the house |
| テンション *tenshon* | tension | someone's energy/mood level |

Also, borrowed words get **clipped**: *terebi* (television), *pasokon* (personal computer),
*eakon* (air conditioner), *konbini* (convenience store), *sumaho* (smartphone),
*depaato* (department store), *famiresu* (family restaurant).

And every borrowed word is **re-syllabified into Japanese beats**. "McDonald's" becomes
*ma-ku-do-na-ru-do*. Saying it in English gets blank looks; saying it in Japanese rhythm
works instantly. When stuck, say the English word **with Japanese beats** — it's a
surprisingly good guessing strategy.

### The vowel-length minefield

Already flagged, but it's where real misunderstandings live: *biiru* (beer) / *biru*
(building) · *obaasan* (grandmother) / *obasan* (aunt) · *ojiisan* / *ojisan* ·
*kiite* (listen) / *kite* (come) · *koutsuu* (traffic) / *kotsu* (knack).

### *Hai* is not "yes"

*Hai* = "that's correct / I'm listening". With **negative questions** it flips relative to
English: *"Ikanai n desu ka"* → *"Hai, ikimasen"* = "Right, I'm not going." When precision
matters, **repeat the verb** instead: *ikimasu* / *ikimasen*.

### *Daijoubu desu* is ambiguous — deliberately

It can mean "I'm fine, thanks" (declining) or "that's fine, go ahead" (accepting). Context
and gesture disambiguate. As a rule of thumb, when a clerk offers you something and you say
*daijoubu desu*, it is heard as **"no thank you"**. To accept, say *onegai shimasu*.

### Overusing *watashi* and *anata*

The single most common learner tell. Drop the subject; use names instead of "you".

### The *wa* / *ga* wobble

Nobody expects mastery. Two defaults that cover most cases: **ga** with existence
(*arimasu/imasu*), question words, likes, wants and abilities; **wa** for everything else.

### Assuming word order carries meaning

It doesn't — **particles do**. If you drop a particle, meaning gets ambiguous even when the
order looks English-like. (Casual speech *does* drop particles, but it relies on shared
context that a tourist often lacks. Keep them.)

### Saying *sayounara* to everyone

It suggests a long parting. Use *arigatou gozaimashita*, *shitsurei shimasu*, or *mata ne*.

### Trying to use keigo you half-know

Half-formed honorifics land worse than clean, consistent *-masu* form. Stay polite-plain and
you'll sound competent rather than confused.

### Pointing at yourself the English way

Japanese people indicate themselves by pointing at their **nose**, not their chest. Minor,
but it's the sort of thing that makes an interaction feel smoother.

### Expecting "no" to sound like "no"

Recap, because it matters most: *chotto…*, *muzukashii desu ne*, a drawn breath, a tilted
head, or a vague *"kangaete okimasu"* ("I'll think about it") are all **no**. Take them at
face value and move on graciously.

### The last one: waiting until you're ready

Japanese speakers are, as a rule, delighted by any attempt. Four words of clumsy Japanese
with a bow gets you further than perfect English. Say *sumimasen*, point, use *kore o
kudasai*, thank them — and the trip largely takes care of itself.
`,
      quizTitle: "Avoiding the classic mistakes",
      flashcards: [
        {
          front: "What do *manshon*, *baikingu*, *konsento* and *saabisu* actually mean?",
          back: `- **manshon** — an apartment block (not a mansion)
- **baikingu** — a buffet (from "Viking", via a famous Tokyo hotel restaurant)
- **konsento** — a power outlet (not consent)
- **saabisu** — free of charge, on the house

Borrowed words often shift meaning. Others: *sain* = signature, *sumaato* = slim, *kureemu* = a complaint, *handoru* = steering wheel, *baiku* = motorcycle.`
        },
        {
          front: "What's the trick for making an English word understood in Japan?",
          back: `Say it in **Japanese beats** (morae), not English rhythm: "McDonald's" → *ma-ku-do-na-ru-do*, "hotel" → *ho-te-ru*, "coffee" → *koo-hii*, "check-in" → *chek-ku-in*.

Every borrowed word is re-syllabified into consonant+vowel beats. Pronouncing it in English gets blank looks; the Japanese version usually lands immediately.`
        },
        {
          front: "Why is *daijoubu desu* risky?",
          back: `It's deliberately ambiguous: "I'm fine, thanks" (declining) **or** "that's fine, go ahead" (accepting).

Rule of thumb: when a clerk **offers** you something and you say *daijoubu desu*, they hear **"no thank you"**. To accept, say **お願いします** *onegai shimasu*.`
        },
        {
          front: "What are the common learner tells that mark someone as a beginner?",
          back: `- Saying *watashi wa* in every sentence.
- Using *anata* for "you" instead of a name.
- *Sayounara* to shop staff.
- Half-learned keigo mixed into plain speech.
- Answering *hai* to a negative question and meaning English "yes".

Clean, consistent *-masu* form with dropped subjects sounds far more competent.`
        },
        {
          front: "List the ways a Japanese speaker says \"no\" without saying it.",
          back: `*Chotto…* (trailing off) · *Chotto muzukashii desu ne* ("a bit difficult") · a drawn breath through the teeth · a tilted head · *Kangaete okimasu* ("I'll think about it") · *Kentou shimasu* ("we'll consider it").

All of these are **refusals**. Accept them gracefully — pressing on makes both sides uncomfortable.`
        },
        {
          front: "What's the best mindset for actually speaking Japanese on a trip?",
          back: `Don't wait until you're "ready". Japanese speakers are typically delighted by any attempt, and four clumsy words with a bow beat flawless English.

Core loop: **sumimasen** → point → **kore o kudasai** → **arigatou gozaimasu**. That handles most transactions; everything else in this course is refinement.`
        }
      ],
      quiz: [
        {
          question: "A hotel receptionist says the room has a *konsento* by the desk. What are they telling you?",
          options: [
            "There's a consent form to sign",
            "There's a power outlet",
            "There's a connecting door",
            "There's a concierge service"
          ],
          answer: 1,
          explanation: `**konsento** = power outlet (from "concentric plug"). It's a classic false-friend loanword, alongside *sain* (signature), *manshon* (apartment), *baikingu* (buffet) and *saabisu* (free of charge).`
        },
        {
          question: "A shop clerk asks if you want a bag and you reply *\"daijoubu desu\"*. What did they understand?",
          answer: `**"No thank you"** — you declined the bag.

*Daijoubu desu* is ambiguous in the abstract ("I'm fine" / "that's fine"), but in response to an **offer** it's conventionally heard as a polite refusal.

To accept, say **「お願いします」** *Onegai shimasu* — or **「袋をください」** *Fukuro o kudasai*. This trips up a lot of visitors who intended to say "that's fine, yes please" and walk out juggling their purchases.`
        },
        {
          question: "You ask a small ryokan whether they can accommodate a late 11pm check-in. The owner tilts their head, breathes in, and says \"Juuichiji desu ka… chotto ne…\". What do you do?",
          options: [
            "Ask again more clearly — they didn't understand",
            "Offer to pay extra",
            "Treat it as a no and arrange to arrive earlier or stay elsewhere",
            "Say hai and turn up at 11pm anyway"
          ],
          answer: 2,
          explanation: `The head tilt, the drawn breath and *"chotto ne…"* are three simultaneous signals of **refusal**. They understood you perfectly. The polite move is to accept it — *"Sou desu ka, wakarimashita"* — and adjust your plan. Pushing would force them into an explicit "no", which is precisely what all that hedging exists to avoid.`
        }
      ]
    }
  ]
}
