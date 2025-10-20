// frontend/src/pages/HistoryPage.jsx

import React, { useState, useEffect } from 'react';
import { getDocumentHistory } from '../api/api';
import { Link } from 'react-router-dom';

const HistoryPage = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await getDocumentHistory();
                setDocuments(response.data);
            } catch (err) {
                console.error("Failed to fetch history:", err);
                setError("Failed to load document history. Please log in and try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) return <div className="text-center text-xl mt-10">Loading history...</div>;
    if (error) return <div className="text-center text-xl mt-10 text-red-600">Error: {error}</div>;

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">📂 Your Document History</h2>
            
            {documents.length === 0 ? (
                <p className="text-gray-500 italic">You have not uploaded any documents yet.</p>
            ) : (
                <ul className="space-y-4">
                    {documents.map((doc) => (
                        <li key={doc._id} className="border-b border-gray-100 pb-4 last:border-b-0">
                            <Link 
                                to={`/document/${doc._id}`} 
                                className="block hover:bg-gray-50 p-3 rounded-lg transition duration-150"
                            >
                                <p className="text-xl font-medium text-indigo-600 hover:text-indigo-700">
                                    {doc.filename}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
                                </p>
                                <p className="text-gray-700 mt-2 line-clamp-2">
                                    Summary: {doc.summary || 'Summary pending...'}
                                </p>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default HistoryPage;