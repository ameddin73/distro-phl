import {CircularProgress} from "@material-ui/core";
import React from "react";
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles({
    body: {
        position: 'absolute',
        left: '50%',
        top: '25%',
    },
});

const Loading = () => {
    const classes = useStyles();

    return (
        <div className={classes.body}>
            <CircularProgress/>
        </div>
    )
};

export default Loading;