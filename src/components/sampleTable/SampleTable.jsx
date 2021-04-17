import { Box, CircularProgress, Collapse, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { getColorsBySampleID } from '../../server';
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
                            <TableCell align="left" style={{ color: 'var(--secondary-color)', whiteSpace: 'nowrap' }}>SAMPLE ID</TableCell>
                            <TableCell align="center" style={{ color: 'var(--secondary-color)', whiteSpace: 'nowrap' }}>MEMO</TableCell>
                            <TableCell align="center" style={{ color: 'var(--secondary-color)', whiteSpace: 'nowrap' }}>BUYER NAME</TableCell>
                            <TableCell align="center" style={{ color: 'var(--secondary-color)', whiteSpace: 'nowrap' }}>CREATED BY</TableCell>
                            <TableCell align="center" style={{ color: 'var(--secondary-color)', whiteSpace: 'nowrap' }}>CREATED AT</TableCell>
                            <TableCell align="center" style={{ color: 'var(--secondary-color)', whiteSpace: 'nowrap' }}># OF COLORS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {samples.map(sample => <SampleRow sample={sample} key={sample.uuid} history={props.history} />)}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

function SampleRow(props) {
    const { sample } = props;
    const [open, setOpen] = useState(false);
    const [state, setstate] = useState({
        isLoading: false,
        colors: []
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

    return (
        <React.Fragment>
            <TableRow className="order-row">
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={getColors}>
                        {state.isLoading ? <CircularProgress size={20} color="secondary" /> : open ? <i className="material-icons">keyboard_arrow_up</i> : <i className="material-icons">keyboard_arrow_down</i>}
                    </IconButton>
                </TableCell>
                <TableCell align="left" style={{ whiteSpace: 'nowrap' }}>{sample.sample_id}</TableCell>
                <TableCell align="center">{sample.memo}</TableCell>
                <TableCell align="center">{sample.buyer_name}</TableCell>
                <TableCell align="center" style={{ whiteSpace: 'nowrap' }}>{sample.user.name}</TableCell>
                <TableCell align="center">{new Date(sample.created_at).toLocaleString()}</TableCell>
                <TableCell align="center">{sample.colorCount}</TableCell>
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
                                        <TableCell align="left" style={{ color: 'var(--logo-color)', whiteSpace: 'nowrap' }}>COLOR ID</TableCell>
                                        <TableCell align="left" style={{ color: 'var(--logo-color)', whiteSpace: 'nowrap' }}>No OF PIECES</TableCell>
                                        <TableCell align="left" style={{ color: 'var(--logo-color)', whiteSpace: 'nowrap' }}>CREATED AT</TableCell>
                                        <TableCell align="left" style={{ color: 'var(--logo-color)', whiteSpace: 'nowrap' }}>UPDATED AT</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        state.colors.map(color =>
                                            <TableRow key={color.id}>
                                                <TableCell align="left">
                                                    <IconButton size="small" onClick={e => props.history.push(`/portal/samples/${color.id}/track`)}>
                                                        <i className="material-icons" style={{ color: 'var(--secondary-color)' }}>timeline</i>
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell align="left">{color.color_id}</TableCell>
                                                <TableCell align="left">{color.no_of_pieces}</TableCell>
                                                <TableCell align="left">{new Date(color.created_at).toLocaleString()}</TableCell>
                                                <TableCell align="left">{new Date(color.updated_at).toLocaleString()}</TableCell>
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

export default SampleTable;