import React from 'react';
import {AppBar, Button, Container, Slide, Toolbar, useScrollTrigger} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import UserMenu from "./UserMenu/UserMenu.lazy";
import {PATHS} from "util/config";
import {CustomTheme} from "util/theme";
import RouterLink from "../RouterLink";
import {ReactComponent as Logo} from "../../../logo.svg";

const useStyles = makeStyles((theme: CustomTheme) => ({
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
    },
    logo: {
        width: 48,
        height: 48,
        padding: 0,
    }
}));

// https://material-ui.com/components/app-bar/#hide-app-bar
function HideOnScroll({children}: { children: React.ReactElement }) {
    const trigger = useScrollTrigger();

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

const TopBar = () => {
    const classes = useStyles();

    return (
        <HideOnScroll>
            <AppBar elevation={0}>
                <Toolbar variant="dense">
                    <Container className={classes.title}>
                        <RouterLink to={PATHS.public.base}>
                            <Button className={classes.logo}>
                                <Logo className={classes.logo}/>
                            </Button>
                        </RouterLink>
                    </Container>
                    <UserMenu/>
                </Toolbar>
            </AppBar>
        </HideOnScroll>
    );
}
export default TopBar;
