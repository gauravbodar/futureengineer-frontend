export type Tier = 'Spark' | 'Maker' | 'Creator'

export type AgentId = 'larry' | 'maya' | 'atlas' | 'nova' | 'echo'

export interface Agent {
  id: AgentId
  name: string
  role: string
  description: string
  tone: string
}

export interface Project {
  id: string
  userId: string
  title: string
  description: string
  currentStep: number
  totalSteps: number
  percentComplete: number
  lastActive: string
  published: boolean
}

export interface PortfolioEntry {
  id: string
  projectId: string
  username: string
  title: string
  description: string
  url: string
  createdAt: string
}
