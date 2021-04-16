import { invokeAPI } from './util';

import {
    API_GET_ROLES,
    API_USERS,
    API_SIGNIN,
    API_REFRESH_TOKEN,
    API_SAMPLES,
    API_STAGES
} from './constant';

/* 
 ********************************************  
 * AUTH APIs
 ********************************************
*/
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
        data: {
            refresh_token: localStorage.getItem("refreshToken")
        }
    };

    return await invokeAPI(request);
};

/*
 ********************************************
 * SAMPLES APIs
 ********************************************
*/

export const getAllSamples = async _ => {
    const request = {
        method: 'GET',
        url: API_SAMPLES,
        headers: {
            'Content-Type': 'application/json',
            token: localStorage.getItem("accessToken")
        },
    };

    return await invokeAPI(request);
};

export const getColorsBySampleID = async sampleID => {
    const request = {
        method: 'GET',
        url: `${API_SAMPLES}/${sampleID}`,
        headers: {
            'Content-Type': 'application/json',
            token: localStorage.getItem("accessToken")
        },
    };

    return await invokeAPI(request);
};

export const createSample = async payload => {
    const request = {
        method: 'POST',
        url: API_SAMPLES,
        headers: {
            'Content-Type': 'application/json',
            token: localStorage.getItem("accessToken")
        },
        data: payload
    };

    return await invokeAPI(request);
};


/*
 ********************************************
 * STAGES APIs
 ********************************************
*/

export const getReportsByStageID = async stageID => {
    const request = {
        method: 'GET',
        url: `${API_STAGES}/${stageID}/reports`,
        headers: {
            'Content-Type': 'application/json',
            token: localStorage.getItem("accessToken")
        }
    };

    return await invokeAPI(request);
};