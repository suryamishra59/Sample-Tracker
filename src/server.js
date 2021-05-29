import { invokeAPI } from './util';

import {
    API_GET_ROLES,
    API_USERS,
    API_SIGNIN,
    API_REFRESH_TOKEN,
    API_SAMPLES,
    API_STAGES,
    API_COLOR_SAMPLE_TYPES,
    API_COLOR_SAMPLE_HISTORY,
    API_ALL_REPORTS,
    API_SAMPLES_DOCUMENTS,
    API_UPDATE_COLOR_SAMPLE_HISTORY,
    API_DETAILED_REPORTS
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

export const deleteSampleByID = async sample_id => {
    const request = {
        method: 'DELETE',
        url: `${API_SAMPLES}/${sample_id}`,
        headers: {
            'Content-Type': 'application/json',
            token: localStorage.getItem("accessToken")
        }
    };

    return await invokeAPI(request);
};

export const deleteColorByID = async color_id => {
    const request = {
        method: 'DELETE',
        url: `${API_SAMPLES}/color/${color_id}`,
        headers: {
            'Content-Type': 'application/json',
            token: localStorage.getItem("accessToken")
        }
    };

    return await invokeAPI(request);
};

export const getColorSampleTypes = async colorID => {
    const request = {
        method: 'GET',
        url: API_COLOR_SAMPLE_TYPES.replace('{color_id}', colorID),
        headers: {
            'Content-Type': 'application/json',
            token: localStorage.getItem("accessToken")
        }
    };

    return await invokeAPI(request);
};

export const getColorSampleHistory = async colorID => {
    const request = {
        method: 'GET',
        url: API_COLOR_SAMPLE_HISTORY.replace('{color_sample_id}', colorID),
        headers: {
            'Content-Type': 'application/json',
            token: localStorage.getItem("accessToken")
        }
    };

    return await invokeAPI(request);
};

export const updateColorSampleHistory = async (color_sample_history_id, payload) => {
    const request = {
        method: 'PUT',
        url: API_UPDATE_COLOR_SAMPLE_HISTORY.replace('{color_sample_history_id}', color_sample_history_id),
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

export const getStages = async _ => {
    const request = {
        method: 'GET',
        url: API_STAGES,
        headers: {
            'Content-Type': 'application/json',
            token: localStorage.getItem("accessToken")
        }
    };

    return await invokeAPI(request);
};

export const getAllReports = async _ => {
    const request = {
        method: 'GET',
        url: API_ALL_REPORTS,
        headers: {
            'Content-Type': 'application/json',
            token: localStorage.getItem("accessToken")
        }
    };

    return await invokeAPI(request);
};

export const getDetailReports = async _ => {
    const request = {
        method: 'GET',
        url: API_DETAILED_REPORTS,
        headers: {
            'Content-Type': 'application/json',
            token: localStorage.getItem("accessToken")
        }
    };

    return await invokeAPI(request);
};

export const downloadReport = async downloadable_file_id => {
    const request = {
        method: 'GET',
        url: `${API_SAMPLES_DOCUMENTS}?downloadable_file_id=${downloadable_file_id}`,
        headers: {
            'Content-Type': 'application/json',
            token: localStorage.getItem("accessToken")
        }
    };

    return await invokeAPI(request);
};

export const uploadReport = async payload => {
    const request = {
        method: 'POST',
        url: API_SAMPLES_DOCUMENTS,
        headers: {
            'Content-Type': 'application/json',
            token: localStorage.getItem("accessToken")
        },
        data: payload
    };

    return await invokeAPI(request);
};

export const uploadReportToS3 = async ({ url, contentType, blob }) => {
    const request = {
        method: 'PUT',
        url: url,
        headers: {
            'Content-Type': contentType,
        },
        data: blob
    };

    return await invokeAPI(request);
};

export const deleteReport = async documents_map_id => {
    const request = {
        method: 'DELETE',
        url: `${API_SAMPLES_DOCUMENTS}?documents_map_id=${documents_map_id}`,
        headers: {
            'Content-Type': 'application/json',
            token: localStorage.getItem("accessToken")
        }
    };

    return await invokeAPI(request);
};