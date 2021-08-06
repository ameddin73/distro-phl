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
const mocIndividualDoc = pruneDoc(mockIndividualChat)
const mocGroupDoc = pruneDoc(mockGroupChat)

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
        expect(chats.find(chat => chat.data().id === mockIndividualChat.id).data()).toMatchObject(mocIndividualDoc);
        // @ts-ignore
        expect(chats.find(chat => chat.data().id === mockGroupChat.id).data()).toMatchObject(mocGroupDoc);
    })
});

describe('create chat rules', () => {
    beforeAll(buildFirestore);

    it('tests creating individual chat', async () => {
        await assertSucceeds(getQuery(firestoreAuth, mockIndividualChat.id)
            .set(mocIndividualDoc as Chat));
    });

    it('tests creating individual chat, second user', async () => {
        await assertSucceeds(getQuery(firestoreAuth2, mockIndividualChat.id)
            .set(mocIndividualDoc as Chat));
    });

    it('tests creating group chat', async () => {
        await assertSucceeds(getQuery(firestoreAuth, mockGroupChat.id)
            .set(mocGroupDoc as Chat));
        await assertSucceeds(getQuery(firestoreAuth2, mockGroupChat.id)
            .set(mocGroupDoc as Chat));
        await assertSucceeds(getQuery(firestoreAuth3, mockGroupChat.id)
            .set(mocGroupDoc as Chat));
    });

    it("tests creating individual chat you're not in", async () => {
        await assertFails(getQuery(firestoreAuth3, mockIndividualChat.id)
            .set(mocIndividualDoc as Chat))
    });

    it("tests creating group chat you're not in", async () => {
        await assertFails(getQuery(firestoreAuth4, mockGroupChat.id)
            .set(mocGroupDoc as Chat))
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
