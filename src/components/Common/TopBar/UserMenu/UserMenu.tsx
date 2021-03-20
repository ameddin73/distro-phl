import React, {SyntheticEvent, useState} from 'react';
import {Button, List, ListItem, ListItemText, SwipeableDrawer} from "@material-ui/core";
import {Menu as MenuIcon} from "@material-ui/icons";
// @ts-ignore
import {navigate, usePath} from 'hookrouter';
import {PATHS} from "../../../../util/config";
import {AuthCheck, useAuth, useUser} from "reactfire";

const UMenu = () => {
    const [open, setOpen] = useState(false);
    const {data: user} = useUser();
    const auth = useAuth();

    const toggleDrawer = (open: boolean) => (event: SyntheticEvent) => (setOpen(open));
    const closeAndAction = (action: () => void) => {
        toggleDrawer(false);
        action();
    }

    return (
        <div>
            <Button aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={toggleDrawer(true)}
                    endIcon={<MenuIcon/>}>
                {user.displayName}
            </Button>
            <SwipeableDrawer onClose={toggleDrawer(false)}
                             onOpen={toggleDrawer(true)}
                             open={open}>
                <List>
                    <ListItem button key="new-item" onClick={() => closeAndAction(() => navigate(PATHS.public.createItem))}>
                        <ListItemText primary="New Item"/>
                    </ListItem>
                    <ListItem button key="my-items" onClick={() => closeAndAction(() => navigate(PATHS.public.userItems))}>
                        <ListItemText primary="My Items"/>
                    </ListItem>
                    <ListItem button key="sign-out" onClick={() => closeAndAction(() => {
                        auth.signOut().then(navigate(PATHS.public.distro));
                    })}>
                        <ListItemText primary="Sign Out"/>
                    </ListItem>
                </List>
            </SwipeableDrawer>
        </div>
    )
}

const UserMenu = () => {
    const path = usePath();

    return (
        <>
            <AuthCheck fallback={
                <Button color="inherit"
                        onClick={() => navigate(PATHS.public.login, {redirect: path})}>Sign In</Button>
            }>
                <UMenu/>
            </AuthCheck>
        </>
    );
}

export default UserMenu;
