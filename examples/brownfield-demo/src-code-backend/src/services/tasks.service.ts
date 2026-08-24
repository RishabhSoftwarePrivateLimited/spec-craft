import { randomUUID } from 'node:crypto'
import type { Task } from '../types/task'
import * as tasksRepository from '../repositories/tasks.repository'

export function listTasks(): Task[] {
  return tasksRepository.list()
}

export function createTask(title: string): Task {
  const trimmedTitle = (title ?? '').trim()
  if (!trimmedTitle) {
    throw new Error('Title is required')
  }

  const task: Task = {
    id: randomUUID(),
    title: trimmedTitle,
    createdAt: new Date().toISOString(),
    completed: false,
  }

  return tasksRepository.create(task)
}

export function setTaskCompleted(id: string, completed: boolean): Task {
  if (typeof completed !== 'boolean') {
    throw new Error('completed must be a boolean')
  }

  const task = tasksRepository.setCompleted(id, completed)
  if (!task) {
    throw new Error('Task not found')
  }

  return task
}
