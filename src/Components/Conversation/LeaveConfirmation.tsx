import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import * as React from "react";
import {useCallback, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Button, Grid, ListItemButton, ListItemIcon, ListItemText, Typography} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

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
export default function LeaveConfirmation(props: any) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const {conversationId} = useParams();

    async function handleOpen() {
        setOpen(true)
    }

    const leaveConversation = useCallback(
        async function leaveConversation() {
            try {
                console.log(props.conversation);
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
                    handleClose();
                }
            } catch (error) {
                navigate("/auth/login");
                console.error(error);
            }
        }, [navigate]);
    const handleClose = () => setOpen(false);

    return (
        <>
            <ListItemButton onClick={handleOpen}>
                <ListItemIcon>
                    <LogoutIcon/>
                </ListItemIcon>
                <ListItemText primary="Leave conversation"/>
            </ListItemButton>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box sx={style}>
                    <Grid container direction="column" spacing={2}>
                        <Grid item>
                            <Typography variant="h5">Leave conversation</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="body1">Are you sure you want to leave this conversation?</Typography>
                        </Grid>
                        <Grid item>
                            <Button onClick={leaveConversation} variant="contained" color="error">Leave</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </>
    );
}
