/**
 * @jest-environment node
 */
import {initFirebase, setupFirestore, startFirestore, teardownFirestore} from "../utils";
import {COLLECTIONS} from "util/config";
import {PostMocks} from "../../mocks/post.mock";
import {Mutable} from "../../types";
import {Post} from "util/types.distro";
import _ from "lodash";

it('populates firestore', async () => {
    await initFirebase();
    const {firestoreAdmin} = await startFirestore();
    await teardownFirestore();
    await setupFirestore(true, true);

    const tertiaryPost: Mutable<Post> = _.clone(PostMocks.tertiaryPost);
    delete tertiaryPost.id;
    firestoreAdmin.collection(COLLECTIONS.posts).doc(PostMocks.tertiaryPost.id || '').set(tertiaryPost);
});