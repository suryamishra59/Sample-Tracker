import { AppBar, Button, IconButton, List, ListItem, ListItemIcon, ListItemText, SwipeableDrawer, Toolbar, Typography } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import UserContext from '../../UserContext';
import './Header.scss';

const Header = (props) => {
    const [state, setstate] = useState({
        anchor: false
    });

    const toggleDrawer = (open) => {
        console.log(open);
        setstate({ ...state, anchor: open });
    };

    const list = _ => (
        <div
            style={{ minWidth: '13em' }}
            role="presentation"
            onClick={e => toggleDrawer(false)}
            onKeyDown={e => toggleDrawer(false)}
        >
            <List>
                <ListItem button key={"manage-orders"}>
                    <ListItemIcon><i style={{ color: 'var(--secondary-color)' }} className="material-icons">dashboard</i></ListItemIcon>
                    <ListItemText primary="Manage Orders" />
                </ListItem>
                <ListItem button key={"Create-orders"}>
                    <ListItemIcon><i style={{ color: 'var(--secondary-color)' }} className="material-icons">edit</i></ListItemIcon>
                    <ListItemText primary="Create Orders" />
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
                    <Typography variant="h6" style={{ fontWeight: 300, margin: 0 }} color="primary">Sample Tracker</Typography>
                    <Button style={{ marginLeft: 'auto', marginRight: '10px' }} color="secondary">LOGOUT</Button>
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