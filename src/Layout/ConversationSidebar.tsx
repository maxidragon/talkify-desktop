import {IconButton, ListItemButton, ListItemIcon, ListItemText, Typography} from "@mui/material";
import List from "@mui/material/List";
import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import Drawer from '../Layout/Drawer';
import ConversationMembers from "../Pages/Conversation/ConversationMembers";
import {useParams} from "react-router-dom";
import MemberSearchBar from "../Components/SearchBar/MemberSearchBar";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LeaveConfirmation from "../Components/ModalComponents/LeaveConfirmation";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import PhoneIcon from '@mui/icons-material/Phone';
import VideocamIcon from '@mui/icons-material/Videocam';

const ConversationSidebar = () => {
    const {conversationId} = useParams();
    const [messagesLoaded, setMessagesLoaded] = useState(false);
    const [searchBar, showSearchBar] = useState(false);
    const [conversationName, setConversationName] = useState('Conversation');

    async function getConversationMembers() {
        try {
            const response = await fetch(`http://localhost:5000/conversation/${conversationId}/members`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                redirect: "follow",
            });
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }

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
                setConversationName(data.name);
                setIsAdmin(data.isAdmin);
            } catch (error) {
                console.error(error);
            }
        }, [conversationId]);
    useEffect(() => {
        setMessagesLoaded(false);
        fetchMessages(10);
    }, [conversationId]);

    return (
        <Drawer variant="permanent" open={true}>
            <Box sx={{mt: 10, alignItems: 'center', width: '100%', textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column'}}>
                <Avatar alt="Profile Picture" sx={{width: 64, height: 64}}/>
                <Typography variant="h6" component="div" sx={{mt: 2}}>{conversationName}</Typography>

            </Box>
            <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                <IconButton>
                    <PhoneIcon/>
                </IconButton>
                <IconButton>
                    <VideocamIcon/>
                </IconButton>
            </Box>
            <List component="nav">
                <ConversationMembers handleGetMembers={getConversationMembers} isAdmin={isAdmin}/>
                <ListItemButton onClick={() => {
                    showSearchBar(!searchBar);
                }
                }>
                    <ListItemIcon>
                        <PersonAddIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Add member"/>
                </ListItemButton>
                {searchBar ? <MemberSearchBar conversationId={conversationId}/> : null}
                <LeaveConfirmation/>
            </List>
        </Drawer>
    );
}

export default ConversationSidebar;