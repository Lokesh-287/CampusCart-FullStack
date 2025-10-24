import React, { useState } from 'react';
import { submitQuery } from '../services/api';
import './ContactUsPage.css'; // We'll create this

const ContactUsPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setResponseMessage('');
        setError('');

        try {
            const response = await submitQuery(name, email, message);
            setResponseMessage(response.data || 'Query submitted successfully!'); // Use backend message if available
            // Clear form
            setName('');
            setEmail('');
            setMessage('');
        } catch (err) {
            setError('Failed to submit query. Please try again.');
            console.error('Query submission error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="contact-us-container">
            <h1>Contact Us</h1>
            <p>Have questions? Fill out the form below and we'll get back to you.</p>
            <form onSubmit={handleSubmit} className="contact-form">
                {responseMessage && <p className="success-message">{responseMessage}</p>}
                {error && <p className="error-message">{error}</p>}
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isSubmitting}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isSubmitting}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows="5"
                        required
                        disabled={isSubmitting}
                    />
                </div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
            </form>
        </div>
    );
};

export default ContactUsPage;