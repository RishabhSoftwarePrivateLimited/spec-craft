import type { Task } from '../types/task'

const tasks: Task[] = []

export function list(): Task[] {
  return tasks
}

export function create(task: Task): Task {
  tasks.unshift(task)
  return task
}

export function setCompleted(id: string, completed: boolean): Task | undefined {
  const task = tasks.find((t) => t.id === id)
  if (!task) {
    return undefined
  }

  task.completed = completed
  return task
}
