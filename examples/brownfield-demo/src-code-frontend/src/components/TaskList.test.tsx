import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskList } from './TaskList'
import type { Task } from '../types/task'

const tasks: Task[] = [
  { id: '2', title: 'Second', createdAt: '2026-01-02T00:00:00.000Z', completed: false },
  { id: '1', title: 'First', createdAt: '2026-01-01T00:00:00.000Z', completed: false },
]

const noopOnToggleComplete = async () => {}

describe('TaskList', () => {
  it('renders an empty-state message when there are no tasks', () => {
    render(<TaskList tasks={[]} onToggleComplete={noopOnToggleComplete} />)

    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument()
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('renders all items in the order given, without re-sorting', () => {
    render(<TaskList tasks={tasks} onToggleComplete={noopOnToggleComplete} />)

    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveTextContent('Second')
    expect(items[1]).toHaveTextContent('First')
  })

  it('renders a completed task with the checkbox checked, an incomplete task unchecked', () => {
    const mixed: Task[] = [
      { id: '1', title: 'Done', createdAt: '2026-01-01T00:00:00.000Z', completed: true },
      { id: '2', title: 'Not done', createdAt: '2026-01-02T00:00:00.000Z', completed: false },
    ]

    render(<TaskList tasks={mixed} onToggleComplete={noopOnToggleComplete} />)

    expect(screen.getByRole('checkbox', { name: /mark "done"/i })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: /mark "not done"/i })).not.toBeChecked()
  })

  it('calls onToggleComplete with the task id and the opposite boolean of its current state', async () => {
    const onToggleComplete = vi.fn().mockResolvedValue(undefined)
    const user = userEvent.setup()
    render(<TaskList tasks={tasks} onToggleComplete={onToggleComplete} />)

    await user.click(screen.getByRole('checkbox', { name: /mark "second"/i }))

    expect(onToggleComplete).toHaveBeenCalledWith('2', true)
  })

  it('disables the toggling row\'s control while its own request is in flight, and re-enables it after', async () => {
    let resolveToggle: () => void = () => {}
    const onToggleComplete = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveToggle = resolve
        }),
    )
    const user = userEvent.setup()
    render(<TaskList tasks={tasks} onToggleComplete={onToggleComplete} />)

    const checkbox = screen.getByRole('checkbox', { name: /mark "second"/i })
    await user.click(checkbox)

    expect(checkbox).toBeDisabled()

    resolveToggle()
    await waitFor(() => expect(checkbox).not.toBeDisabled())
  })

  it('does not disable a sibling row\'s control while one row\'s toggle is in flight', async () => {
    let resolveToggle: () => void = () => {}
    const onToggleComplete = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveToggle = resolve
        }),
    )
    const user = userEvent.setup()
    render(<TaskList tasks={tasks} onToggleComplete={onToggleComplete} />)

    await user.click(screen.getByRole('checkbox', { name: /mark "second"/i }))

    expect(screen.getByRole('checkbox', { name: /mark "first"/i })).not.toBeDisabled()

    resolveToggle()
  })

  it('shows an inline error near the row when its toggle fails, without affecting other rows', async () => {
    const onToggleComplete = vi.fn().mockRejectedValue(new Error('Task not found'))
    const user = userEvent.setup()
    render(<TaskList tasks={tasks} onToggleComplete={onToggleComplete} />)

    await user.click(screen.getByRole('checkbox', { name: /mark "second"/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Task not found')
    const checkbox = screen.getByRole('checkbox', { name: /mark "second"/i })
    expect(checkbox).not.toBeChecked()
    expect(checkbox).not.toBeDisabled()
  })

  it('preserves list order before and after a toggle', async () => {
    const onToggleComplete = vi.fn().mockResolvedValue(undefined)
    const user = userEvent.setup()
    const { rerender } = render(<TaskList tasks={tasks} onToggleComplete={onToggleComplete} />)

    await user.click(screen.getByRole('checkbox', { name: /mark "second"/i }))

    const updated = tasks.map((task) => (task.id === '2' ? { ...task, completed: true } : task))
    rerender(<TaskList tasks={updated} onToggleComplete={onToggleComplete} />)

    const items = screen.getAllByRole('listitem')
    expect(items[0]).toHaveTextContent('Second')
    expect(items[1]).toHaveTextContent('First')
  })
})
