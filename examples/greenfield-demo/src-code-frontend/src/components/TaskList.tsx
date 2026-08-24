import type { Task } from '../types/task'

interface TaskListProps {
  tasks: Task[]
}

export function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="task-list__empty">No tasks yet — create your first one above</p>
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className="task-list__item">
          {task.title}
        </li>
      ))}
    </ul>
  )
}
