import React from 'react';
import HubAction from "./HubAction/HubAction";
import ItemList from "../Common/ItemList/ItemList.lazy";
import {collections} from "../../util/config";
import {FirestoreQuery, FirestoreQueryWhere, ItemInterface} from "../../util/types";
import {AuthCheck, SuspenseWithPerf, useUser} from "reactfire";
import Loading from "../Common/Loading";

const path = collections.items;
const orderBy: FirestoreQuery['orderBy'] = {
    fieldPath: 'created',
    directionStr: 'asc',
};

const PublicHub = () => {
    const query: FirestoreQuery = {
        where: [],
        orderBy,
    };

    return (
        <ItemList path={path}
                  query={query}
            // @ts-ignore
                  itemAction={(item: ItemInterface) => (<HubAction id={item.id} path={path + item.id}/>)}/>
    );
};

const UserHub = () => {
    const {data: user} = useUser();
    const where: FirestoreQueryWhere = {
        fieldPath: 'uid',
        opStr: '!=',
        value: user.uid,
    };
    const query: FirestoreQuery = {
        where: [where],
        orderBy,
    };

    return (
        <ItemList path={path}
                  query={query}
            // @ts-ignore
                  itemAction={(item: ItemInterface) => (<HubAction id={item.id} path={path + item.id}/>)}/>
    );
};

const DistroHub = () => {

    return (
        <>
            <SuspenseWithPerf fallback={Loading} traceId="load-distro-hub">
                <AuthCheck fallback={PublicHub}>
                    <UserHub/>
                </AuthCheck>
            </SuspenseWithPerf>
        </>
    );
}

export default DistroHub;
