import { useEffect } from "react";
import React, {createContext, useReducer, useContext} from "react";
import { checkAuthStatus } from "../api/api";

const AuthContext = createContext();

const initialState = {
    user : null,
    isAuthLoading: true,
}

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, user: action.payload, isAuthLoading: false };

        case 'LOGOUT':
            return { ...state, user: null, isAuthLoading: false };

        case 'FINISH_LOADING': // New action to signal the initial check is done
            return { ...state, isAuthLoading: false };

        default:
            return state;
    }
}
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // 💡 EFFECT TO CHECK AUTH STATUS ON INITIAL LOAD
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // This call relies on the browser automatically sending the httpOnly cookie
                const response = await checkAuthStatus(); 
                
                // If successful (200 OK), dispatch LOGIN with user data
                dispatch({ 
                    type: 'LOGIN', 
                    payload: response.data 
                });
            } catch (error) {
                // If 401 Unauthorized or any other error, the user is not logged in
                dispatch({ type: 'FINISH_LOADING' });
            }
        };

        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {/* 💡 Optionally, you can show a full-page loading spinner here: 
            {state.isAuthLoading ? <LoadingSpinner /> : children} 
            But rendering children ensures your app can start rendering */}
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
};