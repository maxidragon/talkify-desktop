import * as React from 'react';
import Grid from '@mui/material/Grid';
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";


function Dashboard() {
    const navigate = useNavigate();

    async function fetchConversations() {
        try {
            const response = await fetch("http://localhost:5000/message/conversations", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                redirect: "follow",
            });

            const data = await response.json();
            if (data.conversations) {
                console.log(data.conversations);
            } else {
                navigate("/auth/login");
            }
        } catch (error) {
            navigate("/auth/login");
            console.error(error);
        }
    }

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);
    return (
        <Grid container spacing={3}>

        </Grid>
    );
}

export default Dashboard;