import { test } from 'node:test'
import assert from 'node:assert/strict'
import supertest from 'supertest'
import app from '../../src/index'

test('GET /api/tasks responds 200 with [] when no tasks exist', async () => {
  const res = await supertest(app).get('/api/tasks')

  assert.equal(res.status, 200)
  assert.deepEqual(res.body, [])
})

test('POST /api/tasks responds 400 with the contract error body for a whitespace-only title', async () => {
  const res = await supertest(app).post('/api/tasks').send({ title: '   ' })

  assert.equal(res.status, 400)
  assert.deepEqual(res.body, { error: 'Title is required' })
})

test('POST /api/tasks responds 400 with the contract error body for an empty-string title', async () => {
  const res = await supertest(app).post('/api/tasks').send({ title: '' })

  assert.equal(res.status, 400)
  assert.deepEqual(res.body, { error: 'Title is required' })
})

test('POST /api/tasks responds 400 with the contract error body when the title field is missing entirely', async () => {
  const res = await supertest(app).post('/api/tasks').send({})

  assert.equal(res.status, 400)
  assert.deepEqual(res.body, { error: 'Title is required' })
})

test('POST /api/tasks with a malformed JSON body falls through to Express default body-parser error handling', async () => {
  const res = await supertest(app)
    .post('/api/tasks')
    .set('Content-Type', 'application/json')
    .send('{"title": invalid')

  assert.equal(res.status, 400)
  assert.notDeepEqual(res.body, { error: 'Title is required' })
})

test('POST /api/tasks responds 201 with the created task for a valid title', async () => {
  const res = await supertest(app).post('/api/tasks').send({ title: 'Buy milk' })

  assert.equal(res.status, 201)
  assert.equal(res.body.title, 'Buy milk')
  assert.equal(typeof res.body.id, 'string')
  assert.equal(typeof res.body.createdAt, 'string')
})

test('GET /api/tasks reflects newly created tasks, newest first, over the real HTTP + service + repository stack', async () => {
  const first = await supertest(app).post('/api/tasks').send({ title: 'First task' })
  const second = await supertest(app).post('/api/tasks').send({ title: 'Second task' })

  const res = await supertest(app).get('/api/tasks')

  assert.equal(res.status, 200)
  const ids = res.body.map((task: { id: string }) => task.id)
  const secondIndex = ids.indexOf(second.body.id)
  const firstIndex = ids.indexOf(first.body.id)
  assert.ok(secondIndex !== -1 && firstIndex !== -1)
  assert.ok(secondIndex < firstIndex, 'more recently created task must appear before the earlier one')
})

test('POST /api/tasks responds 201 with completed: false by default', async () => {
  const res = await supertest(app).post('/api/tasks').send({ title: 'New task' })

  assert.equal(res.status, 201)
  assert.equal(res.body.completed, false)
})

test('PATCH /api/tasks/:id responds 200 and marks a task complete', async () => {
  const created = await supertest(app).post('/api/tasks').send({ title: 'Mark me complete' })

  const res = await supertest(app).patch(`/api/tasks/${created.body.id}`).send({ completed: true })

  assert.equal(res.status, 200)
  assert.equal(res.body.id, created.body.id)
  assert.equal(res.body.title, 'Mark me complete')
  assert.equal(res.body.completed, true)
})

test('PATCH /api/tasks/:id responds 200 and marks a completed task back as incomplete', async () => {
  const created = await supertest(app).post('/api/tasks').send({ title: 'Toggle both ways' })
  await supertest(app).patch(`/api/tasks/${created.body.id}`).send({ completed: true })

  const res = await supertest(app).patch(`/api/tasks/${created.body.id}`).send({ completed: false })

  assert.equal(res.status, 200)
  assert.equal(res.body.completed, false)
})

test('PATCH /api/tasks/:id responds 404 with the contract error body for an unknown task id', async () => {
  const res = await supertest(app).patch('/api/tasks/does-not-exist').send({ completed: true })

  assert.equal(res.status, 404)
  assert.deepEqual(res.body, { error: 'Task not found' })
})

test('PATCH /api/tasks/:id responds 400 with the contract error body for a non-boolean completed value', async () => {
  const created = await supertest(app).post('/api/tasks').send({ title: 'Bad payload' })

  const res = await supertest(app).patch(`/api/tasks/${created.body.id}`).send({ completed: 'yes' })

  assert.equal(res.status, 400)
  assert.deepEqual(res.body, { error: 'completed must be a boolean' })
})

test('PATCH /api/tasks/:id does not change the task\'s position in GET /api/tasks', async () => {
  const before = await supertest(app).get('/api/tasks')
  const idsBefore = before.body.map((task: { id: string }) => task.id)

  await supertest(app).patch(`/api/tasks/${idsBefore[idsBefore.length - 1]}`).send({ completed: true })

  const after = await supertest(app).get('/api/tasks')
  const idsAfter = after.body.map((task: { id: string }) => task.id)

  assert.deepEqual(idsAfter, idsBefore)
})
