import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Container from '@mui/material/Container';
import {useCallback, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {Badge, Divider, ListItem, ListItemAvatar, Paper, Typography} from "@mui/material";
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import CreateConversation from "../Components/ModalComponents/CreateConversation";
import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from "@mui/material/IconButton";
import LogoutIcon from '@mui/icons-material/Logout';
import Invitations from '../Components/ModalComponents/Invitations';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import getUser from "../Lib/User";

const DashboardLayout = ({children}: any) => {
    const navigate = useNavigate();
    const [conversations, setConversations] = React.useState([]);
    const [invitationsNumber, setInvationsNumber] = React.useState(0);
    const fetchConversations = useCallback(
        async function fetchConversations() {
            try {
                const response = await fetch("http://localhost:5000/conversation", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    redirect: "follow",
                });

                const data = await response.json();
                if (response.status === 401) {
                    navigate("/auth/login");
                } else {
                    console.log(data);
                    setConversations(data);
                }
            } catch (error) {
                navigate("/auth/login");
                console.error(error);
            }
        }, []);
    const fetchInvitationsNumber = useCallback(
        async function fetchInvitationsNumber() {
            try {
                const response = await fetch("http://localhost:5000/conversation/invitations/number", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    redirect: "follow",
                });

                const data = await response.json();
                if (response.status === 401) {
                    navigate("/auth/login");
                } else {
                    setInvationsNumber(data);
                }
            } catch (error) {
                navigate("/auth/login");
                console.error(error);
            }
        }, []);
    useEffect(() => {
        fetchConversations();
        fetchInvitationsNumber();
    }, [fetchConversations, fetchInvitationsNumber]);


    const logout = (event: any) => {
        event.preventDefault();
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        fetch("http://localhost:5000/auth/logout", {
            method: "POST",
            headers: myHeaders,
            redirect: "follow",
            credentials: "include",
        })
            .then((response) => response.text())
            .then(() => {
                navigate("/auth/login")
            })
            .catch((error) => console.log("error", error));
    }
    const switchTheme = useCallback(
        async function switchTheme() {
            try {
                const user = getUser();
                let id = '';
                if (user.Theme === 'light') {
                    id = 'dark';
                } else {
                    id = 'light';
                }
                const response = await fetch(`http://localhost:5000/user/theme/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    redirect: "follow",
                });

                if (response.status === 401) {
                    navigate("/auth/login");
                }
            } catch (error) {
                navigate("/auth/login");
                console.error(error);
            }
        }, []);
    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <Paper square sx={{pb: '50px', width: '20%'}}>
                <Typography variant="h5" gutterBottom component="div" sx={{p: 2, pb: 0}}>
                    Talkify
                    <CreateConversation/>
                    <IconButton onClick={(event: any) => {
                        event.preventDefault();
                        navigate("/settings");
                    }
                    }>
                        <SettingsIcon/>
                    </IconButton>
                    <Invitations invitationsNumber={invitationsNumber}/>
                    <IconButton onClick={switchTheme}>
                        <DarkModeIcon/>
                    </IconButton>
                    <IconButton onClick={logout}>
                        <LogoutIcon/>
                    </IconButton>
                </Typography>
                <List sx={{mb: 2}}>
                    {conversations.map((conversation: any) => (
                        <React.Fragment key={conversation.conversation.id}>
                            <ListItem button onClick={() => {
                                navigate(`/conversation/${conversation.conversation.id}`);
                            }}>
                                <ListItemAvatar>
                                    <Avatar alt="Profile Picture"/>
                                </ListItemAvatar>
                                <ListItemText primary={conversation.conversation.name}/>
                            </ListItem>
                            <Divider/>
                        </React.Fragment>
                    ))}
                </List>
            </Paper>
            <Box
                component="main"
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[100]
                            : theme.palette.grey[900],
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                <Toolbar />
                <Container>
                    {children}
                </Container>
            </Box>
        </Box>
    )
}

export default DashboardLayout;