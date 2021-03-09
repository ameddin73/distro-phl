import React from 'react';
import {AppBar, Button, Container, IconButton, Toolbar, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";
import {Menu} from "@material-ui/icons";
import UserMenu from "./User/UserMenu/UserMenu.lazy";
import {navigate} from 'hookrouter';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        fontFamily: "Wallpoet",
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
                    <Container className={classes.title}>
                        <Button onClick={() => navigate('/')}>
                            <Typography variant="h6">
                                Distro PHL
                            </Typography>
                        </Button>
                    </Container>
                    <UserMenu/>
                </Toolbar>
            </AppBar>
        </div>
    );
}
export default Common;
