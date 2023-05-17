import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

const SystemMessage = (props: any) => {
    return (
        <>
            <Card sx={{display: 'flex', marginBottom: 1, justifyContent: 'center'}}>
                <CardContent sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-center'}}>
                    <Typography variant="body1">{props.message.content}</Typography>
                </CardContent>
                <Divider sx={{margin: 0, height: '100%', alignSelf: 'stretch'}}/>
            </Card>
        </>

    );
};

export default SystemMessage;
