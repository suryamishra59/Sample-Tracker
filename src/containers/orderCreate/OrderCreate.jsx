import { Accordion, AccordionDetails, AccordionSummary, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, Input, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@material-ui/core';
import React, { useState, useEffect, useContext } from 'react';
import { Header, Loader } from '../../components';
import { createOrder, getReportsByStageID } from '../../server';
import UserContext from '../../UserContext';
import './OrderCreate.scss';

function OrderCreate(props) {
    const [state, setstate] = useState({
        po_number: '',
        buyer_name: '',
        memo: '',
        samples: [
            {
                sample_id: '',
                memo: ''
            }
        ]
    });
    const [isLoading, setisLoading] = useState(false);
    const { enqueueSnackbar, isMobile, role } = useContext(UserContext);

    useEffect(() => {
    }, []);

    const onFieldChange = (e) => {
        const { name, value } = e.target;
        setstate({ ...state, [name]: value });
    };

    const onSampleFieldChange = (e, index) => {
        const { name, value } = e.target;
        const samples = state.samples;
        samples[index] = {
            ...state.samples[index],
            [name]: value
        };
        setstate({ ...state, samples });
    };

    const addSample = _ => {
        const samples = state.samples;
        samples.push({
            sample_id: '',
            memo: ''
        });
        setstate({ ...state, samples });
    };

    const deleteSample = (index) => {
        const samples = state.samples;
        samples.splice(index, 1);
        setstate({ ...state, samples });
    };

    const createOrderWithSamples = async _ => {
        const validationResp = validatePayload();
        if (validationResp) {
            enqueueSnackbar && enqueueSnackbar(validationResp, {
                variant: "error"
            });
            return;
        }

        const payload = {
            order: {
                po_number: state.po_number,
                buyer_name: state.buyer_name,
                memo: state.memo
            },
            samples: state.samples
        };
        setisLoading(true);

        try {
            const createResp = await createOrder(payload);
            enqueueSnackbar && enqueueSnackbar("Order created succesfully", {
                variant: "success"
            });
        } catch (error) {
            console.log(error);
            enqueueSnackbar && enqueueSnackbar(error, {
                variant: "error"
            });
        }

        setisLoading(false);
    };

    const validatePayload = _ => {
        if (!state.po_number) return "Invalid PO Number";
        if (!state.buyer_name) return "Invalid Buyer Name";
        if (!state.samples || state.samples.length <= 0) return "Atleast one sample is required";
        return state.samples.every(samp => samp.sample_id ? true : false) ? null : "Invalid sample id found";
    };

    return (
        <>
            <Loader isLoading={isLoading} />
            <Header heading="Create Order" />
            <div className="create-order-wrapper flex flex-c-flow flex-v-centered">
                <Paper elevation={isMobile ? 0 : 1} className="flex flex-c-flow inner-wrapper">
                    {
                        !isMobile &&
                        <div className="flex flex-v-centered">
                            <i className="material-icons" style={{ color: 'var(--logo-color)', fontSize: '28px' }}>add_circle</i>
                            <Typography variant="h5" style={{ marginLeft: '10px', fontWeight: 400 }} color="secondary">Create Order</Typography>
                        </div>
                    }

                    <form>
                        <Typography style={{ fontWeight: 400, color: 'red', fontSize: '14px' }} >Fields marked with * are required</Typography>

                        <TextField size="small" value={state.po_number} onChange={onFieldChange} name="po_number" label="PO Number" variant="filled" color="secondary" fullWidth className="create-order-fields" required />
                        <TextField size="small" value={state.buyer_name} onChange={onFieldChange} name="buyer_name" label="Buyer Name" variant="filled" color="secondary" fullWidth className="create-order-fields" required />
                        <TextField size="small" value={state.memo} onChange={onFieldChange} name="memo" label="Memo" variant="filled" color="secondary" fullWidth className="create-order-fields" />

                        <Divider style={{ width: '100%', margin: '2em 0' }} />

                        <Typography variant="h6" style={{ fontWeight: 400, fontSize: '18px', marginBottom: '0.5em' }} color="secondary" >Add Sample(s)</Typography>

                        <Table aria-label="collapsible table" className="createOrderTable">
                            <TableBody>
                                {state.samples.map((sample, index) => <SampleForm sample={sample} index={index} key={index} onChange={e => onSampleFieldChange(e, index)} deleteSample={e => deleteSample(index)} />)}
                            </TableBody>
                        </Table>

                        {/* {
                            state.samples.map((sample, index) => <SampleForm sample={sample} index={index} key={index} onChange={e => onSampleFieldChange(e, index)} deleteSample={e => deleteSample(index)} />)
                        } */}

                        <Button variant="outlined" className="m-top-1" color="primary" startIcon={<i className="material-icons">add</i>} onClick={addSample}>Add Sample</Button>
                        <br />
                        <Button variant="contained" className="m-top-1" color="secondary" fullWidth onClick={createOrderWithSamples}>Create Order</Button>

                    </form>

                </Paper>
            </div>
        </>
    );
}

function SampleForm({ sample, onChange, index, deleteSample }) {
    const [open, setopen] = useState(false);
    return (
        <>
            <TableRow className="create-order-row" >
                <TableCell align="center" >
                    <TextField size="small" value={sample.sample_id} onChange={onChange} name="sample_id" label="Sample ID" variant="filled" color="secondary" fullWidth className="create-order-fields" required />
                </TableCell>
                <TableCell align="center">
                    <TextField size="small" value={sample.memo} onChange={onChange} name="memo" label="Memo" variant="filled" color="secondary" fullWidth className="create-order-fields" />
                </TableCell>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" color="secondary" onClick={e => setopen(true)}>
                        {<i className="material-icons">delete</i>}
                    </IconButton>
                </TableCell>
            </TableRow>

            <Dialog
                open={open}
                keepMounted
                onClose={e => setopen(false)}
            >
                <DialogTitle>Confirm</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this sample?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={e => setopen(false)} color="primary">Cancel</Button>
                    <Button onClick={e => { deleteSample(); setopen(false); }} color="primary">Yes, Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default OrderCreate;
