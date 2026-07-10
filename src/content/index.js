import ch1 from './ch1-data-structures.js'
import ch2 from './ch2-cs-fundamentals.js'
import ch3 from './ch3-algorithms.js'
import ch4 from './ch4-system-design.js'
import ch5 from './ch5-operating-systems.js'
import ch6 from './ch6-concurrency.js'
import ch7 from './ch7-networking.js'
import ch8 from './ch8-python.js'
import ch9 from './ch9-low-level.js'
import ch10 from './ch10-math.js'

const raw = [ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8, ch9, ch10]

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
