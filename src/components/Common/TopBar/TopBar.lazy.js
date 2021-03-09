import React, { lazy, Suspense } from 'react';

const LazyCommon = lazy(() => import('./TopBar'));

const Common = props => (
  <Suspense fallback={null}>
    <LazyCommon {...props} />
  </Suspense>
);

export default Common;
