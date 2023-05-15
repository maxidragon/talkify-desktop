import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Container from '@mui/material/Container';
import {useNavigate} from "react-router-dom";
import {Badge, Divider, ListItem, ListItemAvatar, Typography} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import getUser from "../Lib/User";
import {styled} from '@mui/material/styles';
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import CreateConversation from "../Components/ModalComponents/CreateConversation";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Invitations from "../Components/ModalComponents/Invitations";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import Drawer from './Drawer';


interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({theme, open}) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: 240,
        width: `calc(100% - ${240}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));



const DashboardLayout = (props: any) => {
    const [open, setOpen] = useState(true);
    const navigate = useNavigate();
    const [conversations, setConversations] = React.useState([]);
    const [invitationsNumber, setInvationsNumber] = React.useState(0);
    const [title, setTitle] = React.useState('Talkify');
    const toggleDrawer = () => {
        setOpen(!open);
    };
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
            <AppBar position="absolute" open={open}>
                <Toolbar
                    sx={{
                        pr: '24px',
                    }}
                >
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={toggleDrawer}
                        sx={{
                            marginRight: '36px',
                            ...(open && {display: 'none'}),
                        }}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography
                        component="h1"
                        variant="h6"
                        color="inherit"
                        noWrap
                        sx={{flexGrow: 1}}
                    >
                        {title}
                    </Typography>
                    <IconButton onClick={logout} color="inherit">
                        <LogoutIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <Toolbar
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        px: [1],
                    }}
                >
                        <CreateConversation/>
                    <IconButton onClick={switchTheme}>
                        <DarkModeIcon/>
                    </IconButton>
                    <Invitations invitationsNumber={invitationsNumber}/>
                    <IconButton onClick={(event: any) => {
                        event.preventDefault();
                        navigate("/settings");
                    }
                    }>
                        <SettingsIcon/>
                    </IconButton>

                    <IconButton onClick={toggleDrawer}>
                        <ChevronLeftIcon/>
                    </IconButton>
                </Toolbar>
                <Divider/>
                <List component="nav">
                    {conversations.map((conversation: any) => (
                        <React.Fragment key={conversation.conversation.id}>
                            <ListItem button onClick={async () => {
                                setTitle(conversation.conversation.name);
                                navigate(`/conversation/${conversation.conversation.id}`);
                            }}>
                                <ListItemAvatar>
                                    <Badge badgeContent={conversation.conversation.numberOfUnreadMessages} color="primary">
                                    <Avatar alt="Profile Picture"/>
                                    </Badge>
                                </ListItemAvatar>
                                <ListItemText primary={conversation.conversation.name}/>
                            </ListItem>
                            <Divider/>
                        </React.Fragment>
                    ))}
                </List>
            </Drawer>
            {props.sidebar}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                <Toolbar/>
                <Container sx={{mt: 4, mb: 4}}>
                    {props.children}

                </Container>

            </Box>
        </Box>
    )
}

export default DashboardLayout;