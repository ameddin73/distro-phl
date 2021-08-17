import {destroyFirebase, initFirebase, setupStorage, startStorage, teardownStorage} from "../../util/util";
import {assertSucceeds} from "@firebase/rules-unit-testing";

let storage: any = {};

beforeAll(initFirebase);
afterAll(destroyFirebase);
describe('testing framework', () => {
    beforeAll(async () => {
        storage = await startStorage();
        await setupStorage();
    });
    afterAll(teardownStorage);
    it('tests', async () => {
        assertSucceeds(Promise.resolve());
    },);
});