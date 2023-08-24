import { FC } from 'react';

import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Alert } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import { usePosition } from "hooks/usePosition";

import SendIcon from '@mui/icons-material/Send';

type LocationDialogProps = {
    open: boolean,
    handleClose: (latitude: number | null, longitude: number | null, accuracy: number | null) => void
}
const LocationDialog: FC<LocationDialogProps> = ({ open, handleClose }: LocationDialogProps) => {

    const { latitude, longitude, accuracy, error } = usePosition(false, { enableHighAccuracy: true });

    const handleAccept = () => {
        if (!error) handleClose(latitude, longitude, accuracy);
    }

    const handleCancel = () => { handleClose(null, null, null); }

    return(
        <Dialog open={open}>
            <DialogTitle>Send your current location?</DialogTitle>
            <DialogContent>
                <DialogContentText mb={2}>This will allow the browser to share your location.</DialogContentText>
                <Alert severity={ (error) ? 'error' : 'info' } color={(latitude && longitude) ? 'success' : undefined}>
                    { !(latitude && longitude) && 'Determining your location...' }
                    { (latitude && longitude) && 'Location found!' }
                    { (error) && 'Error finding location.' }
                </Alert>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} variant='outlined'>Cancel</Button>
                <LoadingButton onClick={handleAccept} endIcon={<SendIcon />} color='primary'
                    loading={!(latitude && longitude)} loadingPosition="end" variant="contained"
                >
                    <span>Send</span>
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
}

export default LocationDialog;