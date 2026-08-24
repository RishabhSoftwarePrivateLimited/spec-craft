import type { Task } from '../types/task'

const tasks: Task[] = []

export function list(): Task[] {
  return tasks
}

export function create(task: Task): Task {
  tasks.unshift(task)
  return task
}
