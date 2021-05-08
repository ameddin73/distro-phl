import React from "react";
import {makeStyles} from "@material-ui/styles";
import Animation from "./logo-load.svg";

const useStyles = makeStyles({
    body: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    animation: {
        marginTop: '25%',
        height: "inherit",
        maxHeight: 48,
        maxWidth: 48,
    }
});

const Loading = () => {
    const classes = useStyles();

    return (
        <div className={classes.body}>
            <object aria-label="loading animation" data={Animation} className={classes.animation}/>
        </div>
    )
};

export default Loading;