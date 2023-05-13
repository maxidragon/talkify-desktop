import * as React from 'react';
import {useState} from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import DeleteConfirmation from "../ModalComponents/DeleteConfirmation";
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import SendIcon from "@mui/icons-material/Send";

const MessageCard = (props: any) => {
    const [hidden, setHidden] = useState(false);
    const [isEdited, setIsEdited] = useState(false);
    const [editedMessage, setEditedMessage] = useState(props.message.content);
    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };
    const formattedTimestamp = formatDate(new Date(props.message.sendTime));
    const handleDelete = () => {
        setHidden(true);
    }
    const handleEdit = () => {
        setIsEdited(true);
    };
    async function updateMessage() {
        try {
            await fetch(`http://localhost:5000/message/${props.message.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                redirect: "follow",
                body: JSON.stringify({
                    content: editedMessage
                })
            });
            setIsEdited(false);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            {
                hidden ? <></> : (

                    <Card sx={{display: 'flex', marginBottom: 1}}>
                        {isEdited ? (
                            <>
                                <Paper
                                    sx={{p: '2px 4px', display: 'flex', alignItems: 'center', mb: 5}}
                                >
                                    <IconButton type="button" sx={{p: '10px'}} aria-label="send">
                                        <InsertPhotoIcon/>
                                    </IconButton>
                                    <Divider sx={{height: 28, m: 0.5}} orientation="vertical"/>
                                    <InputBase
                                        sx={{ml: 1, flex: 1}}
                                        placeholder="Message"
                                        value={editedMessage}
                                        onChange={(event) => setEditedMessage(event.target.value)}
                                    />
                                    <Divider sx={{height: 28, m: 0.5}} orientation="vertical"/>
                                    <IconButton type="button" sx={{p: '10px'}} aria-label="edit" onClick={updateMessage}>
                                        <SendIcon/>
                                    </IconButton>
                                </Paper>
                            </>
                        ) : (
                            <>
                                <Avatar alt="avatar" sx={{
                                    width: 32,
                                    height: 32,
                                    marginRight: 1.5,
                                    marginLeft: 2,
                                    marginTop: 2.5,
                                    marginBottom: 'auto'
                                }}/>
                                <CardContent sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                                    <Typography variant="subtitle1" sx={{fontWeight: 'bold', marginBottom: 0.5}}>
                                        {props.message.sender.username} <span
                                        style={{
                                            fontSize: '0.8rem',
                                            fontWeight: 'normal',
                                            color: '#888'
                                        }}>{formattedTimestamp}
                                        {props.message.isEdited && ' (edited)'}
                                        </span>
                                    </Typography>
                                    <Typography variant="body1">{editedMessage}</Typography>
                                </CardContent>
                                <Box marginLeft="auto" sx={{marginRight: 2}}>
                                    {props.message.isOwned ? (
                                        <>
                                            <IconButton onClick={handleEdit}>
                                                <EditIcon/>
                                            </IconButton>
                                            <DeleteConfirmation id={props.message.id} handleDelete={handleDelete}/>
                                        </>
                                    ) : <></>}
                                </Box>
                                <Divider sx={{margin: 0, height: '100%', alignSelf: 'stretch'}}/>
                            </>
                        )}
                    </Card>
                )}
        </>

    );
};

export default MessageCard;
