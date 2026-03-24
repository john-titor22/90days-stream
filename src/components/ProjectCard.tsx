import { useState } from 'react'
import { Clip, Project } from '../data/projects'

const STATUS_CONFIG = {
  completed: { label: 'Shipped', className: 'status-completed' },
  'in-progress': { label: 'In Progress', className: 'status-inprogress' },
  planned: { label: 'Planned', className: 'status-planned' },
}

const TWITCH_PARENT = typeof window !== 'undefined' ? window.location.hostname : 'localhost'

function ClipEmbed({ clip }: { clip: Clip }) {
  if (clip.type === 'twitch') {
    return (
      <iframe
        src={`https://clips.twitch.tv/embed?clip=${clip.src}&parent=${TWITCH_PARENT}&autoplay=false`}
        allowFullScreen
        title={clip.label ?? 'Twitch clip'}
      />
    )
  }
  if (clip.type === 'twitch-video') {
    return (
      <iframe
        src={`https://player.twitch.tv/?video=${clip.src}&parent=${TWITCH_PARENT}&autoplay=false`}
        allowFullScreen
        title={clip.label ?? 'Twitch video'}
      />
    )
  }
  return (
    <video controls preload="metadata">
      <source src={clip.src} />
      Your browser does not support video.
    </video>
  )
}

interface Props {
  project: Project
  onEdit?: () => void
  onDelete?: () => void
}

export default function ProjectCard({ project, onEdit, onDelete }: Props) {
  const status = STATUS_CONFIG[project.status]
  const clips = project.clips ?? []
  const [index, setIndex] = useState(0)

  function handleDelete() {
    if (onDelete && confirm(`Delete "${project.name}"?`)) onDelete()
  }

  const current = clips[index]

  return (
    <article className="project-card">
      {/* Admin controls — dev only */}
      {(onEdit || onDelete) && <div className="card-admin-actions">
        <button className="card-action-btn" onClick={onEdit} title="Edit project">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button className="card-action-btn card-action-delete" onClick={handleDelete} title="Delete project">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
          </svg>
        </button>
      </div>}

      {/* Clip area */}
      <div className="card-clip">
        {clips.length === 0 ? (
          <div className="clip-placeholder" onClick={onEdit ?? undefined} title={onEdit ? 'Add a clip' : undefined}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
            </svg>
            <span>{onEdit ? 'Click to add a clip' : 'Clip coming soon'}</span>
          </div>
        ) : (
          <>
            <ClipEmbed clip={current} />

            {/* Carousel controls */}
            {clips.length > 1 && (
              <>
                <button
                  className="carousel-btn carousel-prev"
                  onClick={() => setIndex((i) => (i - 1 + clips.length) % clips.length)}
                  aria-label="Previous clip"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  className="carousel-btn carousel-next"
                  onClick={() => setIndex((i) => (i + 1) % clips.length)}
                  aria-label="Next clip"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>

                <div className="carousel-dots">
                  {clips.map((_, i) => (
                    <button
                      key={i}
                      className={`carousel-dot ${i === index ? 'active' : ''}`}
                      onClick={() => setIndex(i)}
                      aria-label={`Go to clip ${i + 1}`}
                    />
                  ))}
                </div>

                {current.label && (
                  <div className="clip-label">{current.label}</div>
                )}
              </>
            )}
          </>
        )}
      </div>

      <div className="card-body">
        <div className="card-meta">
          <span className="card-day">Day {project.day}</span>
          <span className={`status-badge ${status.className}`}>
            {project.status === 'in-progress' && <span className="status-pulse" />}
            {status.label}
          </span>
        </div>

        <h2 className="card-title">{project.name}</h2>
        <p className="card-tagline">{project.tagline}</p>
        <p className="card-description">{project.description}</p>

        <div className="card-tags">
          {project.tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>

        <div className="card-links">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="link-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
          )}
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer" className="link-btn link-btn-accent">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Live Demo
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
