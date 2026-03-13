import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import interviewRoutes from './routes/interviewRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'

const app = express()
const PORT = process.env.PORT || 5000

// Connect to MongoDB
connectDB()

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/interview', interviewRoutes)
app.use('/api/v1/payments', paymentRoutes)

// Health check
app.get('/', (_req, res) => res.json({ message: '🚀 IntelliHire API is running' }))

// Error Handler Middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
    res.status(statusCode).json({
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
})

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`))
