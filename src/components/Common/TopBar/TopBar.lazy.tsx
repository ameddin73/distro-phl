import React, {lazy, Suspense} from 'react';

const LazyCommon = lazy(() => import('./TopBar'));

const Common = () => (
    <Suspense fallback={null}>
        <LazyCommon/>
    </Suspense>
);

export default Common;
