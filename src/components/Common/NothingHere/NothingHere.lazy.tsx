import React, {lazy, Suspense} from 'react';

const LazyNothingHere = lazy(() => import('./NothingHere'));

const NothingHere = () => (
    <Suspense fallback={null}>
        <LazyNothingHere/>
    </Suspense>
);

export default NothingHere;
