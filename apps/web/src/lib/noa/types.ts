export type Status = 'queued' | 'planning' | 'running' | 'waiting' | 'completed' | 'failed'

export interface ExecutionStep {
  id: string
  title: string
  status: Status
  error?: string
}

export interface Task {
  id: string
  title: string
  status: Status
  steps: ExecutionStep[]
  createdAt: string
  metadata?: any
}

export interface Artifact {
  id: string
  type: string
  name?: string
  previewUrl?: string
  status?: Status
  sourceTaskId?: string
  createdAt: string
  metadata?: any
}
