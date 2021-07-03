import React from 'react';
import {Button, Grid, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";
import {Link} from "react-router-dom";
import {PATHS} from "util/config";

const useStyles = makeStyles({
    body: {
        position: 'absolute',
        top: '25%',
    },
});

const NotFound = () => {
    const classes = useStyles();

    return (
        <>
            <Grid container direction="column" alignItems="center" alignContent="center" spacing={2} className={classes.body}>
                <Grid item xs>
                    <Typography role="alert" aria-label="404 not found" variant="h5" color="primary" align="center">Oops, looks like one of us fucked up.</Typography>
                    <Typography role="alert" variant="body1" color="textSecondary" align="center">We can't find that page (404)</Typography>
                </Grid>
                <Grid item xs>
                    <Button variant="contained" color="primary" component={Link} to={PATHS.public.base}>Go Home</Button>
                </Grid>
            </Grid>
        </>
    )
};

export default NotFound;