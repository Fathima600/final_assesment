const express = require('express')
const mongoose = require('mongoose')
const rateLimit = require('express-rate-limit')

const Feedback = require('../models/Feedback')

const router = express.Router()
const feedbackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
})

router.use(feedbackLimiter)

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id)
}

function createValidationError(message) {
  const error = new Error(message)
  error.statusCode = 400
  return error
}

function parseFeedbackPayload(body) {
  const courseName =
    typeof body.courseName === 'string' ? body.courseName.trim() : ''
  const feedbackComments =
    typeof body.feedbackComments === 'string' ? body.feedbackComments.trim() : ''
  const feedbackRating = Number(body.feedbackRating)

  if (!courseName) {
    throw createValidationError('Course name is required')
  }

  if (!feedbackComments) {
    throw createValidationError('Feedback comments are required')
  }

  if (!Number.isFinite(feedbackRating) || feedbackRating < 1 || feedbackRating > 5) {
    throw createValidationError('Feedback rating must be between 1 and 5')
  }

  return { courseName, feedbackComments, feedbackRating }
}

router.get('/', async (_req, res, next) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 })
    res.json(feedbacks)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid feedback id' })
    }

    const feedback = await Feedback.findById(req.params.id)
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' })
    }

    return res.json(feedback)
  } catch (error) {
    return next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const payload = parseFeedbackPayload(req.body)

    const feedback = await Feedback.create(payload)

    res.status(201).json(feedback)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid feedback id' })
    }

    const payload = parseFeedbackPayload(req.body)

    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    )

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' })
    }

    return res.json(feedback)
  } catch (error) {
    return next(error)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid feedback id' })
    }

    const feedback = await Feedback.findByIdAndDelete(req.params.id)

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' })
    }

    return res.json({ message: 'Feedback deleted successfully' })
  } catch (error) {
    return next(error)
  }
})

module.exports = router
