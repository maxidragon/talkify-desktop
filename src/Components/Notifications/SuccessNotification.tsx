import MuiAlert, {AlertProps} from '@mui/material/Alert';
import React from "react";
import {Snackbar} from "@mui/material";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const SuccessNotification = (props: any) => {
    const [open, setOpen] = React.useState(true);
    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={() => {
            setOpen(false)
        }}>
            <Alert onClose={() => {
                setOpen(false);
            }} severity="success" sx={{width: '100%'}}>
                {props.message}
            </Alert>
        </Snackbar>
    )
}
export default SuccessNotification;