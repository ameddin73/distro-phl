import React from 'react';
import {paths} from "../Common/config";
import Login from "./Login/Login.lazy";
import {navigate, useRoutes, useQueryParams} from "hookrouter";
import UserItems from "./UserItems/UserItems.lazy";
import {FirebaseAuthConsumer} from "@react-firebase/auth";
import {Loading} from "../Common/loading";
import AddItem from "./UserItems/AddItem/AddItem.lazy";

const routes = {};
routes[paths.user.login] = () => ({redirect}) => (navigate(redirect, true));
routes[paths.user.items] = () => () => <UserItems/>;
routes[paths.user.create] = () => ({user}) => <AddItem user={user}/>;

const User = () => {
    const routeResult = useRoutes(routes) || routes[paths.user.items];
    const [queryParams] = useQueryParams();

    const redirect = queryParams.hasOwnProperty('redirect') ? queryParams.redirect : paths.public.distro;

    return (
        <>
            <FirebaseAuthConsumer redirect={redirect}>
                {({isSignedIn, providerId, user}) => {
                    if (providerId === null && isSignedIn === false) {
                        return (<Loading/>)
                    } else if (isSignedIn === true) {
                        return routeResult({redirect, user})
                    } else {
                        return <Login/>;
                    }
                }}
            </FirebaseAuthConsumer>
        </>
    )
};

export default User;
