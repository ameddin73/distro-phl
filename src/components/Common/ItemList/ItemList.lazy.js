import React, { lazy, Suspense } from 'react';

const LazyItemList = lazy(() => import('./ItemList'));

const ItemList = props => (
  <Suspense fallback={null}>
    <LazyItemList {...props} />
  </Suspense>
);

export default ItemList;
