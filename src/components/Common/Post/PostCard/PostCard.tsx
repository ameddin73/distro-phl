import React, {Suspense} from 'react';
import {CardActionArea, Grid, Typography} from "@material-ui/core";
import {CARD_MEDIA_HEIGHT, postCardStyle} from "./styles";
import {DEFAULT_IMAGE, PATHS} from "util/config";
import {StorageImage} from "reactfire";
import {ErrorBoundary} from "react-error-boundary";
import Loading from "../../Loading/Loading";
import RouterLink from "../../RouterLink";
import {PostInterface} from "util/types";
import {Skeleton} from "@material-ui/lab";
import {ClassNameMap} from "@material-ui/styles";

export type PostProps = {
    post: PostInterface
    postAction?: (post: PostProps) => JSX.Element,
}

const PostCard = ({post}: PostProps) => {
    const classes = postCardStyle();

    const {name, id, image, userName} = post;

    const media = buildMedia(image, name, classes);

    return (
        <CardActionArea component={RouterLink} to={`${PATHS.public.posts}/${id}`} className={classes.action} data-testid="card-action">
            <Grid item>
                <Suspense fallback={<Skeleton variant="rect" height={CARD_MEDIA_HEIGHT} width="1000%" animation="wave"/>}>
                    {media}
                </Suspense>
                <div className={classes.title}>
                    <Typography variant="h6" noWrap>
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

function buildMedia(image: string, name: string, classes: ClassNameMap) {
    const fallbackMedia = <img src={DEFAULT_IMAGE.thumbnail} alt="Default" className={classes.media}/>;
    const media = image ?
        <StorageImage suspense={true} placeHolder={<Loading/>} storagePath={image} className={classes.media} alt={name}/>
        : fallbackMedia;
    return <ErrorBoundary fallback={fallbackMedia}>{media}</ErrorBoundary>
}


export default PostCard;