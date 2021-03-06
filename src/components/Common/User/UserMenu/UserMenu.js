import React, {useState} from 'react';
import {IfFirebaseAuthed, IfFirebaseUnAuthed} from "@react-firebase/auth";
import {Button, Menu, MenuItem} from "@material-ui/core";
import firebase from "firebase/app";
import {navigate} from 'hookrouter';

const UserMenu = () => {
    const [anchorEl, setAnchorEl] = useState();

    const menuClick = (event) => (setAnchorEl(event.currentTarget));
    const menuClose = () => (setAnchorEl(null))

    return (
        <div>
            <IfFirebaseUnAuthed>
                {({...rest}) => (
                    <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
                )}
            </IfFirebaseUnAuthed>
            <IfFirebaseAuthed>
                {({user, ...rest}) => (
                    <div>
                        <Button aria-controls="simple-menu" aria-haspopup="true" onClick={menuClick}>
                            {user.displayName}
                        </Button>
                        <Menu
                            id="user-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={menuClose}>
                            <MenuItem onClick={() => firebase.auth().signOut()}>Sign Out</MenuItem>
                        </Menu>
                    </div>
                )}
            </IfFirebaseAuthed>
        </div>
    );
}

export default UserMenu;
