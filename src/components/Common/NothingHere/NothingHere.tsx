import React from 'react';
import {Button, Grid, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";
import {PATHS} from "util/config";
import RouterLink from "../RouterLink";

const useStyles = makeStyles({
    body: {
        position: 'absolute',
        top: '25%',
    },
});

const NothingHere = () => {
    const classes = useStyles();

    return (
        <div className={classes.body}>
            <Grid container direction="column" alignItems="center" spacing={2}>
                <Grid item xs>
                    <Typography variant="h5" color="primary" align="center">Oops, theres nothing here.</Typography>
                </Grid>
                <Grid item xs>
                    <RouterLink to={PATHS.public.createItem}>
                        <Button variant="contained" color="primary">Make a Post</Button>
                    </RouterLink>
                </Grid>
            </Grid>
        </div>
    )
};

export default NothingHere;
