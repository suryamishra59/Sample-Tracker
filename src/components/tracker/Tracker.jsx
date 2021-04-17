import React, { useContext, useState } from 'react';
import UserContext from '../../UserContext';
import PropTypes from 'prop-types';
import { Button, Step, StepContent, StepLabel, Stepper, Typography } from '@material-ui/core';

const Tracker = ({ data }) => {
    data = data || dummyHistory;
    const [state, setstate] = useState({
        activeStep: 0
    });
    const { enqueueSnackbar } = useContext(UserContext);
    return (
        <>
            <h2>Track Records</h2>
            {
                (data.length > 0 && data[0].id !== 0) &&
                <Stepper activeStep={0} orientation="vertical">
                    {
                        data.map((record, index) => (
                            <Step key={record.id}>
                                <StepLabel>{record.stage.display_name}</StepLabel>
                                <StepContent>
                                    <Typography>{record.stage.display_name}</Typography>
                                    <div>
                                        <div>
                                            <Button
                                                disabled={state.activeStep === 0}
                                            >
                                                Back
                                    </Button>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                            >
                                                {state.activeStep === data.length - 1 ? 'Finish' : 'Next'}
                                            </Button>
                                        </div>
                                    </div>
                                </StepContent>
                            </Step>
                        ))
                    }
                </Stepper>
            }
        </>
    );
};

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

export default Tracker;
