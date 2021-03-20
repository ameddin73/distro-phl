import React from 'react';
import {Button, Grid, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";
// @ts-ignore
import {navigate, useRoutes} from "hookrouter";
import {PATHS} from "../../../util/config";
import {RouteType} from "../../../util/types";

const routes: RouteType = {};
routes['*' + PATHS.public.distro] = routes['*' + PATHS.user.items] = () => (
    <Button variant="contained" color="primary" onClick={() => navigate(PATHS.public.createItem)}>Make a Post</Button>
)

const useStyles = makeStyles({
    body: {
        position: 'absolute',
        top: '25%',
    },
});

const NothingHere = () => {
    const classes = useStyles();
    const routeResult = useRoutes(routes) || routes['*' + PATHS.user.items];

    return (
        <div className={classes.body} >
            <Grid container direction="column" alignItems="center" spacing={2}>
                <Grid item xs>
                    <Typography variant="h5" color="primary" align="center">Oops, theres nothing here.</Typography>
                </Grid>
                <Grid item xs>
                    {routeResult}
                </Grid>
            </Grid>
        </div>
    )
};

export default NothingHere;
