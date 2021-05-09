import React from "react";
import {makeStyles} from "@material-ui/styles";
import Animation from "./load-animation.svg";

export const loadingStyles = (offset: string) => makeStyles({
    body: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    animation: {
        marginTop: offset,
        height: "inherit",
        maxHeight: 96,
    }
});

const Loading = ({marginTop = '0%'}: { marginTop?: string }) => {
    const classes = loadingStyles(marginTop)();

    return (
        <div className={classes.body}>
            <object id="loading" aria-label="loading animation" data={Animation} className={classes.animation}/>
        </div>
    )
};

export default Loading;