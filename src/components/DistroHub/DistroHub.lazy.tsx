import React, {lazy, Suspense} from 'react';
import Loading from "../Common/Loading";

const LazyDistroHub = lazy(() => import('./DistroHub'));

const DistroHub = () => (
    <Suspense fallback={<Loading/>}>
        <LazyDistroHub/>
    </Suspense>
);

export default DistroHub;
