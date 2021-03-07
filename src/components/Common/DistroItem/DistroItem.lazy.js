import React, { lazy, Suspense } from 'react';

const LazyDistroItem = lazy(() => import('./DistroItem'));

const DistroItem = props => (
  <Suspense fallback={null}>
    <LazyDistroItem {...props} />
  </Suspense>
);

export default DistroItem;
