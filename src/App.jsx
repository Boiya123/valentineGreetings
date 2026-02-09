import { useEffect, useRef, useState } from 'react'
import './App.css'

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
const randomBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min

function App() {
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
          <h1>Dear Lady,</h1>
          <p className="subhead">
            I have a small question that feels big in my heart.
          </p>
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
              Can I give you lilies for Valentine's? No pressure. Just a tiny
              bouquet and a big smile.
            </p>
            <p className="letter-body">
              I like you and I'm willing to try either way. I'm not gonna be a
              bother or whatnot that will stop you from stopping ur dreams, but
              I want you to know that am here. Imma do the best in my ability to
              pursue you while also not making you annoyed or something, I want to show 
              that someone appreciates you. If am gonna get hurt, then so be it, 
              but I have to try. I can't regret it. Maybe maybe someday, maybe there's a chance. 
              ANW eto ang akingginawa na sinabi ko an hr ago I think
            </p>
            <p className="letter-sign">— Dion</p>
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
              <p className="gift-title">A little gift for you, Lady</p>
              <div className="gift-wrap">
                <img
                  src="https://media.tenor.com/AsEFyg_BUMsAAAAe/steph-curry.png"
                  alt="Gift surprise"
                  loading="lazy"
                />
              </div>
              <p className="gift-note">
                Yes? lezgoooooooooooooo.
              </p>
            </section>
          </>
        )}
        {answer === 'no' && (
          <div className="response no">
            All good. I will keep the lilies safe for later.
          </div>
        )}
      </div>
      <audio
        ref={audioRef}
        src="/keshi%20-%20Soft%20Spot%20.mp3"
        preload="auto"
      />
    </div>
  )
}

export default App
