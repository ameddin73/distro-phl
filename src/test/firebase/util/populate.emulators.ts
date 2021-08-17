/**
 * @jest-environment node
 */
import {setupFirestore, startFirestore, teardownFirestore} from "./util";
import {COLLECTIONS} from "util/config";
import {PostMocks} from "../../mocks/post.mock";
import {Mutable} from "../../types";
import {PostInterface} from "util/types.distro";
import _ from "lodash";

it('populates firestore', async () => {
    // Initialize and sanitize
    const {firestoreAdmin} = startFirestore();
    await teardownFirestore();

    // Default setup
    await setupFirestore(true, true);

    // Add your special cases here
    const tertiaryPost: Mutable<PostInterface> = _.clone(PostMocks.tertiaryPost);
    delete tertiaryPost.id;
    await firestoreAdmin.collection(COLLECTIONS.posts).doc(PostMocks.tertiaryPost.id || '').set(tertiaryPost);
});