import { Project } from '../data/projects'
import ProjectCard from './ProjectCard'

interface Props {
  projects: Project[]
  onEdit?: (p: Project) => void
  onDelete?: (id: string) => void
}

export default function ProjectsGrid({ projects, onEdit, onDelete }: Props) {
  return (
    <section id="projects" className="projects-section">
      <div className="section-header">
        <h2 className="section-title">
          <span className="gradient-text">Projects</span> Shipped
        </h2>
        <p className="section-subtitle">
          Each project built live on stream — from zero to deployed.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8M12 17v4" />
          </svg>
          <p>No projects yet. Hit the + button to add your first one.</p>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={onEdit ? () => onEdit(project) : undefined}
              onDelete={onDelete ? () => onDelete(project.id) : undefined}
            />
          ))}
        </div>
      )}
    </section>
  )
}
