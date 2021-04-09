import React, {useState} from 'react';
import {Card, CardActionArea, CardContent, ClickAwayListener, Collapse, Grid, Typography} from "@material-ui/core";
import {postStyle} from "util/styles";
import {DEFAULT_IMAGE} from "util/config";
import {StorageImage} from "reactfire";
import Loading from "../Loading";
import {PostInterface} from "./types";

export type PostProps = {
    post: PostInterface
    postAction?: (post: PostProps) => JSX.Element,
}

const Post = ({post, postAction = (() => (<div/>))}: PostProps) => {
    const classes = postStyle();

    const {name, description, image, userName} = post;
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
                <Card className={classes.card}>
                    <CardActionArea onClick={clickCard}>
                        <StorageImage suspense={true} placeHolder={<Loading/>} storagePath={image || DEFAULT_IMAGE} className={classes.media} alt={image ? post.name : 'Default Image'}/>
                        <CardContent>
                            <Typography variant="h5" component="h2">
                                {name}
                            </Typography>
                            <Collapse in={openDesc} collapsedHeight={100}>
                                <Typography gutterBottom
                                            variant="body2"
                                            color="textPrimary">
                                    {description}
                                </Typography>
                                <Typography variant="body2">
                                    Supplied by:
                                </Typography>
                                <Typography variant="button">
                                    {userName}
                                </Typography>
                            </Collapse>
                        </CardContent>
                    </CardActionArea>
                    {postAction({post})}
                </Card>
            </ClickAwayListener>
        </Grid>
    );
}

export default Post;
