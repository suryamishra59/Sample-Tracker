import { AppBar, Button, Divider, Tab, Tabs, ThemeProvider } from '@material-ui/core';
import React, { useState, useEffect, useContext } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { Header, Loader, OrderTable, Tracker } from '../../components';
import { getColorSampleHistory, getColorSampleTypes } from '../../server';
import UserContext from '../../UserContext';
import './SampleTracker.scss';

function SampleTracker(props) {
    const [state, setstate] = useState({
        colorSampleTypes: [
            {
                id: 0,
                color_id: 0,
                sample_type_id: 0,
                created_at: new Date(),
                updated_at: new Date(),
                is_disabled: false,
                sample_type: {
                    sample_type: "NO_DATA",
                    display_name: "No Samples Found"
                }
            }
        ],
        colorSampleHistory: {
            0: dummyHistory
        },
        tabValue: 0,
        tabIndex: 0,

    });
    const [isLoading, setisLoading] = useState(false);
    const { enqueueSnackbar, isMobile, role } = useContext(UserContext);

    useEffect(() => {
        getAllColorSampleTypes();
    }, []);

    const getAllColorSampleTypes = async _ => {
        setisLoading(true);
        try {
            const colorSampleTypes = await getColorSampleTypes(props.match.params.color_id);
            let colorSampleHistory = {};
            if (colorSampleTypes.data.length > 0) {
                const colorSampleHistories = await Promise.all(colorSampleTypes.data.map(csType => getColorSampleHistory(csType.id)));
                console.log("colorSampleHistories: ", colorSampleHistories);
                colorSampleHistories.forEach(hist => hist.data[0] && (colorSampleHistory[hist.data[0].color_sample_id] = hist.data.sort((a, b) => b.color_sample_id - a.color_sample_id)));
            }
            setstate({ ...state, colorSampleTypes: colorSampleTypes.data, colorSampleHistory });
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
            <Header heading="Sample Tracker" />
            <div className="main-tracker-wrapper flex flex-c-flow flex-v-centered">
                <div className="main-tracker-container" style={{ width: isMobile ? '100%' : '75%' }}>
                    <AppBar position="static" color="default" elevation={0}>
                        <Tabs
                            value={state.tabValue}
                            onChange={(e, newVal) => setstate({ ...state, tabValue: newVal })}
                            indicatorColor="secondary"
                            textColor="secondary"
                            variant="scrollable"
                            scrollButtons="auto"
                        >
                            {
                                state.colorSampleTypes.map((csType, index) => <Tab index={csType.color_id} label={csType.sample_type.display_name} />)
                            }
                        </Tabs>
                    </AppBar>
                    <SwipeableViews
                        axis={ThemeProvider.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={state.tabValue}
                        onChangeIndex={e => setstate({ ...state, tabValue: e, tabIndex: e })}
                    >

                        {
                            state.colorSampleTypes.map((csType, index) =>
                                <div className="tabs" value={state.tabValue} index={index} dir={ThemeProvider.direction}>
                                    <Tracker data={state.colorSampleHistory[csType.id] || dummyHistory} />
                                </div>)
                        }

                    </SwipeableViews>
                </div>
            </div>
        </>
    );
}

const dummyHistory = [
    {
        id: 0,
        color_sample_id: 0,
        stage_id: 0,
        memo: null,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 0,
        updated_by: 0,
        status: 1,
        stage: {
            stage_name: "NO_DATA",
            display_name: "No Tracking Record"
        },
        documents: [
            {
                id: 0,
                color_sample_history_id: 0,
                downloadable_file_id: 0,
                created_at: new Date(),
                created_by: 0,
                is_deleted: 0,
                updated_at: new Date(),
                updated_by: 0,
                uuid: "uuid-uuid-uuid-uuid",
                document_type: 0,
                downloadable_file: {
                    bucket: "",
                    file_path: ""
                },
                document_type_report_type: {
                    report_name: "",
                    report_alias: ""
                }
            }
        ],
        createdByUser: {
            id: 0,
            first_name: "",
            last_name: "",
            email_id: "",
            phone: 0,
            role_id: 2,
            created_at: new Date(),
            updated_at: new Date(),
            created_by: "",
            updated_by: ""
        },
        updatedByUser: {
            id: 0,
            first_name: "",
            last_name: "",
            email_id: "",
            phone: 0,
            role_id: 2,
            created_at: new Date(),
            updated_at: new Date(),
            created_by: "",
            updated_by: ""
        }
    }
];

export default SampleTracker;
