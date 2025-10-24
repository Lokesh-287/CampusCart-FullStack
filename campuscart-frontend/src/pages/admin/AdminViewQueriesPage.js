import React, { useState, useEffect } from 'react';
import { getAllQueriesAdmin } from '../../services/api';
import './AdminPages.css';

const AdminViewQueriesPage = () => {
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchQueries = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await getAllQueriesAdmin();
                const fetchedQueries = Array.isArray(response.data) ? response.data : [];
                const sortedQueries = fetchedQueries.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
                setQueries(sortedQueries);
            } catch (err) {
                setError('Failed to fetch queries.');
                console.error('Fetch queries error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchQueries();
    }, []);

    if (loading) return <p>Loading queries...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="admin-page-container">
            <h1>View Contact Queries</h1>
            {queries.length > 0 ? (
                <div className="query-list">
                    {queries.map((query) => (
                        <div key={query.id} className="query-item">
                            <div className="query-header">
                                <span><strong>From:</strong> {query.name || 'N/A'} ({query.email || 'N/A'})</span>
                                <span><strong>Date:</strong> {query.submittedAt ? new Date(query.submittedAt).toLocaleString() : 'N/A'}</span>
                            </div>
                            <p className="query-message">{query.message}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No queries submitted yet.</p>
            )}
        </div>
    );
};

export default AdminViewQueriesPage;