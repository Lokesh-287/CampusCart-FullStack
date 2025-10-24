import React, { useState } from 'react';
import { submitFeedback } from '../services/api';
import './FeedbackForm.css'; // We'll create this

const FeedbackForm = ({ productId }) => {
    const [comment, setComment] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) {
            setError('Feedback cannot be empty.');
            return;
        }
        setIsSubmitting(true);
        setMessage('');
        setError('');

        try {
            await submitFeedback(productId, comment);
            setMessage('Feedback submitted successfully!');
            setComment(''); // Clear the textarea
        } catch (err) {
            setError('Failed to submit feedback. Please try again.');
            console.error('Feedback submission error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="feedback-form">
            <h3>Leave Feedback</h3>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your feedback here..."
                rows="4"
                required
                disabled={isSubmitting}
            />
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
        </form>
    );
};

export default FeedbackForm;