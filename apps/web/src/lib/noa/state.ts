'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Task, Artifact, ExecutionStep } from './types'

const NoaContext = createContext<any>(null)

export const NoaProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [artifacts, setArtifacts] = useState<Artifact[]>([])

  useEffect(() => {
    const t = localStorage.getItem('noa:tasks')
    const a = localStorage.getItem('noa:artifacts')
    if (t) setTasks(JSON.parse(t))
    if (a) setArtifacts(JSON.parse(a))
  }, [])

  useEffect(() => {
    localStorage.setItem('noa:tasks', JSON.stringify(tasks))
  }, [tasks])
  useEffect(() => {
    localStorage.setItem('noa:artifacts', JSON.stringify(artifacts))
  }, [artifacts])

  const createTask = (title: string, steps: ExecutionStep[]) => {
    const task: Task = {
      id: String(Date.now()) + Math.random().toString(36).slice(2, 9),
      title,
      status: 'queued',
      steps,
      createdAt: new Date().toISOString(),
    }
    setTasks((s) => [task, ...s])
    return task
  }

  const updateStep = (taskId: string, stepId: string, patch: Partial<ExecutionStep>) => {
    setTasks((s) =>
      s.map((t) => {
        if (t.id !== taskId) return t
        return {
          ...t,
          steps: t.steps.map((st) => (st.id === stepId ? { ...st, ...patch } : st)),
        }
      })
    )
  }

  const setTaskStatus = (taskId: string, status: Task['status']) => {
    setTasks((s) => s.map((t) => (t.id === taskId ? { ...t, status } : t)))
  }

  const addArtifact = (a: Artifact) => {
    setArtifacts((s) => [a, ...s])
  }

  return (
    <NoaContext.Provider value={{ tasks, artifacts, createTask, updateStep, setTaskStatus, addArtifact }}>
      {children}
    </NoaContext.Provider>
  )
}

export const useNoa = () => useContext(NoaContext)
