import * as React from 'react';
import Grid from '@mui/material/Grid';
import {useNavigate} from "react-router-dom";
import {useCallback, useEffect} from "react";


function Dashboard() {
    const navigate = useNavigate();
    const fetchConversations = useCallback(async () => {
        console.log(document.cookie);
        await fetch("http://localhost:5000/message/conversations", {
            method: "GET",
            credentials: "include",
        })
            .then(res => {
                if (!res.ok) throw new Error('User is not logged in');
                return res;
            })
            .then((res) => res.json())
            .catch((err) => {
                console.error(err);
                navigate("/auth/login");
                return;
            });
    }, [navigate]);
    useEffect(() => {
        fetchConversations();
    }, []);
    return (
        <Grid container spacing={3}>

        </Grid>
    );
}

export default Dashboard;