import React from "react";
import {makeStyles} from "@material-ui/styles";
import Animation from "./logo-load.svg";

const useStyles = (offset: string) => makeStyles({
    body: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    animation: {
        marginTop: offset,
        height: "inherit",
        maxHeight: 48,
        maxWidth: 48,
    }
});

const Loading = ({marginTop = '0%'}: { marginTop?: string }) => {
    const classes = useStyles(marginTop)();

    return (
        <div className={classes.body}>
            <object aria-label="loading animation" data={Animation} className={classes.animation}/>
        </div>
    )
};

export default Loading;