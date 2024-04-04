import jwt from 'jsonwebtoken'

const generateTokenAndSetCookie = (user, res) => {
  const { password, ...others } = user._doc
  const token = jwt.sign({ others }, process.env.JWT_SERVER, {
    expiresIn: '7d'
  })
  const clientToken = jwt.sign({ others }, process.env.JWT_CLIENT, {
    expiresIn: '7d'
  })

  res.cookie('jwt', token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: 'strict'
  })

  return { token, others, clientToken }
}

export default generateTokenAndSetCookie
