import React from 'react';
import {paths} from "../Common/config";
import Login from "./Login/Login.lazy";
import {navigate, useRoutes, useQueryParams} from "hookrouter";
import UserItems from "./UserItems/UserItems.lazy";
import {FirebaseAuthConsumer} from "@react-firebase/auth";
import {Loading} from "../Common/loading";

const routes = {};
routes[paths.user.login] = () => (redirect) => navigate(redirect, true);
routes[paths.user.items] = () => () => <UserItems/>;

const User = () => {
    const routeResult = useRoutes(routes) || routes[paths.user.items];
    const [queryParams] = useQueryParams();

    const redirect = queryParams.hasOwnProperty('redirect') ? queryParams.redirect : paths.public.distro;

    return (
        <div>
            <FirebaseAuthConsumer>
                {({isSignedIn, providerId}) => {
                    if (providerId === null && isSignedIn === false) {
                        return (<Loading/>)
                    } else if (isSignedIn === true) {
                        return routeResult(redirect);
                    } else {
                        return <Login/>;
                    }
                }}
            </FirebaseAuthConsumer>
        </div>
    )
};

export default User;
