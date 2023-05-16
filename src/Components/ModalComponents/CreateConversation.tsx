import Box from '@mui/material/Box';
import CreateIcon from '@mui/icons-material/Create';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import * as React from "react";
import {useCallback, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Grid, TextField, Typography} from "@mui/material";

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
export default function CreateConversation(props: any) {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [open, setOpen] = useState(false);

    async function handleOpen() {
        setOpen(true)
    }
    const createConversation = useCallback(
        async function createConversation(nameParam: string) {
            try {
                const response = await fetch("http://localhost:5000/conversation/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: nameParam
                    }),
                    credentials: "include",
                    redirect: "follow",
                });

                const data = await response.json();
                if (response.status === 401) {
                    navigate("/auth/login");
                } else {
                    handleClose();
                    await props.fetchConversations();
                    console.log(data);
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
                <CreateIcon/>
            </IconButton>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box sx={style}>
                    <Grid container direction="column"  spacing={2}>
                        <Grid item>
                            <Typography variant="h5">Create conversation</Typography>
                        </Grid>
                        <Grid item>
                            <TextField id="outlined-basic" label="Name" variant="outlined" onChange={(event) => {
                                setName(event.target.value);
                            }}/>
                        </Grid>
                        <Grid item>
                            <Button onClick={() => {
                                createConversation(name);
                            }} variant="contained">Create</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </>
    );
}
