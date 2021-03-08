import React, { lazy, Suspense } from 'react';

const LazyHubAction = lazy(() => import('./HubAction'));

const HubAction = props => (
  <Suspense fallback={null}>
    <LazyHubAction {...props} />
  </Suspense>
);

export default HubAction;
