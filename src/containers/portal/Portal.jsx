import React, { useState, useEffect } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import './Portal.scss';
import { NotFound } from '../../components';
import { Dashboard, OrderCreate } from '../';

function Portal(props) {

    return (
        <>
            <BrowserRouter>
                <Switch>
                    <Route path="/portal/dashboard" render={(props) => <Dashboard {...props} />} />
                    <Route path="/portal/orders/create" render={(props) => <OrderCreate {...props} />} />
                    <Route path="/portal" render={(props) => <Redirect to="/portal/dashboard" />} />
                    <Route component={NotFound} />
                </Switch>
            </BrowserRouter>
        </>
    );
}

export default Portal;
