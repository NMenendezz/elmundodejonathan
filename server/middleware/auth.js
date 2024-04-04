import User from '../models/User.js'
import verify from 'jsonwebtoken'

export const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies.session

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const decoded = verify(token, process.env.JWT_SERVER)

    const user = await User.findById(decoded.userId).select('-password')

    req.user = user

    next()
  } catch (error) {
    console.error('Error:', error.message)
    res.status(500).json({ error: 'Internal server error' })
  }
}
