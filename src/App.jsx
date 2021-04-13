import React from 'react';
import './App.scss';
import { UserProvider } from './UserContext';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import { ThemeProvider, createMuiTheme } from '@material-ui/core';
import axios from "axios";
import { withSnackbar } from 'notistack';
import { NotFound } from './components';
import { SignUp, VerifyOTP, Login, Portal } from './containers';
import { LS_USER_OBJECT_KEY, API_REFRESH_TOKEN } from './constant';
import { invokeAPI } from './util';
import { refreshAccessToken } from './server';

class App extends React.Component {
    socketConnection;
    constructor() {
        super();

        this.state = {
            isAuthenticated: false,
            isMobile: window.matchMedia("(max-width: 768px)").matches,
            updateContext: this.updateContext
        };

    }

    componentDidMount() {
        this.setState({ enqueueSnackbar: this.props.enqueueSnackbar }, _ => this.updateContext());
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

    updateContext = _ => {
        this.setState({
            isMobile: window.matchMedia("(max-width: 768px)").matches,
            ...JSON.parse(window.localStorage.getItem(LS_USER_OBJECT_KEY)),
            isAuthenticated: window.localStorage.getItem(LS_USER_OBJECT_KEY) ? Object.keys(JSON.parse(window.localStorage.getItem(LS_USER_OBJECT_KEY))).length > 3 : false,
        });
    };

    logout = _ => {
        localStorage.clear();
        this.updateContext();
    };

    render() {

        const theme = createMuiTheme({
            palette: {
                type: this.state.isDarkThemeEnabled ? 'dark' : 'light',
                // type: 'dark',
                primary: {
                    main: document.documentElement.style.getPropertyValue('--logo-color') || '#ff0056'
                },
                secondary: {
                    main: document.documentElement.style.getPropertyValue('--secondary-color') || '#4b33d1'
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
                const originalRequest = error.config;
                if (!error.response || error.response.status !== 401) throw error;

                console.log("401 Unauthorized: Moving Forward to refresh the session");

                try {
                    if (originalRequest.url === API_REFRESH_TOKEN) throw new Error("Session Expired");
                    const resp = await refreshAccessToken();
                    localStorage.setItem("accessToken", resp.data.accessToken);
                    this.updateContext();
                    error.response.config.headers.token = resp.data.accessToken;
                    return await axios(error.response.config);
                } catch (error) {
                    this.logout();
                    this.props.enqueueSnackbar("Session Expired. Please login again to continue", {
                        variant: "error"
                    });
                    return { data: { message: "Session Expired", data: [] } };
                }
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
                        <Route path="/login" render={(props) => <UserProvider value={this.state}> {this.state.isAuthenticated ? <Redirect to={'/portal'} /> : <Login {...props} />} </UserProvider>} />
                        <Route exact path="/otp" render={(props) => <UserProvider value={this.state}> {this.state.isAuthenticated ? <Redirect to={'/portal'} /> : <VerifyOTP {...props} />} </UserProvider>} />
                        <Route exact path="/signup" render={(props) => <UserProvider value={this.state}> {this.state.isAuthenticated ? <Redirect to={'/portal'} /> : <SignUp {...props} />}  </UserProvider>} />
                        <Route path="/portal" render={(props) => <UserProvider value={this.state}> {this.state.isAuthenticated ? <Portal {...props} /> : <Redirect to={'/login'} />}  </UserProvider>} />
                        <Route path="/" render={_ => <Redirect to={this.state.isAuthenticated ? '/portal' : '/login'} />} />
                        <Route component={NotFound} />
                    </Switch>
                </Router >
            </ThemeProvider>
        </ >;
    }
}

export default withSnackbar(App);
