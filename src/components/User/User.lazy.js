import React, { lazy, Suspense } from 'react';

const LazyUser = lazy(() => import('./User'));

const User = props => (
  <Suspense fallback={null}>
    <LazyUser {...props} />
  </Suspense>
);

export default User;
