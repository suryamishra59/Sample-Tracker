import React, { useContext, useEffect, useState } from 'react';
import './SignUp.scss';
import logo from '../../assets/logo.png';
import { ButtonBase, Divider, InputBase, MenuItem, MobileStepper, Select } from '@material-ui/core';
import { getRoles, register, signIn } from '../../server';
import { Loader } from '../../components';
import UserContext from '../../UserContext';

function SignUp(props) {
    const [state, setstate] = useState({
        emailID: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        roles: [],
        selectedRole: 0,
        emp_id: ''
    });
    const [activeStep, setActiveStep] = React.useState(0);
    const [isLoading, setisLoading] = React.useState(false);
    const { enqueueSnackbar } = useContext(UserContext);

    useEffect(() => {
        getAllRoles();
    }, []);

    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
    };
    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    const registerUser = async e => {
        setisLoading(true);
        try {
            const payload = {
                first_name: state.firstName,
                last_name: state.lastName,
                email_id: state.emailID,
                role_id: state.selectedRole,
                password: state.password,
                emp_id: state.emp_id
            };
            const resp = await register(payload);
            enqueueSnackbar && enqueueSnackbar(resp.message, {
                variant: "success"
            });
            // localStorage.setItem('reset_email', state.emailID);
            props.history.push('/login');
        } catch (error) {
            enqueueSnackbar && enqueueSnackbar(error, {
                variant: "error"
            });
        }
        setisLoading(false);
    };

    const getAllRoles = async _ => {
        setisLoading(true);
        try {
            const roles = await getRoles();
            setstate({ ...state, roles: roles.data });
        } catch (error) {
            console.log(error);
            enqueueSnackbar && enqueueSnackbar("Error while fetching roles", {
                variant: "error"
            });
        }
        setisLoading(false);
    };

    return (
        <>
            <div className="flex flex-centered flex-c-flow full-width register-wrapper">
                <Loader isLoading={isLoading} />
                <img src={logo} style={{ height: '70px' }} alt="logo" />
                <div className="flex flex-h-centered flex-c-flow m-top-1 main-wrapper">
                    <h1>Welcome</h1>
                    <Divider style={{ margin: '15px 0' }} />
                    <form>
                        {
                            activeStep === 0 ?
                                <div className="flex flex-h-centered flex-c-flow" style={{ margin: '3em 0' }}>
                                    <div className="flex flex-h-centered flex-c-flow" style={{ margin: '0.5em 0' }}>
                                        <label style={{ fontSize: '20px', fontWeight: 400 }} htmlFor="signup_firstName">First Name</label>
                                        <InputBase value={state.firstName} onChange={e => setstate({ ...state, firstName: e.target.value })} placeholder="First Name" name="firstName" required type="text" id="signup_firstName" className="m-top-1 register-fields" />
                                    </div>
                                    <div className="flex flex-h-centered flex-c-flow" style={{ margin: '0.5em 0' }}>
                                        <label style={{ fontSize: '20px', fontWeight: 400 }} htmlFor="signup_lastName">Last Name</label>
                                        <InputBase value={state.lastName} onChange={e => setstate({ ...state, lastName: e.target.value })} placeholder="Last Name" name="lastName" required type="text" id="signup_lastName" className="m-top-1 register-fields" />
                                    </div>
                                    <div className="flex flex-h-centered flex-c-flow" style={{ margin: '0.5em 0' }}>
                                        <label style={{ fontSize: '20px', fontWeight: 400 }} htmlFor="signup_email">Email</label>
                                        <InputBase value={state.emailID} onChange={e => setstate({ ...state, emailID: e.target.value })} placeholder="Email" name="email" required type="email" autoFocus id="signup_email" className="m-top-1 register-fields" />
                                    </div>
                                    <div className="flex flex-h-centered flex-c-flow" style={{ margin: '0.5em 0' }}>
                                        <label style={{ fontSize: '20px', fontWeight: 400 }} htmlFor="emp_id">Employee ID</label>
                                        <InputBase value={state.emp_id} onChange={e => setstate({ ...state, emp_id: e.target.value })} placeholder="Employee ID" name="emp_id" required autoFocus id="signup_emp_id" className="m-top-1 register-fields" />
                                    </div>
                                </div>
                                :
                                <div className="flex flex-h-centered flex-c-flow" style={{ margin: '3em 0' }}>
                                    <div className="flex flex-h-centered flex-c-flow" style={{ margin: '0.5em 0' }}>
                                        <label style={{ fontSize: '20px', fontWeight: 400 }} htmlFor="signup_pwd">Role</label>
                                        <Select value={state.selectedRole} onChange={e => setstate({ ...state, selectedRole: e.target.value })} placeholder="role" name="role" required className="m-top-1">
                                            <MenuItem disabled value={0}>Select your role</MenuItem>
                                            {state.roles.map(r => <MenuItem value={r.id}>{r.display_name}</MenuItem>)}
                                        </Select>
                                    </div>
                                    <div className="flex flex-h-centered flex-c-flow" style={{ margin: '0.5em 0' }}>
                                        <label style={{ fontSize: '20px', fontWeight: 400 }} htmlFor="signup_pwd">Password</label>
                                        <InputBase value={state.password} onChange={e => setstate({ ...state, password: e.target.value })} placeholder="Password" name="password" required type="password" id="signup_pwd" className="m-top-1 register-fields" />
                                    </div>
                                    <div className="flex flex-h-centered flex-c-flow" style={{ margin: '0.5em 0' }}>
                                        <label style={{ fontSize: '20px', fontWeight: 400 }} htmlFor="signup_pwd">Confirm Password</label>
                                        <InputBase value={state.confirmPassword} onChange={e => setstate({ ...state, confirmPassword: e.target.value })} placeholder="Confirm Password" name="conPassword" required type="password" id="signup_conpwd" className="m-top-1 register-fields" />
                                    </div>
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
                                    <ButtonBase focusRipple onClick={handleNext} disabled={activeStep === 2 - 1 || !state.emailID || !state.firstName || !state.lastName} className="btn-nxt">
                                        Next
                                </ButtonBase> :
                                    <ButtonBase onClick={registerUser} focusRipple disabled={!state.emailID || !state.firstName || !state.lastName || !state.password || state.password !== state.confirmPassword || state.selectedRole === 0 || state.isLoading} className="btn-nxt primary">
                                        Submit
                                </ButtonBase>
                            }
                            backButton={
                                <ButtonBase focusRipple onClick={handleBack} className="btn-nxt" size="small" disabled={activeStep === 0}>
                                    Back
                            </ButtonBase>
                            }
                        />
                    </form>
                </div>
            </div>
        </>
    );
}

export default SignUp;
