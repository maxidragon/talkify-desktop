import {ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import List from "@mui/material/List";
import * as React from "react";
import Drawer from '../Layout/Drawer';
import SettingsIcon from '@mui/icons-material/Settings';
import KeyIcon from '@mui/icons-material/Key';
import {useNavigate} from "react-router-dom";

const SettingsSidebar = () => {
    const navigate = useNavigate();

    return (
        <Drawer variant="permanent" open={true}>
            <List component="nav" sx={{mt: 8}}>
                <ListItemButton onClick={() => {
                    navigate('/settings');
                }
                }>
                    <ListItemIcon>
                        <SettingsIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Settings"/>
                </ListItemButton>
                <ListItemButton onClick={() => {
                    navigate('/settings/password');
                }
                }>
                    <ListItemIcon>
                        <KeyIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Change password"/>
                </ListItemButton>
            </List>
        </Drawer>
    );
}

export default SettingsSidebar;