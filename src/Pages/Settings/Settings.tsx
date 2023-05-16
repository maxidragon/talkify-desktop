import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import {Button, CircularProgress, Grid, TextField, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import SuccessNotification from "../../Components/Notifications/SuccessNotification";

const Settings = () => {
    const navigate = useNavigate();
    const [settings, setSettings] = useState<any>();
    const [isLoading, setIsLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const fetchSettings = useCallback(
        async function fetchSettings() {
            try {
                const response = await fetch("http://localhost:5000/user/settings", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    redirect: "follow",
                });
                const data = await response.json();
                if (response.status === 401) {
                    navigate("/auth/login");
                } else {
                    setSettings(data);
                    setIsLoading(false);
                }
            } catch (error) {
                navigate("/auth/login");
                console.error(error);
            }
        }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);
    const updateSettings = useCallback(
        async function updateSettings() {
            try {
                setOpen(false);
                const response = await fetch("http://localhost:5000/user/settings", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(settings),
                    credentials: "include",
                    redirect: "follow",
                });
                const data = await response.json();
                if (response.status === 401) {
                    navigate("/auth/login");
                } else {
                    setOpen(true);
                    console.log(data);
                }
            } catch (error) {
                navigate("/auth/login");
                console.error(error);
            }
        }, [navigate, settings]);
    return (
        <Grid container spacing={3} sx={{marginLeft: 1}}>
            <Typography variant="h4">
                Settings
            </Typography>

            <Grid item xs={12} sx={{marginLeft: -3}}>
                {isLoading ? <CircularProgress/> : (
                    <>
                        <Grid item sx={{paddingTop: 2}}>
                            <TextField label="Email" onChange={(event) => {
                                setSettings(
                                    {
                                        ...settings,
                                        email: event.target.value
                                    }
                                );
                            }} defaultValue={settings.email}/>
                        </Grid>
                        <Grid item sx={{paddingTop: 2}}>
                            <TextField label="Username" onChange={(event) => {
                                setSettings(
                                    {
                                        ...settings,
                                        username: event.target.value
                                    }
                                );
                            }} defaultValue={settings.username}/>
                        </Grid>
                        <Grid item sx={{paddingTop: 2}}>
                            <Button variant="contained" onClick={updateSettings}>Update</Button>
                        </Grid>
                    </>
                )}
            </Grid>
            {open && <SuccessNotification message={"Succesfully updated settings"}/>}
        </Grid>
    );
}

export default Settings;