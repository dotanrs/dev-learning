import { Link } from 'react-router-dom'
import { chapters } from '../content/index.js'

export default function Home() {
  return (
    <div className="content">
      <h1>⚡ Engineer Crash Course</h1>
      <p style={{ color: 'var(--text-dim)', fontSize: 17 }}>
        A fast, navigable knowledge base to sharpen your software-engineering
        fundamentals. Jump into any chapter — nothing here needs to be read in
        order. Look for <strong>🃏 flashcards</strong> and{' '}
        <strong>🧠 test-yourself</strong> questions to check your recall.
      </p>
      <div className="home-grid">
        {chapters.map((ch) => {
          const first = ch.subchapters[0]
          return (
            <Link
              className="home-card"
              key={ch.id}
              to={`/ch/${ch.id}/${first.id}`}
            >
              <div className="hc-num">Chapter {ch.num}</div>
              <h3>{ch.title}</h3>
              <div className="hc-list">
                {ch.subchapters.map((s) => s.title).join(' · ')}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
