import {UserMocks} from "./user.mock";
import {PostInterface} from "util/types.distro";

export namespace PostMocks {
    export const defaultPost: Required<PostInterface> = {
        id: 'default_post_id',
        name: 'default_post_displayName',
        active: true,
        created: new Date('01 Jan 1970 00:00:00 GMT'),
        description: 'default_post_description',
        hasExpiration: true,
        expires: new Date('02 Jan 2070 00:00:00 GMT'),
        image: 'images/posts/a0.jpg',
        uid: UserMocks.defaultUser.uid,
        userName: UserMocks.defaultUser.name || '',
    };
    export const secondaryPost: PostInterface = {
        id: 'secondary_post_id',
        name: 'secondary_post_displayName',
        active: true,
        created: new Date('01 Jan 1970 00:00:00 GMT'),
        description: 'secondary_post_description',
        hasExpiration: false,
        uid: UserMocks.userTwo.uid,
        userName: UserMocks.userTwo.name || '',
    };
    export const tertiaryPost: PostInterface = {
        id: 'tertiary_post_id',
        name: 'tertiary_post_displayName',
        active: true,
        created: new Date('01 Jan 1970 00:00:00 GMT'),
        description: 'tertiary_post_description',
        hasExpiration: false,
        image: 'images/posts/a1.jpg',
        uid: UserMocks.userThree.uid,
        userName: UserMocks.userThree.name || '',
    };
    export const namelessPost: PostInterface = {
        id: 'phone_post_id',
        active: true,
        created: new Date('01 Jan 1970 00:00:00 GMT'),
        description: 'phone_post_description',
        hasExpiration: false,
        uid: UserMocks.userNameless.uid,
        userName: 'Distro User',
    };
}