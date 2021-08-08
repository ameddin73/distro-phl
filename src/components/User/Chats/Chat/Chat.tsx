import React, {SyntheticEvent} from "react";
import {Message as MessageClass, MessageInterface} from 'util/types.distro';
import Message from "./Message/Message";
import useFirestoreCollectionBuilder from "util/hooks/useFirestoreCollectionBuilder";
import {COLLECTIONS} from "util/config";
import {Converters, Query} from "util/utils";
import {useUser} from "reactfire";
import {Button, TextField} from "@material-ui/core";
import useInput from "util/hooks/useInput";
import useFirestoreDocumentBuilder from "util/hooks/useFirestoreDocumentBuilder";

const Chat = ({id}: { id: string }) => {
    const {data: user} = useUser();
    const {data: chat} = useFirestoreDocumentBuilder(COLLECTIONS.chats,
        id, Converters.ChatConverter);
    const {data: messages} = useFirestoreCollectionBuilder<MessageClass>(COLLECTIONS.messages,
        {orderBy: [Query.orderByDesc.created]},
        Converters.MessageConverter,
        chat.documentRef)

    // New message text
    const {value: body, reset: resetBody, bind: bindBody} = useInput('');

    // Send a message
    const sendMessage = async (event: SyntheticEvent) => {
        event.preventDefault();

        // Build message
        const message: MessageInterface = {
            author: user.uid,
            audience: chat.uids,
            text: body,
        }

        try {
            // Add message to chat's collection
            await chat.sendMessage(message as MessageClass);
            // Update
            resetBody();
        } catch (e) {
            console.error('Couldn\'t send message');
            console.error(e);
        }
    }

    if (!user || !chat) return null;
    return (<>
            {messages.map((message: MessageClass) =>
                (<Message key={message.id} message={message}/>))}
            <form onSubmit={sendMessage}>
                <TextField id="new-message" label="new-message" {...bindBody}/>
                <Button type="submit" color="primary">
                    Send
                </Button>
            </form>
        </>
    )
}

export default Chat;