import { test } from 'node:test'
import assert from 'node:assert/strict'
import * as tasksRepository from '../../src/repositories/tasks.repository'

test('list() returns an empty array before any task is created', () => {
  assert.deepEqual(tasksRepository.list(), [])
})

test('create() places the new item at index 0 (newest-first)', () => {
  const first = tasksRepository.create({ id: '1', title: 'First', createdAt: '2026-01-01T00:00:00.000Z', completed: false })
  const second = tasksRepository.create({ id: '2', title: 'Second', createdAt: '2026-01-02T00:00:00.000Z', completed: false })

  const all = tasksRepository.list()
  assert.equal(all[0], second)
  assert.equal(all[1], first)
})

test('list() reflects current contents after multiple creates', () => {
  const before = tasksRepository.list().length
  tasksRepository.create({ id: '3', title: 'Third', createdAt: '2026-01-03T00:00:00.000Z', completed: false })
  tasksRepository.create({ id: '4', title: 'Fourth', createdAt: '2026-01-04T00:00:00.000Z', completed: false })

  assert.equal(tasksRepository.list().length, before + 2)
  assert.equal(tasksRepository.list()[0].id, '4')
})

test('setCompleted(id, true) updates only that task\'s completed field and returns it', () => {
  const task = tasksRepository.create({ id: '5', title: 'Fifth', createdAt: '2026-01-05T00:00:00.000Z', completed: false })

  const updated = tasksRepository.setCompleted('5', true)

  assert.equal(updated, task)
  assert.equal(updated?.completed, true)
  assert.equal(updated?.title, 'Fifth')
})

test('setCompleted(id, false) flips a completed task back to incomplete', () => {
  tasksRepository.create({ id: '6', title: 'Sixth', createdAt: '2026-01-06T00:00:00.000Z', completed: false })
  tasksRepository.setCompleted('6', true)

  const updated = tasksRepository.setCompleted('6', false)

  assert.equal(updated?.completed, false)
})

test('setCompleted() does not change the array order or any other task', () => {
  const before = tasksRepository.list().map((t) => t.id)

  tasksRepository.setCompleted(before[before.length - 1], true)

  const after = tasksRepository.list().map((t) => t.id)
  assert.deepEqual(after, before)
})

test('setCompleted() returns undefined for an id that does not exist', () => {
  const result = tasksRepository.setCompleted('does-not-exist', true)
  assert.equal(result, undefined)
})
