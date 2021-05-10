import {makeStyles} from "@material-ui/core/styles";

const CARD_SQUARE = 286;
export const CARD_MEDIA_HEIGHT = 140;
export const postCardStyle = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        paddingBottom: 0,
    },
    card: {
        width: '100%',
        display: "inline-block",
        maxWidth: 440,
        minWidth: CARD_SQUARE,
        height: 214,
        backgroundColor: theme.palette.background.default,
        borderColor: theme.palette.text.secondary,
        borderRadius: 14,
    },
    action: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    media: {
        width: '100%',
        height: CARD_MEDIA_HEIGHT,
        objectFit: 'cover',
    },
    title: {
        paddingLeft: theme.spacing(2),
        fontWeight: "bold",
    },
    divider: {
        marginLeft: theme.spacing(2) * -1,
    },
    detailContainer: {
        display: 'flex',
        alignItems: 'center',
        paddingTop: theme.spacing(1),
        bottom: 0,
    },
    userInfo: {
        paddingLeft: theme.spacing(2),
        paddingBottom: theme.spacing(1),
    },
    detail: {
        color: theme.palette.text.secondary,
        paddingRight: theme.spacing(1),
    },
}));

