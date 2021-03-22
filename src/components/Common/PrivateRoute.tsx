import React from "react";
import {useUser} from "reactfire";
import {Redirect, Route, RouteProps} from "react-router-dom";
import {PATHS} from "../../util/config";

interface PrivateRouteProps extends RouteProps {
    children: JSX.Element,
}

const PrivateRoute = ({children, ...rest}: PrivateRouteProps) => {
    const user = useUser();

    return (
        <Route
            {...rest}
            render={({location}) =>
                user ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: PATHS.public.login,
                            state: {from: location}
                        }}
                    />
                )
            }
        />
    );
};

export default PrivateRoute;