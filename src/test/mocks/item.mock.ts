import {ItemInterface} from "util/types";
import {TypesMocks} from "./type.mock";
import {UserMocks} from "./user.mock";
import {DEFAULT_IMAGE} from "../../util/config";

export namespace ItemMocks {
    export const defaultItem: ItemInterface = {
        id: 'default_item_id',
        displayName: 'default_item_displayName',
        active: true,
        created: new Date('01 Jan 1970 00:00:00 GMT'),
        description: 'default_item_description',
        hasExpiration: true,
        expires: new Date('02 Jan 2070 00:00:00 GMT'),
        image: DEFAULT_IMAGE,
        type: Object.keys(TypesMocks.defaultTypes)[0],
        uid: UserMocks.defaultUser.uid,
        userName: UserMocks.defaultUser.name,
    }
    export const secondaryItem: ItemInterface = {
        id: 'secondary_item_id',
        displayName: 'secondary_item_displayName',
        active: true,
        created: new Date('01 Jan 1970 00:00:00 GMT'),
        description: 'secondary_item_description',
        hasExpiration: false,
        image: DEFAULT_IMAGE,
        type: Object.keys(TypesMocks.defaultTypes)[1],
        uid: UserMocks.userTwo.uid,
        userName: UserMocks.userTwo.name,
    }
}