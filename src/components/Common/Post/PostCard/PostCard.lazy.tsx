import React, {lazy, Suspense} from 'react';
import Loading from "../../Loading";
import {PostProps} from "../Post";
import {postStyle} from "./styles";
import {Card, Grid} from "@material-ui/core";

const LazyPostCard = lazy(() => import('./PostCard'));

const PostCard = (props: PostProps) => {
    const classes = postStyle();
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
