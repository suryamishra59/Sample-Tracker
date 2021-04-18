import React, { useState, useEffect } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import './Portal.scss';
import { NotFound } from '../../components';
import { Dashboard, SampleCreate, SampleTracker, Samples } from '../';

function Portal(props) {

    return (
        <>
            <BrowserRouter>
                <Switch>
                    <Route exact path="/portal/dashboard" render={(props) => <Dashboard {...props} />} />
                    <Route exact path="/portal/samples" render={(props) => <Samples {...props} />} />
                    <Route exact path="/portal/samples/create" render={(props) => <SampleCreate {...props} />} />
                    <Route exact path="/portal/samples/:color_id?/track" render={(props) => <SampleTracker {...props} />} />
                    <Route path="/portal" render={(props) => <Redirect to="/portal/dashboard" />} />
                    <Route component={NotFound} />
                </Switch>
            </BrowserRouter>
        </>
    );
}

export default Portal;
