import React, {useState} from 'react';
import {Button, IconButton, List, ListItem, ListItemIcon, ListItemText, SwipeableDrawer} from "@material-ui/core";
import {Add, Close, ExitToApp, List as ListIcon, Menu as MenuIcon} from "@material-ui/icons";
import {PATHS} from "util/config";
import {AuthCheck, useAuth, useUser} from "reactfire";
import {useLocation} from 'react-router-dom';
import RouterLink from "../../RouterLink";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    button: {
        whiteSpace: "nowrap",
    },
    paper: {
        minWidth: 240,
        backgroundColor: theme.palette.primary.main,
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

    const toggleDrawer = (open: boolean) => () => (setOpen(open));
    const closeAndAction = (action: () => Promise<void>) => {
        toggleDrawer(false);
        action();
    }

    return (
        <AuthCheck fallback={
            <RouterLink to={{
                pathname: PATHS.public.login,
                state: {from: location}
            }} onClick={toggleDrawer(false)}>
                <Button color="inherit"
                        className={classes.button}>Sign In</Button>
            </RouterLink>
        }>
            {user &&
            <Button aria-controls="menu"
                    aria-haspopup="true"
                    onClick={toggleDrawer(true)}
                    endIcon={<MenuIcon/>}>
                {user.displayName}
            </Button>
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
