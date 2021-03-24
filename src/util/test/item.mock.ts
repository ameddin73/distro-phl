import {ItemInterface} from "../types";
import {DEFAULT_IMAGE} from "../config";

export namespace ItemMocks {
    export const defaultItem: ItemInterface = {
        id: 'default_item_id',
        displayName: 'default_item_displayName',
        active: true,
        created: new Date('01 Jan 1970 00:00:00 GMT'),
        description: 'default_item_description',
        expires: new Date('02 Jan 1970 00:00:00 GMT'),
        image: DEFAULT_IMAGE,
        type: 'default_item_type',
        uid: 'default_item_uid',
        userName: 'default_item_userName',
    }
}