import {Offer} from "util/types.distro";
import {PostMocks} from "./post.mock";
import {UserMocks} from "./user.mock";

export namespace OfferMocks {
    export const defaultOffer: Required<Offer> = {
        id: UserMocks.userTwo.uid,
        created: new Date('01 Jan 1970 00:00:00 GMT'),
        // @ts-ignore
        postId: PostMocks.defaultPost.id,
        posterId: PostMocks.defaultPost.uid,
        userName: UserMocks.userTwo.name,
        message: 'default_offer_message',
    }
    export const secondaryOffer: Offer = {
        id: UserMocks.userThree.uid,
        created: new Date('01 Jan 1971 00:00:00 GMT'),
        // @ts-ignore
        postId: PostMocks.defaultPost.id,
        posterId: PostMocks.defaultPost.uid,
        userName: UserMocks.userThree.name,
        message: 'secondary_offer_message',
    }
}