import React from 'react';
import {paths} from "../../config";
import Login from "./Login/Login.lazy";
// @ts-ignore
import {navigate, useQueryParams, useRoutes} from "hookrouter";
import UserItems from "./UserItems/UserItems.lazy";
import {FirebaseAuthConsumer} from "@react-firebase/auth";
import AddItem from "./UserItems/AddItem/AddItem.lazy";
import Loading from "../Common/Loading";
import {RouteType} from "../Common/types";

const routes: RouteType = {};
routes[paths.user.login] = () => ({redirect}) => (navigate(redirect, true));
routes[paths.user.items] = () => () => <UserItems/>;
routes[paths.user.create] = () => ({user}) => <AddItem user={user}/>;

const User = () => {
    const routeResult = useRoutes(routes) || routes[paths.user.items];
    const [queryParams] = useQueryParams();

    const redirect = queryParams.hasOwnProperty('redirect') ? queryParams.redirect : paths.public.distro;

    return (
        <>
            <FirebaseAuthConsumer>
                {({isSignedIn, providerId, user}) => {
                    if (providerId === null && !isSignedIn) {
                        return (<Loading/>)
                    } else if (isSignedIn) {
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
