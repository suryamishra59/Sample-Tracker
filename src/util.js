import axios from 'axios';

export const invokeAPI = async params => {
    let result;
    try {
        result = await axios(params);
        return result;
    } catch (error) {
        console.error(error);
        const errorMsg = (error.response && error.response.data) ? error.response.data.message : error.toString();
        throw errorMsg;
    }
};

export const sendOTP = async params => {
    
};

export const loginUser = async params => {
    
};