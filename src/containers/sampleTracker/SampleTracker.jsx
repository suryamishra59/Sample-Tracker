import { Button, Divider } from '@material-ui/core';
import React, { useState, useEffect, useContext } from 'react';
import { Header, Loader, OrderTable } from '../../components';
import {  } from '../../server';
import UserContext from '../../UserContext';
import './SampleTracker.scss';

function SampleTracker(props) {
    const [state, setstate] = useState({
    });
    const [isLoading, setisLoading] = useState(false);
    const { enqueueSnackbar, isMobile, role } = useContext(UserContext);

    useEffect(() => {
        
    }, []);

    return (
        <>
            <Loader isLoading={state.isLoading} />
            <Header heading="Sample Tracker" />
        </>
    );
}

export default SampleTracker;
