import React, {lazy, Suspense} from 'react';
import Loading from "../../../Common/Loading";
import {PostProps} from "../../../Common/Post/Post";

const LazyUserAction = lazy(() => import('./UserAction'));

const UserAction = (props: PostProps) => (
    <Suspense fallback={<Loading/>}>
        <LazyUserAction {...props} />
    </Suspense>
);

export default UserAction;
