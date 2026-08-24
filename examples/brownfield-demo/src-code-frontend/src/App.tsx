import { useEffect, useState } from 'react'
import type { Task } from './types/task'
import { TaskList } from './components/TaskList'
import { TaskForm } from './components/TaskForm'
import { createTask, listTasks, updateTaskCompletion } from './api/tasksClient'

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [listError, setListError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    listTasks()
      .then((fetchedTasks) => {
        if (cancelled) return
        setTasks(fetchedTasks)
        setListError(null)
      })
      .catch(() => {
        if (cancelled) return
        setListError("Couldn't load tasks")
      })
      .finally(() => {
        if (cancelled) return
        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const handleCreate = async (title: string) => {
    const task = await createTask(title)
    setTasks((current) => [task, ...current])
  }

  const handleToggleComplete = async (id: string, completed: boolean) => {
    const updated = await updateTaskCompletion(id, completed)
    setTasks((current) => current.map((task) => (task.id === id ? updated : task)))
  }

  return (
    <>
      {listError && <p role="alert">{listError}</p>}
      {isLoading ? <p>Loading tasks…</p> : <TaskList tasks={tasks} onToggleComplete={handleToggleComplete} />}
      <TaskForm onCreate={handleCreate} />
    </>
  )
}

export default App
