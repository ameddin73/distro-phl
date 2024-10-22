import React, {useState} from 'react';
import {Button, IconButton, List, ListItem, ListItemIcon, ListItemText, SwipeableDrawer} from "@material-ui/core";
import {Add, Close, ExitToApp, List as ListIcon, Menu as MenuIcon} from "@material-ui/icons";
import {PATHS} from "util/config";
import {AuthCheck, useAuth, useUser} from "reactfire";
import {useLocation} from 'react-router-dom';
import RouterLink from "common/RouterLink";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
    button: {
        whiteSpace: "nowrap",
        color: "black",
    },
    paper: {
        minWidth: 240,
    },
    closeMenuButton: {
        marginLeft: 'auto',
        marginRight: 0,
    }
}));

const UserMenu = () => {
    const classes = useStyles();

    const auth = useAuth();
    const location = useLocation();

    const [open, setOpen] = useState(false);
    const {data: user} = useUser();

    const toggleDrawer = (openDrawer: boolean) => () => (setOpen(openDrawer));
    const closeAndAction = async (action: () => Promise<void>) => {
        toggleDrawer(false);
        await action();
    }

    return (
        <AuthCheck fallback={
            <RouterLink to={{
                pathname: PATHS.public.login,
                state: {from: location}
            }} onClick={toggleDrawer(false)}>
                <Button className={classes.button}>Sign In</Button>
            </RouterLink>
        }>
            {user &&
            <Button className={classes.button}
                    aria-label="menu"
                    aria-controls="menu"
                    aria-haspopup="true"
                    onClick={toggleDrawer(true)}
                    endIcon={<MenuIcon/>}/>
            }
            <SwipeableDrawer onClose={toggleDrawer(false)}
                             onOpen={toggleDrawer(true)}
                             open={open}
                             anchor="right"
                             color="primary"
                             classes={{paper: classes.paper}}>
                <IconButton onClick={toggleDrawer(false)} className={classes.closeMenuButton}>
                    <Close/>
                </IconButton>
                <List>
                    <RouterLink to={PATHS.public.newPost} onClick={toggleDrawer(false)}>
                        <ListItem button key="new-post">
                            <ListItemIcon>
                                <Add/>
                            </ListItemIcon>
                            <ListItemText primary="New Post"/>
                        </ListItem>
                    </RouterLink>
                    <RouterLink to={PATHS.public.userPosts} onClick={toggleDrawer(false)}>
                        <ListItem button key="my-posts">
                            <ListItemIcon>
                                <ListIcon/>
                            </ListItemIcon>
                            <ListItemText primary="My Posts"/>
                        </ListItem>
                    </RouterLink>
                    <ListItem button key="sign-out" onClick={() => closeAndAction(() => auth.signOut())}>
                        <ListItemIcon>
                            <ExitToApp/>
                        </ListItemIcon>
                        <ListItemText primary="Sign Out"/>
                    </ListItem>
                </List>
            </SwipeableDrawer>
        </AuthCheck>
    );
}

export default UserMenu;
