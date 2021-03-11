import React, { lazy, Suspense } from 'react';

const LazyNothingHere = lazy(() => import('./NothingHere'));

const NothingHere = props => (
  <Suspense fallback={null}>
    <LazyNothingHere {...props} />
  </Suspense>
);

export default NothingHere;
