import React, { useState, useEffect } from 'react';
import { getAllFeedbackAdmin } from '../../services/api';
import './AdminPages.css';

const AdminViewFeedbackPage = () => {
    const [feedbackList, setFeedbackList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFeedback = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await getAllFeedbackAdmin();
                const fetchedFeedback = Array.isArray(response.data) ? response.data : [];
                const sortedFeedback = fetchedFeedback.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setFeedbackList(sortedFeedback);
            } catch (err) {
                setError('Failed to fetch feedback.');
                console.error('Fetch feedback error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchFeedback();
    }, []);

    if (loading) return <p>Loading feedback...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="admin-page-container">
            <h1>View Feedback</h1>
            {feedbackList.length > 0 ? (
                <div className="feedback-list">
                    {feedbackList.map((feedback) => (
                        <div key={feedback.id} className="feedback-item">
                            <div className="feedback-header">
                                <span><strong>Product:</strong> {feedback.product?.name || 'N/A'} (ID: {feedback.product?.id || 'N/A'})</span>
                                <span><strong>Student:</strong> {feedback.user?.username || 'N/A'}</span>
                                <span><strong>Date:</strong> {feedback.createdAt ? new Date(feedback.createdAt).toLocaleString() : 'N/A'}</span>
                            </div>
                            <p className="feedback-comment">{feedback.comment}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No feedback submitted yet.</p>
            )}
        </div>
    );
};

export default AdminViewFeedbackPage;