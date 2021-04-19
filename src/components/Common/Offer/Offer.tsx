import React, {useState} from 'react';
import {OfferInterface} from "util/types";
import {makeStyles} from "@material-ui/core/styles";
import {CardContent, Collapse, Grid, Typography} from "@material-ui/core";
import {postCardStyle} from "../Post/PostCard/styles";

export const offerStyles = makeStyles((theme) => ({
    card: {
        width: "auto",
    },
    content: {
        padding: theme.spacing(0),
    },
    date: {
        paddingRight: theme.spacing(2),
    },
    message: {
        padding: theme.spacing(3),
        paddingBottom: theme.spacing(1),
        paddingTop: theme.spacing(1),
        '& :hover': {
            cursor: "default",
        },
    },
}));

const Offer = (offer: OfferInterface) => {
    const classes = offerStyles();
    const cardClasses = postCardStyle();
    const {userName, message} = offer;
    const date = offer.getCreatedAsString();

    const [openMessage, setOpenMessage] = useState(false);

    const handleMessageClick = () => {
        setOpenMessage(prev => !prev);
    }

    return (
        <CardContent className={classes.content}>
            <Grid container
                  direction="row"
                  justify="space-between">
                <Grid item className={cardClasses.userInfo}>
                    <div className={cardClasses.detailContainer}>
                        <Typography variant="body2" className={cardClasses.detail}>
                            Offer by
                        </Typography>
                        <Typography variant="body1" color="primary" noWrap>
                            {userName}
                        </Typography>
                    </div>
                </Grid>
                <Grid item className={cardClasses.userInfo}>
                    <div className={cardClasses.detailContainer}>
                        <Typography variant="body1" color="textSecondary" noWrap className={classes.date}>
                            {date}
                        </Typography>
                    </div>
                </Grid>
            </Grid>
            <Collapse in={openMessage} collapsedHeight={25} className={classes.message}>
                <Typography onClick={handleMessageClick} variant="body2">
                    {message}
                </Typography>
            </Collapse>
        </CardContent>
    );
}

export default Offer;