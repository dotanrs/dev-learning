import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

// Questions may contain Markdown (bold, inline code, ~~~ code fences).
function Question({ index, children }) {
  return (
    <div className="quiz-q">
      <span className="qn">Q{index + 1}.</span>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  )
}

function Mcq({ item, index }) {
  const [picked, setPicked] = useState(null)
  const done = picked !== null
  return (
    <div className="quiz-item">
      <Question index={index}>{item.question}</Question>
      <div className="quiz-options">
        {item.options.map((opt, i) => {
          let cls = 'quiz-opt'
          if (done && i === picked) cls += ' selected'
          if (done && i === item.answer) cls += ' correct'
          else if (done && i === picked) cls += ' wrong'
          return (
            <button
              key={i}
              className={cls}
              // Clicking the current pick clears it; clicking another switches.
              onClick={() => setPicked((p) => (p === i ? null : i))}
            >
              <span className="letter">{LETTERS[i]}</span>
              <span>{opt}</span>
            </button>
          )
        })}
      </div>
      {done && (
        <div className="quiz-hint">Click your answer again to un-select, or pick another.</div>
      )}
      {done && item.explanation && (
        <div className="quiz-answer">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.explanation}</ReactMarkdown>
        </div>
      )}
    </div>
  )
}

function Open({ item, index }) {
  const [show, setShow] = useState(false)
  return (
    <div className="quiz-item">
      <Question index={index}>{item.question}</Question>
      <button className="reveal-btn" onClick={() => setShow((s) => !s)}>
        {show ? 'Hide answer ▴' : 'Show answer ▾'}
      </button>
      {show && (
        <div className="quiz-answer">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.answer}</ReactMarkdown>
        </div>
      )}
    </div>
  )
}

export default function Quiz({ items, title = 'Test yourself' }) {
  if (!items || items.length === 0) return null
  return (
    <div className="section-block">
      <h2>🧠 {title}</h2>
      <div className="quiz">
        {items.map((item, i) =>
          item.options ? (
            <Mcq key={i} item={item} index={i} />
          ) : (
            <Open key={i} item={item} index={i} />
          )
        )}
      </div>
    </div>
  )
}
