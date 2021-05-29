import { Box, Button, CircularProgress, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { } from '../../server';
import UserContext from '../../UserContext';
import './ReportTable.scss';

const ReportTable = (props) => {
    const reports = props.reports || [];
    return (
        <>
            <TableContainer component={Paper} elevation={0}>
                <Table aria-label="collapsible table" className="orderTable">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left" style={{ color: 'var(--secondary-color)', whiteSpace: 'nowrap' }}>STYLE ID</TableCell>
                            <TableCell align="left" style={{ color: 'var(--secondary-color)', whiteSpace: 'nowrap' }}>COLOR</TableCell>
                            <TableCell align="left" style={{ color: 'var(--secondary-color)', whiteSpace: 'nowrap' }}>BUYER NAME</TableCell>
                            <TableCell align="left" style={{ color: 'var(--secondary-color)', whiteSpace: 'nowrap' }}>REPORT TYPE</TableCell>
                            <TableCell align="left" style={{ color: 'var(--secondary-color)', whiteSpace: 'nowrap' }}>REPORT NAME</TableCell>
                            <TableCell align="left" style={{ color: 'var(--secondary-color)', whiteSpace: 'nowrap' }}>SAMPLE TYPE</TableCell>
                            <TableCell align="left" style={{ color: 'var(--secondary-color)', whiteSpace: 'nowrap' }}>STAGE</TableCell>
                            <TableCell align="left" style={{ color: 'var(--secondary-color)', whiteSpace: 'nowrap' }}>CREATED BY</TableCell>
                            <TableCell align="left" style={{ color: 'var(--secondary-color)', whiteSpace: 'nowrap' }}>CREATED AT</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reports.map(report => <ReportRow report={report} key={report.uuid} history={props.history} downloadSampleReport={props.downloadSampleReport} />)}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

function ReportRow(props) {
    const { report: doc, downloadSampleReport } = props;

    return (
        <React.Fragment>
            <TableRow key={doc.uuid}>
                <TableCell align="left">{doc.sample_id}</TableCell>
                <TableCell align="left">{doc.color_id}</TableCell>
                <TableCell align="left">{doc.buyer_name}</TableCell>
                <TableCell align="left">{doc.report_type}</TableCell>
                <TableCell align="left">{doc.file_name.slice(doc.file_name.search('_') + 1)}</TableCell>
                <TableCell align="left">{doc.sample_type}</TableCell>
                <TableCell align="left">{doc.stage}</TableCell>
                <TableCell align="left">{doc.created_by}</TableCell>
                <TableCell align="left">{new Date(doc.created_at).toLocaleString()}</TableCell>
                <TableCell align="center">
                    <IconButton color="primary" size="small" onClick={e => downloadSampleReport(doc.downloadable_file_id)}>
                        {<i className="material-icons">file_download</i>}
                    </IconButton>
                </TableCell>
            </TableRow>
        </React.Fragment >
    );
}

export default ReportTable;