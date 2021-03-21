import {makeStyles} from "@material-ui/core/styles";

export const itemStyle = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    pad: {
        padding: theme.spacing(2),
    },
    card: {
        width: '100%',
        display: "inline-block",
        maxWidth: 440,
        minWidth: 220,
    },
    media: {
        width: '100%',
        height: 140,
        objectFit: 'cover',
    },
}));

