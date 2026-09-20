import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { useInView } from 'framer-motion'

// ─── Messages ────────────────────────────────────────────────────────────────
const MESSAGES = [
  'you make everything feel lighter.',
  'the way you think is genuinely beautiful.',
  'you\'re doing great. in general.',
  'your presence is enough.',
  'I notice the small things you do.',
  'you carry things with such quiet grace.',
  'everything\'s better with you around.',
  'you deserve every good thing.',
  'your warmth is not a small thing.',
  'you are someone\'s favourite kind of person.',
  'you don\'t have to earn being cared for.',
  'the world is genuinely better with you in it.',
  'you\'re more seen than you know.',
  'rest is allowed. you\'ve earned it.',
  'you matter — plainly, without conditions.',
  'your laugh is one of the good sounds.',
  'being around you is easy. that\'s rare.',
  'you are exactly enough.',
  'the softness in you is a kind of strength.',
  'you notice the right things.',
  'you make people feel at home.',
  'some people just carry warmth — you\'re one of them.',
]

let msgIdx = Math.floor(Math.random() * MESSAGES.length)
const nextMsg = () => {
  msgIdx = (msgIdx + 1) % MESSAGES.length
  return MESSAGES[msgIdx]
}

// ─── Tile color map ─────────────────────────────────────────────────────────
const TILE_STYLES = {
  2:    { bg: '#F0D9D5', color: '#2D2926', fontSize: '2rem' },
  4:    { bg: '#D8E0D5', color: '#2D2926', fontSize: '2rem' },
  8:    { bg: '#E5C388', color: '#2D2926', fontSize: '2rem' },
  16:   { bg: '#D4A574', color: '#fff',    fontSize: '2rem' },
  32:   { bg: '#C2896B', color: '#fff',    fontSize: '2rem' },
  64:   { bg: '#A36B5E', color: '#fff',    fontSize: '2rem' },
  128:  { bg: '#8B7355', color: '#fff',    fontSize: '1.6rem' },
  256:  { bg: '#6B7A66', color: '#fff',    fontSize: '1.6rem' },
  512:  { bg: '#5A6B55', color: '#fff',    fontSize: '1.5rem' },
  1024: { bg: '#4A5944', color: '#fff',    fontSize: '1.2rem' },
  2048: { bg: '#2D2926', color: '#E5C388', fontSize: '1.1rem' },
}

const EMPTY = () => Array(4).fill(null).map(() => Array(4).fill(0))

let nextId = 1
const uid = () => nextId++

// ─── Core game logic ─────────────────────────────────────────────────────────

function addRandomTile(board) {
  const empties = []
  board.forEach((row, r) => row.forEach((cell, c) => { if (cell.value === 0) empties.push([r, c]) }))
  if (empties.length === 0) return board
  const [r, c] = empties[Math.floor(Math.random() * empties.length)]
  const next = board.map(row => row.map(cell => ({ ...cell })))
  next[r][c] = { value: Math.random() < 0.9 ? 2 : 4, id: uid(), isNew: true, isMerged: false }
  return next
}

function initBoard() {
  let board = Array(4).fill(null).map(() =>
    Array(4).fill(null).map(() => ({ value: 0, id: uid(), isNew: false, isMerged: false }))
  )
  board = addRandomTile(board)
  board = addRandomTile(board)
  return board
}

function slideLeft(row) {
  const vals = row.filter(c => c.value !== 0)
  let score = 0
  const merged = []
  let i = 0
  while (i < vals.length) {
    if (i + 1 < vals.length && vals[i].value === vals[i + 1].value) {
      const newVal = vals[i].value * 2
      score += newVal
      merged.push({ value: newVal, id: uid(), isNew: false, isMerged: true })
      i += 2
    } else {
      merged.push({ ...vals[i], isNew: false, isMerged: false })
      i++
    }
  }
  while (merged.length < 4) merged.push({ value: 0, id: uid(), isNew: false, isMerged: false })
  return { row: merged, score }
}

function move(board, dir) {
  let totalScore = 0
  let moved = false
  let next = board.map(row => row.map(c => ({ ...c, isNew: false, isMerged: false })))

  const rotate = (b) => b[0].map((_, i) => b.map(row => row[i]).reverse())
  const rotateCCW = (b) => b[0].map((_, i) => b.map(row => row[3 - i]))

  // Normalise so all moves are "slide left" after rotation
  if (dir === 'right') next = next.map(r => [...r].reverse())
  if (dir === 'up') next = rotate(next)
  if (dir === 'down') next = rotateCCW(next)

  next = next.map(row => {
    const { row: newRow, score } = slideLeft(row)
    totalScore += score
    const changed = row.some((c, i) => c.value !== newRow[i].value)
    if (changed) moved = true
    return newRow
  })

  if (dir === 'right') next = next.map(r => [...r].reverse())
  if (dir === 'up') next = rotateCCW(next)
  if (dir === 'down') next = rotate(next)

  return { board: next, score: totalScore, moved }
}

function hasMovesLeft(board) {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c].value === 0) return true
      if (c < 3 && board[r][c].value === board[r][c + 1].value) return true
      if (r < 3 && board[r][c].value === board[r + 1][c].value) return true
    }
  }
  return false
}

function hasWon(board) {
  return board.some(row => row.some(c => c.value === 2048))
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function Game() {
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })

  const [board, setBoard] = useState(() => initBoard())
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(() => Number(localStorage.getItem('saee2048best') || 0))
  const [status, setStatus] = useState('playing') // 'playing' | 'won' | 'over'
  const [continuedAfterWin, setContinuedAfterWin] = useState(false)
  const [toast, setToast] = useState(null) // { text, key }
  const toastTimer = useRef(null)

  const showToast = useCallback(() => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ text: nextMsg(), key: Date.now() })
    toastTimer.current = setTimeout(() => setToast(null), 2500)
  }, [])

  const touchStart = useRef(null)

  const reset = useCallback(() => {
    setBoard(initBoard())
    setScore(0)
    setStatus('playing')
    setContinuedAfterWin(false)
  }, [])

  const doMove = useCallback((dir) => {
    if (status === 'over') return
    if (status === 'won' && !continuedAfterWin) return

    setBoard(prev => {
      const { board: next, score: gained, moved } = move(prev, dir)
      if (!moved) return prev

      const withTile = addRandomTile(next)

      setScore(s => {
        const newScore = s + gained
        setBest(b => {
          const newBest = Math.max(b, newScore)
          localStorage.setItem('saee2048best', newBest)
          return newBest
        })
        return newScore
      })

      showToast()

      if (!continuedAfterWin && hasWon(withTile)) setStatus('won')
      else if (!hasMovesLeft(withTile)) setStatus('over')

      return withTile
    })
  }, [status, continuedAfterWin, showToast])

  // Keyboard
  useEffect(() => {
    const handler = (e) => {
      const map = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' }
      if (map[e.key]) { e.preventDefault(); doMove(map[e.key]) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [doMove])

  // Touch
  const onTouchStart = (e) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  const onTouchEnd = (e) => {
    if (!touchStart.current) return
    const dx = e.changedTouches[0].clientX - touchStart.current.x
    const dy = e.changedTouches[0].clientY - touchStart.current.y
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return
    if (Math.abs(dx) > Math.abs(dy)) doMove(dx > 0 ? 'right' : 'left')
    else doMove(dy > 0 ? 'down' : 'up')
    touchStart.current = null
  }

  return (
    <section
      id="game"
      className="section-pad"
      style={{ background: 'var(--bg-secondary)' }}
      ref={sectionRef}
    >
      <div className="max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <p className="label-text mb-2">a little game</p>
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '2rem',
              fontWeight: 400,
              color: 'var(--text-main)',
            }}>
              2048
            </h2>
          </div>

          {/* Scores */}
          <div className="flex gap-3 items-end">
            <ScorePill label="score" value={score} />
            <ScorePill label="best" value={best} />
            <button
              onClick={reset}
              title="New Game"
              className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 hover:scale-105"
              style={{ background: 'var(--accent-blush)', color: 'var(--text-accent)' }}
            >
              <RotateCcw size={15} strokeWidth={2} />
            </button>
          </div>
        </motion.div>

        {/* Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="label-text mb-5 text-center"
          style={{ letterSpacing: '0.15em' }}
        >
          arrow keys · swipe · merge to 2048
        </motion.p>

        {/* Message Toast */}
        <div className="relative h-8 mb-2 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {toast && (
              <motion.p
                key={toast.key}
                initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '1rem',
                  fontStyle: 'italic',
                  color: 'var(--text-accent)',
                  fontWeight: 300,
                  letterSpacing: '0.01em',
                  textAlign: 'center',
                  pointerEvents: 'none',
                }}
              >
                {toast.text}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Board */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="relative select-none touch-none"
          style={{
            background: 'rgba(214,199,183,0.4)',
            borderRadius: '16px',
            padding: '10px',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--shadow-elevated)',
          }}
        >
          {/* Background cells */}
          <div className="grid grid-cols-4 gap-[10px] mb-0">
            {Array(16).fill(0).map((_, i) => (
              <div
                key={i}
                style={{
                  aspectRatio: '1',
                  borderRadius: '10px',
                  background: 'rgba(214,199,183,0.5)',
                }}
              />
            ))}
          </div>

          {/* Tile layer (absolute) */}
          <div
            className="absolute inset-[10px] grid grid-cols-4"
            style={{ gap: '10px' }}
          >
            <AnimatePresence>
              {board.flat().map((cell) => (
                cell.value !== 0 && (
                  <Tile key={cell.id} cell={cell} />
                )
              ))}
            </AnimatePresence>
          </div>

          {/* Game Over overlay */}
          <AnimatePresence>
            {(status === 'over' || (status === 'won' && !continuedAfterWin)) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl"
                style={{ background: 'rgba(253,251,247,0.88)', backdropFilter: 'blur(8px)' }}
              >
                <p style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '2rem',
                  color: status === 'won' ? 'var(--text-accent)' : 'var(--text-main)',
                  fontWeight: 400,
                  fontStyle: 'italic',
                  marginBottom: '0.5rem',
                }}>
                  {status === 'won' ? 'You reached 2048!' : 'Game Over'}
                </p>
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  {status === 'won' ? `Score: ${score}` : `Final score: ${score}`}
                </p>
                <div className="flex gap-3">
                  {status === 'won' && (
                    <button
                      onClick={() => { setContinuedAfterWin(true); setStatus('playing') }}
                      className="px-5 py-2 rounded-full text-sm transition-all hover:scale-105"
                      style={{ background: 'var(--accent-sage)', color: 'var(--text-main)', fontFamily: 'Plus Jakarta Sans', letterSpacing: '0.05em' }}
                    >
                      Keep going
                    </button>
                  )}
                  <button
                    onClick={reset}
                    className="px-5 py-2 rounded-full text-sm transition-all hover:scale-105"
                    style={{ background: 'var(--text-accent)', color: '#fff', fontFamily: 'Plus Jakarta Sans', letterSpacing: '0.05em' }}
                  >
                    New game
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Tile ─────────────────────────────────────────────────────────────────────
function Tile({ cell }) {
  const style = TILE_STYLES[cell.value] || { bg: '#2D2926', color: '#E5C388', fontSize: '1rem' }
  return (
    <motion.div
      layout
      initial={cell.isNew
        ? { scale: 0, opacity: 0 }
        : cell.isMerged
        ? { scale: 1.15 }
        : { scale: 1, opacity: 1 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.6 }}
      className="flex items-center justify-center font-display font-medium"
      style={{
        background: style.bg,
        color: style.color,
        borderRadius: '10px',
        fontSize: style.fontSize,
        fontFamily: 'Playfair Display, serif',
        fontWeight: 500,
        aspectRatio: '1',
        boxShadow: cell.value >= 64 ? '0 4px 12px rgba(78,64,53,0.18)' : 'none',
        letterSpacing: '-0.02em',
        userSelect: 'none',
      }}
    >
      {cell.value}
    </motion.div>
  )
}

// ─── Score Pill ───────────────────────────────────────────────────────────────
function ScorePill({ label, value }) {
  return (
    <div
      className="flex flex-col items-center px-4 py-2 rounded-xl"
      style={{ background: 'var(--bg-tertiary)', minWidth: '64px' }}
    >
      <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        {label}
      </span>
      <motion.span
        key={value}
        initial={{ y: -6, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', color: 'var(--text-main)', fontWeight: 500 }}
      >
        {value.toLocaleString()}
      </motion.span>
    </div>
  )
}
