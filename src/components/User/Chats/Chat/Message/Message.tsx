import React from "react";
import {Message as MessageClass} from 'util/types.distro'
import {Typography} from "@material-ui/core";
import {useUser} from "reactfire";

const Message = ({message}: { message: MessageClass }) => {
    const {data: user} = useUser();

    // Check if this is user's message
    const myMessage = message.author === user.uid;

    return (<>
        <Typography variant='subtitle2' color={myMessage ? 'textPrimary' : 'primary'}>
            {myMessage ? 'Me!' : message.author}
        </Typography>
        <Typography color={myMessage ? 'textPrimary' : 'primary'}>
            {message.text}
        </Typography>
    </>)
}


export default Message;