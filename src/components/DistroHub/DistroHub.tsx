import React from 'react';
import HubAction from "./HubAction/HubAction";
import ItemList from "../Common/ItemList/ItemList.lazy";
import {COLLECTIONS} from "../../util/config";
import {FirestoreQuery, ItemInterface} from "../../util/types";
import {AuthCheck, useUser} from "reactfire";
import ErrorMessage from "../Common/ErrorMessage";
import {ErrorBoundary} from "react-error-boundary";
import {Query} from "../../util/utils";

const path = COLLECTIONS.items;
const orderBy = Query.orderByCreated;
const query: FirestoreQuery = {
    where: [Query.whereActive],
    orderBy,
};

const PublicHub = () => (
    <ItemList path={path}
              query={query}
              itemAction={(item: ItemInterface) => (<HubAction id={item.id} path={path + item.id}/>)}/>
);

const UserHub = () => {
    const {data: user} = useUser();
    if (!user) return null;

    const filter = ((item: ItemInterface) => item.uid !== user.uid);

    return (
        <ItemList path={path}
                  query={query}
                  filter={filter}
                  itemAction={(item: ItemInterface) => (<HubAction id={item.id} path={path}/>)}/>
    );
};

const DistroHub = () => (
    <ErrorBoundary FallbackComponent={ErrorMessage}>
        <AuthCheck fallback={<PublicHub/>}>
            <UserHub/>
        </AuthCheck>
    </ErrorBoundary>
);

export default DistroHub;
