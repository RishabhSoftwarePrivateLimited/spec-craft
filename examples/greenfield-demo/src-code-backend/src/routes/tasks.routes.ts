import { Router } from 'express'
import { listTasks, createTask } from '../controllers/tasks.controller'

const router = Router()

router.get('/', listTasks)
router.post('/', createTask)

export default router
