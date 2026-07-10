import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Link } from 'react-router-dom'
import Flashcards from './Flashcards.jsx'
import Quiz from './Quiz.jsx'

export default function ContentView({ chapter, sub, prev, next }) {
  return (
    <div className="content">
      <div className="breadcrumb">
        <Link to="/">Home</Link> / {chapter.title}
      </div>
      <h1>{sub.title}</h1>

      {sub.body && (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{sub.body}</ReactMarkdown>
      )}

      <Flashcards cards={sub.flashcards} />
      <Quiz items={sub.quiz} title={sub.quizTitle} />

      <div className="pager">
        {prev ? (
          <Link className="prev" to={prev.path}>
            <div className="pager-dir">← Previous</div>
            <div className="pager-title">{prev.title}</div>
          </Link>
        ) : <span />}
        {next ? (
          <Link className="next" to={next.path}>
            <div className="pager-dir">Next →</div>
            <div className="pager-title">{next.title}</div>
          </Link>
        ) : <span />}
      </div>
    </div>
  )
}
