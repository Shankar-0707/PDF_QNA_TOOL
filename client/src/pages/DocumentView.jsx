import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import { getDocumentDetails, askQuestion } from "../api/api";

const DocumentView = () => {
    const { docId } = useParams();
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(false);
    const [question, setQuestion] = useState('');
    const [qaLoading, setQaLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDocument = async () => {
            try{
                const response = await getDocumentDetails(docId);
                setDocument(response.data);
                setLoading(false);
            }
            catch(err){
                setError("Could not load document details.");
                setLoading(false);
            }
        };
        fetchDocument();
    }, [docId]);


    const handleQuestionSubmit = async (e) => {
        e.preventDefault();
        if(!question.trim()) return;

        setQaLoading(true);
        setError(null);

        try{
            const response = await askQuestion(docId, question.trim());
            setDocument(prev => ({ ...prev, qaHistory: response.data.history }));
            setQuestion('');
        }
        catch (err) {
            setError("Failed to get an answer. Please try again.");
        } finally {
            setQaLoading(false);
        }
    }

    if (loading) return <div className="text-center text-xl mt-10">Loading document...</div>;
    if (error) return <div className="text-center text-xl mt-10 text-red-600">Error: {error}</div>;
    if (!document) return <div className="text-center text-xl mt-10 text-gray-500">Document not found.</div>;


    return (
        <div className="space-y-8">
            <header className="bg-white p-6 shadow-lg rounded-lg">
                <h2 className="text-3xl font-bold text-gray-900">{document.filename}</h2>
                <p className="text-sm text-gray-500 mt-1">Uploaded: {new Date(document.createdAt).toLocaleDateString()}</p>
            </header>
            
            <section className="bg-white p-6 shadow-lg rounded-lg">
                <h3 className="text-2xl font-semibold text-indigo-600 mb-4 flex items-center">
                    <span className="mr-2">📝</span> AI Summary
                </h3>
                <div className="bg-gray-50 p-4 border border-gray-200 rounded-md whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {document.summary || "Summary generation pending..."}
                </div>
            </section>
            
            <section className="bg-white p-6 shadow-lg rounded-lg">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="mr-2">❓</span> Ask a Question (RAG-lite)
                </h3>
                <form onSubmit={handleQuestionSubmit} className="flex gap-3">
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Ask anything about the document..."
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                        disabled={qaLoading}
                    />
                    <button 
                        type="submit" 
                        disabled={!question.trim() || qaLoading}
                        className="px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:bg-indigo-400"
                    >
                        {qaLoading ? 'Answering...' : 'Ask'}
                    </button>
                </form>
            </section>

            <section className="bg-white p-6 shadow-lg rounded-lg">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="mr-2">📜</span> Q&A History
                </h3>
                <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
                    {document.qaHistory && document.qaHistory.slice().reverse().map((qa, index) => (
                        <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                            <p className="text-indigo-600 font-semibold mb-1">Q: {qa.question}</p>
                            <p className="text-gray-700 bg-gray-50 p-3 rounded-md">A: {qa.answer}</p>
                        </div>
                    ))}
                    {(!document.qaHistory || document.qaHistory.length === 0) && <p className="text-gray-500 italic">No questions asked yet.</p>}
                </div>
            </section>
        </div>
    );
}

export default DocumentView;