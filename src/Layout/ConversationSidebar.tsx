import {Divider, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import List from "@mui/material/List";
import * as React from "react";
import Toolbar from "@mui/material/Toolbar";
import CreateConversation from "../Components/ModalComponents/CreateConversation";
import IconButton from "@mui/material/IconButton";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import SettingsIcon from "@mui/icons-material/Settings";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Drawer from '../Layout/Drawer';
import DashboardIcon from "@mui/icons-material/Dashboard";

const ConversationSidebar = () => {
    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <Drawer variant="permanent" open={open}>
            <Toolbar
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    px: [1],
                }}
            >
                <CreateConversation/>
                <IconButton>
                    <DarkModeIcon/>
                </IconButton>
                <IconButton>
                    <SettingsIcon/>
                </IconButton>

                <IconButton onClick={toggleDrawer}>
                    <ChevronLeftIcon/>
                </IconButton>
            </Toolbar>
            <Divider/>
            <List component="nav">
                <ListItemButton>
                    <ListItemIcon>
                        <DashboardIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Dashboard"/>
                </ListItemButton>
            </List>
        </Drawer>
    );
}

export default ConversationSidebar;