import React from 'react';
import {CardActionArea, Grid, Typography} from "@material-ui/core";
import {postCardStyle} from "./styles";
import {DEFAULT_IMAGE, PATHS} from "util/config";
import {StorageImage} from "reactfire";
import {ErrorBoundary} from "react-error-boundary";
import Loading from "../../Loading/Loading";
import RouterLink from "../../RouterLink";
import {PostInterface} from "util/types";

export type PostProps = {
    post: PostInterface
    postAction?: (post: PostProps) => JSX.Element,
}

const PostCard = ({post}: PostProps) => {
    const classes = postCardStyle();

    const {name, id, image, userName} = post;

    const storageParams = {
        storagePath: image,
        onError: () => {
        },
    }
    storageParams.onError = () => storageParams.storagePath = DEFAULT_IMAGE;

    return (
        <CardActionArea component={RouterLink} to={`${PATHS.public.posts}/${id}`} className={classes.action} data-testid="card-action">
            <Grid item>
                <ErrorBoundary fallback={
                    <StorageImage suspense={true} placeHolder={<Loading/>} storagePath={DEFAULT_IMAGE} className={classes.media} alt={image ? post.name : 'Default Image'}/>
                }>
                    <StorageImage suspense={true} placeHolder={<Loading/>} storagePath={image || DEFAULT_IMAGE} className={classes.media} alt={image ? post.name : 'Default Image'}/>
                </ErrorBoundary>
                <div className={classes.title}>
                    <Typography variant="h6">
                        {name}
                    </Typography>
                </div>
            </Grid>
            <Grid item className={classes.userInfo}>
                <div className={classes.detailContainer}>
                    <Typography variant="subtitle2" className={classes.detail}>
                        Posted by
                    </Typography>
                    <Typography variant="body2" noWrap>
                        {userName}
                    </Typography>
                </div>
            </Grid>
        </CardActionArea>
    );
}

export default PostCard;