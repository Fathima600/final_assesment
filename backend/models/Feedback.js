const mongoose = require('mongoose')

const feedbackSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
      trim: true,
    },
    courseDuration: {
      type: String,
      default: 'Not specified',
      trim: true,
    },
    feedbackComments: {
      type: String,
      required: true,
      trim: true,
    },
    feedbackRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Feedback', feedbackSchema)
