import React, { useState, useEffect, useContext } from 'react';
import { Header, Loader, SampleTable } from '../../components';
import { getAllSamples } from '../../server';
import UserContext from '../../UserContext';
import './Samples.scss';

function Samples(props) {
    const [state, setstate] = useState({
        samples: []
    });
    const [isLoading, setisLoading] = useState(false);
    const { enqueueSnackbar, isMobile } = useContext(UserContext);

    useEffect(() => {
        getSamples().then();
    }, []);

    const getSamples = async _ => {
        setisLoading(true);
        try {
            const resp = await getAllSamples();
            setstate({ ...state, samples: resp.data });
        } catch (error) {
            enqueueSnackbar && enqueueSnackbar(error, {
                variant: "error"
            });
        }
        setisLoading(false);
    };

    return (
        <>
            <Loader isLoading={isLoading} />
            <Header heading="My Samples" {...props} />
            <div className="samples-wrapper flex flex-c-flow flex-v-centered">
                <div className="flex" style={{ marginTop: '5em', width: isMobile ? '95%' : '70%' }} id="#my_samples">
                    <SampleTable samples={state.samples} history={props.history} updateTableData={getSamples} />
                </div>
            </div>
        </>
    );
}

export default Samples;
