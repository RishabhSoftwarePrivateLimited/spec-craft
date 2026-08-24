import type { Request, Response } from 'express'
import * as tasksService from '../services/tasks.service'

export function listTasks(req: Request, res: Response): void {
  void req
  res.status(200).json(tasksService.listTasks())
}

export function createTask(req: Request, res: Response): void {
  const { title } = req.body ?? {}

  try {
    const task = tasksService.createTask(title)
    res.status(201).json(task)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Title is required'
    res.status(400).json({ error: message })
  }
}
