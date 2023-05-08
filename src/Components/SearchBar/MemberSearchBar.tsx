import {useState} from "react";
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import IconButton from "@mui/material/IconButton";
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function ConversationMembers(props: any) {
    const [users, setUsers] = useState<any>([]);
    const [text, setText] = useState('');
    const fetchUsers = async (event: any) => {
        setText(text);
        const val = event.target.value;
        await fetch(`http://localhost:5000/user/search/${val}`, {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((json) => setUsers(json));
    };
    const addUser = async (userId: any) => {
        await fetch(`http://localhost:5000/conversation/add/`, {
            method: "POST",
            credentials: "include",
             headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                conversationId: +props.conversationId,
                userId: userId
            })
        }).then((res) => {
            if (res.status === 200) {
                props.fetchMembers();
            }
        });
    };

    return (
        <Autocomplete
            disablePortal
            color="inherit"
            options={users}
            sx={{width: 300}}
            getOptionLabel={(option: any) => option.username}
            renderOption={(props: any, option: any) => (
                <Box component="li" sx={{'& > img': {mr: 2, flexShrink: 0}}} {...props}>
                    <ListItem
                        key={option.id}
                        secondaryAction={
                            <IconButton aria-label="delete" onClick={(event) => {
                                addUser(option.id);
                            }
                            }>
                                <AddIcon/>
                            </IconButton>
                        }
                        disablePadding
                    >
                        <ListItemButton>
                            <ListItemAvatar>
                                <Avatar
                                    alt={`Avatar`}
                                />
                            </ListItemAvatar>
                            <ListItemText id={option.id} primary={option.username}/>
                        </ListItemButton>
                    </ListItem>
                </Box>
            )}
            renderInput={(params) => <TextField {...params} onChange={fetchUsers} value={text} label="Search" sx={{input: {color: 'black'}}}/>}
        />
    );
}
