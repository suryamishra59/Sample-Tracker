import { Button, Divider } from '@material-ui/core';
import React, { useState, useEffect, useContext } from 'react';
import { Header, Loader, SampleTable } from '../../components';
import { getAllSamples } from '../../server';
import UserContext from '../../UserContext';
import './Dashboard.scss';

function Dashboard(props) {
    const [state, setstate] = useState({
    });
    const [isLoading, setisLoading] = useState(false);
    const { enqueueSnackbar, isMobile, first_name, role } = useContext(UserContext);

    return (
        <>
            <Loader isLoading={isLoading} />
            <Header heading="Dashboard" {...props} />
            <div className="dashboard-wrapper flex flex-c-flow flex-v-centered">
                <h1>Welcome, {first_name}</h1>
                <Divider style={{ width: '80%' }} />
                <div className="flex flex-centered cards-container">
                    <div className="card flex flex-c-flow flex-v-centered">
                        <div className="flex flex-centered flex-c-flow">
                            <div className="card-icon flex flex-centered">
                                <i style={{ color: 'var(--secondary-color)' }} className="material-icons">dashboard</i>
                            </div>
                            <h2>Manage Samples</h2>
                        </div>
                        <div className="flex flex-centered flex-c-flow full-width">
                            <Button color="secondary" className="full-width" variant="outlined" onClick={e => props.history.push('/portal/samples')}>My Samples</Button>
                            {
                                (role && role.stages) && role.stages.map(r => r.stage).includes('ORDER_CREATED') && <Button color="secondary" className="full-width" variant="outlined" style={{ marginTop: '0.5em' }} onClick={e => props.history.push('/portal/samples/create')}>Create Order</Button>
                            }
                        </div>
                    </div>
                    <div className="card flex flex-c-flow">
                        <div className="flex flex-centered flex-c-flow">
                            <div className="card-icon flex flex-centered">
                                <i style={{ color: 'var(--secondary-color)' }} className="material-icons">person</i>
                            </div>
                            <h2>Manage Accounts</h2>
                        </div>
                        <div className="flex flex-centered flex-c-flow full-width">
                            <Button color="secondary" className="full-width" variant="outlined" disabled>My Account</Button>
                        </div>
                    </div>
                </div>
{/* 
                <div className="flex" style={{ marginTop: '5em', width: isMobile ? '95%' : '70%' }}>
                    <SampleTable samples={state.samples} history={props.history} />
                </div> */}
            </div>
        </>
    );
}

export default Dashboard;
