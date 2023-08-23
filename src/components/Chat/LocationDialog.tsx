import { FC } from 'react';

import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import { usePosition } from "hooks/usePosition";

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
            <DialogTitle>{"Send your current location?"}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    { error ? error : 'This will allow the browser to share your location.' }
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleAccept} disabled={!!(error)}>Send</Button>
            </DialogActions>
        </Dialog>
    );
}

export default LocationDialog;