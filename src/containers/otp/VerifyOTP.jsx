import React, { useState, useEffect } from 'react';
import './VerifyOTP.scss';
import logo from '../../assets/logo.png';
import OtpInput from "react-otp-input";
import { ButtonBase, Divider } from '@material-ui/core';
import { sendOTP } from '../../util';

function VerifyOTP(props) {
    const [otp, setotp] = useState('');
    const [emailID, setEmailID] = useState('');
    const [otpTimer, setotpTimer] = useState('02:00');

    if (!localStorage.getItem('reset_email')) props.history.goBack();

    const verifyOTP = async otp => {
        setotp(otp);
        if (otp.length === 4) {
            // TODO: Verify the OTP
            if (localStorage.getItem('reset_pwd')) props.history.push('/login/email/reset');
            else props.history.push('/login');
        }
    };

    const resendOTP = async _ => {
        try {
            await sendOTP();
            refreshTimer();
        } catch (error) {

        }
    };

    let timeoutInterval;

    useEffect(() => {
        refreshTimer();
        setEmailID(localStorage.getItem('reset_email'));
    }, []);

    const refreshTimer = _ => {
        timeoutInterval && clearInterval(timeoutInterval);
        const timeoutDate = new Date();
        timeoutDate.setMinutes(2);
        timeoutDate.setSeconds(0);
        timeoutInterval = setInterval(e => {
            let min = timeoutDate.getMinutes();
            let secs = timeoutDate.getSeconds();
            timeoutDate.setSeconds(secs - 1);
            let otpTimeout = '';
            if (min !== 0 || secs !== 0) {
                otpTimeout = `${min.toString().length === 1 ? `0${min}` : min}:${secs.toString().length === 1 ? `0${secs}` : secs}`;
            }
            setotpTimer(otpTimeout);
            !otpTimeout && clearInterval(timeoutInterval);
        }, 1000);
    };

    return (
        <>
            <div className="flex flex-centered flex-c-flow full-width register-otp-wrapper">
                <img src={logo} style={{ height: '70px' }} alt="logo" />
                <div className="flex flex-h-centered flex-c-flow m-top-1">
                    <h1>Verify your Email</h1>
                    <Divider style={{ margin: '15px 0' }} />
                    <div className="flex flex-c-flow full-width flex-v-centered otp-wrapper">
                        <OtpInput
                            value={otp}
                            onChange={verifyOTP}
                            numInputs={4}
                            shouldAutoFocus
                            inputStyle={{
                                width: '30px',
                                border: '1px solid var(--logo-color)',
                                background: '#fff',
                                color: '#2d2d2d',
                                outline: 'none',
                                padding: '10px 5px',
                                fontSize: '18px',
                                borderRadius: '3px'
                            }}
                        />

                        <ButtonBase focusRipple onClick={resendOTP} disabled={otpTimer ? true : false} className="btn-otp-resend">
                            Resend {otpTimer}
                        </ButtonBase>
                    </div>
                </div>
            </div>
        </>
    );
}

export default VerifyOTP;
