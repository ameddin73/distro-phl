import React from "react";
import {useUser} from "reactfire";
import {COLLECTIONS} from "util/config";
import {useParams} from "react-router-dom";
import useFirestoreDocumentBuilder from "util/hooks/useFirestoreDocumentBuilder";
import {Converters} from "util/utils";
import Post from "common/Post/Post";
import {Button} from "@material-ui/core";
import RouterLink from "common/RouterLink";

const PostContainer = () => {
    const {id} = useParams<{ id: string | undefined }>();

    // Get user and document
    const {data: user} = useUser();
    const {data: post} = useFirestoreDocumentBuilder(COLLECTIONS.posts, id, Converters.PostConverter);

    // See if this is signed in users post
    const myPost = user && user.uid === post.uid;

    return (<>
        <Post post={post}/>
        {myPost ?
            <Button onClick={() => post.setActive(!post.active)}>
                Set post {post.active ? 'inactive' : 'active'}
            </Button>
            :
            <RouterLink to={'path_to_new_chat'}>
                <Button>
                    Message {post.userName}
                </Button>
            </RouterLink>
        }
    </>)
}

export default PostContainer;