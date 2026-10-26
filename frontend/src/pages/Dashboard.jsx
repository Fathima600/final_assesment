import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

function Dashboard() {
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const fetchFeedbacks = useCallback(async () => {
    try {
      const { data } = await api.get('/feedbacks')
      setFeedbacks(data)
      setError('')
    } catch {
      setError('Unable to load feedback data. Please check backend and MongoDB connection.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFeedbacks()
  }, [fetchFeedbacks])

  async function handleDelete(id) {
    const shouldDelete = window.confirm('Delete this feedback?')
    if (!shouldDelete) return

    try {
      await api.delete(`/feedbacks/${id}`)
      setFeedbacks((current) => current.filter((item) => item._id !== id))
    } catch {
      setError('Delete failed. Please try again.')
    }
  }

  if (loading) {
    return <p className="status-message">Loading feedbacks...</p>
  }

  return (
    <section>
      <h2 className="page-title">Feedback Dashboard</h2>
      {error && <p className="status-message error">{error}</p>}

      {feedbacks.length === 0 ? (
        <p className="status-message">No feedback available yet. Use Add Feedback to create one.</p>
      ) : (
        <div className="table-wrapper">
          <table className="feedback-table">
            <thead>
              <tr>
                <th>Course ID</th>
                <th>Course Name</th>
                <th>Course Duration</th>
                <th>Overall Feedback Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((feedback) => (
                <tr key={feedback._id}>
                  <td data-label="Course ID">{feedback._id.slice(-6).toUpperCase()}</td>
                  <td data-label="Course Name">{feedback.courseName}</td>
                  <td data-label="Course Duration">{feedback.courseDuration || 'Not specified'}</td>
                  <td data-label="Overall Feedback Rating">{feedback.feedbackRating} / 5</td>
                  <td data-label="Actions" className="action-cell">
                    <button type="button" onClick={() => navigate(`/edit-feedback/${feedback._id}`)}>
                      Update
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => handleDelete(feedback._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default Dashboard
