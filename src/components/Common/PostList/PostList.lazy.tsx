import React, {lazy, Suspense} from 'react';
import {PostListProps} from "./PostList";
import Loading from "../Loading";

const LazyPostList = lazy(() => import('./PostList'));

const PostList = (props: PostListProps) => (
    <Suspense fallback={<Loading/>}>
        <LazyPostList {...props} />
    </Suspense>
);

export default PostList;
