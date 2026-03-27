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
      { type: 'twitch-video', src: '2729826020' },
      { type: 'twitch-video', src: '2729822711' },
      { type: 'twitch-video', src: '2731167724' },
    ],
  },
  {
    id: 'egsy',
    day: '5',
    name: 'Egsy',
    tagline: 'Smart poultry farm management.',
    description:
      'A full-stack farm management platform for poultry farmers — track flocks, egg production, stock, sales, and expenses in one place. Built with Node.js, Prisma, and React.',
    status: 'completed',
    tags: ['React', 'Node.js', 'Prisma', 'Tailwind'],
    github: 'https://github.com/john-titor22/Egsy',
    demo: 'https://prolific-kindness-production-dbb6.up.railway.app',
  },
]
