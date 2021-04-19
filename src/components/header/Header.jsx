import { AppBar, Button, Divider, IconButton, List, ListItem, ListItemIcon, ListItemText, SwipeableDrawer, Toolbar, Typography } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import UserContext from '../../UserContext';
import './Header.scss';
import logo from '../../assets/logo.png';

const Header = (props) => {
    const [state, setstate] = useState({
        anchor: false
    });
    const { logout, isMobile } = useContext(UserContext);

    const toggleDrawer = (open) => {
        setstate({ ...state, anchor: open });
    };

    const list = _ => (
        <div
            className="flex flex-c-flow flex-v-centered"
            style={{ minWidth: '13em' }}
            role="presentation"
            onClick={e => toggleDrawer(false)}
            onKeyDown={e => toggleDrawer(false)}
        >
            <img style={{margin: '1.5em 0'}} src={logo} alt="logo" width={100} />
            <List>
                <ListItem button onClick={e => props.history.push('/portal')}>
                    <ListItemIcon><i style={{ color: 'var(--logo-color)' }} className="material-icons">home</i></ListItemIcon>
                    <ListItemText primary="Home" />
                </ListItem>
                <ListItem button onClick={e => props.history.push('/portal/samples')}>
                    <ListItemIcon><i style={{ color: 'var(--logo-color)' }} className="material-icons">dashboard</i></ListItemIcon>
                    <ListItemText primary="Manage Sample" />
                </ListItem>
                <ListItem button onClick={e => props.history.push('/portal/samples/create')}>
                    <ListItemIcon><i style={{ color: 'var(--logo-color)' }} className="material-icons">edit</i></ListItemIcon>
                    <ListItemText primary="Create Sample" />
                </ListItem>
                <ListItem button onClick={logout}>
                    <ListItemIcon><i style={{ color: 'var(--logo-color)' }} className="material-icons">logout</i></ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItem>
            </List>
        </div>
    );

    return (
        <>
            <AppBar position="static" color="transparent" elevation={0}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={e => toggleDrawer(true)}>
                        <i className="material-icons">menu</i>
                    </IconButton>
                    <Typography variant="h6" style={{ fontWeight: 300, margin: 0, cursor: 'pointer' }} color="secondary" onClick={e => props.history.push('/portal')}>{props.heading}</Typography>
                    <Button style={{ marginLeft: 'auto', marginRight: '10px' }} color="secondary" onClick={logout}>LOGOUT</Button>
                </Toolbar>
            </AppBar>

            <SwipeableDrawer
                anchor="left"
                open={state.anchor}
                onClose={e => toggleDrawer(false)}
                onOpen={e => toggleDrawer(true)}
            >
                {list()}
            </SwipeableDrawer>

        </>
    );
};

export default Header;