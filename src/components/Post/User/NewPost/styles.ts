import {makeStyles} from "@material-ui/core/styles";
import theme from "util/theme";
import {grey} from "@material-ui/core/colors";

export const useStyles = makeStyles({
    root: {
        flexGrow: 1
    },
    container: {
        padding: theme.spacing(2),
    },
    mediaBox: {
        background: grey[500],
        padding: theme.spacing(1),
    },
    upload: {
        color: grey[200],
        fontSize: 100,
    },
    title: {
        fontSize: theme.typography.h6.fontSize,
    },
    input: {
        width: '100%',
        paddingBottom: theme.spacing(2),
        float: 'left',
    },
    body: {
        fontSize: theme.typography.body2.fontSize,
    },
    error: {
        color: theme.palette.error.light,
        padding: theme.spacing(1),
        maxWidth: '240px',
    },
});

