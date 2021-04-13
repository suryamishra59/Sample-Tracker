import { Box, CircularProgress, Collapse, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { getSamplesByOrderID } from '../../server';
import UserContext from '../../UserContext';
import './OrderTable.scss';

const OrderTable = (props) => {
    const orders = props.orders || [];
    return (
        <>
            <TableContainer component={Paper} elevation={0}>
                <Table aria-label="collapsible table" className="orderTable">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell align="left" style={{ color: 'var(--secondary-color)', whiteSpace: 'nowrap' }}>PO NUMBER</TableCell>
                            <TableCell align="center" style={{ color: 'var(--secondary-color)', whiteSpace: 'nowrap' }}>MEMO</TableCell>
                            <TableCell align="center" style={{ color: 'var(--secondary-color)', whiteSpace: 'nowrap' }}>CREATED BY</TableCell>
                            <TableCell align="center" style={{ color: 'var(--secondary-color)', whiteSpace: 'nowrap' }}>CREATED AT</TableCell>
                            <TableCell align="center" style={{ color: 'var(--secondary-color)', whiteSpace: 'nowrap' }}># OF SAMPLES</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map(order => <OrderRow order={order} key={order.uuid} />)}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

function OrderRow(props) {
    const { order } = props;
    const [open, setOpen] = useState(false);
    const [state, setstate] = useState({
        isLoading: false,
        samples: []
    });
    const { enqueueSnackbar } = useContext(UserContext);

    const getSamples = async _ => {
        if (open) {
            setOpen(false);
            return;
        };
        setstate({ ...state, isLoading: true });
        try {
            const resp = await getSamplesByOrderID(order.id);
            setstate({ ...state, samples: resp.data }, _ => setstate({ ...state, isLoading: false }));
            setOpen(!open);
        } catch (error) {
            enqueueSnackbar && enqueueSnackbar(error, {
                variant: "error"
            });
            setstate({ ...state, isLoading: false });
        }

    };

    return (
        <React.Fragment>
            <TableRow className="order-row">
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={getSamples}>
                        {state.isLoading ? <CircularProgress size={20} color="primary" /> : open ? <i className="material-icons">keyboard_arrow_up</i> : <i className="material-icons">keyboard_arrow_down</i>}
                    </IconButton>
                </TableCell>
                <TableCell align="left" style={{ whiteSpace: 'nowrap' }}>{order.po_number}</TableCell>
                <TableCell align="center">{order.memo}</TableCell>
                <TableCell align="center" style={{ whiteSpace: 'nowrap' }}>{order.user.name}</TableCell>
                <TableCell align="center">{new Date(order.created_at).toLocaleString()}</TableCell>
                <TableCell align="center">{order.sampleCount}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: open ? '1em' : 0, paddingTop: open ? '1em' : 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            {/* <Typography variant="h6" gutterBottom component="div" style={{ marginLeft: '15px' }} color="secondary">
                                Samples
                            </Typography> */}
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left"></TableCell>
                                        <TableCell align="left" style={{ color: 'var(--logo-color)', whiteSpace: 'nowrap' }}>SAMPLE ID</TableCell>
                                        <TableCell align="left" style={{ color: 'var(--logo-color)', whiteSpace: 'nowrap' }}>MEMO</TableCell>
                                        <TableCell align="left" style={{ color: 'var(--logo-color)', whiteSpace: 'nowrap' }}>CREATED AT</TableCell>
                                        <TableCell align="left" style={{ color: 'var(--logo-color)', whiteSpace: 'nowrap' }}>LAST STAGE</TableCell>
                                        <TableCell align="left" style={{ color: 'var(--logo-color)', whiteSpace: 'nowrap' }}>UPDATED AT</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        state.samples.map(sample =>
                                            <TableRow key={sample.id}>
                                                <TableCell align="left">
                                                    <IconButton size="small">
                                                        <i className="material-icons" style={{ color: 'var(--secondary-color)' }}>timeline</i>
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell align="left">{sample.sample_id}</TableCell>
                                                <TableCell align="left">{sample.memo}</TableCell>
                                                <TableCell align="left">{new Date(sample.created_at).toLocaleString()}</TableCell>
                                                <TableCell align="left">{sample.latestSampleHistoryRecord.stage.stage_name}</TableCell>
                                                <TableCell align="left">{new Date(sample.latestSampleHistoryRecord.updated_at).toLocaleString()}</TableCell>
                                            </TableRow>)
                                    }
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default OrderTable;