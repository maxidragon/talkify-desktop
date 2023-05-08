import * as React from "react";
import {useState} from "react";
import {IconButton, ListItem, ListItemAvatar, ListItemButton, ListItemIcon} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import StarIcon from '@mui/icons-material/Star';
import DeleteIcon from '@mui/icons-material/Delete';
import {useNavigate, useParams} from "react-router-dom";
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import PeopleIcon from "@mui/icons-material/People";

export default function ConversationMembers(props: any) {
    const [open, setOpen] = useState(false);
    const [members, setMembers] = useState([]);

    const {conversationId} = useParams();
    const navigate = useNavigate();

    async function toggleMembers() {
            setOpen(!open);
            setMembers(await props.handleGetMembers());
            console.log(members);
    }

    async function handleDeleteMember(id: Number) {
        try {
            const response = await fetch(`http://localhost:5000/conversation/remove?userId=${id}&conversationId=${conversationId}`, {
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
    async function addAdmin(id: Number) {
        try {
            const response = await fetch(`http://localhost:5000/conversation/admin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: id,
                    conversationId: conversationId
                }),
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
    async function removeAdmin(id: Number) {
        try {
            const response = await fetch(`http://localhost:5000/conversation/admin?userId=${id}&conversationId=${conversationId}`, {
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

    const handleClose = () => setOpen(false);

    return (
        <>
            <ListItemButton onClick={toggleMembers}>
                <ListItemIcon>
                    <PeopleIcon/>
                </ListItemIcon>
                <ListItemText primary="Members"/>
            </ListItemButton>
            {open && (
                    members.map((member: any) => (
                        <ListItem key={member.user.id}>
                            <ListItemAvatar>
                                <Avatar alt="Profile Picture"/>
                            </ListItemAvatar>
                            {member.isAdmin ? (
                                    <ListItemText primary={member.user.username} secondary={"Admin"} />
                                ) : (
                                <ListItemText primary={member.user.username} secondary={("Added by " + member.addedBy.username)}/>
                            )}
                            {props.isAdmin ? (
                                <>

                                    {member.isAdmin ? (
                                        <IconButton color="inherit" onClick={async () => {
                                            await removeAdmin(member.user.id);
                                        }}>
                                            <StarOutlineIcon/>
                                        </IconButton>
                                    ) : (
                                        <IconButton color="inherit" onClick={async () => {
                                            await addAdmin(member.user.id);
                                        }}>
                                            <StarIcon/>
                                        </IconButton>
                                    )
                                    }
                                    <IconButton color="inherit" onClick={() => {
                                        handleDeleteMember(member.user.id);
                                    }}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </>
                            ) : <></>}
                        </ListItem>
                    ))
                )}
        </>
    );
}
