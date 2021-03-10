import {Grid, Typography} from "@material-ui/core";
import React from "react";
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles({
    body: {
        position: 'absolute',
        top: '25%',
    },
});

export const EmptyList = () => {
    const classes = useStyles();

    return (
        <div className={classes.body} >
            <Grid container>
                <Grid item xs>
                    <Typography variant="h5" color="primary" justify="center">Oops, theres nothing here.</Typography>
                </Grid>
            </Grid>
        </div>
    )
};