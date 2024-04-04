import { register, login, authWithGoogle, logout } from '../controllers/auth.js'
import { Router } from 'express'
const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/google-auth', authWithGoogle)
router.post('/logout', logout)

export default router
