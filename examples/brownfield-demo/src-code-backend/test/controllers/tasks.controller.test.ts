import { test } from 'node:test'
import assert from 'node:assert/strict'
import type { Request, Response } from 'express'
import * as tasksService from '../../src/services/tasks.service'
import { listTasks, createTask, updateTaskCompletion } from '../../src/controllers/tasks.controller'

function createMockResponse() {
  const res = {
    statusCode: undefined as number | undefined,
    body: undefined as unknown,
    status(code: number) {
      res.statusCode = code
      return res
    },
    json(payload: unknown) {
      res.body = payload
      return res
    },
  }
  return res
}

test('listTasks responds 200 with the service result', (t) => {
  const tasks = [{ id: '1', title: 'Buy milk', createdAt: '2026-01-01T00:00:00.000Z', completed: false }]
  t.mock.method(tasksService, 'listTasks', () => tasks)
  const res = createMockResponse()

  listTasks({} as Request, res as unknown as Response)

  assert.equal(res.statusCode, 200)
  assert.equal(res.body, tasks)
})

test('listTasks responds 200 with an empty array when no tasks exist', (t) => {
  t.mock.method(tasksService, 'listTasks', () => [])
  const res = createMockResponse()

  listTasks({} as Request, res as unknown as Response)

  assert.equal(res.statusCode, 200)
  assert.deepEqual(res.body, [])
})

test('listTasks responds 200 with all tasks in the order the service returns them, after multiple creates', (t) => {
  const tasks = [
    { id: '2', title: 'Second', createdAt: '2026-01-02T00:00:00.000Z', completed: false },
    { id: '1', title: 'First', createdAt: '2026-01-01T00:00:00.000Z', completed: false },
  ]
  t.mock.method(tasksService, 'listTasks', () => tasks)
  const res = createMockResponse()

  listTasks({} as Request, res as unknown as Response)

  assert.equal(res.statusCode, 200)
  assert.equal(res.body, tasks)
  assert.deepEqual((res.body as typeof tasks).map((task) => task.id), ['2', '1'])
})

test('createTask responds 201 with the created task for a valid title', (t) => {
  const created = { id: '1', title: 'Buy milk', createdAt: '2026-01-01T00:00:00.000Z', completed: false }
  t.mock.method(tasksService, 'createTask', () => created)
  const res = createMockResponse()

  createTask({ body: { title: 'Buy milk' } } as Request, res as unknown as Response)

  assert.equal(res.statusCode, 201)
  assert.equal(res.body, created)
})

test('createTask responds 400 with the service error message for an invalid title', (t) => {
  t.mock.method(tasksService, 'createTask', () => {
    throw new Error('Title is required')
  })
  const res = createMockResponse()

  createTask({ body: { title: '   ' } } as Request, res as unknown as Response)

  assert.equal(res.statusCode, 400)
  assert.deepEqual(res.body, { error: 'Title is required' })
})

test('createTask treats a missing request body as a missing title', (t) => {
  t.mock.method(tasksService, 'createTask', (title: string) => {
    assert.equal(title, undefined)
    throw new Error('Title is required')
  })
  const res = createMockResponse()

  createTask({ body: undefined } as Request, res as unknown as Response)

  assert.equal(res.statusCode, 400)
  assert.deepEqual(res.body, { error: 'Title is required' })
})

test('updateTaskCompletion responds 200 with the updated task for a valid toggle', (t) => {
  const updated = { id: '1', title: 'Buy milk', createdAt: '2026-01-01T00:00:00.000Z', completed: true }
  t.mock.method(tasksService, 'setTaskCompleted', () => updated)
  const res = createMockResponse()

  updateTaskCompletion({ params: { id: '1' }, body: { completed: true } } as unknown as Request, res as unknown as Response)

  assert.equal(res.statusCode, 200)
  assert.equal(res.body, updated)
})

test('updateTaskCompletion responds 404 with the contract error body for an unknown task id', (t) => {
  t.mock.method(tasksService, 'setTaskCompleted', () => {
    throw new Error('Task not found')
  })
  const res = createMockResponse()

  updateTaskCompletion({ params: { id: 'does-not-exist' }, body: { completed: true } } as unknown as Request, res as unknown as Response)

  assert.equal(res.statusCode, 404)
  assert.deepEqual(res.body, { error: 'Task not found' })
})

test('updateTaskCompletion responds 400 with the contract error body for a non-boolean completed value', (t) => {
  t.mock.method(tasksService, 'setTaskCompleted', () => {
    throw new Error('completed must be a boolean')
  })
  const res = createMockResponse()

  updateTaskCompletion({ params: { id: '1' }, body: { completed: 'true' } } as unknown as Request, res as unknown as Response)

  assert.equal(res.statusCode, 400)
  assert.deepEqual(res.body, { error: 'completed must be a boolean' })
})

test('updateTaskCompletion treats a missing request body as a missing completed value', (t) => {
  t.mock.method(tasksService, 'setTaskCompleted', (id: string, completed: boolean) => {
    assert.equal(completed, undefined)
    throw new Error('completed must be a boolean')
  })
  const res = createMockResponse()

  updateTaskCompletion({ params: { id: '1' }, body: undefined } as unknown as Request, res as unknown as Response)

  assert.equal(res.statusCode, 400)
  assert.deepEqual(res.body, { error: 'completed must be a boolean' })
})
