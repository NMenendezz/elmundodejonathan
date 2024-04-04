import generateTokenAndSetCookie from '../utils/generateTokenAndSetCookie.js'
import { getAuth } from 'firebase-admin/auth'
import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const passwordComplexityCheck = (password) => {
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password)

  return hasUpperCase && hasLowerCase && hasSymbol
}

const registerSchema = z.object({
  firstname: z.string().min(3).max(20),
  lastname: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(8).refine(passwordComplexityCheck, {
    message:
      'password must contain at least 8 characters, one uppercase letter, one lowercase letter and one symbol'
  })
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export const register = async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body)

    const { firstname, lastname, email, password } = validatedData

    const duplicate = await User.findOne({ email }).lean().exec()

    if (duplicate) {
      return res.status(409).json({ message: 'Duplicate user' })
    }

    const hashedPwd = await bcrypt.hash(password, 10)

    const userObject = { firstname, lastname, email, password: hashedPwd }

    const user = await User.create(userObject)

    if (user) {
      res.status(201).json({ message: `new user ${firstname} created` })
    } else {
      res.status(400).json({ message: 'invalid user data received' })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0].message })
    } else {
      res.status(500).json({ message: error.message })
    }
  }
}

export const login = async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body)

    const { email, password } = validatedData

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(403).json({ error: 'email or password incorrect' })
    }

    if (user.google_auth) {
      return res.status(403).json({
        error:
          'you signed up with google, please log in with google service to access your account'
      })
    }

    const isPasswordCorrect =
      user.password && bcrypt.compareSync(password, user.password)

    if (!isPasswordCorrect || isPasswordCorrect === false) {
      return res.status(403).json({ error: 'email or password incorrect' })
    }

    const { others: data, clientToken } = generateTokenAndSetCookie(user, res)

    res.status(200).json({ message: 'you are now logged in', data, clientToken })
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0].message })
    } else {
      res.status(500).json({ message: error.message })
    }
  }
}

export const authWithGoogle = async (req, res) => {
  const { stsTokenManager } = req.body.user
  try {
    const decodedToken = await getAuth().verifyIdToken(
      stsTokenManager.accessToken
    )
    const user = await User.findOne({ email: decodedToken.email })
    if (user && !user.google_auth) {
      return res.status(403).json({
        error:
          'you signed up without google, please log in with password to access your account'
      })
    }
    if (!user) {
      const fullname = decodedToken.name.split(' ')
      const newUser = await User.create({
        firstname: fullname[0],
        lastname: fullname[1],
        email: decodedToken.email,
        google_auth: true
      })
      const { others: data, clientToken } = generateTokenAndSetCookie(newUser, res)
      return res.status(200).json({ message: 'you are now logged in', data, clientToken })
    }
    const { others: data, clientToken } = generateTokenAndSetCookie(user, res)
    return res.status(200).json({ message: 'you are now logged in', data, clientToken })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const logout = async (req, res) => {
  res.clearCookie('session')
  res.status(200).json({ message: 'you are now logged out' })
}
