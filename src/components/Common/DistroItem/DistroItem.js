import React, {useState} from 'react';
import {Card, CardActionArea, CardContent, CardMedia, ClickAwayListener, Collapse, Divider, Grid, Link, makeStyles, Typography} from "@material-ui/core";
import HubAction from "../../DistroHub/HubAction/HubAction.lazy";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    pad: {
        padding: theme.spacing(2),
    },
    card: {
        display: "inline-block",
        maxWidth: 340,
    },
    media: {
        height: 140,
        objectFit: 'fill',
    },
}));

const DistroItem = ({item}) => {
    const {name, description, imgUrl} = item;
    const classes = useStyles();
    const [openDesc, setOpenDesc] = useState(false);

    const clickCard = () => {
        setOpenDesc(!openDesc);
    };

    const clickAway = () => {
        setOpenDesc(false);
    };

    return (
        <Grid item xs>
            <ClickAwayListener onClickAway={clickAway}>
                <Card className={classes.card} onClick={clickCard}>
                    <CardActionArea>
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
                                    <Grid item>
                                        <Typography gutterBottom
                                                    variant="body2"
                                                    color="textSecondary">
                                            {description}
                                        </Typography>
                                    </Grid>
                                    <Link>click me!</Link>
                                </Grid>
                            </Collapse>
                        </CardContent>
                        <Divider/>
                        <HubAction item={item}/>
                    </CardActionArea>
                </Card>
            </ClickAwayListener>
        </Grid>
    );
}

export default DistroItem;
