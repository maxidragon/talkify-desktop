import * as React from "react";
import {useCallback, useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import MessageCard from "../../Components/Message/MessageCard";
import Button from '@mui/material/Button';
import classes from "./Conversation.module.css";
import Box from "@mui/material/Box";
import EmojiPicker from 'emoji-picker-react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import {CircularProgress} from "@mui/material";
import io from "socket.io-client";
import {sendNotification} from "@tauri-apps/api/notification";

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
const socket = io('http://localhost:5000/chat');
const Conversation = () => {
    const {conversationId} = useParams();
    const messageContainerRef = useRef<HTMLDivElement>(null);
    const [conversation, setConversation] = useState<IConversation | null>(null);
    const [message, setMessage] = useState<string>("");

    const [messagesLoaded, setMessagesLoaded] = useState(false);
    const [take, setTake] = useState(10);
    const [showPicker, setShowPicker] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const fetchMessages = useCallback(
        async function fetchMessages(paramTake: number) {
            try {
                const response = await fetch(`http://localhost:5000/conversation/messages/${conversationId}?skip=0&take=${paramTake}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    redirect: "follow",
                });
                const data = await response.json();
                console.log(data);
                setIsAdmin(data.isAdmin);
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
        socket.emit('enterConversation', conversationId);
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
        markMessagesAsRead();
    }
    async function markMessagesAsRead() {
        try {
            await fetch(`http://localhost:5000/conversation/read/${conversationId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                redirect: "follow",
            });
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
    useEffect(() => {
        socket.on('message', (message) => {
            setConversation((conversation) => {
                if (conversation) {
                    return {
                        ...conversation,
                        messages: [...conversation.messages, message]
                    };
                }
                return conversation;
            });
         sendNotification({ title: `${message.sender.username} messaged ${conversation?.name}`, body: message?.content });
        });
        markMessagesAsRead();
    }, [socket]);
    return (
        <>
            {messagesLoaded ? (
                <Box className={classes.messageContainer} ref={messageContainerRef}
                     sx={{width: '100%', height: '100%'}}>
                    <Button variant="outlined" onClick={loadMoreMessages}>Load more messages</Button>
                    {conversation?.messages.map((message: any) => (
                        <MessageCard message={message}
                                     fetchMessages={fetchMessages} key={message.id}/>
                    ))}
                </Box>
            ) : <CircularProgress
                sx={{alignItems: 'center', margin: 'auto', justifyContent: 'center', width: '100%'}}/>}
            <Box sx={{position: 'relative'}}>
                <Paper
                    sx={{p: '2px 4px', display: 'flex'}}
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
