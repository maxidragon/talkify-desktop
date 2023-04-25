import {useCallback, useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import MessageCard from "../../Components/Message/MessageCard";
import Button from '@mui/material/Button';
import classes from "./Conversation.module.css";
import PeopleIcon from '@mui/icons-material/People';
import Box from "@mui/material/Box";
import ConversationMembers from "../../Components/ModalComponents/ConversationMembers";
import MemberSearchBar from "../../Components/MemberSearchBar";
import EmojiPicker from 'emoji-picker-react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import * as React from "react";
import ConversationNavbar from "./ConversationNavbar";

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

    const [messagesLoaded, setMessagesLoaded] = useState(false);
    const [take, setTake] = useState(10);
    const [showPicker, setShowPicker] = useState(false);
    const fetchMessages = useCallback(
        async function fetchMessages(paramTake: number) {
            try {
                const response = await fetch(`http://localhost:5000/conversation/${conversationId}?skip=0&take=${paramTake}`, {
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
                setMessagesLoaded(true);
            } catch (error) {
                console.error(error);
            }
        }, [conversationId]);


    useEffect(() => {
        if (messageContainerRef.current && take === 10) {
            messageContainerRef.current.scrollTo(0, messageContainerRef.current.scrollHeight);
        }
    }, [conversation]);
    useEffect(() => {
        setMessagesLoaded(false);
        fetchMessages(10);
    }, [conversationId]);


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
            await fetchMessages(10);
        } catch (error) {
            console.error(error);
        }
    }




    const loadMoreMessages = () => {
        setTake(take + 10);
        fetchMessages(take + 10);
    };
    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSendMessage();
            setMessage('');
        }
    };
    const handleEmojiClick = (emoji: any) => {
        setMessage(message + emoji.emoji);
    };
    return (
        <>
            <ConversationNavbar conversation={conversation}/>

            <div className={classes.messageContainer} ref={messageContainerRef}>
                <Button variant="outlined" onClick={loadMoreMessages}>Load more messages</Button>
                {conversation?.messages.map((message: any) => (
                    <MessageCard author={message.sender.username} content={message.content}
                                 timestamp={message.sendTime} isOwned={message.isOwned} id={message.id}
                                 fetchMessages={fetchMessages}/>
                ))}
            </div>
            <Box sx={{position: 'relative'}}>
                <Paper
                    sx={{p: '2px 4px', display: 'flex', alignItems: 'center', mb: 5}}
                >
                    <IconButton type="button" sx={{p: '10px'}} aria-label="send">
                        <InsertPhotoIcon/>
                    </IconButton>
                    <Divider sx={{height: 28, m: 0.5}} orientation="vertical"/>
                    <InputBase
                        sx={{ml: 1, flex: 1}}
                        placeholder="Message"
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <IconButton color="primary" sx={{p: '10px'}} onClick={() => setShowPicker(!showPicker)}>
                        <EmojiEmotionsIcon/>
                    </IconButton>
                    <Divider sx={{height: 28, m: 0.5}} orientation="vertical"/>
                    <IconButton type="button" sx={{p: '10px'}} aria-label="send" onClick={handleSendMessage}>
                        <SendIcon/>
                    </IconButton>
                </Paper>
                {showPicker && (
                    <Box sx={{position: 'absolute', top: '-470px', right: '30px'}}>
                        <EmojiPicker onEmojiClick={handleEmojiClick}/>
                    </Box>
                )}
            </Box>
        </>
    )
};

export default Conversation;