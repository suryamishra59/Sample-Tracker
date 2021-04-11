import { invokeAPI } from './util';

import {
    API_GET_ROLES,
    API_USERS,
    API_SIGNIN,
    API_REFRESH_TOKEN
} from './constant';

export const getRoles = async _ => {
    const request = {
        method: 'GET',
        url: API_GET_ROLES,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    return await invokeAPI(request);;
};

export const signIn = async payload => {
    const request = {
        method: 'POST',
        url: API_SIGNIN,
        headers: {
            'Content-Type': 'application/json'
        },
        data: payload
    };

    return await invokeAPI(request);;
};

export const register = async payload => {
    const request = {
        method: 'POST',
        url: API_USERS,
        headers: {
            'Content-Type': 'application/json'
        },
        data: payload
    };

    return await invokeAPI(request);;
};

export const refreshAccessToken = async payload => {
    const request = {
        method: 'POST',
        url: API_REFRESH_TOKEN,
        headers: {
            'Content-Type': 'application/json'
        },
        data: payload
    };

    return await invokeAPI(request);;
};