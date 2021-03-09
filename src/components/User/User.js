import React from 'react';
import {paths} from "../Common/config";
import Login from "./Login/Login.lazy";
import {useRoutes} from "hookrouter";
import UserItems from "./UserItems/UserItems.lazy";

const routes = {};
routes[paths.user.login] = () => <Login/>;
routes[paths.user.items] = () => <UserItems/>;

const User = () => {
    const routeResult = useRoutes(routes) || routes[paths.user.items];
    return (
        <div>
            {routeResult}
        </div>
    )
};

export default User;
