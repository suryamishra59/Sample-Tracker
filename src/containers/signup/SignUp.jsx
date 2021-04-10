import React, { useState } from 'react';
import './SignUp.scss';
import logo from '../../assets/logo.png';
import { ButtonBase, Divider, InputBase, MobileStepper } from '@material-ui/core';

function SignUp(props) {
    const [state, setstate] = useState({
        emailID: '',
        password: ''
    });
    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    const register = _ => {
        localStorage.setItem('reset_email', state.emailID);
        props.history.push('/otp');
    };

    return (
        <>
            <div className="flex flex-centered flex-c-flow full-width register-wrapper">
                <img src={logo} style={{ height: '70px' }} alt="logo" />
                <div className="flex flex-h-centered flex-c-flow m-top-1">
                    <h1>Welcome! Let's ToS</h1>
                    <Divider style={{ margin: '15px 0' }} />
                    {
                        activeStep === 0 ?
                            <div className="flex flex-h-centered flex-c-flow" style={{ margin: '5em 0' }}>
                                <label style={{ fontSize: '24px', fontWeight: 400 }} htmlFor="signup_email">Email</label>
                                <InputBase value={state.emailID} onChange={e => setstate({ ...state, emailID: e.target.value })} placeholder="Your email..." name="email" required type="email" autoFocus id="signup_email" className="m-top-1" />
                            </div>
                            :
                            <div className="flex flex-h-centered flex-c-flow" style={{ margin: '5em 0' }}>
                                <label style={{ fontSize: '24px', fontWeight: 400 }} htmlFor="signup_pwd">Password</label>
                                <InputBase value={state.password} onChange={e => setstate({ ...state, password: e.target.value })} placeholder="Password" name="password" required type="password" id="signup_pwd" className="m-top-1" />
                            </div>
                    }

                    <MobileStepper
                        steps={2}
                        position="static"
                        variant="dots"
                        style={{ background: 'transparent' }}
                        activeStep={activeStep}
                        nextButton={
                            activeStep === 0 ?
                                <ButtonBase focusRipple onClick={handleNext} disabled={activeStep === 2 - 1 || !state.emailID} className="btn-nxt">
                                    Next
                                </ButtonBase> :
                                <ButtonBase focusRipple onClick={register} disabled={!state.emailID || !state.password} className="btn-nxt primary">
                                    Submit
                                </ButtonBase>
                        }
                        backButton={
                            <ButtonBase focusRipple onClick={handleBack} className="btn-nxt" size="small" disabled={activeStep === 0}>
                                Back
                            </ButtonBase>
                        }
                    />

                </div>
            </div>
        </>
    );
}

export default SignUp;
