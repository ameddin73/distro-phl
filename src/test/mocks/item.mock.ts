import {ItemInterface} from "util/types";
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
        image: 'default_image',
        type: Object.keys(TypesMocks.defaultTypes)[0],
        uid: UserMocks.defaultUser.uid,
        userName: UserMocks.defaultUser.name,
    }
}