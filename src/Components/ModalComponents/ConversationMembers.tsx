import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {useState} from "react";
import PeopleIcon from "@mui/icons-material/People";
import {ListItem, ListItemAvatar} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";

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
    const [open, setOpen] = useState(false);
    const [members, setMembers] = useState([]);
    async function handleOpen() {
        setOpen(true)
        console.log(props.handleGetMembers());
        setMembers(await props.handleGetMembers());
    };
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Button variant="outlined" color="secondary" sx={{marginRight: 2}} startIcon={<PeopleIcon/>}
                    onClick={handleOpen}>
                Members
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box sx={style}>
                    {members.map((member: any) => (
                        <ListItem button>
                            <ListItemAvatar>
                                <Avatar alt="Profile Picture"/>
                            </ListItemAvatar>
                            <ListItemText primary={member.user.username}/>
                        </ListItem>
                    ))}
                </Box>
            </Modal>
        </div>
    );
}
