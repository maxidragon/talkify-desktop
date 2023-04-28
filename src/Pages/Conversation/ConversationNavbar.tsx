import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MemberSearchBar from '../../Components/SearchBar/MemberSearchBar';
import ConversationMembers from "../../Components/ModalComponents/ConversationMembers";
import {useState} from "react";
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const ConversationNavbar = (props: any) => {
    const [searchBar, showSearchBar] = useState(false);

    function toggleSearchBar() {
        showSearchBar(!searchBar);
    };

    async function getConversationMembers() {
        try {
            if (!props.conversation) return;
            const response = await fetch(`http://localhost:5000/conversation/${props.conversation?.id}/members`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                redirect: "follow",
            });
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Box sx={{flexGrow: 1, marginBottom: 5, marginTop: -8, marginLeft: -3, width: '100%'}}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{mr: 2}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        {props.conversation?.name}
                    </Typography>
                    {searchBar ? <MemberSearchBar conversationId={props.conversation.id}/> : null}
                    <IconButton color="inherit" onClick={() => {
                        showSearchBar(!searchBar);
                    }
                    }>
                        <PersonAddIcon/>
                    </IconButton>
                    <ConversationMembers handleGetMembers={getConversationMembers}/>
                    <IconButton
                        size="large"
                        color="inherit"
                    >
                        <MenuIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
    )
};

export default ConversationNavbar;