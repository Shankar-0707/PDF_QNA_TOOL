// client/src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import UploadPage from './pages/UploadPage';
import DocumentView from './pages/DocumentView';
import AuthPage from './pages/AuthPage';
import { setAuthHeader } from './api/api';
import HistoryPage from './pages/HistoryPage';
import { logoutUser } from './api/api';

// ✅ Logout component using useEffect to avoid React warning
// client/src/App.jsx (Updated Logout Component)
const Logout = () => {
    const { dispatch } = useAuth();
    const navigate = useNavigate();
    
    useEffect(() => {
        const performLogout = async () => {
            try {
                // 1. Ask the server to clear the httpOnly cookie
                await logoutUser(); 
            } catch (error) {
                // Log the failure, but proceed to clear local state and navigate regardless.
                // The most important thing is getting the user off the protected route.
                console.error("Logout API failed. Clearing local state.", error);
            }
            
            // 2. Clear local state (always)
            dispatch({ type: 'LOGOUT' });
            setAuthHeader(null); 
            
            // 3. Navigate (always)
            navigate('/login', { replace: true });
        };
        
        performLogout();
        
    }, [dispatch, navigate]);

    // Return a temporary message while the async logout runs
    return <div>Logging out...</div>;
};

// ✅ Navigation Bar
const NavBar = () => {
    const { user } = useAuth();

    return (
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-indigo-600">PDF Tool 📚</h1>
            <nav className="space-x-4">
                {user ? (
                    <>
                        <span className="text-gray-600 hidden sm:inline">Welcome, {user.email}</span>
                        <Link to="/documents" className="text-indigo-600 hover:text-indigo-800">Documents</Link>
                        <Link to="/history" className='text-indigo-600 hover:text-indigo-800'>History</Link>
                        <Link to="/logout" className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">Logout</Link>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-indigo-600 hover:text-indigo-800">Login</Link>
                        <Link to="/signup" className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">Sign Up</Link>
                    </>
                )}
            </nav>
        </header>
    );
};

// ✅ Main App Component
const App = () => {
    return (
        <Router>
            <AuthProvider>
                <div className="min-h-screen bg-gray-50">
                    <NavBar />
                    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                        <Routes>
                            <Route path="/" element={<Navigate to="/login" replace />} />
                            <Route path="/login" element={<AuthPage type="login" />} />
                            <Route path="/signup" element={<AuthPage type="signup" />} />
                            <Route path="/logout" element={<Logout />} />

                            <Route element={<ProtectedRoute />}>
                                <Route path="/documents" element={<UploadPage />} />
                                <Route path="/document/:docId" element={<DocumentView />} />
                                <Route path='/history' element={<HistoryPage />} />
                            </Route>
                        </Routes>
                    </main>
                </div>
            </AuthProvider>
        </Router>
    );
};

export default App;
