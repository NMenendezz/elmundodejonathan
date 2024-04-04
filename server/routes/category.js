import { getAllCategories, newCategory } from '../controllers/category.js'
import { Router } from 'express'

const router = Router()

router.get('/', getAllCategories)
router.post('/new', newCategory)

export default router
