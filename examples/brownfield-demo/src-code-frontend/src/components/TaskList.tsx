import { useState } from 'react'
import type { Task } from '../types/task'

interface TaskListProps {
  tasks: Task[]
  onToggleComplete: (id: string, completed: boolean) => Promise<void>
}

export function TaskList({ tasks, onToggleComplete }: TaskListProps) {
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set())
  const [rowErrors, setRowErrors] = useState<Record<string, string>>({})

  if (tasks.length === 0) {
    return <p className="task-list__empty">No tasks yet — create your first one above</p>
  }

  const handleToggle = async (task: Task) => {
    setTogglingIds((current) => new Set(current).add(task.id))
    setRowErrors((current) => {
      const next = { ...current }
      delete next[task.id]
      return next
    })

    try {
      await onToggleComplete(task.id, !task.completed)
    } catch (err) {
      setRowErrors((current) => ({
        ...current,
        [task.id]: err instanceof Error ? err.message : 'Failed to update task',
      }))
    } finally {
      setTogglingIds((current) => {
        const next = new Set(current)
        next.delete(task.id)
        return next
      })
    }
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li
          key={task.id}
          className={
            task.completed ? 'task-list__item task-list__item--completed' : 'task-list__item'
          }
        >
          <label className="task-list__item-label">
            <input
              type="checkbox"
              checked={task.completed}
              disabled={togglingIds.has(task.id)}
              onChange={() => handleToggle(task)}
              aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
            />
            {task.title}
          </label>
          {rowErrors[task.id] && (
            <p className="task-list__item-error" role="alert">
              {rowErrors[task.id]}
            </p>
          )}
        </li>
      ))}
    </ul>
  )
}
