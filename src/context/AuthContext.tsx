import React, {createContext, useContext, useState, ReactNode, useEffect} from 'react';
import {isLoginByTokenSuccessfull, isLoginSuccessfull, logout} from "../api/auth";
import {getCookie} from "../utils/utils";
import Loader from "../components/loader/Loader";
import {useNavigate} from "react-router-dom";

interface AuthContextType {
    isAuthenticated: boolean;
    loginAuthProvider: (phoneNumber: string, otp: string) => Promise<Boolean>;
    logoutAuthProvider: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true)


    useEffect(() => {
        const extUserId = getCookie('ext_user_id')
        const authToken = getCookie('auth_token')
        if (extUserId !== '' && authToken != '') {
            isLoginByTokenSuccessfull(extUserId, authToken).then((isSuccess: boolean) => {
                if (!isSuccess) {
                    logoutAuthProvider().then(r => setIsLoading(false))
                } else {
                    setIsAuthenticated(true);
                    setIsLoading(false)
                }
            })
        } else {
            setIsLoading(false)
        }
    }, [])

    const loginAuthProvider = async (phoneNumber: string, otp: string): Promise<Boolean> => {
        setIsLoading(true)
        const isLoginSuccess = await isLoginSuccessfull(phoneNumber, otp)
        setIsLoading(false)
        if (isLoginSuccess) {
            setIsAuthenticated(true);
            return true
        } else {
            setIsAuthenticated(false);
            return false
        }
    };

    const logoutAuthProvider = async () => {
        await logout()
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, loginAuthProvider, logoutAuthProvider }}>
            {!isLoading && children}
            {isLoading && <Loader />}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
