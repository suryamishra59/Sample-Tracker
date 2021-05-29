import React from 'react';
import { LS_USER_OBJECT_KEY } from './constant';

const UserContext = React.createContext({
    isMobile: window.matchMedia("(max-width: 768px)").matches,
    ...JSON.parse(window.localStorage.getItem(LS_USER_OBJECT_KEY) || "{}"),
    isAuthenticated: window.localStorage.getItem(LS_USER_OBJECT_KEY) ? Object.keys(JSON.parse(window.localStorage.getItem(LS_USER_OBJECT_KEY))).length > 3 : false,
});

const { Provider: UserProvider, Consumer: UserConsumer } = UserContext;

export { UserProvider, UserConsumer };
export default UserContext;
