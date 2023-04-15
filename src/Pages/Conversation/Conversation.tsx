import {useCallback, useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import MessageCard from "../../Components/Message/MessageCard";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import classes from "./Conversation.module.css";
import PeopleIcon from '@mui/icons-material/People';
import Box from "@mui/material/Box";
import ConversationMembers from "../../Components/ModalComponents/ConversationMembers";
import MemberSearchBar from "../../Components/MemberSearchBar";
interface IConversation {
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
    const messageContainerRef = useRef<HTMLDivElement>(null);
    const [conversation, setConversation] = useState<IConversation | null>(null);
    const [message, setMessage] = useState<string>("");
    const [searchBar, showSearchBar] = useState(false);
    const fetchMessages = useCallback(
        async function fetchMessages() {
            try {
                const response = await fetch(`http://localhost:5000/conversation/${conversationId}`, {
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
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTo(0, messageContainerRef.current.scrollHeight);
        }
    }, [conversation]);
    useEffect(() => {
        fetchMessages();
    }, []);

    async function handleSendMessage() {
        try {
            if (message.trim() === "") return;
            if (!conversation) return;
            await fetch(`http://localhost:5000/message/send`, {
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
            setMessage("");
            await fetchMessages();
        } catch (error) {
            console.error(error);
        }
    }
    async function getConversationMembers() {
        try {
            if (!conversation) return;
            const response = await fetch(`http://localhost:5000/conversation/${conversation?.id}/members`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                redirect: "follow",
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
        }
    }
    function toggleSearchBar() {
        showSearchBar(!searchBar);
    };
    return (
        <div>
            <Box sx={{marginBottom: 5}}>
                {searchBar ? <MemberSearchBar /> : null}
                <ConversationMembers handleGetMembers={getConversationMembers} />

                <Button variant="outlined" color="secondary" sx={{marginRight: 2}} startIcon={<PeopleIcon/>} onClick={toggleSearchBar}>
                    Add member
                </Button>
                <Button variant="outlined" color="secondary" sx={{marginRight: 2}} startIcon={<PeopleIcon/>}>
                    Delete conversation
                </Button>
            </Box>
            <div className={classes.messageContainer} ref={messageContainerRef}>
                {conversation?.messages.map((message: any) => (
                    <MessageCard author={message.sender.username} content={message.content}
                                 timestamp={message.sendTime}/>
                ))}
            </div>
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