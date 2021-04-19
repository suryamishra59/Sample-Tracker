import React, { Component } from 'react';
import "./ScanQR.scss";
import UserContext from '../../UserContext';
import { Backdrop, IconButton } from '@material-ui/core';
import QrReader from 'react-qr-reader';
import { withSnackbar } from 'notistack';
import Loader from '../loader/Loader';

export class ScanQR extends Component {
    constructor() {
        super();

        this.state = {
        };

    }

    isScanned = false;
    handleScan = async val => {
        if (!val) return;

        try {
            if (!this.isScanned) {
                this.isScanned = true;
                console.log(val);
                val = val.split('com')[1];
                console.log(val);
                this.props.history.push(val);
                this.isScanned = false;
            }
        } catch (error) {
            this.context.enqueueSnackbar("Invalid QR", {
                variant: "error"
            });
            this.isScanned = false;
        }

    };

    render() {
        const qrContainer =
            <div style={this.props.style} className={`flex flex-centered flex-c-flow qr-wrapper ${this.props.withoutWrapper ? 'withoutWrapper' : ''} animate__animated animate__zoomIn`}>
                <Loader isLoading={this.state.isLoading} />
                {
                    (this.props.showCloseBtn && this.props.onCloseClick) &&
                    <IconButton onClick={e => this.props.onCloseClick(e)} style={{ position: 'absolute', top: '1em', right: '1em' }}>
                        <i className="material-icons" style={{ color: '#fff' }}>clear</i>
                    </IconButton>
                }
                {!this.props.withoutWrapper && <h2 style={{ color: 'var(--secondary-color)', marginBottom: '2em' }}>Scan QR</h2>}
                {
                    this.props.open &&
                    <QrReader
                        delay={1}
                        onError={console.log}
                        onScan={this.handleScan}
                        className={`qr-main flex flex-centered ${!window.navigator.mediaDevices && 'not-supported'}`}
                        style={this.props.withoutWrapper && { width: this.props.width }}
                    />
                }
            </div>;
        return (

            <>
                {
                    !this.props.fixed ?
                        <Backdrop open={this.props.open} style={{ zIndex: '1101' }}>
                            {qrContainer}
                        </Backdrop> :
                        qrContainer
                }
            </>
        );
    }
}

ScanQR.contextType = UserContext;
export default withSnackbar(ScanQR);
