import React, { useState } from 'react';
import { addStudent } from '../../services/api';
import './AdminPages.css'; // Shared CSS for admin pages

const AdminAddStudentPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [department, setDepartment] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');
        setError('');

        const studentData = { username, password, fullName, email, department, phoneNumber };

        try {
            await addStudent(studentData);
            setMessage('Student registered successfully!');
            // Clear form
            setUsername('');
            setPassword('');
            setFullName('');
            setEmail('');
            setDepartment('');
            setPhoneNumber('');
        } catch (err) {
            // Check if backend sent specific error message
            const errorMessage = err.response?.data?.message || err.response?.data || 'Failed to register student.';
            setError(errorMessage);
            console.error('Student registration error:', err.response || err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="admin-page-container">
            <h1>Add New Student</h1>
            <form onSubmit={handleSubmit} className="admin-form">
                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}

                <div className="form-group">
                    <label htmlFor="username">Student ID (Username)</label>
                    <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required disabled={isSubmitting} />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isSubmitting} />
                </div>
                <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required disabled={isSubmitting} />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isSubmitting} />
                </div>
                <div className="form-group">
                    <label htmlFor="department">Department</label>
                    <input type="text" id="department" value={department} onChange={(e) => setDepartment(e.target.value)} disabled={isSubmitting} />
                </div>
                <div className="form-group">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input type="text" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} disabled={isSubmitting} />
                </div>

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Registering...' : 'Register Student'}
                </button>
            </form>
        </div>
    );
};

export default AdminAddStudentPage;