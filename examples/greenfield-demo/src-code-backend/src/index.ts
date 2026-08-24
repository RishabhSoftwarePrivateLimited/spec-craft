import express from 'express'
import cors from 'cors'
import tasksRouter from './routes/tasks.routes'

const app = express()

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.use('/api/tasks', tasksRouter)

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
  })
}

export default app
