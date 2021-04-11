import axios from 'axios';
import { LS_USER_OBJECT_KEY } from './constant';

export const invokeAPI = async params => {
    let result;
    try {
        result = await axios(params);
        return result.data;
    } catch (error) {
        console.error(error);
        const errorMsg = (error.response && error.response.data) ? error.response.data.message : error.toString();
        throw errorMsg;
    }
};

export const sendOTP = async params => {

};

export const postSignIn = params => {
    localStorage.setItem(LS_USER_OBJECT_KEY, JSON.stringify(params.data));
};