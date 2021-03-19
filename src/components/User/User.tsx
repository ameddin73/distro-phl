import React from 'react';
import {paths} from "../../util/config";
import Login from "./Login/Login.lazy";
// @ts-ignore
import {navigate, useQueryParams, useRoutes} from "hookrouter";
import UserItems from "./UserItems/UserItems.lazy";
import AddItem from "./UserItems/AddItem/AddItem.lazy";
import Loading from "../Common/Loading";
import {RouteType} from "../../util/types";
import {AuthCheck, SuspenseWithPerf, useUser} from "reactfire";

const routes: RouteType = {};
routes[paths.user.login] = () => ({redirect}) => (navigate(redirect, true));
routes[paths.user.items] = () => () => <UserItems/>;
routes[paths.user.create] = () => ({user}) => <AddItem user={user}/>;

const AuthedUser = () => {
    const [queryParams] = useQueryParams();
    const {data: user} = useUser();

    const routeResult = useRoutes(routes) || routes[paths.user.items];
    const redirect = queryParams.hasOwnProperty('redirect') ? queryParams.redirect : paths.public.distro;

    return routeResult({redirect, user})
}

const User = () => (
    <>
        <SuspenseWithPerf fallback={Loading} traceId="load-user-pages">
            <AuthCheck fallback={Login}>
                <AuthedUser/>
            </AuthCheck>
        </SuspenseWithPerf>
    </>
);

export default User;
