import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Task } from './types/task'

vi.mock('./api/tasksClient')

vi.mock('./components/TaskList', () => ({
  TaskList: ({
    tasks,
    onToggleComplete,
  }: {
    tasks: Task[]
    onToggleComplete: (id: string, completed: boolean) => Promise<void>
  }) => (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          {task.title}
          <button onClick={() => { onToggleComplete(task.id, !task.completed).catch(() => {}) }}>
            mock-toggle-{task.id}
          </button>
        </li>
      ))}
    </ul>
  ),
}))

vi.mock('./components/TaskForm', () => ({
  TaskForm: ({ onCreate }: { onCreate: (title: string) => void }) => (
    <button onClick={() => onCreate('New task from test')}>mock-create</button>
  ),
}))

import App from './App'
import * as tasksClient from './api/tasksClient'

const mockedTasksClient = vi.mocked(tasksClient)

const existingTask: Task = { id: '1', title: 'Buy milk', createdAt: '2026-01-01T00:00:00.000Z', completed: false }
const createdTask: Task = { id: '2', title: 'New task from test', createdAt: '2026-01-02T00:00:00.000Z', completed: false }

beforeEach(() => {
  vi.resetAllMocks()
})

describe('App', () => {
  it('fetches the task list on mount and renders it', async () => {
    mockedTasksClient.listTasks.mockResolvedValue([existingTask])

    render(<App />)

    expect(await screen.findByText('Buy milk')).toBeInTheDocument()
    expect(mockedTasksClient.listTasks).toHaveBeenCalledTimes(1)
  })

  it('places a newly created task at the top of local state without a re-fetch', async () => {
    mockedTasksClient.listTasks.mockResolvedValue([existingTask])
    mockedTasksClient.createTask.mockResolvedValue(createdTask)
    const user = userEvent.setup()

    render(<App />)
    await screen.findByText('Buy milk')

    await user.click(screen.getByText('mock-create'))

    const items = await screen.findAllByRole('listitem')
    expect(items[0]).toHaveTextContent('New task from test')
    expect(items[1]).toHaveTextContent('Buy milk')
    expect(mockedTasksClient.listTasks).toHaveBeenCalledTimes(1)
  })

  it('shows an error banner when the initial fetch fails', async () => {
    mockedTasksClient.listTasks.mockRejectedValue(new Error('network down'))

    render(<App />)

    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })

  it('shows a loading indicator while the initial fetch is in flight', async () => {
    let resolveList: (tasks: Task[]) => void = () => {}
    mockedTasksClient.listTasks.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveList = resolve
        }),
    )

    render(<App />)

    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    resolveList([])

    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument())
  })

  it('updates only the toggled task in place, at the same position, without a re-fetch', async () => {
    const second: Task = { id: '2', title: 'Second', createdAt: '2026-01-02T00:00:00.000Z', completed: false }
    mockedTasksClient.listTasks.mockResolvedValue([second, existingTask])
    const updatedSecond = { ...second, completed: true }
    mockedTasksClient.updateTaskCompletion.mockResolvedValue(updatedSecond)
    const user = userEvent.setup()

    render(<App />)
    await screen.findByText('Second')

    await user.click(screen.getByText('mock-toggle-2'))

    await waitFor(() => expect(mockedTasksClient.updateTaskCompletion).toHaveBeenCalledWith('2', true))
    const items = await screen.findAllByRole('listitem')
    expect(items[0]).toHaveTextContent('Second')
    expect(items[1]).toHaveTextContent('Buy milk')
    expect(mockedTasksClient.listTasks).toHaveBeenCalledTimes(1)
  })

  it('does not change local state when a toggle fails', async () => {
    mockedTasksClient.listTasks.mockResolvedValue([existingTask])
    mockedTasksClient.updateTaskCompletion.mockRejectedValue(new Error('Task not found'))
    const user = userEvent.setup()

    render(<App />)
    await screen.findByText('Buy milk')

    await user.click(screen.getByText('mock-toggle-1'))

    await waitFor(() => expect(mockedTasksClient.updateTaskCompletion).toHaveBeenCalledTimes(1))
    const items = await screen.findAllByRole('listitem')
    expect(items).toHaveLength(1)
    expect(items[0]).toHaveTextContent('Buy milk')
  })
})
