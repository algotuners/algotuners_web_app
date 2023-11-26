import axios from 'axios';
import {deleteCookie, getCookie, setCookie} from "../utils/utils";

const BASE_URL = 'http://localhost:8090';

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const getHeaderConfig = (authToken: string) => {
    return {"headers": {"Authorization": authToken}}
}

export const sendOtp = (phoneNumber: string) => {
    return api.post('/sendLoginOtp', { phone_number: phoneNumber });
};

export const isLoginSuccessfull = async (phoneNumber: string, otp: string) => {
    const response: any = (await api.post('/login', { phone_number: phoneNumber, otp })).data;
    if (response.data != null) {
        setCookie('auth_token', 'Bearer ' + response.data.auth_token)
        setCookie('phone', phoneNumber, 7)
        setCookie('ext_user_id', response.data.ext_user_id)
    }
    return response.data != null
};

export const isLoginByTokenSuccessfull = async (extUserId: string, authToken: string) => {
    const response: any = (await api.post('/loginByToken', { ext_user_id: extUserId, auth_token: authToken })).data;
    return response.message == "AUTHORIZED_ACCESS"
};

export const logout = async () => {
    try {
        const extUserId = getCookie('ext_user_id')
        const authToken = getCookie('auth_token')
        deleteCookie('ext_user_id')
        deleteCookie('auth_token')
        deleteCookie('phone')
        return (await api.patch('/logout', {ext_user_id: extUserId}, getHeaderConfig(authToken))).data
    } catch (error: any) {
        if (error.response) {
            if (error.response.data.message == 'UNAUTHORIZED_ACCESS') {
                deleteCookie('ext_user_id')
                deleteCookie('auth_token')
                deleteCookie('phone')
                return error.response.data
            }
        }
    }
}
