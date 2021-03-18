import React, {lazy, Suspense} from 'react';

const LazyUser = lazy(() => import('./User'));

const User = () => (
    <Suspense fallback={null}>
        <LazyUser/>
    </Suspense>
);

export default User;
