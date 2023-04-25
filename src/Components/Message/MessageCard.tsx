import {useState} from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import DeleteConfirmation from "../ModalComponents/DeleteConfirmation";

const MessageCard = (props: any) => {
    const [hidden, setHidden] = useState(false);
    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };
    const formattedTimestamp = formatDate(new Date(props.timestamp));
    const handleDelete = () => {
        setHidden(true);
    }
    return (
        <>
            {
                hidden ? <></> : (

                    <Card sx={{display: 'flex', marginBottom: 1}}>
                        <Avatar alt="avatar" sx={{
                            width: 32,
                            height: 32,
                            marginRight: 1.5,
                            marginLeft: 2,
                            marginTop: 2.5,
                            marginBottom: 'auto'
                        }}/>
                        <CardContent sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                            <Typography variant="subtitle1" sx={{fontWeight: 'bold', marginBottom: 0.5}}>
                                {props.author} <span
                                style={{
                                    fontSize: '0.8rem',
                                    fontWeight: 'normal',
                                    color: '#888'
                                }}>{formattedTimestamp}</span>
                            </Typography>
                            <Typography variant="body1">{props.content}</Typography>
                        </CardContent>
                        <Box marginLeft="auto" sx={{marginRight: 2}}>
                            {props.isOwned ? (
                                <DeleteConfirmation id={props.id} handleDelete={handleDelete}/>
                            ) : <></>}
                        </Box>
                        <Divider sx={{margin: 0, height: '100%', alignSelf: 'stretch'}}/>
                    </Card>
                )}
        </>

    );
};

export default MessageCard;
