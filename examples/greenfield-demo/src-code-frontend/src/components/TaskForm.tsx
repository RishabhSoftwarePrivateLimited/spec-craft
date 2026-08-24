import { useState } from 'react'
import type { FormEvent } from 'react'

interface TaskFormProps {
  onCreate: (title: string) => Promise<void>
}

export function TaskForm({ onCreate }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return

    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setFormError('Title is required')
      return
    }

    setFormError(null)
    setIsSubmitting(true)

    try {
      await onCreate(trimmedTitle)
      setTitle('')
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create task')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      {formError && (
        <p className="task-form__error" role="alert">
          {formError}
        </p>
      )}
      <input
        className="task-form__input"
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Add a new task"
        aria-label="Task title"
      />
      <button className="task-form__submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Adding…' : 'Add task'}
      </button>
    </form>
  )
}
