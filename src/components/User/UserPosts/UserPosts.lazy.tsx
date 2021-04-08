import React, {lazy, Suspense} from 'react';
import Loading from "../../Common/Loading";

const LazyUserPosts = lazy(() => import('./UserPosts'));

const UserPosts = () => (
    <Suspense fallback={<Loading/>}>
        <LazyUserPosts/>
    </Suspense>
);

export default UserPosts;
