import React, {lazy, Suspense} from 'react';
import Loading from "../Loading";

const LazyNothingHere = lazy(() => import('./NothingHere'));

const NothingHere = () => (
    <Suspense fallback={<Loading/>}>
        <LazyNothingHere/>
    </Suspense>
);

export default NothingHere;
