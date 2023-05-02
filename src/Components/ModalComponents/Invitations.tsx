import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import {useState} from "react";
import {Badge, IconButton, ListItem, ListItemAvatar} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";
import EmailIcon from "@mui/icons-material/Email";
import {useNavigate} from "react-router-dom";
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';

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
export default function Invitations(props: any) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [invitations, setInvitations] = useState<any>([]);

    async function fetchInvitations() {
        try {
            const response = await fetch("http://localhost:5000/conversation/invitations/", {
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
                setInvitations(data);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function acceptInvitation(id: Number) {
        try {
            const response = await fetch(`http://localhost:5000/conversation/invitations/${id}/accept`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                redirect: "follow"
            });
            if (response.status === 401) {
                navigate("/auth/login");
            } else {
                handleClose();
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function declineInvitation(id: Number) {
        try {
            const response = await fetch(`http://localhost:5000/conversation/invitations/${id}/decline`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                redirect: "follow"
            });
            if (response.status === 401) {
                navigate("/auth/login");
            } else {
                handleClose();
            }
        } catch (error) {
            console.error(error);
        }
    }

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
                        <ListItem key={conversation.conversation.id}>
                            <ListItemAvatar>
                                <Avatar alt="Profile Picture"/>
                            </ListItemAvatar>
                            <ListItemText primary={conversation.conversation.name}/>
                            <IconButton onClick={() => {
                                acceptInvitation(conversation.conversation.id);
                            }}>
                                <DoneIcon/>
                            </IconButton>
                            <IconButton onClick={() => {
                                declineInvitation(conversation.conversation.id);
                            }}>
                                <ClearIcon/>
                            </IconButton>
                        </ListItem>
                    ))}
                </Box>
            </Modal>
        </>
    );
}
