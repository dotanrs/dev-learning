import { useState, useEffect } from 'react'
import { Routes, Route, useParams, useLocation, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import Home from './components/Home.jsx'
import ContentView from './components/ContentView.jsx'
import { chapters, flatIndex } from './content/index.js'

function SubPage() {
  const { chapterId, subId } = useParams()
  const chapter = chapters.find((c) => c.id === chapterId)
  if (!chapter) return <Navigate to="/" replace />
  const subIdx = chapter.subchapters.findIndex((s) => s.id === subId)
  if (subIdx === -1) {
    const first = chapter.subchapters[0]
    return <Navigate to={`/ch/${chapter.id}/${first.id}`} replace />
  }
  const sub = chapter.subchapters[subIdx]

  const flatPos = flatIndex.findIndex(
    (f) => f.chapterId === chapterId && f.subId === subId
  )
  const prev = flatIndex[flatPos - 1]
  const next = flatIndex[flatPos + 1]

  return (
    <ContentView
      key={chapterId + '/' + subId}
      chapter={chapter}
      sub={sub}
      prev={prev}
      next={next}
    />
  )
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="layout">
      <button className="menu-toggle" onClick={() => setMenuOpen((o) => !o)}>
        ☰
      </button>
      <div
        className={'scrim' + (menuOpen ? ' show' : '')}
        onClick={() => setMenuOpen(false)}
      />
      <aside className={'sidebar' + (menuOpen ? ' open' : '')}>
        <Sidebar onNavigate={() => setMenuOpen(false)} />
      </aside>
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ch/:chapterId/:subId" element={<SubPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
