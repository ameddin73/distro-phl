import {ChatInterface} from "util/types.distro";
import {UserMocks} from "./user.mock";

export namespace ChatMocks {
    export const individualChat: ChatInterface = {
        id: 'individual_chat_id',
        individual: true,
        created: new Date('01 Jan 1970 00:00:00 GMT'),
        updated: new Date('01 Jan 1971 00:00:00 GMT'),
        uids: [UserMocks.defaultUser.uid, UserMocks.userTwo.uid],
        members: [
            {
                uid: UserMocks.defaultUser.uid,
                name: UserMocks.defaultUser.name || '',
            },
            {
                uid: UserMocks.userTwo.uid,
                name: UserMocks.userTwo.name || '',
            },
        ],
        name: 'individual_chat_name',
        recentMessage: 'individual_chat_message',
    };
    export const groupChat: ChatInterface = {
        id: 'group_chat_id',
        individual: false,
        created: new Date('01 Jan 1970 00:00:00 GMT'),
        updated: new Date('01 Jan 1971 00:00:00 GMT'),
        uids: [UserMocks.defaultUser.uid,
            UserMocks.userTwo.uid,
            UserMocks.userThree.uid],
        members: [
            {
                uid: UserMocks.defaultUser.uid,
                name: UserMocks.defaultUser.name || '',
            },
            {
                uid: UserMocks.userTwo.uid,
                name: UserMocks.userTwo.name || '',
            },
            {
                uid: UserMocks.userThree.uid,
                name: UserMocks.userThree.name || '',
            },
        ],
        name: 'group_chat_name',
        recentMessage: 'group_chat_message'
    };
}
