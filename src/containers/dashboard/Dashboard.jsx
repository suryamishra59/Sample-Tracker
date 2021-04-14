import { Button, Divider } from '@material-ui/core';
import React, { useState, useEffect, useContext } from 'react';
import { Header, Loader, OrderTable } from '../../components';
import { getAllOrders } from '../../server';
import UserContext from '../../UserContext';
import './Dashboard.scss';

function Dashboard(props) {
    const [state, setstate] = useState({
        orders: [],
        isLoading: false
    });
    const { enqueueSnackbar, isMobile, first_name, role } = useContext(UserContext);

    useEffect(() => {
        getOrders().then();
    }, []);

    const getOrders = async _ => {
        try {
            const resp = await getAllOrders();
            setstate({ ...state, orders: resp.data });
        } catch (error) {
            enqueueSnackbar && enqueueSnackbar(error, {
                variant: "error"
            });
        }
    };

    return (
        <>
            <Loader isLoading={state.isLoading} />
            <Header heading="Sample Tracker" />
            <div className="dashboard-wrapper flex flex-c-flow flex-v-centered">
                <h1>Welcome, {first_name}</h1>
                <Divider style={{ width: '80%' }} />
                <div className="flex flex-centered cards-container">
                    <div className="card flex flex-c-flow flex-v-centered">
                        <div className="flex flex-centered flex-c-flow">
                            <div className="card-icon flex flex-centered">
                                <i style={{ color: 'var(--secondary-color)' }} className="material-icons">dashboard</i>
                            </div>
                            <h2>Manage Orders</h2>
                        </div>
                        <div className="flex flex-centered flex-c-flow full-width">
                            <Button color="primary" className="full-width" variant="outlined">My Orders</Button>
                            {
                                role.stages.map(r => r.stage).includes('ORDER_CREATED') && <Button color="primary" className="full-width" variant="outlined" style={{ marginTop: '0.5em' }} onClick={e => props.history.push('/portal/orders/create')}>Create Order</Button>
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
                            <Button color="primary" className="full-width" variant="outlined" disabled>My Account</Button>
                        </div>
                    </div>
                </div>

                <div className="flex" style={{ marginTop: '5em', width: isMobile ? '95%' : '70%' }}>
                    <OrderTable orders={state.orders} />
                </div>
            </div>
        </>
    );
}

export default Dashboard;
