import React from "react";
import {useSigninCheck} from "reactfire";
import {Redirect, Route, RouteProps} from "react-router-dom";
import {PATHS} from "util/config";

interface PrivateRouteProps extends RouteProps {
    children: JSX.Element,
}

const PrivateRoute = ({children, path, ...rest}: PrivateRouteProps) => {
    const {data: signInCheckResult} = useSigninCheck();

    return (
        <Route
            {...rest}
            path={path}
            render={() =>
                signInCheckResult.signedIn ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: PATHS.public.login,
                            state: {referrer: path},
                        }}
                    />
                )
            }
        />
    );
};

export default PrivateRoute;