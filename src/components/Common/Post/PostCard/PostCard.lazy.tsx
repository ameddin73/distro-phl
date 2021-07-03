import React, {lazy, Suspense} from 'react';
import {CARD_MEDIA_HEIGHT, postCardStyle} from "./styles";
import {Card, CardActionArea, Grid, Typography} from "@material-ui/core";
import {PostProps} from "./PostCard";
import {Skeleton} from "@material-ui/lab";

const LazyPostCard = lazy(() => import('./PostCard'));

const SkeletonCard = () => {
    const classes = postCardStyle();

    return (
        <CardActionArea className={classes.action} data-testid="card-action">
            <Grid item>
                <Skeleton id="loading" variant="rect" height={CARD_MEDIA_HEIGHT} width="10000%" animation="wave"/>
                <div className={classes.title}>
                    <Typography variant="h6" noWrap>
                        <Skeleton id="loading" width={200} animation="wave"/>
                    </Typography>
                </div>
            </Grid>
            <Grid item className={classes.userInfo}>
                <div className={classes.detailContainer}>
                    <Typography variant="subtitle2" className={classes.detail}>
                        <Skeleton id="loading" width={125} animation="wave"/>
                    </Typography>
                </div>
            </Grid>
        </CardActionArea>
    );
}
const PostCard = (props: PostProps) => {
    const classes = postCardStyle();
    return (
        <Grid item xs>
            <Card className={classes.card} variant="outlined">
                <Suspense fallback={<SkeletonCard/>}>
                    <LazyPostCard {...props} />
                </Suspense>
            </Card>
        </Grid>
    )
};

export default PostCard;
