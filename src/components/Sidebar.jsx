import { useState, useMemo } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { chapters } from '../content/index.js'

export default function Sidebar({ onNavigate }) {
  const location = useLocation()
  const [query, setQuery] = useState('')
  const activeChapter = useMemo(() => {
    const m = location.pathname.match(/^\/ch\/([^/]+)/)
    return m ? m[1] : null
  }, [location.pathname])

  const [collapsed, setCollapsed] = useState({})
  const toggle = (id) => setCollapsed((c) => ({ ...c, [id]: !c[id] }))

  const q = query.trim().toLowerCase()
  const filtered = chapters
    .map((ch) => {
      if (!q) return ch
      const subs = ch.subchapters.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          ch.title.toLowerCase().includes(q)
      )
      return ch.title.toLowerCase().includes(q)
        ? ch
        : { ...ch, subchapters: subs }
    })
    .filter((ch) => ch.subchapters.length > 0)

  return (
    <>
      <div className="brand">
        <span>⚡ Crash Course</span>
      </div>
      <div style={{ padding: '0 6px' }}>
        <small style={{ color: 'var(--text-dim)', fontSize: 12 }}>
          Interview-prep knowledge base
        </small>
      </div>
      <input
        className="search"
        placeholder="Filter topics…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ marginTop: 12 }}
      />

      {filtered.map((ch) => {
        const isCollapsed = q ? false : collapsed[ch.id] && activeChapter !== ch.id
        const open = !isCollapsed
        return (
          <div className="nav-chapter" key={ch.id}>
            <button className="nav-chapter-title" onClick={() => toggle(ch.id)}>
              <span>
                <span className="num">{ch.num}</span>
                {ch.title}
              </span>
              <span className={'chev' + (open ? ' open' : '')}>▶</span>
            </button>
            {open && (
              <ul className="nav-sub">
                {ch.subchapters.map((s) => (
                  <li key={s.id}>
                    <NavLink
                      to={`/ch/${ch.id}/${s.id}`}
                      className={({ isActive }) => (isActive ? 'active' : '')}
                      onClick={onNavigate}
                    >
                      {s.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </>
  )
}
