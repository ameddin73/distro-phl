import {ItemTypeInterface, ItemTypes} from "util/types";
import firebase from "@firebase/testing";
import {TypesMocks} from "test/mocks/type.mock";
import {Mutable} from "test/types";
import {COLLECTIONS} from "util/config";

async function setTypes(firestoreAdmin: firebase.firestore.Firestore, mock?: ItemTypes) {
    mock = mock || TypesMocks.defaultTypes;
    for (const mockType of Object.values(mock)) {
        const id = mockType.id;
        const mocDoc: Mutable<ItemTypeInterface> = mockType;
        delete mocDoc.id;
        await firestoreAdmin.collection(COLLECTIONS.types).doc(id).set(mocDoc);
    }
}

export default setTypes;