/**
 * @jest-environment node
 */
// this test has to be run in a node environment because @firebase/rules-testing-library
// uses grpc and doesn't work in JSDOM. See more:
// https://github.com/firebase/firebase-admin-node/issues/1135#issuecomment-765766020
import firebase from "firebase";
import {ChatMocks} from "../../mocks/chats.mock";
import {destroyFirebase, initFirebase, setupFirestore, startFirestore, teardownFirestore} from "../util/util";
import {COLLECTIONS} from "util/config";
import {Converters} from "util/utils";
import {assertFails, assertSucceeds} from "@firebase/rules-unit-testing";
import {ChatInterface} from "util/types.distro";
import _ from "lodash";
import {Mutable} from "../../types";
import {UserMocks} from "../../mocks/user.mock";

// Firestore instances
let firestore: any = {noConverter: {}};
// Built queries
const queries: any = {
    noConverter: {},
    individual: {},
    group: {}
};
// Mock ChatInterfaces
const mocks = {
    individual: ChatMocks.individualChat,
    group: ChatMocks.groupChat,
}
// Pruned and validated chats
const validatedChats: any = {};

beforeAll(initFirebase);
afterAll(destroyFirebase);
describe('testing framework', () => {
    beforeAll(async () => {
        firestore = startFirestore();
        await setupFirestore(false, true);
    })
    afterAll(teardownFirestore);

    it('tests populates chats', async () => {
        // @ts-ignore
        const query = buildQuery(firestore.firestoreAdmin);
        const {docs: chats} = await query.get();
        // @ts-ignore
        expect(chats.find(chat => chat.data().id === mocks.individual.id).data())
            .toMatchObject(createChat(mocks.individual));
        // @ts-ignore
        expect(chats.find(chat => chat.data().id === mocks.group.id).data())
            .toMatchObject(createChat(mocks.group));
    })
});

describe('create chat rules', () => {
    beforeEach(async () => {
        firestore = startFirestore();
        queries.individual = await buildQuery(firestore.firestoreAuth, mocks.individual.id);
        queries.group = await buildQuery(firestore.firestoreAuth, mocks.group.id);
        queries.noConverter.individual = buildQuery(firestore.firestoreAuth, mocks.individual.id, false);
        queries.noConverter.group = buildQuery(firestore.firestoreAuth, mocks.group.id, false);
        await setupFirestore(false, false);

        // Create and validate objects for creating
        await validateChats();
    });
    afterEach(teardownFirestore);

    it('tests un-authed create chat', async () => {
        await assertFails(buildQuery(firestore.firestore, mocks.individual.id)
            .set(validatedChats.individual));
    });

    it('tests creating individual chat', async () => {
        await assertSucceeds(buildQuery(firestore.firestoreAuth, mocks.individual.id)
            .set(validatedChats.individual));
    });

    it('tests creating individual chat, second user', async () => {
        await assertSucceeds(buildQuery(firestore.firestoreAuth2, mocks.individual.id)
            .set(validatedChats.individual));
    });

    it('tests cannot create existing individual chat', async () => {
        const query = buildQuery(firestore.firestoreAuth, mocks.individual.id);
        await assertSucceeds(query.set(validatedChats.individual));
        await assertFails(query.set(validatedChats.individual));
    });

    it('tests creating group chat', async () => {
        await assertSucceeds(queries.individual.set(validatedChats.group));
        await teardownFirestore();
        await assertSucceeds(buildQuery(firestore.firestoreAuth2, mocks.group.id)
            .set(validatedChats.group));
        await teardownFirestore();
        await assertSucceeds(buildQuery(firestore.firestoreAuth3, mocks.group.id)
            .set(validatedChats.group));
    });

    it('tests creating chat without members', async () => {
        validatedChats.individual.uids = validatedChats.individual.uids
            .filter((uid: string) => uid !== UserMocks.defaultUser.uid);
        await assertFails(queries.individual.set(validatedChats.individual));
    });

    it("tests creating chat you're not in", async () => {
        await assertFails(buildQuery(firestore.firestoreAuth3, mocks.individual.id)
            .set(validatedChats.individual))
        await assertFails(buildQuery(firestore.firestoreAuth4, mocks.group.id)
            .set(validatedChats.group))
    });

    it('tests creating a chat with <2 members', async () => {
        validatedChats.group.uids = [{
            uid: UserMocks.defaultUser.uid,
            name: UserMocks.defaultUser.name,
        }]
        await assertFails(buildQuery(firestore.firestoreAuth, mocks.group.id)
            .set(validatedChats.group))
    });

    it('tests types are valid', async () => {
        await testInvalidField('created', 'string');
        await testInvalidField('updated', 'string');
        await testInvalidField('individual', 'string');
        await testInvalidField('members', 'string');
        await testInvalidField('members', ['a', 'b']);
        await testInvalidField('members', [{
            uid: false,
            name: false,
        }, {
            uid: false,
            name: false,
        }]);
        await testInvalidField('name', false);
        await testInvalidField('recentMessage', false);

        async function testInvalidField(field: string, value: any) {
            // Invalidate field
            validatedChats.noConverter.individual[field] = value;
            validatedChats.noConverter.group[field] = value;

            // Assert failures
            await assertFails(queries.noConverter.individual.set(validatedChats.noConverter.individual));
            await assertFails(queries.noConverter.group.set(validatedChats.noConverter.group));

            // Reset Chats
            await validateChats();
        }
    });

    it('tests hasAll rule', async () => {
        delete validatedChats.noConverter.individual.individual;
        await assertFails(queries.noConverter.individual.set(validatedChats.noConverter.individual));
    });

    it('tests creating chat without name', async () => {
        delete validatedChats.individual.name;
        await assertSucceeds(buildQuery(firestore.firestoreAuth, mocks.individual.id)
            .set(validatedChats.individual));
    });

    it('tests creating chat without recentMessage', async () => {
        delete validatedChats.individual.recentMessage;
        await assertSucceeds(buildQuery(firestore.firestoreAuth, mocks.individual.id)
            .set(validatedChats.individual));
    });

    it('tests hasOnly rule', async () => {
        validatedChats.noConverter.individual.test = 'test';
        await assertFails(queries.noConverter.individual.set(validatedChats.noConverter.individual));
    });

    it('tests createdNow rule', async () => {
        validatedChats.noConverter.individual.created = new Date('06 Aug 2021 00:00:00 GMT')
        await assertFails(queries.noConverter.individual.set(validatedChats.noConverter.individual));
    });

    it('tests updatedNow rule', async () => {
        validatedChats.noConverter.individual.updated = new Date('06 Aug 2021 00:00:00 GMT')
        await assertFails(queries.noConverter.individual.set(validatedChats.noConverter.individual));
    });

    async function validateChats() {
        validatedChats.individual = await createAndValidateChat(
            mocks.individual, queries.individual);
        validatedChats.group = await createAndValidateChat(
            mocks.group, queries.group);
        validatedChats.noConverter = {};
        validatedChats.noConverter.individual = await createAndValidateNoConverterChat(
            mocks.individual, queries.noConverter.individual);
        validatedChats.noConverter.group = await createAndValidateNoConverterChat(
            mocks.group, queries.noConverter.group);
    }
});

describe('update chat rules', () => {
    beforeAll(async () => {
        firestore = startFirestore();
        queries.individual.auth = await buildQuery(firestore.firestoreAuth, mocks.individual.id, false);
        queries.individual.auth2 = await buildQuery(firestore.firestoreAuth2, mocks.individual.id, false);
        queries.group.auth3 = await buildQuery(firestore.firestoreAuth3, mocks.group.id, false);
    });
    beforeEach(async () => {
        await queries.individual.auth.withConverter(Converters.ChatConverter).set(createChat(mocks.individual));
        await queries.group.auth3.withConverter(Converters.ChatConverter).set(createChat(mocks.group));
    });
    afterEach(teardownFirestore);

    it('tests un-authed update chat', async () => {
        await assertSucceeds(queries.individual.auth.update({
            recentMessage: 'test',
            updated: firebase.firestore.FieldValue.serverTimestamp(),
        }));
        await assertFails(buildQuery(firestore.firestore, mocks.individual.id)
            .update({
                recentMessage: 'test',
                updated: firebase.firestore.FieldValue.serverTimestamp(),
            }));
    });

    it("tests updating a chat you're not in", async () => {
        await assertSucceeds(queries.individual.auth.update({
            recentMessage: 'test',
            updated: firebase.firestore.FieldValue.serverTimestamp(),
        }));
        await assertFails(buildQuery(firestore.firestoreAuth3, mocks.individual.id)
            .update({
                recentMessage: 'test',
                updated: firebase.firestore.FieldValue.serverTimestamp(),
            }));
    });

    it('tests valid updates', async () => {
        await assertSucceeds(queries.individual.auth.update({
            name: 'test',
            updated: firebase.firestore.FieldValue.serverTimestamp(),
        }));
        await assertSucceeds(queries.individual.auth.update({
            recentMessage: 'test',
            updated: firebase.firestore.FieldValue.serverTimestamp(),
        }));
        // Add user to group
        await assertSucceeds(queries.group.auth3.update({
            uids: [UserMocks.userFour.uid].concat(mocks.group.uids),
            members: [{
                uid: UserMocks.userFour.uid,
                name: UserMocks.userFour.name,
            }].concat(mocks.group.members),
            updated: firebase.firestore.FieldValue.serverTimestamp(),
        }));
        await resetFirestore();
        // Leave group
        await assertSucceeds(queries.group.auth3.update({
            uids: mocks.group.uids?.filter(uid =>
                uid !== UserMocks.userThree.uid),
            members: mocks.group.members?.filter(member =>
                member.uid !== UserMocks.userThree.uid),
            updated: firebase.firestore.FieldValue.serverTimestamp(),
        }));
    });

    it('tests adding user to individual chat', async () => {
        await assertFails(queries.individual.auth.update({
            uids: mocks.individual.uids.concat(UserMocks.userThree.uid),
            members: mocks.individual.members.concat({
                uid: UserMocks.userThree.uid,
                name: UserMocks.userThree.name || '',
            })
        }));
    });

    it('tests adding users w/o uids-members parity', async () => {
        await assertSucceeds(queries.group.auth3.update({
            uids: [UserMocks.userFour.uid].concat(mocks.group.uids),
            members: [{
                uid: UserMocks.userFour.uid,
                name: UserMocks.userFour.name,
            }].concat(mocks.group.members),
            updated: firebase.firestore.FieldValue.serverTimestamp(),
        }));
        await resetFirestore();
        await assertFails(queries.group.auth3.update({
            members: [{
                uid: UserMocks.userFour.uid,
                name: UserMocks.userFour.name,
            }].concat(mocks.group.members),
            updated: firebase.firestore.FieldValue.serverTimestamp(),
        }));
        await resetFirestore();
        await assertFails(queries.group.auth3.update({
            uids: [UserMocks.userFour.uid].concat(mocks.group.uids),
            updated: firebase.firestore.FieldValue.serverTimestamp(),
        }));
    });

    it('tests leaving chat w/o uids-members parity', async () => {
        await successfulUpdate();
        await assertFails(queries.group.auth3.update({
            members: mocks.group.members?.filter(member =>
                member.uid !== UserMocks.userThree.uid),
            updated: firebase.firestore.FieldValue.serverTimestamp(),
        }));
        await successfulUpdate();
        await assertFails(queries.group.auth3.update({
            uids: mocks.group.uids?.filter(uid =>
                uid !== UserMocks.userThree.uid),
            updated: firebase.firestore.FieldValue.serverTimestamp(),
        }));

        async function successfulUpdate() {
            await resetFirestore();
            await assertSucceeds(queries.group.auth3.update({
                uids: mocks.group.uids?.filter(uid =>
                    uid !== UserMocks.userThree.uid),
                members: mocks.group.members?.filter(member =>
                    member.uid !== UserMocks.userThree.uid),
                updated: firebase.firestore.FieldValue.serverTimestamp(),
            }));
            await resetFirestore();
        }
    });

    it('tests removing other user', async () => {
        await assertFails(queries.group.auth3.update({
            uids: mocks.group.uids?.filter(uid =>
                uid !== UserMocks.userTwo.uid),
            members: mocks.group.members?.filter(member =>
                member.uid !== UserMocks.userTwo.uid),
            updated: firebase.firestore.FieldValue.serverTimestamp(),
        }));
    });

    it('tests leaving an individual chat', async () => {
        await assertFails(queries.individual.auth.update({
            uids: mocks.group.uids?.filter(uid =>
                uid !== UserMocks.userTwo.uid),
            members: mocks.group.members?.filter(member =>
                member.uid !== UserMocks.userTwo.uid),
            updated: firebase.firestore.FieldValue.serverTimestamp(),
        }));
    });

    it('tests changing individual', async () => {
        await assertFails(queries.individual.auth.update({
            individual: false,
            updated: firebase.firestore.FieldValue.serverTimestamp(),
        }));
    });

    it('tests update without updating updated field', async () => {
        await assertSucceeds(queries.individual.auth.update({
            name: 'test',
            updated: firebase.firestore.FieldValue.serverTimestamp(),
        }));
        await assertFails(queries.individual.auth.update({name: 'test'}));
    });

    it('tests types are valid', async () => {
        await assertFails(queries.individual.auth.update({
            name: false,
            updated: firebase.firestore.FieldValue.serverTimestamp(),
        }));
        await assertFails(queries.individual.auth.update({
            recentMessages: false,
            updated: firebase.firestore.FieldValue.serverTimestamp(),
        }));
        await assertFails(queries.group.auth3.update({
            members: 'string',
            updated: firebase.firestore.FieldValue.serverTimestamp(),
        }));
    });

    it('tests hasOnly rule', async () => {
        await assertFails(queries.individual.auth.update({
            created: new Date(),
            updated: firebase.firestore.FieldValue.serverTimestamp(),
        }));
        await assertFails(queries.individual.auth.update({
            test: 'test',
            updated: firebase.firestore.FieldValue.serverTimestamp(),
        }));
    });

    async function resetFirestore() {
        await teardownFirestore();
        await queries.individual.auth.withConverter(Converters.ChatConverter).set(createChat(mocks.individual));
        await queries.group.auth3.withConverter(Converters.ChatConverter).set(createChat(mocks.group));
    }
})

describe('read chat rules', () => {
    beforeAll(async () => {
        firestore = startFirestore();
        await setupFirestore(false, true);
    });
    beforeEach(async () => {
        await setupFirestore(false, true);
    });
    afterEach(teardownFirestore);

    it('tests listing chats', async () => {
        await assertSucceeds(firestore.firestoreAuth.collection(COLLECTIONS.chats)
            .where('uids', 'array-contains', UserMocks.defaultUser.uid).get());
        await teardownFirestore();
        await assertSucceeds(firestore.firestoreAuth.collection(COLLECTIONS.chats)
            .where('uids', 'array-contains', UserMocks.defaultUser.uid).get());
    });

    it('tests successfully reading individual chat', async () => {
        await assertSucceeds(buildQuery(firestore.firestoreAuth, mocks.individual.id).get())
        await assertSucceeds(buildQuery(firestore.firestoreAuth2, mocks.individual.id).get())
    });

    it("tests reading individual chat you're not in", async () => {
        await assertFails(buildQuery(firestore.firestoreAuth3, mocks.individual.id).get())
    });

    it('tests successfully reading group chat', async () => {
        await assertSucceeds(buildQuery(firestore.firestoreAuth, mocks.group.id).get())
        await assertSucceeds(buildQuery(firestore.firestoreAuth2, mocks.group.id).get())
        await assertSucceeds(buildQuery(firestore.firestoreAuth3, mocks.group.id).get())
    });

    it("tests reading group chat you're not in", async () => {
        await assertFails(buildQuery(firestore.firestoreAuth4, mocks.individual.id).get())
    });
})

describe('delete chat rules', () => {
    beforeAll(async () => {
        firestore = startFirestore();
        queries.individual.auth = await buildQuery(firestore.firestoreAuth, mocks.individual.id);
        queries.individual.auth3 = await buildQuery(firestore.firestoreAuth3, mocks.individual.id);
        queries.group.auth3 = await buildQuery(firestore.firestoreAuth3, mocks.group.id);
        queries.group.auth4 = await buildQuery(firestore.firestoreAuth4, mocks.group.id);
    });
    beforeEach(async () => {
        await setupFirestore(false, true);
    });
    afterEach(teardownFirestore);

    it('tests deleting individual chat', async () => {
        await assertSucceeds(queries.individual.auth.delete());
    });

    it("tests cannot delete individual chat you're not in", async () => {
        await assertSucceeds(queries.individual.auth.delete());
        await setupFirestore(false, true);
        await assertFails(queries.individual.auth3.delete());
    });

    it('tests deleting group chat', async () => {
        await twoMemberGroup();
        await assertSucceeds(queries.group.auth3.delete());
    });

    it("tests cannot delete group chat you're not in", async () => {
        await twoMemberGroup();
        await assertSucceeds(queries.group.auth3.delete());
        await setupFirestore(false, true);
        await twoMemberGroup();
        await assertFails(queries.group.auth4.delete());
    });

    it('tests cannot delete group with >2 members', async () => {
        await twoMemberGroup();
        await assertSucceeds(queries.group.auth3.delete());
        await setupFirestore(false, true);
        await assertFails(queries.group.auth3.delete());
    });

    function twoMemberGroup() {
        return buildQuery(firestore.firestoreAdmin, mocks.group.id).update({
            uids: [UserMocks.defaultUser.uid, UserMocks.userThree.uid],
            members: [{
                uid: UserMocks.defaultUser.uid,
                name: UserMocks.defaultUser.name,
            }, {
                uid: UserMocks.userThree.uid,
                name: UserMocks.userThree.name,
            }]
        });
    }
})

function buildQuery(firestore: firebase.firestore.Firestore, id?: string, converter = true) {
    let query: any = firestore.collection(COLLECTIONS.chats);
    if (id) query = query.doc(id);
    if (converter) query = query.withConverter(Converters.ChatConverter);
    return query;
}

function createChat(chat: ChatInterface) {
    const tmpDoc: Mutable<ChatInterface> = _.clone(chat);
    delete tmpDoc.id;
    delete tmpDoc.created;
    delete tmpDoc.updated;
    return _.clone(tmpDoc);
}

async function createAndValidateChat(chat: ChatInterface,
                                     query: firebase.firestore.DocumentReference) {
    const testChat = createChat(chat);

    // Validate it works
    await assertSucceeds(query.set(testChat));
    await teardownFirestore();

    return testChat;
}

async function createAndValidateNoConverterChat(chat: ChatInterface,
                                                query: firebase.firestore.DocumentReference) {
    const testChat = createChat(chat);
    // @ts-ignore
    testChat.created = firebase.firestore.FieldValue.serverTimestamp();
    // @ts-ignore
    testChat.updated = firebase.firestore.FieldValue.serverTimestamp();

    // Validate it works
    await assertSucceeds(query.set(testChat));
    await teardownFirestore();

    return testChat;
}