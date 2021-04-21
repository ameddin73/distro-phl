/**
 * @jest-environment node
 */
import {initFirebase, setupFirestore, startFirestore, teardownFirestore} from "../utils";

it('populates firestore', async () => {
    await initFirebase();
    await startFirestore();
    await teardownFirestore();
    await setupFirestore(true, true);
});