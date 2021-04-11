import React, { useContext, useState } from 'react';
import './Login.scss';
import logo from '../../assets/logo.png';
import { Button, ButtonBase, Divider, InputBase } from '@material-ui/core';
import { signIn } from '../../server';
import { LS_USER_OBJECT_KEY } from '../../constant';
import { sendOTP, postSignIn } from '../../util';
import { withSnackbar } from 'notistack';
import { Loader } from '../../components';
import UserContext from '../../UserContext';

function Login(props) {
    console.log(props);
    const [state, setstate] = useState({
        emailID: '',
        password: '',
        newPassword: '',
        loginSuccess: false,
        isLoading: false
    });
    const { enqueueSnackbar, updateContext } = useContext(UserContext);

    const login = async _ => {
        setstate(prevState => ({ ...prevState, isLoading: true }));
        try {
            const resp = await signIn({
                email_id: state.emailID,
                password: state.password
            });
            localStorage.setItem(LS_USER_OBJECT_KEY, JSON.stringify(resp.data));
            updateContext();
            setstate(prevState => ({ ...prevState, loginSuccess: true }));
            props.history.push('/portal/dashboard');
        } catch (error) {
            enqueueSnackbar && enqueueSnackbar(error, {
                variant: "error"
            });
        }
        setstate(prevState => ({ ...prevState, isLoading: false }));
    };

    const sendEmailOTP = async _ => {
        try {
            await sendOTP();
            localStorage.setItem('reset_email', state.emailID);
            localStorage.setItem('reset_pwd', true);
            props.history.push('/otp');
        } catch (error) {
            this.props.enqueueSnackbar(error.toString(), {
                variant: "error"
            });
        }
    };

    const resetPassword = async _ => {
        setstate({
            emailID: '',
            password: '',
            newPassword: ''
        });
        props.history.push('/login');
    };

    return (
        <>
            <Loader isLoading={state.isLoading} />
            {
                props.location.pathname === '/login' &&
                <div className="flex flex-centered flex-c-flow full-width login-wrapper">
                    <img src={logo} style={{ height: '70px' }} alt="logo" />
                    {
                        !state.loginSuccess &&
                        <div className="flex flex-h-centered flex-c-flow m-top-1 main-wrapper">
                            <h1>Welcome back</h1>
                            <Divider style={{ margin: '15px 0' }} />
                            <div className="flex flex-c-flow full-width flex-v-centered">
                                <InputBase value={state.emailID} onChange={e => setstate({ ...state, emailID: e.target.value })} placeholder="Email" name="email" required type="email" className="full-width m-top-1 login-fields" />
                                <InputBase value={state.password} onChange={e => setstate({ ...state, password: e.target.value })} placeholder="Password" name="password" required type="password" className="full-width m-top-1 login-fields" />

                                <ButtonBase focusRipple onClick={login} disabled={!state.emailID || !state.password || state.isLoading} className="btn-login">
                                    Login
                            </ButtonBase>

                                <Button style={{ marginTop: '2em' }} color="secondary" onClick={e => props.history.push('/login/email')}>Trouble logging in?</Button>
                            </div>
                        </div>
                    }
                </div>
            }
            {
                props.location.pathname === '/login/email' &&
                <div className="flex flex-centered flex-c-flow full-width login-wrapper">
                    <img src={logo} style={{ height: '70px' }} alt="logo" />
                    <div className="flex flex-h-centered flex-c-flow m-top-1">
                        <h1>Reset Your Account</h1>
                        <Divider style={{ margin: '15px 0' }} />
                        <div className="flex flex-c-flow full-width flex-v-centered">
                            <InputBase value={state.emailID} onChange={e => setstate({ ...state, emailID: e.target.value })} placeholder="Email" name="email" required type="email" className="full-width m-top-1 login-fields" />

                            <ButtonBase focusRipple onClick={sendEmailOTP} disabled={!state.emailID} className="btn-login">
                                Send OTP
                            </ButtonBase>
                        </div>
                    </div>
                </div>
            }
            {
                props.location.pathname === '/login/email/reset' &&
                <div className="flex flex-centered flex-c-flow full-width login-wrapper">
                    <img src={logo} style={{ height: '70px' }} alt="logo" />
                    <div className="flex flex-h-centered flex-c-flow m-top-1">
                        <h1>Reset Your Account</h1>
                        <Divider style={{ margin: '15px 0' }} />
                        <div className="flex flex-c-flow full-width flex-v-centered">
                            <InputBase value={state.password} onChange={e => setstate({ ...state, password: e.target.value })} placeholder="Password" name="password" required type="password" className="full-width m-top-1 login-fields" />
                            <InputBase value={state.newPassword} onChange={e => setstate({ ...state, newPassword: e.target.value })} placeholder="Confirm Password" name="newPassword" required type="password" className="full-width m-top-1 login-fields" />

                            <ButtonBase focusRipple onClick={resetPassword} disabled={!state.newPassword || !state.password || state.password !== state.newPassword} className="btn-login">
                                Reset
                            </ButtonBase>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}

export default withSnackbar(Login);
