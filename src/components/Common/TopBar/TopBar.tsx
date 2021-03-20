import React from 'react';
import {AppBar, Button, Container, Toolbar, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import UserMenu from "./UserMenu/UserMenu.lazy";
// @ts-ignore
import {navigate} from 'hookrouter';
import {PATHS} from "../../../util/config";

// @ts-ignore
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        // @ts-ignore
        fontFamily: theme.title.fontFamily,
    },
}));

const TopBar = () => {
    const classes = useStyles();

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Container className={classes.title}>
                        <Button onClick={() => navigate(PATHS.public.base)}>
                            <Typography variant="h6" className={classes.title}>
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
