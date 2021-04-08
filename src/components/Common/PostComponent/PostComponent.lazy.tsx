import React, {lazy, Suspense} from 'react';
import Loading from "../Loading";
import {PostComponentProps} from "./PostComponent";

const LazyPostComponent = lazy(() => import('./PostComponent'));

const Post = (props: PostComponentProps) => (
    <Suspense fallback={<Loading/>}>
        <LazyPostComponent {...props} />
    </Suspense>
);

export default Post;
