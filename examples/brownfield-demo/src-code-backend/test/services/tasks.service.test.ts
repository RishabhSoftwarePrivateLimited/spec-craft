import { test } from 'node:test'
import assert from 'node:assert/strict'
import * as tasksRepository from '../../src/repositories/tasks.repository'
import { createTask, listTasks, setTaskCompleted } from '../../src/services/tasks.service'

test('createTask rejects an empty title without calling the repository', (t) => {
  const createSpy = t.mock.method(tasksRepository, 'create')

  assert.throws(() => createTask(''), /Title is required/)
  assert.equal(createSpy.mock.callCount(), 0)
})

test('createTask rejects a whitespace-only title without calling the repository', (t) => {
  const createSpy = t.mock.method(tasksRepository, 'create')

  assert.throws(() => createTask('   '), /Title is required/)
  assert.equal(createSpy.mock.callCount(), 0)
})

test('createTask rejects a missing title (undefined) the same as empty', (t) => {
  const createSpy = t.mock.method(tasksRepository, 'create')

  assert.throws(() => createTask(undefined as unknown as string), /Title is required/)
  assert.equal(createSpy.mock.callCount(), 0)
})

test('createTask assigns id + createdAt and delegates to the repository exactly once', (t) => {
  const createSpy = t.mock.method(tasksRepository, 'create')

  const task = createTask('Buy milk')

  assert.equal(createSpy.mock.callCount(), 1)
  assert.equal(task.title, 'Buy milk')
  assert.equal(typeof task.id, 'string')
  assert.ok(task.id.length > 0)
  assert.equal(typeof task.createdAt, 'string')
  assert.ok(!Number.isNaN(Date.parse(task.createdAt)))
})

test('createTask defaults completed to false on a new task', (t) => {
  t.mock.method(tasksRepository, 'create')

  const task = createTask('New task')

  assert.equal(task.completed, false)
})

test('createTask trims the title before storing', (t) => {
  t.mock.method(tasksRepository, 'create')

  const task = createTask('  Walk the dog  ')

  assert.equal(task.title, 'Walk the dog')
})

test('createTask calls the repository exactly once per valid call, even across repeated calls', (t) => {
  const createSpy = t.mock.method(tasksRepository, 'create')

  createTask('One')
  createTask('Two')

  assert.equal(createSpy.mock.callCount(), 2)
})

test('listTasks delegates to the repository', (t) => {
  const listSpy = t.mock.method(tasksRepository, 'list')

  const tasks = listTasks()

  assert.equal(listSpy.mock.callCount(), 1)
  assert.ok(Array.isArray(tasks))
})

test('setTaskCompleted rejects a non-boolean completed value without calling the repository', (t) => {
  const setCompletedSpy = t.mock.method(tasksRepository, 'setCompleted')

  assert.throws(() => setTaskCompleted('1', 'true' as unknown as boolean), /completed must be a boolean/)
  assert.equal(setCompletedSpy.mock.callCount(), 0)
})

test('setTaskCompleted rejects an unknown task id', (t) => {
  t.mock.method(tasksRepository, 'setCompleted', () => undefined)

  assert.throws(() => setTaskCompleted('does-not-exist', true), /Task not found/)
})

test('setTaskCompleted delegates to the repository exactly once for a valid call and returns the updated task', (t) => {
  const updated = { id: '1', title: 'Buy milk', createdAt: '2026-01-01T00:00:00.000Z', completed: true }
  const setCompletedSpy = t.mock.method(tasksRepository, 'setCompleted', () => updated)

  const task = setTaskCompleted('1', true)

  assert.equal(setCompletedSpy.mock.callCount(), 1)
  assert.equal(task, updated)
})
