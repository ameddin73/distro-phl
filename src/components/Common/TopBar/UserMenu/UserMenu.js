import React, {useState} from 'react';
import {IfFirebaseAuthed, IfFirebaseUnAuthed} from "@react-firebase/auth";
import {Button, Menu, MenuItem} from "@material-ui/core";
import {Menu as MenuIcon} from "@material-ui/icons";
import firebase from "firebase/app";
import {navigate, usePath} from 'hookrouter';
import {paths} from "../../config";

const UserMenu = () => {
    const [anchorEl, setAnchorEl] = useState(null);

    const path = usePath();

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
                    <Button color="inherit"
                    onClick={() => navigate(paths.public.login, {redirect: path})}>Login</Button>
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
                            <MenuItem onClick={() => closeAndAction(() => navigate(paths.public.createItem))}>New Item</MenuItem>
                            <MenuItem onClick={() => closeAndAction(() => navigate(paths.public.userItems))}>My Items</MenuItem>
                            <MenuItem onClick={() => closeAndAction(() => {
                                firebase.auth().signOut();
                                navigate(paths.public.distro);
                            })}>Sign Out</MenuItem>
                        </Menu>
                    </div>
                )}
            </IfFirebaseAuthed>
        </div>
    );
}

export default UserMenu;
