import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import {useCallback, useState} from "react";
import * as React from "react";
import {useNavigate} from "react-router-dom";
import {Button, Grid, Typography} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

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
export default function DeleteConfirmation(props: any) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    async function handleOpen() {
        setOpen(true)
        console.log(props.handleGetMembers());
    };
    const deleteMessage = useCallback(
        async function deleteMessage() {
            console.log(props.id);
            try {
                const response = await fetch(`http://localhost:5000/message/delete/${props.id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    redirect: "follow",
                });
                if (response.status === 401) {
                    navigate("/auth/login");
                }
                else {
                    props.handleDelete();
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
            <IconButton aria-label="delete" onClick={handleOpen}>
                <DeleteIcon/>
            </IconButton>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box sx={style}>
                    <Grid container direction="column" spacing={2}>
                        <Grid item>
                            <Typography variant="h5">Delete message</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="body1">Are you sure you want to delete this message?</Typography>
                        </Grid>
                        <Grid item>
                            <Button onClick={deleteMessage} variant="contained" color="error">Delete</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </>
    );
}
