import { getAllPosts, getPost, addPost, deletePost, updatePost } from '../controllers/posts.js'
import { requireAuth } from '../middleware/auth.js'
import { Router } from 'express'

const router = Router()

router.get('/', getAllPosts)
router.get('/posts', getAllPosts)
router.get('/post/:id', getPost)
router.post('/editor', requireAuth, addPost)
router.patch('/update/:id', requireAuth, updatePost)
router.delete('/delete/:id', requireAuth, deletePost)

export default router
