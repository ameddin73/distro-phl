import React from 'react';
import HubAction from "./HubAction/HubAction";
import ItemList from "../Common/ItemList/ItemList.lazy";
import {COLLECTIONS} from "../../util/config";
import {FirestoreQuery, ItemInterface} from "../../util/types";
import {AuthCheck, SuspenseWithPerf, useUser} from "reactfire";
import Loading from "../Common/Loading";
import {orderByCreated} from "../../util/utils";

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

const DistroHub = () => {

    return (
        <>
            <SuspenseWithPerf fallback={<Loading/>} traceId="load-distro-hub">
                <AuthCheck fallback={PublicHub}>
                    <UserHub/>
                </AuthCheck>
            </SuspenseWithPerf>
        </>
    );
}

export default DistroHub;
