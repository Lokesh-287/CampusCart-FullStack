import React, { useState, useEffect, useContext } from 'react';
import { getStudentProfile } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import './ProfilePage.css'; // We'll create this CSS file next

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext); // Get user context if needed

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return; // Make sure user is logged in
            try {
                const response = await getStudentProfile();
                setProfile(response.data);
            } catch (err) {
                setError('Failed to fetch profile details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user]); // Re-run if user context changes

    if (loading) return <p>Loading profile...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (!profile) return <p>Could not load profile information.</p>; // Handle case where profile is null

    return (
        <div className="profile-container">
            <h1>Your Profile</h1>
            <div className="profile-details">
                <p><strong>Student ID:</strong> {profile.username}</p>
                <p><strong>Full Name:</strong> {profile.fullName}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Department:</strong> {profile.department || 'N/A'}</p>
                <p><strong>Phone Number:</strong> {profile.phoneNumber || 'N/A'}</p>
                <p><strong>Wallet Balance:</strong> <span className="wallet-balance">₹{profile.walletBalance.toFixed(2)}</span></p>
            </div>
            {/* You could add an "Edit Profile" button here later */}
        </div>
    );
};

export default ProfilePage;