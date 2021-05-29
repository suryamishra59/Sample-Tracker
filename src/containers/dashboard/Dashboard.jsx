import { Button, Divider } from '@material-ui/core';
import React, { useState, useEffect, useContext } from 'react';
import { Header, Loader, SampleTable, ScanQR } from '../../components';
import { getAllSamples } from '../../server';
import UserContext from '../../UserContext';
import './Dashboard.scss';

function Dashboard(props) {
    const [state, setstate] = useState({
        showScanDialog: false
    });
    const [isLoading, setisLoading] = useState(false);
    const { enqueueSnackbar, isMobile, first_name, role } = useContext(UserContext);

    const onScanChange = val => {
        console.log("FROM dash: ", val);
    };

    return (
        <>
            <Loader isLoading={isLoading} />
            <Header heading="Dashboard" {...props} />
            <ScanQR showCloseBtn {...props} open={state.showScanDialog} onChange={onScanChange} onCloseClick={e => setstate({ showScanDialog: false })} />
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
                                <i style={{ color: 'var(--secondary-color)' }} className="material-icons">qr_code_scanner</i>
                            </div>
                            <h2>Track my Sample</h2>
                        </div>
                        <div className="flex flex-centered flex-c-flow full-width" onClick={e => setstate({ showScanDialog: true })}>
                            <Button color="secondary" className="full-width" variant="outlined">Scan Style QR</Button>
                        </div>
                    </div>
                    {/* <div className="card flex flex-c-flow">
                        <div className="flex flex-centered flex-c-flow">
                            <div className="card-icon flex flex-centered">
                                <i style={{ color: 'var(--secondary-color)' }} className="material-icons">person</i>
                            </div>
                            <h2>Manage Accounts</h2>
                        </div>
                        <div className="flex flex-centered flex-c-flow full-width">
                            <Button color="secondary" className="full-width" variant="outlined" disabled>My Account</Button>
                        </div>
                    </div> */}
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
