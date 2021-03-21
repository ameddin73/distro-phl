import React from 'react';
import {PATHS} from "../../util/config";
import Login from "./Login/Login.lazy";
// @ts-ignore
import {navigate, useQueryParams, useRoutes} from "hookrouter";
import UserItems from "./UserItems/UserItems.lazy";
import AddItem from "./UserItems/AddItem/AddItem.lazy";
import {RouteType} from "../../util/types";
import {AuthCheck, useUser} from "reactfire";

const routes: RouteType = {};
routes[PATHS.user.login] = () => ({redirect}) => (navigate(redirect, true));
routes[PATHS.user.items] = () => () => <UserItems/>;
routes[PATHS.user.create] = () => () => <AddItem/>;

const AuthedUser = () => {
    const [queryParams] = useQueryParams();
    const {data: user} = useUser();

    const routeResult = useRoutes(routes) || routes[PATHS.user.items];
    const redirect = queryParams.hasOwnProperty('redirect') ? queryParams.redirect : PATHS.public.distro;

    return routeResult({redirect, user})
}

const User = () => (
    <>
        <AuthCheck fallback={<Login/>}>
            <AuthedUser/>
        </AuthCheck>
    </>
);

export default User;
