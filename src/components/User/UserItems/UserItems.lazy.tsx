import React, {lazy, Suspense} from 'react';

const LazyUserItems = lazy(() => import('./UserItems'));

const UserItems = () => (
    <Suspense fallback={null}>
        <LazyUserItems/>
    </Suspense>
);

export default UserItems;
