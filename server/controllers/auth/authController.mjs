import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../../models/User.js'

import dotenv from 'dotenv'
import e from 'express'

dotenv.config()

//register
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body

  try {
    const checkUser = await User.findOne({ email })
    if (checkUser)
      return res.json({ success: false, message: 'User Already exists with the same email! Please try again ' })
    const hashPassword = await bcrypt.hash(password, 12)
    const newUser = new User({
      userName,
      email,
      password: hashPassword
    })

    await newUser.save()
    res.status(200).json({ success: true, message: 'Registration successfull' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

//login

const loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    const checkUser = await User.findOne({ email })
    if (!checkUser) return res.json({ success: false, message: 'User not found! Please register first' })

    const checkPasswordMatch = await bcrypt.compare(password, checkUser.password)
    if (!checkPasswordMatch) return res.json({ success: false, message: 'Incorrect password! Please try again' })

    const token = jwt.sign(
      { id: checkUser._id, role: checkUser.role, email: checkUser.email, userName: checkUser.userName },
      process.env.JWT_SECRET,
      { expiresIn: '60m' }
    )

    res.cookie('token', token, { httpOnly: true, secure: false }).json({
      success: true,
      message: 'Logged in successfull',
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        userName: checkUser.userName
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

//logout

const logoutUser = async (req, res) => {
  res.clearCookie('token').json({ success: true, message: 'Logged out successfully!' })
}

//auth middleware
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ success: false, message: 'Unauthorized user!' })
      req.user = decoded
      next()
    })
  } else {
    res.status(401).json({ success: false, message: 'Unauthorized user!' })
  }
}

export { registerUser, loginUser, logoutUser, authMiddleware }
