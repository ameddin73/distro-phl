/**
 * @jest-environment node
 */
// this test has to be run in a node environment because @firebase/rules-testing-library
// uses grpc and doesn't work in JSDOM. See more:
// https://github.com/firebase/firebase-admin-node/issues/1135#issuecomment-765766020
import firebase from "firebase";
import {ChatMocks} from "../mocks/chats.mock";
import {destroyFirebase, initFirebase, setupFirestore, startFirestore, teardownFirestore} from "./utils";
import {COLLECTIONS} from "util/config";
import {Converters} from "util/utils";
import {assertFails, assertSucceeds} from "@firebase/rules-unit-testing";
import {ChatInterface} from "util/types.distro";
import _ from "lodash";
import {Mutable} from "../types";
import {UserMocks} from "../mocks/user.mock";

// Firestore instances
let firestore: any;
// Built queries
let queries: any;
// Mock ChatInterfaces
const mocks = {
    individual: ChatMocks.individualChat,
    group: ChatMocks.groupChat,
}
// Pruned and validated chats
let validatedChats: any;

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
        const query = firestore.firestoreAdmin.collection(COLLECTIONS.chats)
            .withConverter(Converters.ChatConverter);
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
    beforeAll(async () => {
        firestore = startFirestore();
        queries.individual = await buildQuery(firestore.firestoreAuth, mocks.individual.id);
        queries.group = await buildQuery(firestore.firestoreAuth, mocks.group.id);
    });
    beforeEach(async () => {
        validatedChats.individual = await createAndValidateChat(
            mocks.individual, queries.individual);
        validatedChats.group = await createAndValidateChat(
            mocks.group, queries.group);
    });

    it('tests un-authed create chat', async () => {
        await assertFails(buildQuery(firestore.firestoreInstance, mocks.individual.id)
            .set(validatedChats.individual));
    });

    it('tests creating individual chat', async () => {
        await assertSucceeds(buildQuery(firestore.firestoreAuth, mocks.individual.id)
            .set(validatedChats.individual));
    });

    it('tests creating individual chat, second user', async () => {
        await assertSucceeds(buildQuery(firestore.firestore.firestoreAuth2, mocks.individual.id)
            .set(validatedChats.individual));
    });

    it('tests creating group chat', async () => {
        await assertSucceeds(buildQuery(firestore.firestoreAuth, mocks.group.id)
            .set(validatedChats.group));
        await destroyFirebase();
        await assertSucceeds(buildQuery(firestore.firestoreAuth2, mocks.group.id)
            .set(validatedChats.group));
        await destroyFirebase();
        await assertSucceeds(buildQuery(firestore.firestoreAuth3, mocks.group.id)
            .set(validatedChats.group));
    });

    it("tests creating chat you're not in", async () => {
        await assertFails(buildQuery(firestore.firestoreAuth3, mocks.individual.id)
            .set(validatedChats.individual))
        await assertFails(buildQuery(firestore.firestoreAuth4, mocks.group.id)
            .set(validatedChats.group))
    });

    it('tests creating a chat with <2 members', async () => {
        validatedChats.group.members = [{
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
            // Validate unmodified chats
            await assertSucceeds(queries.individual.set(validatedChats.individual));
            await assertSucceeds(queries.group.set(validatedChats.group));

            // Invalidate field
            validatedChats.individual[field] = value;
            validatedChats.group[field] = value;

            // Assert failures
            await assertFails(queries.individual.set(validatedChats.individual));
            await assertFails(queries.group.set(validatedChats.group));

            // Reset Chats
            validatedChats.individual = await createAndValidateChat(
                mocks.individual, queries.individual);
            validatedChats.group = await createAndValidateChat(
                mocks.group, queries.group);
        }
    });

    it('tests hasAll rule', async () => {
        delete validatedChats.individual.individual;
        await assertFails(queries.individual.set(validatedChats.individual));
    });

    it('tests hasOnly rule', async () => {
        validatedChats.individual.test = 'test';
        await assertFails(queries.individual.set(validatedChats.individual));
    });

    it('tests createdNow rule', async () => {
        validatedChats.individual.created = new Date('06 Aug 2021 00:00:00 GMT')
        await assertFails(queries.individual.set(validatedChats.individual));
    });

    it('tests updatedNow rule', async () => {
        validatedChats.individual.updated = new Date('06 Aug 2021 00:00:00 GMT')
        await assertFails(queries.individual.set(validatedChats.individual));
    });
});

describe('update chat rules', () => {
    beforeAll(async () => {
        firestore = startFirestore();
        queries.individual.auth = await buildQuery(firestore.firestoreAuth, mocks.individual.id);
        queries.individual.auth2 = await buildQuery(firestore.firestoreAuth2, mocks.individual.id);
        queries.group.auth3 = await buildQuery(firestore.firestoreAuth3, mocks.group.id);
    });
    beforeEach(async () => {
        await queries.individual.auth.set(createChat(mocks.individual));
        await queries.group.auth3.set(createChat(mocks.group));
    });
    afterEach(teardownFirestore);

    it('tests un-authed update chat', async () => {
        await assertSucceeds(queries.individual.auth.update({recentMessage: 'test'}));
        await assertFails(buildQuery(firestore.firestoreInstance, mocks.individual.id)
            .update({
                recentMessage: 'test',
                updated: firebase.firestore.FieldValue.serverTimestamp(),
            }));
    });

    it("tests updating a chat you're not in", async () => {
        await assertSucceeds(queries.individual.auth.update({recentMessage: 'test'}));
        await assertFails(buildQuery(firestore.firestore.firestoreAuth3, mocks.individual.id)
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
            recentMessages: 'test',
            updated: firebase.firestore.FieldValue.serverTimestamp(),
        }));
        await assertSucceeds(queries.group.auth3.update({
            members: [{
                uid: UserMocks.userFour.uid,
                name: UserMocks.userFour.name,
                // @ts-ignore
            }].push(prunedGroupChat.members),
            updated: firebase.firestore.FieldValue.serverTimestamp(),
        }));
        await assertSucceeds(queries.group.auth3.update({
            members: mocks.group.members?.filter(member =>
                member.uid !== UserMocks.userThree.uid),
            updated: firebase.firestore.FieldValue.serverTimestamp(),
        }));
    });

    it('tests removing other user', async () => {
        await assertFails(queries.group.auth3.update({
            members: mocks.group.members?.filter(member =>
                member.uid !== UserMocks.userTwo.uid),
            updated: firebase.firestore.FieldValue.serverTimestamp(),
        }));
    });

    it('tests leaving an individual chat', async () => {
        await assertFails(queries.individual.auth.update({
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

});

function buildQuery(firestore: firebase.firestore.Firestore, id?: string) {
    return firestore.collection(COLLECTIONS.chats).doc(id).withConverter(Converters.ChatConverter);
}

function createChat(chat: ChatInterface) {
    const tmpDoc: Mutable<ChatInterface> = _.clone(chat);
    delete tmpDoc.id;
    delete tmpDoc.created;
    delete tmpDoc.updated;
    return _.clone(tmpDoc);
}

async function createAndValidateChat(chat: ChatInterface, query: firebase.firestore.DocumentReference) {
    const testChat = createChat(chat);

    // Validate it works
    await assertSucceeds(query.set(testChat));
    await teardownFirestore();

    return testChat;
}