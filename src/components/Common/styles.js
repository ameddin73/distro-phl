import {makeStyles} from "@material-ui/styles";

export const itemStyle = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    pad: {
        padding: theme.spacing(2),
    },
    card: {
        display: "inline-block",
        maxWidth: 440,
        minWidth: 220,
    },
    media: {
        height: 140,
        objectFit: 'fill',
    },
}));

