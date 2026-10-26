import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api'

const initialForm = {
  courseName: '',
  feedbackComments: '',
  feedbackRating: 5,
}

function FeedbackForm() {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { id } = useParams()
  const navigate = useNavigate()

  const isEditMode = useMemo(() => Boolean(id), [id])

  useEffect(() => {
    async function loadFeedback() {
      if (!id) return
      try {
        const { data } = await api.get(`/feedbacks/${id}`)
        setForm({
          courseName: data.courseName,
          feedbackComments: data.feedbackComments,
          feedbackRating: data.feedbackRating,
        })
      } catch {
        setError('Unable to load feedback for editing.')
      }
    }

    loadFeedback()
  }, [id])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: name === 'feedbackRating' ? Number(value) : value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      if (isEditMode) {
        await api.put(`/feedbacks/${id}`, form)
      } else {
        await api.post('/feedbacks', form)
      }
      navigate('/')
    } catch {
      setError('Unable to save feedback. Check your input and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section>
      <h2 className="page-title">{isEditMode ? 'Update Feedback' : 'Add Feedback'}</h2>
      <form className="feedback-form" onSubmit={handleSubmit}>
        <label htmlFor="courseName">Course Name</label>
        <input
          id="courseName"
          name="courseName"
          value={form.courseName}
          onChange={handleChange}
          required
          maxLength={120}
        />

        <label htmlFor="feedbackComments">Feedback Comments</label>
        <textarea
          id="feedbackComments"
          name="feedbackComments"
          value={form.feedbackComments}
          onChange={handleChange}
          required
          rows={5}
          maxLength={1000}
        />

        <label htmlFor="feedbackRating">Feedback Rating</label>
        <input
          id="feedbackRating"
          name="feedbackRating"
          type="number"
          min={1}
          max={5}
          value={form.feedbackRating}
          onChange={handleChange}
          required
        />

        {error && <p className="status-message error">{error}</p>}

        <div className="form-actions">
          <button type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : isEditMode ? 'Update Feedback' : 'Submit Feedback'}
          </button>
          <button type="button" className="secondary" onClick={() => navigate('/')}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  )
}

export default FeedbackForm
