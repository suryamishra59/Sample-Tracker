const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

module.exports = {
    // CONSTANTS
    LS_USER_OBJECT_KEY: 'user_info',

    // APIs PATH
    API_BASE_URL: API_BASE_URL,

    API_GET_ROLES: `${API_BASE_URL}/roles`,
    API_USERS: `${API_BASE_URL}/users`,
    API_SIGNIN: `${API_BASE_URL}/users/signin`,
    API_REFRESH_TOKEN: `${API_BASE_URL}/users/refresh`,
    API_SAMPLES: `${API_BASE_URL}/samples`,
    API_SAMPLES_DOCUMENTS: `${API_BASE_URL}/samples/document`,
    API_STAGES: `${API_BASE_URL}/stages`,
    API_ALL_REPORTS: `${API_BASE_URL}/stages/reports`,
    API_DETAILED_REPORTS: `${API_BASE_URL}/reports`,
    API_COLOR_SAMPLE_TYPES: `${API_BASE_URL}/samples/color/{color_id}/types`,
    API_COLOR_SAMPLE_HISTORY: `${API_BASE_URL}/samples/color-sample/{color_sample_id}`,
    API_UPDATE_COLOR_SAMPLE_HISTORY: `${API_BASE_URL}/samples/color-sample-history/{color_sample_history_id}`,
};