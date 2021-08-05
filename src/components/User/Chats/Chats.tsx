import React from "react";
import {useParams} from "react-router-dom";
import Chat from "./Chat/Chat";
import ChatList from "./ChatList/ChatList";

const Chats = () => {
    const {id} = useParams<{ id: string }>();

    return (<>
        {id ?
            <Chat id={id}/>
            :
            <ChatList/>}
    </>)
}

export default Chats;
