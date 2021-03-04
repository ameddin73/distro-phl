import React, { lazy, Suspense } from 'react';

const LazyDistroHub = lazy(() => import('./DistroHub'));

const DistroHub = props => (
  <Suspense fallback={null}>
    <LazyDistroHub {...props} />
  </Suspense>
);

export default DistroHub;
