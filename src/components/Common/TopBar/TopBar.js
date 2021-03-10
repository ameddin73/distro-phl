import React from 'react';
import {AppBar, Button, Container, Toolbar, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";
import UserMenu from "./UserMenu/UserMenu.lazy";
import {navigate} from 'hookrouter';
import {paths} from "../../../config";

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

const TopBar = () => {
    const classes = useStyles();

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Container className={classes.title}>
                        <Button onClick={() => navigate(paths.public.base)}>
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
export default TopBar;
