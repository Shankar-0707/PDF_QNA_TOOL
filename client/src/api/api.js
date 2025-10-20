import axios from "axios";

const api = axios.create({
    baseURL : 'http://localhost:5000/api',
    headers : {
        'Content-Type': 'application/json',
    }
});

// Utility function to set the Authorization header
const setAuthHeader = (token) => {
    if (token) {
        // Set the Authorization header for all future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        // Remove the Authorization header
        delete api.defaults.headers.common['Authorization'];
    }
};

//--- AUTH API CALLS ---
export const loginUser = (email, password) => {
    return api.post('/users/login', { email, password }, {withCredentials : true});
};

export const signupUser = ( email, password) => {
    return api.post('/users/signup', {email, password }, {withCredentials : true});
};

export const logoutUser = () => {
    // This calls the backend to clear the httpOnly cookie
    return api.get('/users/logout', { 
        withCredentials: true 
    });
};

export const uploadDocument = (file) => {
    const formData = new FormData();
    formData.append('pdfFile', file);

    // Override Content-Type for file upload
    return api.post('/documents/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }, {withCredentials : true});
}

export const getDocumentDetails = (docId) => {
    return api.get(`/documents/${docId}`, {withCredentials : true});
}

export const askQuestion = (docId, question) => {
    return api.post(`/documents/${docId}/qa`, {question}, {withCredentials : true});
};

export const getDocumentHistory = () => {
    // This calls the new GET /api/documents/ route
    return api.get('/documents/', {withCredentials : true});
};

export const checkAuthStatus = () => {
    // This endpoint must exist on your backend and use the 'protect' middleware.
    // The browser automatically sends the httpOnly cookie because of withCredentials: true.
    return api.get('/users/checkAuth', { withCredentials: true });
};

export {setAuthHeader};