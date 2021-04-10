import React from 'react';

const UserContext = React.createContext({
    isMobile: window.matchMedia("(max-width: 768px)").matches,
});

const { Provider: UserProvider, Consumer: UserConsumer } = UserContext;

export { UserProvider, UserConsumer };
export default UserContext;
