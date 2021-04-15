import React from 'react';
import {CardActionArea, Grid, Typography} from "@material-ui/core";
import {postStyle} from "./styles";
import {DEFAULT_IMAGE, PATHS} from "util/config";
import {StorageImage} from "reactfire";
import {ErrorBoundary} from "react-error-boundary";
import Loading from "../../Loading";
import RouterLink from "../../RouterLink";
import {PostInterface} from "../types";

export type PostProps = {
    post: PostInterface
    postAction?: (post: PostProps) => JSX.Element,
}

const PostCard = ({post}: PostProps) => {
    const classes = postStyle();

    const {name, id, image, hasExpiration, expires, userName} = post;

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
                <div className={classes.content}>
                    <Typography variant="h5" component="h2">
                        {name}
                    </Typography>
                    {hasExpiration && expires?.getFullYear() === (new Date()).getFullYear() && (
                        <div className={classes.detailContainer}>
                            <Typography variant="body2" className={classes.detail}>
                                Expires
                            </Typography>
                            <Typography variant="body2">
                                {expires?.toLocaleDateString('en-US', {month: 'long', day: 'numeric'})}
                            </Typography>
                        </div>
                    )}
                </div>
            </Grid>
            <Grid item className={classes.userInfo}>
                <div className={classes.detailContainer}>
                    <Typography variant="body2" className={classes.detail}>
                        Posted by
                    </Typography>
                    <Typography variant="button" noWrap>
                        {userName}
                    </Typography>
                </div>
            </Grid>
        </CardActionArea>
    );
}

export default PostCard;