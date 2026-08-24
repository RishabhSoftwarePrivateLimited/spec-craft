import { test } from 'node:test'
import assert from 'node:assert/strict'
import * as tasksRepository from '../../src/repositories/tasks.repository'

test('list() returns an empty array before any task is created', () => {
  assert.deepEqual(tasksRepository.list(), [])
})

test('create() places the new item at index 0 (newest-first)', () => {
  const first = tasksRepository.create({ id: '1', title: 'First', createdAt: '2026-01-01T00:00:00.000Z' })
  const second = tasksRepository.create({ id: '2', title: 'Second', createdAt: '2026-01-02T00:00:00.000Z' })

  const all = tasksRepository.list()
  assert.equal(all[0], second)
  assert.equal(all[1], first)
})

test('list() reflects current contents after multiple creates', () => {
  const before = tasksRepository.list().length
  tasksRepository.create({ id: '3', title: 'Third', createdAt: '2026-01-03T00:00:00.000Z' })
  tasksRepository.create({ id: '4', title: 'Fourth', createdAt: '2026-01-04T00:00:00.000Z' })

  assert.equal(tasksRepository.list().length, before + 2)
  assert.equal(tasksRepository.list()[0].id, '4')
})
