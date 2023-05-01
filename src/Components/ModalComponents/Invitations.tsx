import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {useCallback, useState} from "react";
import PeopleIcon from "@mui/icons-material/People";
import {Badge, IconButton, ListItem, ListItemAvatar} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";
import EmailIcon from "@mui/icons-material/Email";
import {useNavigate} from "react-router-dom";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
export default function ConversationMembers(props: any) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [invitations, setInvitations] = useState<any>([]);
    async function fetchInvitations() {
            try {
                const response = await fetch("http://localhost:5000/conversation/invitations", {
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
                    setInvitations(data);
                }
            } catch (error) {
                console.error(error);
            }
        };
    async function handleOpen() {
        setOpen(true);
        fetchInvitations();
    };
    const handleClose = () => setOpen(false);

    return (
        <>
            <IconButton onClick={handleOpen}>
                <Badge badgeContent={props.invitationsNumber} color="primary">
                    <EmailIcon color="action"/>
                </Badge>
            </IconButton>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box sx={style}>
                    {invitations.map((conversation: any) => (
                        <ListItem button>
                            <ListItemAvatar>
                                <Avatar alt="Profile Picture"/>
                            </ListItemAvatar>
                            <ListItemText primary={conversation.name}/>
                        </ListItem>
                    ))}
                </Box>
            </Modal>
        </>
    );
}
