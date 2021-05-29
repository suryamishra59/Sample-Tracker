import { Box, Button, CircularProgress, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { downloadReport, getColorsBySampleID, deleteColorByID, deleteSampleByID } from '../../server';
import UserContext from '../../UserContext';
import './SampleTable.scss';

const SampleTable = (props) => {
    const samples = props.samples || [];
    return (
        <>
            <TableContainer component={Paper} elevation={0}>
                <Table aria-label="collapsible table" className="orderTable">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell align="left" style={{ color: 'var(--secondary-color)', whiteSpace: 'nowrap' }}>STYLE ID</TableCell>
                            <TableCell align="center" style={{ color: 'var(--secondary-color)', whiteSpace: 'nowrap' }}>REMARKS</TableCell>
                            <TableCell align="center" style={{ color: 'var(--secondary-color)', whiteSpace: 'nowrap' }}>BUYER NAME</TableCell>
                            <TableCell align="center" style={{ color: 'var(--secondary-color)', whiteSpace: 'nowrap' }}>CREATED BY</TableCell>
                            <TableCell align="center" style={{ color: 'var(--secondary-color)', whiteSpace: 'nowrap' }}>CREATED AT</TableCell>
                            <TableCell align="center" style={{ color: 'var(--secondary-color)', whiteSpace: 'nowrap' }}>No. OF COLORS</TableCell>
                            <TableCell align="center" style={{ color: 'var(--secondary-color)', whiteSpace: 'nowrap' }}>Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {samples.map(sample => <SampleRow sample={sample} key={sample.uuid} history={props.history} updateTableData={props.updateTableData} />)}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

function SampleRow(props) {
    const { sample, updateTableData } = props;
    const [open, setOpen] = useState(false);
    const [dialogOpen, setdialogOpen] = useState(false);
    const [sampleDialogOpen, setsampleDialogOpen] = useState(false);
    const [state, setstate] = useState({
        isLoading: false,
        colors: [],
        toDeleteColorID: ''
    });
    const { enqueueSnackbar } = useContext(UserContext);

    const getColors = async _ => {
        if (open) {
            setOpen(false);
            return;
        };
        setstate({ ...state, isLoading: true });
        try {
            const resp = await getColorsBySampleID(sample.id);
            setstate({ ...state, colors: resp.data, isLoading: false });
            setOpen(!open);
        } catch (error) {
            enqueueSnackbar && enqueueSnackbar(error, {
                variant: "error"
            });
            setstate({ ...state, isLoading: false });
        }
    };

    const downloadSampleReport = async downloadable_file_id => {
        setstate({ ...state, isLoading: true });
        try {
            const resp = await downloadReport(downloadable_file_id);
            const docWin = window.open();
            docWin.location.href = resp.data.download_link.url;
        } catch (error) {
            enqueueSnackbar && enqueueSnackbar(error, {
                variant: "error"
            });
        }
        setstate({ ...state, isLoading: false });
    };

    const deleteColor = async color_id => {
        setstate({ ...state, isLoading: true });
        try {
            const resp = await deleteColorByID(color_id);
            enqueueSnackbar && enqueueSnackbar(resp.message, {
                variant: "success"
            });
            await getColors();
        } catch (error) {
            enqueueSnackbar && enqueueSnackbar(error, {
                variant: "error"
            });
        }
        setstate({ ...state, isLoading: false });
    };

    const deleteSample = async sample_id => {
        setstate({ ...state, isLoading: true });
        try {
            const resp = await deleteSampleByID(sample_id);
            enqueueSnackbar && enqueueSnackbar(resp.message, {
                variant: "success"
            });
            await updateTableData();
        } catch (error) {
            enqueueSnackbar && enqueueSnackbar(error, {
                variant: "error"
            });
        }
        setstate({ ...state, isLoading: false });
    };

    return (
        <React.Fragment>
            <TableRow className="order-row">
                <TableCell>
                    <IconButton color="secondary" aria-label="expand row" size="small" onClick={getColors}>
                        {state.isLoading ? <CircularProgress size={20} color="secondary" /> : open ? <i className="material-icons">keyboard_arrow_up</i> : <i className="material-icons">keyboard_arrow_down</i>}
                    </IconButton>
                </TableCell>
                <TableCell align="left" style={{ whiteSpace: 'nowrap' }}>{sample.sample_id}</TableCell>
                <TableCell align="center">{sample.memo || '-'}</TableCell>
                <TableCell align="center">{sample.buyer_name}</TableCell>
                <TableCell align="center" style={{ whiteSpace: 'nowrap' }}>{sample.user.name}</TableCell>
                <TableCell align="center">{new Date(sample.created_at).toLocaleString()}</TableCell>
                <TableCell align="center">{sample.colorCount}</TableCell>
                <TableCell align="center">
                    <IconButton color="secondary" size="small" onClick={e => setsampleDialogOpen(true)}>
                        {<i className="material-icons">delete</i>}
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: open ? '1em' : 0, paddingTop: open ? '1em' : 0 }} colSpan={8}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left" style={{ color: 'var(--logo-color)', whiteSpace: 'nowrap' }}></TableCell>
                                        <TableCell align="left" style={{ color: 'var(--logo-color)', whiteSpace: 'nowrap' }}>COLOR</TableCell>
                                        <TableCell align="left" style={{ color: 'var(--logo-color)', whiteSpace: 'nowrap' }}>No OF PIECES</TableCell>
                                        <TableCell align="left" style={{ color: 'var(--logo-color)', whiteSpace: 'nowrap' }}>CREATED AT</TableCell>
                                        <TableCell align="left" style={{ color: 'var(--logo-color)', whiteSpace: 'nowrap' }}>UPDATED AT</TableCell>
                                        <TableCell align="center" style={{ color: 'var(--logo-color)', whiteSpace: 'nowrap' }}>DOWNLOAD QR</TableCell>
                                        <TableCell align="center" style={{ color: 'var(--logo-color)', whiteSpace: 'nowrap' }}>DELETE</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        state.colors.map(color =>
                                            <>
                                                <TableRow key={color.id}>
                                                    <TableCell align="left">
                                                        <Link to={{
                                                            pathname: `/portal/samples/${color.id}/track`,
                                                            state: {
                                                                sample_id: sample.sample_id,
                                                                color: color.color_id
                                                            }
                                                        }} >
                                                            <Button color="primary" variant="text" size="small" startIcon={<i className="material-icons">timeline</i>}>
                                                                Track
                                                            </Button>
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell align="left">{color.color_id}</TableCell>
                                                    <TableCell align="left">{color.no_of_pieces}</TableCell>
                                                    <TableCell align="left">{new Date(color.created_at).toLocaleString()}</TableCell>
                                                    <TableCell align="left">{new Date(color.updated_at).toLocaleString()}</TableCell>
                                                    <TableCell align="center">
                                                        <IconButton color="primary" size="small" onClick={e => downloadSampleReport(color.qr_downloadable_file_id)}>
                                                            {<i className="material-icons">file_download</i>}
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <IconButton color="primary" size="small" onClick={e => {
                                                            setdialogOpen(true);
                                                            setstate({ ...state, toDeleteColorID: color.id });
                                                        }}>
                                                            {<i className="material-icons">delete</i>}
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            </>
                                        )
                                    }
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>

            <Dialog
                open={sampleDialogOpen}
                keepMounted
                onClose={e => setsampleDialogOpen(false)}
            >
                <DialogTitle>Confirm</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete this Sample?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={e => setsampleDialogOpen(false)} color="primary">Cancel</Button>
                    <Button onClick={e => { deleteSample(sample.id); setsampleDialogOpen(false); }} color="primary">Yes, Delete</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={dialogOpen}
                keepMounted
                onClose={e => setdialogOpen(false)}
            >
                <DialogTitle>Confirm</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this Color?
                                                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={e => { setdialogOpen(false); setstate({ ...state, toDeleteColorID: '' }); }} color="primary">Cancel</Button>
                    <Button onClick={e => { deleteColor(state.toDeleteColorID); setdialogOpen(false); }} color="primary">Yes, Delete</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default SampleTable;