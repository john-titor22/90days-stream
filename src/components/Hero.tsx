import { Project } from '../data/projects'

const DAY_ONE = new Date('2026-03-24')

function getDaysIn() {
  const now = new Date()
  const diff = Math.floor((now.getTime() - DAY_ONE.getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(1, diff + 1)
}

interface Props {
  projects: Project[]
}

export default function Hero({ projects }: Props) {
  const daysIn = getDaysIn()
  const shipped = projects.filter((p) => p.status === 'completed').length
  const total = projects.length

  return (
    <section className="hero">
      <div className="hero-bg">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="grid-overlay" />
      </div>

      <div className="hero-content">
        <div className="hero-badge">
          <span className="pulse-dot" />
          Live Challenge — Building in Public
        </div>

        <h1 className="hero-title">
          90 Days.
          <br />
          <span className="gradient-text">Real Projects.</span>
          <br />
          All with Claude.
        </h1>

        <p className="hero-subtitle">
          Every stream session I ship a real, working project — from idea to deployed product — entirely built with AI.
          No shortcuts, no pre-built templates. Just raw building.
        </p>

        <div className="hero-stats">
          <div className="stat">
            <span className="stat-value">{daysIn}</span>
            <span className="stat-label">Days In</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-value">{total}</span>
            <span className="stat-label">Projects Started</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-value">{shipped}</span>
            <span className="stat-label">Shipped</span>
          </div>
        </div>

        <div className="hero-cta">
          <a
            href="https://www.twitch.tv/kami_nari22"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
            </svg>
            Follow on Twitch
          </a>
          <a href="#projects" className="btn-secondary">
            See Projects
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
