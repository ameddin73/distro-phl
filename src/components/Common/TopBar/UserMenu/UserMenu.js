import React, {useState} from 'react';
import {IfFirebaseAuthed, IfFirebaseUnAuthed} from "@react-firebase/auth";
import {Button, Menu, MenuItem} from "@material-ui/core";
import {Menu as MenuIcon} from "@material-ui/icons";
import firebase from "firebase/app";
import {navigate} from 'hookrouter';
import {paths} from "../../config";

const UserMenu = () => {
    const [anchorEl, setAnchorEl] = useState(null);

    const menuClick = (event) => (setAnchorEl(event.currentTarget));
    const menuClose = () => (setAnchorEl(null))
    const closeAndAction = (action) => {
        menuClose();
        action();
    }

    return (
        <div>
            <IfFirebaseUnAuthed>
                {({...rest}) => (
                    <Button color="inherit" onClick={() => navigate(paths.public.login)}>Login</Button>
                )}
            </IfFirebaseUnAuthed>
            <IfFirebaseAuthed>
                {({user}) => (
                    <div>
                        <Button aria-controls="simple-menu"
                                aria-haspopup="true"
                                onClick={menuClick}
                                endIcon={<MenuIcon/>}>
                            {user.displayName}
                        </Button>
                        <Menu
                            id="user-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={menuClose}>
                            <MenuItem onClick={() => closeAndAction(() => navigate(paths.public.login))}>My Items</MenuItem>
                            <MenuItem onClick={() => closeAndAction(() => firebase.auth().signOut())}>Sign Out</MenuItem>
                        </Menu>
                    </div>
                )}
            </IfFirebaseAuthed>
        </div>
    );
}

export default UserMenu;
