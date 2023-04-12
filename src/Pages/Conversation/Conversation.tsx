import {useCallback, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import MessageCard from "../../Components/Message/MessageCard";

interface Conversation {
    id: number;
    name: string;
    messages: Message[];
}

interface Message {
    id: number;
    content: string;
    sendTime: Date;
    sender: User;
}

interface User {
    id: number;
    username: string;
}

const Conversation = () => {
    const {conversationId} = useParams();
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const fetchMessages = useCallback(
        async function fetchMessages() {
            try {
                const response = await fetch(`http://localhost:5000/message/conversation/${conversationId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    redirect: "follow",
                });
                const data = await response.json();
                console.log(data);
                setConversation(data);
            } catch (error) {
                console.error(error);
            }
        }, []);

    useEffect(() => {
        fetchMessages();
    }, []);
    return (
        <div>
            {conversation?.messages.map((message: any) => (
                <MessageCard author={message.sender.username} content={message.content} timestamp={message.sendTime} />
            ))}
        </div>
    )
};

export default Conversation;