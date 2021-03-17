import React, {lazy, Suspense} from 'react';

const LazyLogin = lazy(() => import('./Login'));

const Login = () => (
    <Suspense fallback={null}>
        <LazyLogin/>
    </Suspense>
);

export default Login;
