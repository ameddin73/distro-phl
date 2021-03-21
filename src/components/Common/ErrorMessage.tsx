import React from 'react';
import {Grid, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";
import {FallbackProps} from "react-error-boundary";

const useStyles = makeStyles({
    body: {
        position: 'absolute',
        top: '25%',
    },
});

const ErrorMessage = ({error}: FallbackProps) => {
    const classes = useStyles();

    return (
        <div className={classes.body}>
            <Grid container direction="column" alignItems="center" spacing={2}>
                <Grid item xs>
                    <Typography role="alert" variant="h5" color="primary" align="center">{error.message}</Typography>
                </Grid>
            </Grid>
        </div>
    )
};

export default ErrorMessage;