import React, {lazy, Suspense} from 'react';

const LazyDistroHub = lazy(() => import('./DistroHub'));

const DistroHub = () => (
    <Suspense fallback={null}>
        <LazyDistroHub/>
    </Suspense>
);

export default DistroHub;
