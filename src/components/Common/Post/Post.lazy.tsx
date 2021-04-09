import React, {lazy, Suspense} from 'react';
import Loading from "../Loading";
import {PostProps} from "./Post";

const LazyPost = lazy(() => import('./Post'));

const Post = (props: PostProps) => (
    <Suspense fallback={<Loading/>}>
        <LazyPost {...props} />
    </Suspense>
);

export default Post;
