import React, {SyntheticEvent, useState} from 'react';
import {Button, List, ListItem, ListItemText, SwipeableDrawer} from "@material-ui/core";
import {Menu as MenuIcon} from "@material-ui/icons";
import {PATHS} from "../../../../util/config";
import {AuthCheck, useAuth, useUser} from "reactfire";
import {useHistory} from 'react-router-dom';
import RouterLink from "../../RouterLink";

const UserMenu = () => {
    const auth = useAuth();
    const history = useHistory();

    const [open, setOpen] = useState(false);
    const {data: user} = useUser();

    const toggleDrawer = (open: boolean) => (event: SyntheticEvent) => (setOpen(open));
    const closeAndAction = (action: () => void) => {
        toggleDrawer(false);
        action();
    }

    return (
        <AuthCheck fallback={
            <RouterLink to={PATHS.public.login}>
                <Button color="inherit"
                        style={{whiteSpace: 'nowrap'}}>Sign In</Button>
            </RouterLink>
        }>
            {user &&
            <Button aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={toggleDrawer(true)}
                    style={{whiteSpace: 'nowrap'}}
                    endIcon={<MenuIcon/>}>
                {user.displayName}
            </Button>
            }
            <SwipeableDrawer onClose={toggleDrawer(false)}
                             onOpen={toggleDrawer(true)}
                             open={open}
                             anchor="right">
                <List>
                    <RouterLink to={PATHS.public.createItem}>
                        <ListItem button key="new-item">
                            <ListItemText primary="New Item"/>
                        </ListItem>
                    </RouterLink>
                    <RouterLink to={PATHS.public.userItems}>
                        <ListItem button key="my-items">
                            <ListItemText primary="My Items"/>
                        </ListItem>
                    </RouterLink>
                    <ListItem button key="sign-out" onClick={() => closeAndAction(() => {
                        auth.signOut().then(() => history.push(PATHS.public.base));
                    })}>
                        <ListItemText primary="Sign Out"/>
                    </ListItem>
                </List>
            </SwipeableDrawer>
        </AuthCheck>
    );
}

export default UserMenu;
