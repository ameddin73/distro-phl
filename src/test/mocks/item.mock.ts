import {ItemInterface} from "util/types";
import {DEFAULT_IMAGE} from "util/config";
import {TypesMocks} from "./type.mock";
import {UserMocks} from "./user.mock";

export namespace ItemMocks {
    export const defaultItem: ItemInterface = {
        id: 'default_item_id',
        displayName: 'default_item_displayName',
        active: true,
        created: new Date('01 Jan 1970 00:00:00 GMT'),
        description: 'default_item_description',
        expires: new Date('02 Jan 2070 00:00:00 GMT'),
        image: DEFAULT_IMAGE,
        type: Object.keys(TypesMocks.defaultTypes)[0],
        uid: UserMocks.defaultUser.uid,
        userName: 'default_item_userName',
    }
}