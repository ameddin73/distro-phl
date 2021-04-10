import React from 'react';
import {Card, CardActionArea, CardContent, Grid, Typography} from "@material-ui/core";
import {postStyle} from "util/styles";
import {DEFAULT_IMAGE} from "util/config";
import {StorageImage} from "reactfire";
import Loading from "../Loading";
import {PostInterface} from "./types";
import theme from "../../../util/theme";

export type PostProps = {
    post: PostInterface
    postAction?: (post: PostProps) => JSX.Element,
}

const Post = ({post, postAction = (() => (<div/>))}: PostProps) => {
    const classes = postStyle();

    const {name, description, image, userName} = post;

    const clickCard = () => {
        // TODO what does click do?
    };

    return (
        <Grid item xs>
                <Card className={classes.card}>
                    <CardActionArea onClick={clickCard}>
                        <StorageImage suspense={true} placeHolder={<Loading/>} storagePath={image || DEFAULT_IMAGE} className={classes.media} alt={image ? post.name : 'Default Image'}/>
                        <CardContent>
                            <Typography variant="h5" component="h2">
                                {name}
                            </Typography>
                            <Typography gutterBottom
                                        variant="body2"
                                        color="textPrimary">
                                {description}
                            </Typography>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <Typography variant="body2" color="textSecondary" noWrap style={{paddingRight: theme.spacing(1)}}>
                                    Posted by
                                </Typography>
                                <Typography variant="button" noWrap>
                                    {userName}
                                </Typography>
                            </div>
                        </CardContent>
                    </CardActionArea>
                    {postAction({post})}
                </Card>
        </Grid>
    );
}

export default Post;
