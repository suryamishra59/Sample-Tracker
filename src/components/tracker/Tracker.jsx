import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../../UserContext';
import './Tracker.scss';
import { Accordion, AccordionDetails, AccordionSummary, Button, FormControl, FormControlLabel, IconButton, InputLabel, Menu, MenuItem, Paper, Select, Step, StepContent, StepLabel, Stepper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@material-ui/core';

const Tracker = props => {
    const { data, stages } = props;
    const { isMobile, role } = useContext(UserContext);

    const userAllowedStages = role && role.stages.map(s => s.id);
    const unApprovedStages = data.filter(rec => rec.status !== 1).map(rec => rec.stage_id).sort((a, b) => a - b);

    return <>
        <Typography variant="h5" color="primary">Track Records</Typography>
        {
            stages.map((record, index) => (
                <div className="flex flex-v-centered accordion-container" key={record.id}>
                    {
                        // !isMobile &&
                        <i
                            className={`material-icons track-icon ${record.id > unApprovedStages[0] ? 'disabled' : ''} ${!(data[index] && data[index].status === 1) ? 'glow' : ''}`}
                        >
                            {(data[index] && data[index].status === 1) ? 'done' : 'integration_instructions'}
                        </i>}
                    <StageAccoridion
                        {...props}
                        id={data[index] ? data[index].id : null}
                        isApproved={data[index] && data[index].status === 1}
                        record={record}
                        index={index}
                        data={data}
                        unApprovedStages={unApprovedStages}
                        userAllowedStages={userAllowedStages}
                    />
                </div>
            ))
        }
    </>;
};

const StageAccoridion = props => {
    const { record, data, index, downloadSampleReport, deleteSampleReport, uploadFile, reports, userAllowedStages, unApprovedStages, id, isApproved, updateHistoryRecord } = props;
    const { enqueueSnackbar, isMobile, role } = useContext(UserContext);
    const [showDeletedDocs, setshowDeletedDocs] = useState(false);
    const [newDocs, setnewDocs] = useState({
        file_name: '',
        file_type: '',
        document_type: '',
        color_sample_history_id: '',
        file: null
    });
    const [memo, setmemo] = useState("");

    useEffect(() => {
        id && setmemo(data[index].memo || "");
    }, []);

    const onFileInputChange = async (e, color_sample_history_id) => {
        let { files } = e.target;

        if (!files || files.length === 0) return;

        setnewDocs({
            ...newDocs,
            file: new Blob([new Uint8Array(await files[0].arrayBuffer())], { type: files[0].type }),
            file_name: files[0].name,
            file_type: files[0].type,
            color_sample_history_id
        });
    };

    const isAccordionDisabled = record.id > unApprovedStages[0];

    return (
        <Accordion className="tracker-accordion-main" elevation={0} disabled={isAccordionDisabled}>
            <AccordionSummary
                expandIcon={<i className="material-icons">expand_more</i>}
            >
                <Typography style={{ fontWeight: 400, fontSize: '16px' }}>
                    {record.display_name}{isApproved && ` - Approved by ${data[index].updated_by_user.first_name} ${data[index].updated_by_user.last_name}`}
                    <br />
                    <span style={{ fontSize: '12px', color: 'grey' }}>{isApproved && new Date(data[index].updated_at).toLocaleString()}</span>
                </Typography>
            </AccordionSummary>
            {(!isAccordionDisabled && id) && <AccordionDetails className="tracker-accordion-body flex flex-c-flow">
                <div className="flex flex-v-centered full-width">
                    <Typography color="secondary" style={{ fontWeight: 400, fontSize: '16px', marginRight: '10px' }}>Documents</Typography>
                    <FormControlLabel
                        style={{ marginLeft: 'auto' }}
                        control={
                            <Switch
                                checked={showDeletedDocs}
                                size="small"
                                onChange={e => setshowDeletedDocs(!showDeletedDocs)}
                            />
                        }
                        label="Show Deleted"
                    />

                </div>
                <div className="flex flex-c-flow documents-container m-top-1">
                    <div className="flex flex-c-flow full-width">
                        <TableContainer component={Paper} elevation={0} style={{ maxHeight: '15em' }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left" style={{ color: 'var(--secondary-color)', whiteSpace: 'nowrap' }}>REPORT TYPE</TableCell>
                                        <TableCell align="left" style={{ color: 'var(--secondary-color)', whiteSpace: 'nowrap' }}>CREATED AT</TableCell>
                                        <TableCell align="left" style={{ color: 'var(--secondary-color)', whiteSpace: 'nowrap' }}>CREATED BY</TableCell>
                                        <TableCell align="left" style={{ color: 'var(--secondary-color)', whiteSpace: 'nowrap' }}>UPDATED AT</TableCell>
                                        <TableCell align="left" style={{ color: 'var(--secondary-color)', whiteSpace: 'nowrap' }}>UPDATED BY</TableCell>
                                        <TableCell align="left" style={{ color: 'var(--secondary-color)', whiteSpace: 'nowrap' }}>FILE NAME</TableCell>
                                        <TableCell align="center" style={{ color: 'var(--secondary-color)', whiteSpace: 'nowrap' }}>DOWNLOAD</TableCell>
                                        <TableCell align="center" style={{ color: 'var(--secondary-color)', whiteSpace: 'nowrap' }}>DELETE</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        (data[index] && data[index].id !== 0) && data[index].documents.map(doc =>
                                            (showDeletedDocs || doc.is_deleted !== 1) &&
                                            <TableRow key={doc.uuid}>
                                                <TableCell align="left">{doc.document_type_report_type.report_alias}</TableCell>
                                                <TableCell align="left">{new Date(doc.created_at).toLocaleString()}</TableCell>
                                                <TableCell align="left">{doc.created_by_user.first_name}</TableCell>
                                                <TableCell align="left">{doc.updated_at ? new Date(doc.updated_at).toLocaleString() : ''}</TableCell>
                                                <TableCell align="left">{doc.updated_by_user ? doc.updated_by_user.first_name : ''}</TableCell>
                                                <TableCell align="left">{doc.downloadable_file.file_path.slice(doc.downloadable_file.file_path.search('_') + 1)}</TableCell>
                                                <TableCell align="center">
                                                    <IconButton color="primary" size="small" onClick={e => downloadSampleReport(doc.downloadable_file_id)}>
                                                        {<i className="material-icons">file_download</i>}
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell align="center">
                                                    {
                                                        doc.is_deleted === 1 ?
                                                            'Deleted'
                                                            :
                                                            <IconButton color="primary" size="small" onClick={e => deleteSampleReport(doc.id, data[index].color_sample_id)}>
                                                                {<i className="material-icons">delete</i>}
                                                            </IconButton>
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        )

                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Typography color="secondary" style={{ fontWeight: 400, fontSize: '16px', marginRight: '10px', marginTop: '1em' }}>Add Documents</Typography>
                        <div className="flex flex-v-centered full-width m-top-1" style={{ flexWrap: 'wrap' }}>
                            <FormControl variant="filled" size="small" style={{ width: '12em' }}>
                                <InputLabel>Report Type</InputLabel>
                                <Select
                                    value={newDocs.document_type}
                                    onChange={e => setnewDocs({ ...newDocs, document_type: e.target.value })}
                                >
                                    <MenuItem value={0} disabled>
                                        <em>Choose Report Type</em>
                                    </MenuItem>
                                    {
                                        reports.map(rep => rep.report_stage_maps.map(rsm => rsm.stage_id).includes(record.id) ? <MenuItem key={rep.id} value={rep.id}>{rep.report_alias}</MenuItem> : null)
                                    }
                                </Select>
                            </FormControl>

                            <input
                                accept="*/*"
                                id={`${id}-upload-button-file`}
                                multiple
                                type="file"
                                style={{ display: 'none' }}
                                onChange={e => onFileInputChange(e, data[index].id)}
                            />
                            <label htmlFor={`${id}-upload-button-file`}>
                                <Button color="primary" variant="outlined" disableElevation component="span" style={{ marginLeft: '20px' }}>Choose File</Button>
                            </label>
                            <Typography style={{ fontWeight: 300, fontSize: '14px', marginLeft: '10px' }}>{newDocs.file_name}</Typography>
                            <IconButton color="primary" size="small" style={{ marginLeft: '20px' }} disabled={!newDocs.file} onClick={e => {
                                setnewDocs({
                                    file_name: '',
                                    document_type: '',
                                    color_sample_history_id: '',
                                    file: null,
                                    file_type: ''
                                }); document.getElementById(`${id}-upload-button-file`).value = '';
                            }}>
                                {<i className="material-icons">clear</i>}
                            </IconButton>
                            <IconButton color="primary" size="small" style={{ marginLeft: '20px' }} disabled={!newDocs.file || !newDocs.document_type} onClick={async e => {
                                await uploadFile(newDocs, data[index].color_sample_id);
                                setnewDocs({
                                    file_name: '',
                                    document_type: '',
                                    color_sample_history_id: '',
                                    file: null,
                                    file_type: ''
                                });
                                document.getElementById(`${id}-upload-button-file`).value = '';
                            }}>
                                {<i className="material-icons">file_upload</i>}
                            </IconButton>
                        </div>

                        <Typography color="secondary" style={{ fontWeight: 400, fontSize: '16px', marginRight: '10px', marginTop: '1em' }}>Remarks</Typography>
                        {
                            !userAllowedStages.includes(record.id) ?
                                <Typography style={{ fontWeight: 300, fontSize: '14px', marginRight: '10px' }}>{data[index].memo || "No remarks added"}</Typography>
                                :
                                <div className="flex flex-v-centered full-width m-top-1">
                                    <TextField value={memo} size="small" label="Remarks" variant="filled" onChange={e => setmemo(e.target.value)} />
                                    <IconButton color="primary" size="small" style={{ marginLeft: '20px' }} disabled={!memo} onClick={async e => {
                                        await updateHistoryRecord(data[index].id, { memo: memo }, data[index].color_sample_id);
                                    }}>
                                        {<i className="material-icons">done</i>}
                                    </IconButton>
                                </div>
                        }
                    </div>
                </div>
                <div className="flex action-button-container m-top-1">
                    {(!isApproved && userAllowedStages.includes(record.id)) && <Button size="small" variant="contained" color="primary" onClick={async e => {
                        await updateHistoryRecord(data[index].id, { memo: memo, isApproved: true }, data[index].color_sample_id);
                    }}>Approve</Button>}
                    {(!isApproved && userAllowedStages.includes(record.id)) && <Button size="small" variant="contained" style={{ marginLeft: '10px' }} onClick={async e => {
                        await updateHistoryRecord(data[index].id, { memo: memo, isApproved: false }, data[index].color_sample_id);
                    }}>Reject</Button>}
                    {/* <Button size="small" color="secondary" variant="contained" style={{ marginLeft: '10px' }}>Save</Button> */}
                </div>
            </AccordionDetails>}
        </Accordion>
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
                },
                created_by_user: {
                    first_name: "",
                    last_name: ""
                }
            }
        ],
        created_by_user: {
            first_name: "",
            last_name: ""
        },
        updated_by_user: {
            first_name: "",
            last_name: ""
        }
    }
];

export default Tracker;
