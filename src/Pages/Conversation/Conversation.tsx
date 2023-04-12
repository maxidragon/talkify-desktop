import {useCallback, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import MessageCard from "../../Components/Message/MessageCard";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

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
    const [message, setMessage] = useState<string>("");
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

    async function handleSendMessage() {
        try {
            if (message.trim() === "") return;
            if (!conversation) return;
            const response = await fetch(`http://localhost:5000/message/send`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    content: message,
                    conversation: conversation?.id
                }),
                credentials: "include",
                redirect: "follow",
            });
            const data = await response.json();
            fetchMessages();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            {conversation?.messages.map((message: any) => (
                <MessageCard author={message.sender.username} content={message.content} timestamp={message.sendTime}/>
            ))}
            <TextField
                label="Message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                sx={{width: '100%', marginBottom: 1}}
            />
            <Button variant="contained" onClick={handleSendMessage}>
                Send
            </Button>
        </div>
    )
};

export default Conversation;