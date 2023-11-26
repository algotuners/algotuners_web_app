import React, {useEffect, useState} from 'react';
import './PhoneNumberLogin.css';
import {sendOtp} from "../../api/auth";
import { useNavigate } from 'react-router-dom';
import {useAuth} from "../../context/AuthContext";

interface Props {}

const PhoneNumberLogin: React.FC<Props> = () => {
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [otp, setOtp] = useState<string>('');
    const [showOtpInput, setShowOtpInput] = useState<boolean>(false);
    const [loginMessage, setLoginMessage] = useState<string>("")
    const { isAuthenticated, loginAuthProvider } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard')
        }
    }, [isAuthenticated])

    const handleSendOtp = async () => {
        try {
            const response = await sendOtp(phoneNumber);
            if (response.status === 200) {
                setLoginMessage("")
                setShowOtpInput(true);
            } else {
                setLoginMessage("SERVER ERROR")
            }
        } catch (error) {
            setLoginMessage("SERVER ERROR")
        }
    };

    const handleLogin = async () => {
        try {
            const isLoginSuccess = await loginAuthProvider(phoneNumber, otp)
            if (!isLoginSuccess) {
                setLoginMessage("Wrong OTP")
            }
        } catch (error) {
            setLoginMessage("SERVER ERROR")
        }
    };
    return (
        <div className="login-container">
            <h2>Login with Phone Number</h2>
            <div>
                <label>Phone Number:</label>
                <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                <button onClick={handleSendOtp} onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}>Get OTP</button>
            </div>

            {showOtpInput && (
                <div>
                    <label>OTP:</label>
                    <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} />
                    <button onClick={handleLogin} onKeyDown={(e) => (showOtpInput && e.key === 'Enter') && handleSendOtp()}>Login</button>
                </div>
            )}
            {loginMessage!=="" && (<p>{loginMessage}</p>)}
        </div>
    );
};

export default PhoneNumberLogin;
