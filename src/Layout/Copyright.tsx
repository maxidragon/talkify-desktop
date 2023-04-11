import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import GitHubIcon from '@mui/icons-material/GitHub';

function Copyright(props: any) {
    return (
        <div>
            <Typography variant="body2" color="text.secondary" align="center" {...props}>
                {'Copyright © '}
                Talkify
                {' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
            <Typography align="center">
                <IconButton aria-label="GitHubIcon" href="https://github.com/maxidragon/talkify-desktop" target="_blank">
                    <GitHubIcon sx={{color: "#000"}} fontSize="large"/>
                </IconButton>
            </Typography>

        </div>

    );
}

export default Copyright;