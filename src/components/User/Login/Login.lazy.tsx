import React, {lazy, Suspense} from 'react';
import Loading from "../../Common/Loading";

const LazyLogin = lazy(() => import('./Login'));

const Login = () => (
    <Suspense fallback={<Loading/>}>
        <LazyLogin/>
    </Suspense>
);

export default Login;
