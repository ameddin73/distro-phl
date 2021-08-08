import React, {SyntheticEvent} from "react";
import {useUser} from "reactfire";
import useFirestoreCollectionBuilder from "util/hooks/useFirestoreCollectionBuilder";
import {COLLECTIONS, PATHS} from "util/config";
import {Chat as ChatClass, FirestoreQuery, FirestoreQueryWhere} from "util/types.distro";
import {Converters} from "util/utils";
import {Button, TextField} from "@material-ui/core";
import RouterLink from "../../../Common/RouterLink";
import useInput from "util/hooks/useInput";
import useFirestoreAdd from "util/hooks/useFirestoreAdd";
import {useHistory} from "react-router-dom";
import firebase from "firebase/app";

const CList = ({user}: { user: firebase.User }) => {
    // Get user's chats
    const where: FirestoreQueryWhere = {
        fieldPath: 'uids',
        opStr: 'array-contains',
        value: user.uid
    }
    const query: FirestoreQuery = {
        where: [where],
        orderBy: [{
            fieldPath: 'updated',
            directionStr: 'desc',
        }]
    }
    const {data: chats} = useFirestoreCollectionBuilder(COLLECTIONS.chats,
        query, Converters.ChatConverter)

    return (<>
        {chats.map((chat: ChatClass) => (
            <RouterLink key={chat.id} to={`${PATHS.public.chats}/${chat.id}`}>
                <Button>
                    {chat.name}
                </Button>
            </RouterLink>
        ))}
    </>);
}

const ChatList = () => {
    const {data: user} = useUser();
    const history = useHistory();

    // New chat state
    const {value: uid, bind: bindUid} = useInput('');
    const {value: name, bind: bindName} = useInput('');
    const [addChat] = useFirestoreAdd(COLLECTIONS.chats, Converters.ChatConverter);

    // Create new chat and go to it
    const createChat = async (event: SyntheticEvent) => {
        event.preventDefault();

        try {
            // Create chat
            const chatRef = await addChat({
                uids: [
                    user.uid,
                    uid,
                ],
                members: [{
                    uid: user.uid,
                    name: user.displayName,
                }, {
                    uid: uid,
                    name: uid,
                }],
                name: name,
            } as ChatClass)

            // Navigate to it
            history.push(`${PATHS.public.chats}/${chatRef.id}`);
        } catch (e) {
            console.error(e)
        }
    }

    if (!user) return null;
    return (<>
        <CList user={user}/>
        <form onSubmit={createChat}>
            <TextField id="uid" label="User" {...bindUid}/>
            <TextField id="name" label="Chat Name" {...bindName}/>
            <Button type="submit">
                Start Chat
            </Button>
        </form>
    </>)
}

export default ChatList;