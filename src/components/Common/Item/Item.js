import React, {useState} from 'react';
import {Card, CardActionArea, CardContent, CardMedia, ClickAwayListener, Collapse, Divider, Grid, makeStyles, Typography} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
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

const Item = ({item, itemAction}) => {
    const classes = useStyles();

    const {name, description, imgUrl} = item;
    const [openDesc, setOpenDesc] = useState(false);

    if (itemAction === undefined) (itemAction = (() => (<div/>)))

    const clickCard = () => {
        setOpenDesc(!openDesc);
    };

    const clickAway = () => {
        setOpenDesc(false);
    };

    return (
        <Grid item xs>
            <ClickAwayListener onClickAway={clickAway}>
                <Card className={classes.card}>
                    <CardActionArea onClick={clickCard}>
                        <CardMedia
                            className={classes.media}
                            image={imgUrl}
                            title={name}/>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                {name}
                            </Typography>
                            <Collapse in={openDesc} collapsedHeight={100}>
                                <Grid container direction="column">
                                    <Grid item xs>
                                        <Typography gutterBottom
                                                    variant="body2"
                                                    color="textSecondary">
                                            {description}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs>
                                        <Typography variant="body2">
                                            Supplied by:
                                        </Typography>
                                        <Typography variant="button">
                                            {item.uid}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Collapse>
                        </CardContent>
                        <Divider/>
                    </CardActionArea>
                    {itemAction(item)}
                </Card>
            </ClickAwayListener>
        </Grid>
    );
}

export default Item;
