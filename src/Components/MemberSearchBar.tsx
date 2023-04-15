import {useState} from "react";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
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
    const fetchUsers = async (event: any) => {
        const val = event.target.value;
        await fetch(`http://localhost:5000/user/search/${val}`, {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((json) => setUsers(json));
    };
    return (
        <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={users}
            sx={{width: 300}}
            getOptionLabel={(option: any) => option.username}
            renderOption={(props: any, option: any) => (
                <Box component="li" sx={{'& > img': {mr: 2, flexShrink: 0}}} {...props}>
                    <ListItem
                        key={option.id}
                        secondaryAction={
                            <IconButton aria-label="delete">
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
            renderInput={(params) => <TextField {...params} onChange={fetchUsers} label="Search"/>}
        />
    );
}
