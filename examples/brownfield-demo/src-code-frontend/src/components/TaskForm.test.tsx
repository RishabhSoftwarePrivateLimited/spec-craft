import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskForm } from './TaskForm'

describe('TaskForm', () => {
  it('blocks submit and shows a message for an empty title', async () => {
    const onCreate = vi.fn()
    const user = userEvent.setup()
    render(<TaskForm onCreate={onCreate} />)

    await user.click(screen.getByRole('button', { name: /add task/i }))

    expect(await screen.findByText(/title is required/i)).toBeInTheDocument()
    expect(onCreate).not.toHaveBeenCalled()
  })

  it('blocks submit and shows a message for a whitespace-only title', async () => {
    const onCreate = vi.fn()
    const user = userEvent.setup()
    render(<TaskForm onCreate={onCreate} />)

    await user.type(screen.getByLabelText(/task title/i), '   ')
    await user.click(screen.getByRole('button', { name: /add task/i }))

    expect(await screen.findByText(/title is required/i)).toBeInTheDocument()
    expect(onCreate).not.toHaveBeenCalled()
  })

  it('calls onCreate with the trimmed title on valid submit and clears the input', async () => {
    const onCreate = vi.fn().mockResolvedValue(undefined)
    const user = userEvent.setup()
    render(<TaskForm onCreate={onCreate} />)

    const input = screen.getByLabelText(/task title/i)
    await user.type(input, '  Buy milk  ')
    await user.click(screen.getByRole('button', { name: /add task/i }))

    expect(onCreate).toHaveBeenCalledWith('Buy milk')
    await waitFor(() => expect(input).toHaveValue(''))
  })

  it('disables the submit control while isSubmitting and prevents a double-submit', async () => {
    let resolveCreate: () => void = () => {}
    const onCreate = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveCreate = resolve
        }),
    )
    const user = userEvent.setup()
    render(<TaskForm onCreate={onCreate} />)

    await user.type(screen.getByLabelText(/task title/i), 'Buy milk')
    const button = screen.getByRole('button', { name: /add task/i })
    await user.click(button)

    expect(button).toBeDisabled()

    await user.click(button)
    expect(onCreate).toHaveBeenCalledTimes(1)

    resolveCreate()
    await waitFor(() => expect(button).not.toBeDisabled())
  })

  it('shows the server error message on a failed create, re-enables the control, and preserves the typed text', async () => {
    const onCreate = vi.fn().mockRejectedValue(new Error('Title is required'))
    const user = userEvent.setup()
    render(<TaskForm onCreate={onCreate} />)

    const input = screen.getByLabelText(/task title/i)
    await user.type(input, 'Buy milk')
    const button = screen.getByRole('button', { name: /add task/i })
    await user.click(button)

    expect(await screen.findByText('Title is required')).toBeInTheDocument()
    expect(input).toHaveValue('Buy milk')
    expect(button).not.toBeDisabled()
  })
})
