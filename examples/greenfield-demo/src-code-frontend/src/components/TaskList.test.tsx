import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TaskList } from './TaskList'
import type { Task } from '../types/task'

const tasks: Task[] = [
  { id: '2', title: 'Second', createdAt: '2026-01-02T00:00:00.000Z' },
  { id: '1', title: 'First', createdAt: '2026-01-01T00:00:00.000Z' },
]

describe('TaskList', () => {
  it('renders an empty-state message when there are no tasks', () => {
    render(<TaskList tasks={[]} />)

    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument()
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('renders all items in the order given, without re-sorting', () => {
    render(<TaskList tasks={tasks} />)

    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveTextContent('Second')
    expect(items[1]).toHaveTextContent('First')
  })
})
