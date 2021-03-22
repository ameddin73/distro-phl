import React from 'react';
import {PATHS} from "../../util/config";
import Login from "./Login/Login.lazy";
import UserItems from "./UserItems/UserItems.lazy";
import AddItem from "./UserItems/AddItem/AddItem.lazy";
import {Route, Switch, useRouteMatch} from "react-router-dom";
import PrivateRoute from "../Common/PrivateRoute";

const User = () => {
    const match = useRouteMatch();

    return (
        <>
            <Switch>
                <Route path={`${match.path}${PATHS.user.login}`}>
                    <Login/>
                </Route>
                <PrivateRoute path={`${match.path}${PATHS.user.items}`}>
                    <UserItems/>
                </PrivateRoute>
                <PrivateRoute path={`${match.path}${PATHS.user.create}`}>
                    <AddItem/>
                </PrivateRoute>
            </Switch>
        </>
    )
};

export default User;
