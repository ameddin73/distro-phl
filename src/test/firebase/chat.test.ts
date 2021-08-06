/**
 * @jest-environment node
 */
// this test has to be run in a node environment because @firebase/rules-testing-library
// uses grpc and doesn't work in JSDOM. See more:
// https://github.com/firebase/firebase-admin-node/issues/1135#issuecomment-765766020
import firebase from "firebase";
import {firestore} from "firebase-admin/lib/firestore";
import {ChatMocks} from "../mocks/chats.mock";
import {destroyFirebase, initFirebase, setupFirestore, startFirestore, teardownFirestore} from "./utils";
import {COLLECTIONS} from "util/config";
import {Converters} from "util/utils";
import {assertFails, assertSucceeds} from "@firebase/rules-unit-testing";
import {Chat, ChatInterface} from "util/types.distro";
import _ from "lodash";
import {Mutable} from "../types";

let firestoreInstance: firebase.firestore.Firestore;
let firestoreAuth: firebase.firestore.Firestore;
let firestoreAuth2: firebase.firestore.Firestore;
let firestoreAuth3: firebase.firestore.Firestore;
let firestoreAuth4: firebase.firestore.Firestore;
let firestoreAdmin: firestore.Firestore;

const mockIndividualChat = ChatMocks.individualChat;
const mockGroupChat = ChatMocks.groupChat;
const prunedIndividualChat = pruneDoc(mockIndividualChat)
const prunedGroupChat = pruneDoc(mockGroupChat)

beforeAll(initFirebase);
afterAll(destroyFirebase);
describe('testing framework', () => {
    beforeAll(async () => {
        const stores = startFirestore();
        firestoreInstance = stores.firestore;
        firestoreAdmin = stores.firestoreAdmin;
        await setupFirestore(false, true);
    })
    afterAll(teardownFirestore);

    it('tests populates chats', async () => {
        // @ts-ignore
        const query = firestoreAdmin.collection(COLLECTIONS.chats).withConverter(Converters.ChatConverter);
        const {docs: chats} = await query.get();
        // @ts-ignore
        expect(chats.find(chat => chat.data().id === mockIndividualChat.id).data()).toMatchObject(prunedIndividualChat);
        // @ts-ignore
        expect(chats.find(chat => chat.data().id === mockGroupChat.id).data()).toMatchObject(prunedGroupChat);
    })
});

describe('create chat rules', () => {
    let query: firebase.firestore.DocumentReference;
    let testIndividualChat: Mutable<Chat>;

    beforeEach(async () => {
        testIndividualChat = await createAndValidateChat(
            prunedIndividualChat, query);
    });
    beforeAll(async () => {
        await buildFirestore();
        query = await getQuery(firestoreAuth, mockIndividualChat.id);
    });

    it('tests creating individual chat', async () => {
        await assertSucceeds(getQuery(firestoreAuth, mockIndividualChat.id)
            .set(prunedIndividualChat as Chat));
    });

    it('tests creating individual chat, second user', async () => {
        await assertSucceeds(getQuery(firestoreAuth2, mockIndividualChat.id)
            .set(prunedIndividualChat as Chat));
    });

    it('tests creating group chat', async () => {
        await assertSucceeds(getQuery(firestoreAuth, mockGroupChat.id)
            .set(prunedGroupChat as Chat));
        await destroyFirebase();
        await assertSucceeds(getQuery(firestoreAuth2, mockGroupChat.id)
            .set(prunedGroupChat as Chat));
        await destroyFirebase();
        await assertSucceeds(getQuery(firestoreAuth3, mockGroupChat.id)
            .set(prunedGroupChat as Chat));
    });

    it("tests creating chat you're not in", async () => {
        await assertFails(getQuery(firestoreAuth3, mockIndividualChat.id)
            .set(prunedIndividualChat as Chat))
        await assertFails(getQuery(firestoreAuth4, mockGroupChat.id)
            .set(prunedGroupChat as Chat))
    });

    it('tests types are valid', async () => {
        // @ts-ignore
        testIndividualChat.created = 'string';
        await assertFails(query.set(testIndividualChat as Chat));
        testIndividualChat = _.clone(prunedIndividualChat);
        // @ts-ignore
        testIndividualChat.updated = 'string';
        await assertFails(query.set(testIndividualChat as Chat));
        testIndividualChat = _.clone(prunedIndividualChat);
        // @ts-ignore
        testIndividualChat.individual = 'string';
        await assertFails(query.set(testIndividualChat as Chat));
        testIndividualChat = _.clone(prunedIndividualChat);
        // @ts-ignore
        testIndividualChat.members = 'string';
        await assertFails(query.set(testIndividualChat as Chat));
        testIndividualChat = _.clone(prunedIndividualChat);
        // @ts-ignore
        testIndividualChat.members = ['a', 'b'];
        await assertFails(query.set(testIndividualChat as Chat));
        testIndividualChat = _.clone(prunedIndividualChat);
        // @ts-ignore
        testIndividualChat.members = [{
            // @ts-ignore
            uid: false,
            // @ts-ignore
            name: false,
        }, {
            // @ts-ignore
            uid: false,
            // @ts-ignore
            name: false,
        }];
        await assertFails(query.set(testIndividualChat as Chat));
        testIndividualChat = _.clone(prunedIndividualChat);
        // @ts-ignore
        testIndividualChat.name = false;
        await assertFails(query.set(testIndividualChat as Chat));
        testIndividualChat = _.clone(prunedIndividualChat);
        // @ts-ignore
        testIndividualChat.recentMessage = false;
        await assertFails(query.set(testIndividualChat as Chat));
    });

    it('tests hasAll rule', async () => {
        delete testIndividualChat.individual;
        await assertFails(query.set(testIndividualChat as Chat));
    });

    it('tests hasOnly rule', async () => {
        // @ts-ignore
        testIndividualChat.test = 'test';
        await assertFails(query.set(testIndividualChat as Chat));
    });

    it('tests createdNow rule', async () => {
        testIndividualChat.created = new Date('06 Aug 2021 00:00:00 GMT')
        await assertFails(query.set(testIndividualChat as Chat));
    });

    it('tests updatedNow rule', async () => {
        testIndividualChat.updated = new Date('06 Aug 2021 00:00:00 GMT')
        await assertFails(query.set(testIndividualChat as Chat));
    });
});

function buildFirestore() {
    const stores = startFirestore();
    firestoreInstance = stores.firestore;
    firestoreAuth = stores.firestoreAuth;
    firestoreAuth2 = stores.firestoreAuth2;
    firestoreAuth3 = stores.firestoreAuth3;
    firestoreAuth4 = stores.firestoreAuth4;
    firestoreAdmin = stores.firestoreAdmin;
}

function getQuery(firestore: firebase.firestore.Firestore, id?: string) {
    return firestore.collection(COLLECTIONS.chats).doc(id).withConverter(Converters.ChatConverter);
}

function pruneDoc(post: ChatInterface) {
    const tmpDoc: Mutable<ChatInterface> = _.clone(post);
    delete tmpDoc.id;
    delete tmpDoc.created;
    delete tmpDoc.updated;
    return tmpDoc;
}

async function createAndValidateChat(chat: Partial<Chat>, query: firebase.firestore.DocumentReference) {
    let testChat: Mutable<Chat> = _.clone(chat);

    // Validate it works
    await assertSucceeds(query.set(testChat as Chat));
    await teardownFirestore();

    return testChat as Chat;
}