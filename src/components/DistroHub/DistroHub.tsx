import React from 'react';
import HubAction from "./HubAction/HubAction";
import ItemList from "../Common/ItemList/ItemList.lazy";
import {COLLECTIONS} from "../../util/config";
import {FirestoreQuery, ItemInterface} from "../../util/types";
import {AuthCheck, useUser} from "reactfire";
import {orderByCreated} from "../../util/utils";
import ErrorMessage from "../Common/ErrorMessage";
import {ErrorBoundary} from "react-error-boundary";

const path = COLLECTIONS.items;
const orderBy = orderByCreated;
const query: FirestoreQuery = {
    where: [],
    orderBy,
};

const PublicHub = () => {
    return (
        <ItemList path={path}
                  query={query}
                  itemAction={(item: ItemInterface) => (<HubAction id={item.id} path={path + item.id}/>)}/>
    );
};

const UserHub = () => {
    const {data: user} = useUser();
    const filter = ((item: ItemInterface) => item.uid !== user.uid);

    return (
        <ItemList path={path}
                  query={query}
                  filter={filter}
                  itemAction={(item: ItemInterface) => (<HubAction id={item.id} path={path}/>)}/>
    );
};

const DistroHub = () => (
    <>
        <ErrorBoundary FallbackComponent={ErrorMessage}>
            <AuthCheck fallback={<PublicHub/>}>
                <UserHub/>
            </AuthCheck>
        </ErrorBoundary>
    </>
);

export default DistroHub;
