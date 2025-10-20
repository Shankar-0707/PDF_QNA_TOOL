import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { uploadDocument } from "../api/api";

const UploadPage = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setError(null);
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if(!file){
            setError("Please select a PDF file to Upload");
            return;
        }

        setLoading(true);
        setError(null);
        try{
            const response = await uploadDocument(file);
            // Navigate to the document view upon successful upload
            navigate(`/document/${response.data.id}`);
        }
        catch (err) {
            console.error(err);
            setError("Upload failed. Please try again. (Is the server running?)");
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl mx-auto">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Upload a PDF Document</h2>
            
            <form onSubmit={handleUpload} className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Select Document (.pdf)</label>
                <input 
                    type="file" 
                    accept=".pdf" 
                    onChange={handleFileChange} 
                    disabled={loading}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                
                <button 
                    type="submit" 
                    disabled={!file || loading} 
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out disabled:bg-green-400"
                >
                    {loading ? 'Processing Document...' : 'Upload & Summarize'}
                </button>
            </form>
            
            {error && <p className="mt-4 text-sm text-red-600 p-3 bg-red-50 rounded">{error}</p>}
            {loading && <p className="mt-4 text-sm text-indigo-600 p-3 bg-indigo-50 rounded">
                This may take a moment while the AI generates the summary...
            </p>}
        </div>
    );
}

export default UploadPage;