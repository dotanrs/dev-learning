import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function Card({ front, back }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="flashcard" onClick={() => setOpen((o) => !o)}>
      <div className="fc-tag">Flashcard</div>
      <div className="fc-front">{front}</div>
      {open ? (
        <>
          <div className="fc-back">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{back}</ReactMarkdown>
          </div>
          <div className="fc-hint">Click to hide ▴</div>
        </>
      ) : (
        <div className="fc-hint">Click to reveal ▾</div>
      )}
    </div>
  )
}

export default function Flashcards({ cards }) {
  if (!cards || cards.length === 0) return null
  return (
    <div className="section-block">
      <h2>🃏 Flashcards</h2>
      <div className="flashcard-deck">
        {cards.map((c, i) => (
          <Card key={i} {...c} />
        ))}
      </div>
    </div>
  )
}
