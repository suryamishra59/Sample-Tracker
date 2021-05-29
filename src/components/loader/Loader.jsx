import { CircularProgress } from '@material-ui/core';
import React, { useContext } from 'react';
import UserContext from '../../UserContext';
import './Loader.scss';

const Loader = ({ isLoading }) => {
    const { isDarkThemeEnabled } = useContext(UserContext);
    return (
        <div className={`loading-icon-wrapper flex flex-centered ${isDarkThemeEnabled ? 'dark' : ''} ${!isLoading ? 'hidden' : ''}`}>
            <CircularProgress />
        </div>
    );
};

export default Loader;