import { useEffect, useRef, useState } from 'react'
import './App.css'

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
const randomBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min

function App() {
  const audioSrc = `${import.meta.env.BASE_URL}soft-spot.mp3`
  const [isOpen, setIsOpen] = useState(false)
  const [answer, setAnswer] = useState(null)
  const [dodge, setDodge] = useState({ x: 0, y: 0 })
  const [isDodging, setIsDodging] = useState(false)
  const [musicReady, setMusicReady] = useState(false)
  const runnerRef = useRef(null)
  const audioRef = useRef(null)

  const getBounds = () => {
    const padding = 12
    const rect = runnerRef.current?.getBoundingClientRect()
    const buttonWidth = rect?.width ?? 120
    const buttonHeight = rect?.height ?? 52
    const maxX = Math.max(window.innerWidth - buttonWidth - padding, padding)
    const maxY = Math.max(window.innerHeight - buttonHeight - padding, padding)
    return { padding, maxX, maxY }
  }

  const dartRandomly = () => {
    const { padding, maxX, maxY } = getBounds()
    setDodge({
      x: clamp(randomBetween(padding, maxX), padding, maxX),
      y: clamp(randomBetween(padding, maxY), padding, maxY),
    })
  }

  const startDodging = () => {
    if (!isDodging) {
      setIsDodging(true)
    }
    dartRandomly()
  }

  useEffect(() => {
    if (!isDodging) return

    const intervalId = window.setInterval(() => {
      dartRandomly()
    }, 220)

    const handleResize = () => {
      dartRandomly()
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.clearInterval(intervalId)
    }
  }, [isDodging])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.play().catch(() => {})
  }, [])

  return (
    <div className="page">
      <div className="scene">
        <header className="hero">
          <p className="eyebrow">A little Valentine note</p>
          <h1>Hello,</h1>
          <p className="subhead">A small question from a warm heart.</p>
        </header>

        {!isOpen && (
          <section className="card envelope">
            <div className="seal" aria-hidden="true" />
            <p className="letter-body">A sealed letter waits for you.</p>
            {!musicReady ? (
              <button
                className="btn ghost"
                onClick={() => {
                  audioRef.current?.play().catch(() => {})
                  setMusicReady(true)
                }}
              >
                Play music
              </button>
            ) : (
              <button className="btn primary" onClick={() => setIsOpen(true)}>
                Open the letter
              </button>
            )}
          </section>
        )}

        {isOpen && (
          <section className="card letter">
            <p className="letter-body">
              Will you be my Valentine?
            </p>
            <p className="letter-body">
              No pressure at all, just a simple ask and a big smile. If your
              answer is yes, I'd be happy. If it's no, I'll still be grateful.
            </p>
            <p className="letter-sign">— From Somone Who Really Likes You</p>
            <div className="button-row">
              <button
                className={`btn ghost runner${isDodging ? ' is-dodging' : ''}`}
                style={isDodging ? { left: dodge.x, top: dodge.y } : undefined}
                ref={runnerRef}
                onPointerEnter={startDodging}
                onPointerDown={startDodging}
                onClick={() => setAnswer('no')}
              >
                No
              </button>
              <button className="btn primary" onClick={() => setAnswer('yes')}>
                Yes!
              </button>
            </div>
            <p className="hint">The &quot;No&quot; button is super shy.</p>
          </section>
        )}

        {answer === 'yes' && (
          <>
            <div className="confetti" aria-hidden="true">
              <span className="piece" />
              <span className="piece" />
              <span className="piece" />
              <span className="piece" />
              <span className="piece" />
              <span className="piece" />
              <span className="piece" />
              <span className="piece" />
              <span className="piece" />
              <span className="piece" />
              <span className="piece" />
              <span className="piece" />
            </div>
            <section className="card gift">
              <p className="gift-title">A little gift for you</p>
              <div className="gift-wrap">
                <img
                  src="https://media.tenor.com/AsEFyg_BUMsAAAAe/steph-curry.png"
                  alt="Gift surprise"
                  loading="lazy"
                />
              </div>
              <p className="gift-note">Thank you for making my day.</p>
            </section>
          </>
        )}
        {answer === 'no' && (
          <div className="response no">
            All good. Thanks for being kind.
          </div>
        )}
      </div>
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="auto"
      />
    </div>
  )
}

export default App
