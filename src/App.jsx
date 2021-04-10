import React from 'react';
import './App.scss';
import { UserProvider } from './UserContext';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import { ThemeProvider, createMuiTheme } from '@material-ui/core';
import axios from "axios";
import { withSnackbar } from 'notistack';
import { NotFound } from './components';
import { Home, SignUp, VerifyOTP, Login, Portal } from './containers';

class App extends React.Component {
    socketConnection;
    constructor() {
        super();

        this.state = {
            isAuthenticated: false,
            isMobile: window.matchMedia("(max-width: 768px)").matches,
        };

    }

    componentDidMount() {
    }

    showNotification(title, body) {
        Notification.requestPermission(function (result) {
            if (result === 'granted') {
                navigator.serviceWorker.ready.then(registration => {
                    registration.showNotification(title, body);
                });
            }
        });
    }

    render() {

        const theme = createMuiTheme({
            palette: {
                type: this.state.isDarkThemeEnabled ? 'dark' : 'light',
                // type: 'dark',
                primary: {
                    main: document.documentElement.style.getPropertyValue('--secondary-color') || '#ff0056'
                },
                secondary: {
                    main: document.documentElement.style.getPropertyValue('--logo-color') || '#4b33d1'
                }
            },
            typography: {
                fontFamily: "'Work Sans', sans-serif"
            },
        });

        // Add a response interceptor
        axios.interceptors.response.use(
            response => response,
            async (error) => {
                // console.log(error.response);
                const originalRequest = error.config;
                if (!error.response || error.response.status !== 401) throw error;

                console.log("401 Unauthorized: Moving Forward to refresh the session");

                // try {
                //     if (originalRequest.url === DORDER_REFRESH_TOKEN_API) throw new Error("Session Expired");
                //     await refreshToken();
                //     await this.updateContext();
                //     error.response.config.headers.token = window.localStorage.getItem("token");
                //     return await invokeAPI(error.response.config);
                // } catch (error) {
                //     console.log(error.toString());
                //     this.logout();
                //     return new Error();
                // }
            });

        if (!("Notification" in window)) {
            console.log("This browser does not support desktop notification");
        } else {
            console.log("Notifications are supported");
            Notification.requestPermission().then(console.log);
        }

        return <>
            <ThemeProvider theme={theme}>
                <Router>
                    <Switch>
                        <Route path="/login" render={(props) => <UserProvider value={this.state}> <Login {...props} /> </UserProvider>} />
                        <Route exact path="/otp" render={(props) => <UserProvider value={this.state}> <VerifyOTP {...props} /> </UserProvider>} />
                        <Route exact path="/signup" render={(props) => <UserProvider value={this.state}> <SignUp {...props} /> </UserProvider>} />
                        <Route path="/portal" render={(props) => <UserProvider value={this.state}> <Portal {...props} /> </UserProvider>} />
                        <Route path="/" render={_ => <Redirect to={this.state.isAuthenticated ? '/portal' : '/login'} />} />
                        <Route component={NotFound} />
                    </Switch>
                </Router >
            </ThemeProvider>
        </ >;
    }
}

export default withSnackbar(App);
