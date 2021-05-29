import { TextField } from '@material-ui/core';
import React, { useState, useEffect, useContext } from 'react';
import { Header, Loader, ReportTable } from '../../components';
import { downloadReport, getDetailReports } from '../../server';
import UserContext from '../../UserContext';
import './Reports.scss';

function Reports(props) {
    const [state, setstate] = useState({
        reports: [],
        filterReports: []
    });
    const [isLoading, setisLoading] = useState(false);
    const { enqueueSnackbar, isMobile } = useContext(UserContext);

    useEffect(() => {
        getReports().then();
    }, []);

    const getReports = async _ => {
        setisLoading(true);
        try {
            const resp = await getDetailReports();
            const reports = resp.data.sort((b, a) => b.sample_id > a.sample_id);
            setstate({ ...state, reports, filterReports: reports });
        } catch (error) {
            enqueueSnackbar && enqueueSnackbar(error, {
                variant: "error"
            });
        }
        setisLoading(false);
    };

    const downloadSampleReport = async downloadable_file_id => {
        setisLoading(true);
        try {
            const resp = await downloadReport(downloadable_file_id);
            setisLoading(false);
            const docWin = window.open();
            docWin.location.href = resp.data.download_link.url;
        } catch (error) {
            enqueueSnackbar && enqueueSnackbar(error, {
                variant: "error"
            });
        }
        setisLoading(false);
    };

    const onSearch = (event) => {
        if (!event.target.value) {
            setstate({ ...state, filterReports: state.reports });
            return;
        }
        const filterReports = state.reports.filter(rep =>
            rep.sample_id.toString().toLowerCase().includes(event.target.value.toLowerCase()) ||
            rep.buyer_name.toString().toLowerCase().includes(event.target.value.toLowerCase()) ||
            rep.color_id.toString().toLowerCase().includes(event.target.value.toLowerCase()) ||
            rep.sample_type.toString().toLowerCase().includes(event.target.value.toLowerCase()) ||
            rep.stage.toString().toLowerCase().includes(event.target.value.toLowerCase()) ||
            rep.report_type.toString().toLowerCase().includes(event.target.value.toLowerCase()) ||
            rep.file_name.slice(rep.file_name.search('_') + 1).toLowerCase().includes(event.target.value.toLowerCase()) ||
            rep.created_by.toString().toLowerCase().includes(event.target.value.toLowerCase())
        );

        setstate({ ...state, filterReports });
    };

    return (
        <>
            <Loader isLoading={isLoading} />
            <Header heading="My Reports" {...props} />
            <div className="reports-wrapper flex flex-c-flow flex-v-centered">
                <div className="flex flex-c-flow" style={{ marginTop: '5em', width: isMobile ? '95%' : '80%' }} id="#my_reports">
                    <TextField label='Search...' variant="filled" onChange={onSearch} />
                    <br />
                    <ReportTable reports={state.filterReports} history={props.history} downloadSampleReport={downloadSampleReport} />
                </div>
            </div>
        </>
    );
}

export default Reports;
