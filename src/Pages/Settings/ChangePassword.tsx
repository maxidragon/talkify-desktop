import * as React from 'react';
import {useState} from 'react';
import {Button, Grid, TextField, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";

const ChangePassword = () => {
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [repeatNewPassword, setRepeatNewPassword] = useState("");

    async function changePassword() {
        try {
            if (newPassword !== repeatNewPassword) {
                return;
            }
            const response = await fetch("http://localhost:5000/auth/changePassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    oldPassword,
                    newPassword,
                }),
                credentials: "include",
                redirect: "follow",
            });
            //TOOD
            //Show notification that password has been changed (or not)
            const data = await response.json();
            if (response.status === 401) {
                navigate("/auth/login");
            } else {
                console.log(data);
            }
        } catch (error) {
            navigate("/auth/login");
            console.error(error);
        }
    }

    return (
        <Grid container spacing={3} sx={{marginLeft: 1}}>
            <Typography variant="h4">
                Change password
            </Typography>

            <Grid item xs={12} sx={{marginLeft: -3}}>
                <>
                    <Grid item sx={{paddingTop: 2}}>
                        <TextField label="Old password" onChange={(event) => {
                            setOldPassword(event.target.value);
                        }} type="password" autoComplete="current-password"
                        />
                    </Grid>
                    <Grid item sx={{paddingTop: 2}}>
                        <TextField label="New password" onChange={(event) => {
                            setNewPassword(event.target.value);
                        }} type="password"/>
                    </Grid>
                    <Grid item sx={{paddingTop: 2}}>
                        <TextField label="Repeat password" onChange={(event) => {
                            setRepeatNewPassword(event.target.value);
                        }} type="password"/>
                    </Grid>
                    <Grid item sx={{paddingTop: 2}}>
                        <Button variant="contained" onClick={changePassword}>Change password</Button>
                    </Grid>
                </>
            </Grid>

        </Grid>
    );
}

export default ChangePassword;