import { useEffect, useRef, useState } from 'react'
import { Clip, ClipType, Project, ProjectStatus } from '../data/projects'

interface Props {
  project: Project | null
  onSave: (p: Project) => void
  onClose: () => void
}

interface ClipRow {
  _key: string
  type: ClipType
  src: string
  label: string
}

interface FormState {
  name: string
  day: string
  tagline: string
  description: string
  status: ProjectStatus
  tags: string
  github: string
  demo: string
  clips: ClipRow[]
}

// ── Twitch URL parsers ────────────────────────────────────────

function parseTwitchSlug(input: string): string {
  const m = input.match(/clip\/([^/?&#\s]+)/) ?? input.match(/clips\.twitch\.tv\/([^/?&#\s]+)/)
  return m ? m[1] : input.trim()
}

function parseTwitchVideoId(input: string): string {
  const m = input.match(/\/videos\/(\d+)/)
  return m ? m[1] : input.trim()
}

function makeKey() {
  return Math.random().toString(36).slice(2)
}

// ── Form helpers ──────────────────────────────────────────────

function toForm(p: Project | null): FormState {
  return {
    name: p?.name ?? '',
    day: p ? String(p.day) : '',
    tagline: p?.tagline ?? '',
    description: p?.description ?? '',
    status: p?.status ?? 'in-progress',
    tags: p?.tags.join(', ') ?? '',
    github: p?.github ?? '',
    demo: p?.demo ?? '',
    clips: (p?.clips ?? []).map((c) => ({ _key: makeKey(), type: c.type, src: c.src, label: c.label ?? '' })),
  }
}

// ── Clip type labels ──────────────────────────────────────────

const CLIP_TYPE_LABELS: Record<ClipType, string> = {
  twitch: 'Twitch Clip',
  'twitch-video': 'Twitch Video',
  local: 'Local File',
}

const CLIP_PLACEHOLDERS: Record<ClipType, string> = {
  twitch: 'https://www.twitch.tv/kami_nari22/clip/SlugHere  —  or just the slug',
  'twitch-video': 'https://www.twitch.tv/videos/2345678901  —  or just the video ID',
  local: '/clips/project-name.mp4',
}

const CLIP_HINTS: Record<ClipType, string> = {
  twitch: 'Paste the full clip URL or just the slug — both work.',
  'twitch-video': 'Paste the full VOD URL or just the numeric video ID.',
  local: 'Put the .mp4 in public/clips/ then enter the path above.',
}

// ── Component ─────────────────────────────────────────────────

export default function AdminPanel({ project, onSave, onClose }: Props) {
  const [form, setForm] = useState<FormState>(() => toForm(project))
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({})
  const firstInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setForm(toForm(project))
    setErrors({})
  }, [project])

  useEffect(() => {
    firstInput.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function setField(field: keyof Omit<FormState, 'clips'>, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  // ── Clip list helpers ──────────────────────────────────────

  function addClip() {
    setForm((f) => ({
      ...f,
      clips: [...f.clips, { _key: makeKey(), type: 'twitch', src: '', label: '' }],
    }))
  }

  function removeClip(key: string) {
    setForm((f) => ({ ...f, clips: f.clips.filter((c) => c._key !== key) }))
  }

  function updateClip(key: string, patch: Partial<ClipRow>) {
    setForm((f) => ({
      ...f,
      clips: f.clips.map((c) => (c._key === key ? { ...c, ...patch } : c)),
    }))
    setErrors((e) => ({ ...e, [`clip-${key}`]: undefined }))
  }

  function moveClip(key: string, dir: -1 | 1) {
    setForm((f) => {
      const arr = [...f.clips]
      const i = arr.findIndex((c) => c._key === key)
      const j = i + dir
      if (j < 0 || j >= arr.length) return f
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
      return { ...f, clips: arr }
    })
  }

  // ── Validation ─────────────────────────────────────────────

  function validate(): boolean {
    const e: typeof errors = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.day.trim() || isNaN(parseInt(form.day))) e.day = 'Enter a day (e.g. 1 or 1-2)'
    if (!form.tagline.trim()) e.tagline = 'Required'
    if (!form.description.trim()) e.description = 'Required'
    form.clips.forEach((c) => {
      if (!c.src.trim()) e[`clip-${c._key}`] = 'Enter a URL or path'
    })
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // ── Save ───────────────────────────────────────────────────

  function handleSave() {
    if (!validate()) return
    const id =
      project?.id ??
      form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now()

    const clips: Clip[] = form.clips
      .filter((c) => c.src.trim())
      .map((c) => ({
        type: c.type,
        src:
          c.type === 'twitch'
            ? parseTwitchSlug(c.src)
            : c.type === 'twitch-video'
            ? parseTwitchVideoId(c.src)
            : c.src.trim(),
        label: c.label.trim() || undefined,
      }))

    onSave({
      id,
      day: form.day.trim(),
      name: form.name.trim(),
      tagline: form.tagline.trim(),
      description: form.description.trim(),
      status: form.status,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      github: form.github.trim() || undefined,
      demo: form.demo.trim() || undefined,
      clips: clips.length > 0 ? clips : undefined,
    })
  }

  // ── Render ─────────────────────────────────────────────────

  return (
    <>
      <div className="admin-overlay" onClick={onClose} />
      <aside className="admin-panel">
        <div className="admin-header">
          <h2>{project ? 'Edit Project' : 'Add Project'}</h2>
          <button className="admin-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="admin-body">
          {/* Basic info */}
          <section className="form-section">
            <h3 className="form-section-title">Basic Info</h3>

            <div className="form-row-2">
              <div className="form-field">
                <label>Project Name *</label>
                <input
                  ref={firstInput}
                  value={form.name}
                  onChange={(e) => setField('name', e.target.value)}
                  placeholder="Dispeak"
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>
              <div className="form-field">
                <label>Day # *</label>
                <input
                  value={form.day}
                  onChange={(e) => setField('day', e.target.value)}
                  placeholder="1 or 1-2"
                  className={errors.day ? 'error' : ''}
                />
                {errors.day && <span className="form-error">{errors.day}</span>}
              </div>
            </div>

            <div className="form-field">
              <label>Tagline *</label>
              <input
                value={form.tagline}
                onChange={(e) => setField('tagline', e.target.value)}
                placeholder="Encrypted voice & text, self-hosted."
                className={errors.tagline ? 'error' : ''}
              />
              {errors.tagline && <span className="form-error">{errors.tagline}</span>}
            </div>

            <div className="form-field">
              <label>Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => setField('description', e.target.value)}
                placeholder="What it does, how it was built..."
                rows={3}
                className={errors.description ? 'error' : ''}
              />
              {errors.description && <span className="form-error">{errors.description}</span>}
            </div>

            <div className="form-row-2">
              <div className="form-field">
                <label>Status</label>
                <select value={form.status} onChange={(e) => setField('status', e.target.value as ProjectStatus)}>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Shipped</option>
                  <option value="planned">Planned</option>
                </select>
              </div>
              <div className="form-field">
                <label>Tags</label>
                <input
                  value={form.tags}
                  onChange={(e) => setField('tags', e.target.value)}
                  placeholder="React, Node, Prisma"
                />
                <span className="form-hint">Comma-separated</span>
              </div>
            </div>
          </section>

          {/* Links */}
          <section className="form-section">
            <h3 className="form-section-title">Links</h3>
            <div className="form-field">
              <label>GitHub URL</label>
              <input
                value={form.github}
                onChange={(e) => setField('github', e.target.value)}
                placeholder="https://github.com/..."
              />
            </div>
            <div className="form-field">
              <label>Live Demo URL</label>
              <input
                value={form.demo}
                onChange={(e) => setField('demo', e.target.value)}
                placeholder="https://..."
              />
            </div>
          </section>

          {/* Clips */}
          <section className="form-section">
            <h3 className="form-section-title">
              Clips
              <span className="form-section-count">{form.clips.length}</span>
            </h3>

            {form.clips.length === 0 && (
              <p className="clips-empty">No clips yet. Add a Twitch clip, VOD, or local video.</p>
            )}

            <div className="clips-list">
              {form.clips.map((clip, i) => (
                <div key={clip._key} className="clip-row">
                  <div className="clip-row-header">
                    <div className="clip-row-order">
                      <button
                        className="clip-order-btn"
                        onClick={() => moveClip(clip._key, -1)}
                        disabled={i === 0}
                        title="Move up"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="18 15 12 9 6 15" />
                        </svg>
                      </button>
                      <button
                        className="clip-order-btn"
                        onClick={() => moveClip(clip._key, 1)}
                        disabled={i === form.clips.length - 1}
                        title="Move down"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                    </div>

                    <div className="clip-type-tabs clip-type-tabs-sm">
                      {(['twitch', 'twitch-video', 'local'] as ClipType[]).map((t) => (
                        <button
                          key={t}
                          className={`clip-tab ${clip.type === t ? 'active' : ''}`}
                          onClick={() => updateClip(clip._key, { type: t, src: '' })}
                          type="button"
                        >
                          {CLIP_TYPE_LABELS[t]}
                        </button>
                      ))}
                    </div>

                    <button
                      className="clip-remove-btn"
                      onClick={() => removeClip(clip._key)}
                      title="Remove clip"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>

                  <div className="form-field">
                    <input
                      value={clip.src}
                      onChange={(e) => updateClip(clip._key, { src: e.target.value })}
                      placeholder={CLIP_PLACEHOLDERS[clip.type]}
                      className={errors[`clip-${clip._key}`] ? 'error' : ''}
                    />
                    <span className="form-hint">{CLIP_HINTS[clip.type]}</span>
                    {errors[`clip-${clip._key}`] && (
                      <span className="form-error">{errors[`clip-${clip._key}`]}</span>
                    )}
                  </div>

                  <div className="form-field">
                    <input
                      value={clip.label}
                      onChange={(e) => updateClip(clip._key, { label: e.target.value })}
                      placeholder='Label (optional) — e.g. "Full stream" or "Highlight"'
                    />
                  </div>
                </div>
              ))}
            </div>

            <button className="btn-add-clip" onClick={addClip} type="button">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Clip
            </button>
          </section>
        </div>

        <div className="admin-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave}>
            {project ? 'Save Changes' : 'Add Project'}
          </button>
        </div>
      </aside>
    </>
  )
}
