import { useState, useEffect } from 'react'
import { Project, projects as seedProjects } from '../data/projects'

const IS_DEV = import.meta.env.DEV
const STORAGE_KEY = '90days-projects'

function load(): Project[] {
  if (!IS_DEV) return seedProjects
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : seedProjects
  } catch {
    return seedProjects
  }
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(load)

  useEffect(() => {
    if (!IS_DEV) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
  }, [projects])

  function addProject(p: Project) {
    setProjects((prev) => [...prev, p].sort((a, b) => parseInt(a.day) - parseInt(b.day)))
  }

  function updateProject(id: string, updates: Partial<Project>) {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)))
  }

  function deleteProject(id: string) {
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }

  return { projects, addProject, updateProject, deleteProject }
}
