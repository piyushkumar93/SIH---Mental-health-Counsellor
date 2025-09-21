import { User } from '../models/user'
export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.userId) return res.status(401).json({ message: 'Unauthorized' })
  const user = await User.findById(req.userId)
  if (!user) return res.status(401).json({ message: 'User not found' })
  if (user.role !== 'admin')
    return res.status(403).json({ message: 'Admin only' })
  next()
}
declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

// Use same fallback secret as auth route so tokens signed without env var remain valid
const JWT_SECRET = process.env.JWT_SECRET || 'MentalHealthSecret'

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ message: 'No token provided' })

  // Remove Bearer prefix if present
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader

  try {
    const payload: any = jwt.verify(token, JWT_SECRET)
    // Attach userId to request for downstream use
    req.userId = payload.id
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token', error: err })
  }
}
