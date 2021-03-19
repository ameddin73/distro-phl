import React, {lazy, Suspense} from 'react';
import Loading from "../Common/Loading";

const LazyUser = lazy(() => import('./User'));

const User = () => (
    <Suspense fallback={<Loading/>}>
        <LazyUser/>
    </Suspense>
);

export default User;
