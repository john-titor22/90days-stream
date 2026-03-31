export type ProjectStatus = 'completed' | 'in-progress' | 'planned'
export type ClipType = 'twitch' | 'twitch-video' | 'local'

export interface Clip {
  type: ClipType
  /**
   * - twitch:       clip slug, e.g. "FastSlipperyCatAliens"
   * - twitch-video: VOD/video ID, e.g. "2345678901"
   * - local:        public-relative path, e.g. "/clips/dispeak.mp4"
   */
  src: string
  label?: string
}

export interface Project {
  id: string
  day: string
  name: string
  tagline: string
  description: string
  status: ProjectStatus
  tags: string[]
  github?: string
  demo?: string
  clips?: Clip[]
}

export const projects: Project[] = [
  {
    id: 'dispeak',
    day: '1-5',
    name: 'Dispeak',
    tagline: 'Encrypted voice & text, self-hosted.',
    description:
      'A privacy-first communication platform — Discord meets TeamSpeak with end-to-end encryption. Self-hostable, open source, built with Fastify, LiveKit, and React.',
    status: 'completed',
    tags: ['React', 'Fastify', 'LiveKit', 'Prisma', 'Socket.IO'],
    github: 'https://github.com/john-titor22/Dispeak',
    demo: 'https://dispeakweb-production.up.railway.app/',
    clips: [
      { type: 'local', src: '/clips/Dispeak1.mp4' },
      { type: 'local', src: '/clips/Dispeak2.mp4' },
      { type: 'local', src: '/clips/DispeakFinal.mp4' },
    ],
  },
  {
    id: 'eggsy',
    day: '5',
    name: 'Eggsy',
    tagline: 'Smart poultry farm management.',
    description:
      'A full-stack farm management platform for poultry farmers — track flocks, egg production, stock, sales, and expenses in one place. Built with Node.js, Prisma, and React.',
    status: 'completed',
    tags: ['React', 'Node.js', 'Prisma', 'Tailwind'],
    github: 'https://github.com/john-titor22/Egsy',
    demo: 'https://prolific-kindness-production-dbb6.up.railway.app',
    clips: [
      { type: 'local', src: '/clips/Eggsy.mp4' },
    ],
  },
  {
    id: 'gympal',
    day: '6-8',
    name: 'GymPal',
    tagline: 'Track workouts, build streaks, crush goals.',
    description:
      'A full-stack fitness tracking app — build custom routines, log sets and reps, track streaks, and schedule workouts on a drag-and-drop calendar. Includes an exercise library with muscle-group filtering, session history, and a body visualization map. Built with React, Express, Prisma, and PostgreSQL.',
    status: 'completed',
    tags: ['React', 'Express', 'Prisma', 'PostgreSQL', 'Tailwind'],
    github: 'https://github.com/john-titor22/GymPal',
    demo: 'https://diplomatic-joy-production.up.railway.app/',
    clips: [
      { type: 'local', src: '/clips/GymPal1.mp4' },
      { type: 'local', src: '/clips/GymPal2.mp4' },
    ],
  },
]
