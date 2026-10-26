const express = require('express')
const mongoose = require('mongoose')

const Feedback = require('../models/Feedback')

const router = express.Router()

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id)
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
    const { courseName, feedbackComments, feedbackRating } = req.body

    const feedback = await Feedback.create({
      courseName,
      feedbackComments,
      feedbackRating,
    })

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

    const { courseName, feedbackComments, feedbackRating } = req.body

    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      {
        courseName,
        feedbackComments,
        feedbackRating,
      },
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
