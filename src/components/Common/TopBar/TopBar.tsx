import React from 'react';
import {AppBar, Button, Container, Toolbar, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import UserMenu from "./UserMenu/UserMenu.lazy";
import {PATHS} from "util/config";
import {CustomTheme} from "util/theme";
import RouterLink from "../RouterLink";

const useStyles = makeStyles((theme: CustomTheme) => ({
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
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
                        <RouterLink to={PATHS.public.base}>
                            <Button>
                                <Typography variant="h6" className={classes.title}>
                                    Distro PHL
                                </Typography>
                            </Button>
                        </RouterLink>
                    </Container>
                    <UserMenu/>
                </Toolbar>
            </AppBar>
        </div>
    );
}
export default TopBar;
