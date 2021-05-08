import React, {lazy, Suspense} from 'react';
import Loading from "../../Loading/Loading";
import {postCardStyle} from "./styles";
import {Card, Grid} from "@material-ui/core";
import {PostProps} from "./PostCard";

const LazyPostCard = lazy(() => import('./PostCard'));

const PostCard = (props: PostProps) => {
    const classes = postCardStyle();
    return (
        <Grid item xs>
            <Card className={classes.card} variant="outlined">
                <Suspense fallback={<Loading/>}>
                    <LazyPostCard {...props} />
                </Suspense>
            </Card>
        </Grid>
    )
};

export default PostCard;
