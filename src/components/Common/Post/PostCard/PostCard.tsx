import React, {Suspense} from 'react';
import {CardActionArea, Grid, Typography} from "@material-ui/core";
import {CARD_MEDIA_HEIGHT, postCardStyle} from "./styles";
import {PATHS} from "util/config";
import RouterLink from "../../RouterLink";
import {PostInterface} from "util/types.distro";
import {Skeleton} from "@material-ui/lab";
import PostImage from "../PostImage/PostImage";

export type PostProps = {
    post: PostInterface
    postAction?: (post: PostProps) => JSX.Element,
}

const PostCard = ({post}: PostProps) => {
    const classes = postCardStyle();

    const {name, id, image, userName} = post;

    return (
        <CardActionArea component={RouterLink} to={`${PATHS.public.posts}/${id}`} className={classes.action} data-testid="card-action">
            <Grid item>
                <Suspense fallback={<Skeleton id="loading" variant="rect" height={CARD_MEDIA_HEIGHT} width="1000%" animation="wave"/>}>
                    <PostImage image={image} name={name}/>
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

export default PostCard;