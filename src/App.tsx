import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProjectsGrid from './components/ProjectsGrid'
import AdminPanel from './components/AdminPanel'
import { useProjects } from './hooks/useProjects'
import { Project } from './data/projects'

const IS_DEV = import.meta.env.DEV

export default function App() {
  const { projects, addProject, updateProject, deleteProject } = useProjects()
  const [panelOpen, setPanelOpen] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)

  function openAdd() {
    setEditing(null)
    setPanelOpen(true)
  }

  function openEdit(p: Project) {
    setEditing(p)
    setPanelOpen(true)
  }

  function handleSave(p: Project) {
    if (editing) updateProject(p.id, p)
    else addProject(p)
    setPanelOpen(false)
    setEditing(null)
  }

  function handleClose() {
    setPanelOpen(false)
    setEditing(null)
  }

  return (
    <div className="app">
      <Navbar />
      <main>
        <Hero projects={projects} />
        <ProjectsGrid
          projects={projects}
          onEdit={IS_DEV ? openEdit : undefined}
          onDelete={IS_DEV ? deleteProject : undefined}
        />
      </main>
      <footer className="footer">
        <p>
          Built live on stream with{' '}
          <a href="https://claude.ai" target="_blank" rel="noopener noreferrer">Claude</a>
          {' '}— 90 Day Build Challenge
        </p>
      </footer>

      {IS_DEV && (
        <>
          <button className="fab" onClick={openAdd} title="Add project">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Add Project</span>
          </button>

          {panelOpen && (
            <AdminPanel
              project={editing}
              onSave={handleSave}
              onClose={handleClose}
            />
          )}
        </>
      )}
    </div>
  )
}
