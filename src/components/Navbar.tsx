export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <span className="navbar-logo">
          <span className="logo-dot" />
          90-Day Build
        </span>
        <div className="navbar-links">
          <a href="#projects">Projects</a>
          <a
            href="https://www.twitch.tv/kami_nari22"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-twitch"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
            </svg>
            Watch Live
          </a>
        </div>
      </div>
    </nav>
  )
}
