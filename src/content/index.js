import ch1 from './ch1-sounds-and-survival.js'
import ch2 from './ch2-sentence-building.js'
import ch3 from './ch3-word-building.js'
import ch4 from './ch4-verbs-in-action.js'
import ch5 from './ch5-numbers-and-time.js'
import ch6 from './ch6-tourist-situations.js'
import ch7 from './ch7-quirks.js'

const raw = [ch1, ch2, ch3, ch4, ch5, ch6, ch7]

export const chapters = raw.map((ch, i) => ({ ...ch, num: i + 1 }))

// Flat, ordered index used for prev/next paging.
export const flatIndex = chapters.flatMap((ch) =>
  ch.subchapters.map((s) => ({
    chapterId: ch.id,
    subId: s.id,
    title: s.title,
    chapterTitle: ch.title,
    path: `/ch/${ch.id}/${s.id}`,
  }))
)
