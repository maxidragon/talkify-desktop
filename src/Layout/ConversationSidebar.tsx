import {IconButton, ListItemButton, ListItemIcon, ListItemText, Typography} from "@mui/material";
import List from "@mui/material/List";
import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import Drawer from '../Layout/Drawer';
import ConversationMembers from "../Pages/Conversation/ConversationMembers";
import {useNavigate, useParams} from "react-router-dom";
import MemberSearchBar from "../Components/SearchBar/MemberSearchBar";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import PhoneIcon from '@mui/icons-material/Phone';
import VideocamIcon from '@mui/icons-material/Videocam';
import {useConfirm} from "material-ui-confirm";
import LogoutIcon from "@mui/icons-material/Logout";

const ConversationSidebar = () => {
    const {conversationId} = useParams();
    const [messagesLoaded, setMessagesLoaded] = useState(false);
    const [searchBar, showSearchBar] = useState(false);
    const [conversationName, setConversationName] = useState('Conversation');
    const confirm = useConfirm();
    const navigate = useNavigate();
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

    async function leaveConversation() {
        confirm({description: "Are you sure you want to leave this conversation?"}).then(async () => {
            const response = await fetch(`http://localhost:5000/conversation/leave/${conversationId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                redirect: "follow",
            });
            if (response.status === 401) {
                navigate("/auth/login");
            } else {
                navigate('/');
                window.location.reload();
            }
        }).catch((error) => {
                console.error(error);
            }
        );

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
        <Drawer variant="permanent" open={true} width={300}>
            <Box sx={{
                mt: 10,
                alignItems: 'center',
                width: '100%',
                textAlign: 'center',
                justifyContent: 'center',
                display: 'flex',
                flexDirection: 'column'
            }}>
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
                <ListItemButton onClick={leaveConversation}>
                    <ListItemIcon>
                        <LogoutIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Leave conversation"/>
                </ListItemButton>
            </List>
        </Drawer>
    );
}

export default ConversationSidebar;