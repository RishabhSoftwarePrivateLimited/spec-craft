import type { Task } from '../types/task'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000'

export async function listTasks(): Promise<Task[]> {
  const response = await fetch(`${API_BASE_URL}/api/tasks`)

  if (!response.ok) {
    throw new Error(`Failed to load tasks (${response.status})`)
  }

  return response.json() as Promise<Task[]>
}

export async function createTask(title: string): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null
    throw new Error(body?.error ?? `Failed to create task (${response.status})`)
  }

  return response.json() as Promise<Task>
}

export async function updateTaskCompletion(id: string, completed: boolean): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null
    throw new Error(body?.error ?? `Failed to update task (${response.status})`)
  }

  return response.json() as Promise<Task>
}
