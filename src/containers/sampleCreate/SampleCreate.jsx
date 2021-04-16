import { Accordion, AccordionDetails, AccordionSummary, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, Input, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@material-ui/core';
import React, { useState, useEffect, useContext } from 'react';
import { Header, Loader } from '../../components';
import { createOrder, createSample, getReportsByStageID } from '../../server';
import UserContext from '../../UserContext';
import './SampleCreate.scss';

function SampleCreate(props) {
    const [state, setstate] = useState({
        sample_id: '',
        buyer_name: '',
        memo: '',
        colors: [
            {
                color_id: '',
                memo: '',
                no_of_pieces: 0
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

    const onColorFieldChange = (e, index) => {
        const { name, value } = e.target;
        const colors = state.colors;
        colors[index] = {
            ...state.colors[index],
            [name]: value
        };
        setstate({ ...state, colors });
    };

    const addColor = _ => {
        const colors = state.colors;
        colors.push({
            sample_id: '',
            memo: ''
        });
        setstate({ ...state, colors });
    };

    const deleteColor = (index) => {
        const colors = state.colors;
        colors.splice(index, 1);
        setstate({ ...state, colors });
    };

    const createOrderWithColors = async _ => {
        const validationResp = validatePayload();
        if (validationResp) {
            enqueueSnackbar && enqueueSnackbar(validationResp, {
                variant: "error"
            });
            return;
        }

        const payload = {
            sample: {
                sample_id: state.sample_id,
                buyer_name: state.buyer_name,
                memo: state.memo
            },
            colors: state.colors
        };
        setisLoading(true);

        try {
            const createResp = await createSample(payload);
            enqueueSnackbar && enqueueSnackbar("Sample created succesfully", {
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
        if (!state.sample_id) return "Invalid Sample ID";
        if (!state.buyer_name) return "Invalid Buyer Name";
        if (!state.colors || state.colors.length <= 0) return "Atleast one sample is required";
        return state.colors.every(col => (col.color_id && col.no_of_pieces > 0) ? true : false) ? null : "Invalid color details";
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
                            <Typography variant="h5" style={{ marginLeft: '10px', fontWeight: 400 }} color="primary">Create Sample</Typography>
                        </div>
                    }

                    <form>
                        <Typography style={{ fontWeight: 400, color: 'red', fontSize: '14px' }} >Fields marked with * are required</Typography>

                        <TextField size="small" value={state.sample_id} onChange={onFieldChange} name="sample_id" label="Sample ID" variant="filled" color="primary" fullWidth className="create-order-fields" required />
                        <TextField size="small" value={state.buyer_name} onChange={onFieldChange} name="buyer_name" label="Buyer Name" variant="filled" color="primary" fullWidth className="create-order-fields" required />
                        <TextField size="small" value={state.memo} onChange={onFieldChange} name="memo" label="Memo" variant="filled" color="primary" fullWidth className="create-order-fields" />

                        <Divider style={{ width: '100%', margin: '2em 0' }} />

                        <Typography variant="h6" style={{ fontWeight: 400, fontSize: '18px', marginBottom: '0.5em' }} color="secondary" >Add Color(s)</Typography>

                        <Table aria-label="collapsible table" className="createOrderTable">
                            <TableBody>
                                {state.colors.map((color, index) => <ColorForm color={color} index={index} key={index} onChange={e => onColorFieldChange(e, index)} deleteColor={e => deleteColor(index)} />)}
                            </TableBody>
                        </Table>

                        <Button variant="outlined" className="m-top-1" color="secondary" startIcon={<i className="material-icons">add</i>} onClick={addColor}>Add Sample</Button>
                        <br />
                        <Button variant="contained" className="m-top-1" color="primary" fullWidth onClick={createOrderWithColors}>Create Order</Button>

                    </form>

                </Paper>
            </div>
        </>
    );
}

function ColorForm({ color, onChange, index, deleteColor }) {
    const [open, setopen] = useState(false);
    return (
        <>
            <TableRow className="create-order-row" >
                <TableCell align="center" >
                    <TextField size="small" value={color.color_id} onChange={onChange} name="color_id" label="Color ID" variant="filled" color="secondary" fullWidth className="create-order-fields" required />
                </TableCell>
                <TableCell align="center">
                    <TextField size="small" value={color.no_of_pieces} onChange={onChange} name="no_of_pieces" label="Number of Pieces" variant="filled" color="secondary" fullWidth className="create-order-fields" required type="number" inputProps={{ min: 1 }} />
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
                        Are you sure you want to delete this Color?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={e => setopen(false)} color="primary">Cancel</Button>
                    <Button onClick={e => { deleteColor(); setopen(false); }} color="primary">Yes, Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default SampleCreate;
