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
    API_ORDERS: `${API_BASE_URL}/orders`,
    API_STAGES: `${API_BASE_URL}/stages`

};