import React from 'react';
import DistroHub from "../DistroHub/DistroHub.lazy";
import {AppBar, Container, IconButton, Toolbar, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";
import {Menu} from "@material-ui/icons";
import UserMenu from "./User/UserMenu/UserMenu.lazy";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

const Common = () => {
    const classes = useStyles();
    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Pheed Philly
                    </Typography>
                    <UserMenu/>
                </Toolbar>
            </AppBar>
            <Container maxWidth="md">
                <DistroHub/>
            </Container>
        </div>
    );
}
export default Common;
