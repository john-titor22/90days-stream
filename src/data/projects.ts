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
  day: number
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
    day: 1,
    name: 'Dispeak',
    tagline: 'Encrypted voice & text, self-hosted.',
    description:
      'A privacy-first communication platform — Discord meets TeamSpeak with end-to-end encryption. Self-hostable, open source, built with Fastify, LiveKit, and React.',
    status: 'in-progress',
    tags: ['React', 'Fastify', 'LiveKit', 'Prisma', 'Socket.IO'],
    github: 'https://github.com/john-titor22/Dispeak',
    demo: 'https://dispeakweb-production.up.railway.app/',
    clips: [
      { type: 'twitch-video', src: '2729826020' },
      { type: 'twitch-video', src: '2729822711' },
    ],
  },
]
