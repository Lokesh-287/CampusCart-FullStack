import React, { useState, useEffect } from 'react';
import { getAllStudentsAdmin, updateStudentAdmin } from '../../services/api';
import './AdminPages.css';

// Simple Modal Component
const Modal = ({ show, onClose, children }) => {
    if (!show) return null;
    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                {children}
                <button onClick={onClose} className="modal-close-btn">Close</button>
            </div>
        </div>
    );
};

const AdminViewStudentsPage = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentStudent, setCurrentStudent] = useState(null);
    const [formError, setFormError] = useState('');

    const fetchStudents = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getAllStudentsAdmin();
            const studentList = Array.isArray(response.data)
                ? response.data.filter(user => user.roles.some(role => role.name === 'ROLE_STUDENT'))
                : [];
            setStudents(studentList);
        } catch (err) {
            setError('Failed to fetch students.');
            console.error('Fetch students error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleEditClick = (student) => {
        setCurrentStudent({ ...student });
        setIsEditing(true);
        setFormError('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentStudent(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        if (!currentStudent || currentStudent.walletBalance < 0) {
            setFormError('Wallet balance cannot be negative.');
            return;
        }

        const studentData = {
            fullName: currentStudent.fullName,
            email: currentStudent.email,
            department: currentStudent.department,
            phoneNumber: currentStudent.phoneNumber,
            walletBalance: parseFloat(currentStudent.walletBalance),
        };

        try {
            await updateStudentAdmin(currentStudent.id, studentData);
            setIsEditing(false); // Close modal
            fetchStudents(); // Refresh list
        } catch (err) {
            const errMsg = err.response?.data?.message || 'Failed to update student.';
            setFormError(errMsg);
            console.error('Student update error:', err);
        }
    };

    if (loading) return <p>Loading students...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="admin-page-container">
            <h1>View & Update Students</h1>
            {students.length > 0 ? (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Balance</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.id}>
                                <td>{student.id}</td>
                                <td>{student.username}</td>
                                <td>{student.fullName}</td>
                                <td>{student.email}</td>
                                <td>{student.department || 'N/A'}</td>
                                <td>₹{student.walletBalance.toFixed(2)}</td>
                                <td>
                                    <button className="action-btn edit-btn" onClick={() => handleEditClick(student)}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No students found.</p>
            )}

            {/* Edit Student Modal */}
            <Modal show={isEditing} onClose={() => setIsEditing(false)}>
                {currentStudent && (
                    <form onSubmit={handleUpdateSubmit} className="admin-form">
                        <h2>Edit Student: {currentStudent.username}</h2>
                        {formError && <p className="error-message">{formError}</p>}
                        <div className="form-group">
                            <label htmlFor="editFullName">Full Name</label>
                            <input type="text" id="editFullName" name="fullName" value={currentStudent.fullName} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="editEmail">Email</label>
                            <input type="email" id="editEmail" name="email" value={currentStudent.email} onChange={handleInputChange} required />
                        </div>
                         <div className="form-group">
                            <label htmlFor="editDepartment">Department</label>
                            <input type="text" id="editDepartment" name="department" value={currentStudent.department || ''} onChange={handleInputChange} />
                        </div>
                         <div className="form-group">
                            <label htmlFor="editPhoneNumber">Phone Number</label>
                            <input type="text" id="editPhoneNumber" name="phoneNumber" value={currentStudent.phoneNumber || ''} onChange={handleInputChange} />
                        </div>
                         <div className="form-group">
                            <label htmlFor="editWalletBalance">Wallet Balance (₹)</label>
                            <input type="number" id="editWalletBalance" name="walletBalance" value={currentStudent.walletBalance} onChange={handleInputChange} required min="0" step="0.01" />
                        </div>
                        <div className="form-actions">
                             <button type="submit">Update Student</button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default AdminViewStudentsPage;