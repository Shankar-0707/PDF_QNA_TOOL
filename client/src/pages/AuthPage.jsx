// client/src/pages/AuthPage.jsx
import React, { useState } from 'react';
import { loginUser, signupUser, setAuthHeader } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const AuthPage = ({ type }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const { dispatch } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            let response;
            if (type === 'login') {
                response = await loginUser(email, password);
            } else {
                response = await signupUser(email, password);
            }

            const userData = response.data;
            
            // 1. Update Context
            dispatch({ type: 'LOGIN', payload: userData });

            // 2. Set Auth Header for API calls
            setAuthHeader(userData.token);
            
            // 3. Redirect to the protected document section
            navigate('/documents');

        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || 'Authentication failed.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-white shadow-xl rounded-lg border border-gray-100">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
                {type === 'login' ? 'Sign in to your account' : 'Create a new account'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email address</label>
                    <input 
                        id="email"
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="you@example.com"
                        disabled={loading}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
                    <input 
                        id="password"
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Password"
                        disabled={loading}
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:bg-indigo-400"
                >
                    {loading ? (type === 'login' ? 'Signing In...' : 'Registering...') : (type === 'login' ? 'Log In' : 'Sign Up')}
                </button>
            </form>
            {error && <p className="mt-4 text-sm text-red-600 text-center">{error}</p>}
            <p className="mt-6 text-center text-sm text-gray-600">
                {type === 'login' 
                    ? <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">Need an account? Sign Up</Link>
                    : <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Already have an account? Log In</Link>
                }
            </p>
        </div>
    );
};

export default AuthPage;