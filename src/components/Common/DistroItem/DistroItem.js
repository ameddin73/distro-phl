import React from 'react';
import {Button, Card, CardActionArea, CardActions, CardContent, CardMedia, makeStyles, Paper, Typography} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        maxWidth: 340,
    },
    paper: {
        padding: theme.spacing(2),
    },
    card: {
        display: "inline-block",
        width: 240,
    },
    media: {
        height: 140,
    }
}));


const DistroItem = ({id, name, type, description, imgUrl, created, expires, uid}) => {
    const classes = useStyles();

    return (
        <div className={classes.paper}>
            <Card className={classes.card}>
                <CardActionArea>
                    <CardMedia
                        className={classes.media}
                        // image={imgUrl}
                        image="https://firebasestorage.googleapis.com/v0/b/pheeding-philly.appspot.com/o/soup4fam.jpg?alt=media&token=7628582c-0ac2-4a79-a8d0-837b04b34a69"
                        title={name}/>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            {description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Button variant="contained" fullWidth>Add to Cart</Button>
                </CardActions>
            </Card>
        </div>
    );
}

export default DistroItem;
