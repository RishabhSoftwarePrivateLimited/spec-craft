import { Router } from 'express'
import { listTasks, createTask, updateTaskCompletion } from '../controllers/tasks.controller'

const router = Router()

router.get('/', listTasks)
router.post('/', createTask)
router.patch('/:id', updateTaskCompletion)

export default router
