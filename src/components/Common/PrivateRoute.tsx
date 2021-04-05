import React from "react";
import {useUser} from "reactfire";
import {Redirect, Route, RouteProps} from "react-router-dom";
import {PATHS} from "util/config";

interface PrivateRouteProps extends RouteProps {
    children: JSX.Element,
}

const PrivateRoute = ({children, path, ...rest}: PrivateRouteProps) => {
    const {data: user} = useUser();

    return (
        <Route
            {...rest}
            render={() =>
                user ? (
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