import { FC } from 'react';
import { Button, DialogActions, DialogContentText, DialogProps } from "@mui/material";
import { usePushNotifications } from "hooks/usePushNotifications";
import SettingsDialog, { SettingsDialogProps } from "./SettingsDialog";


interface PushNotificationsProps extends SettingsDialogProps {
    uid: string | null;
}

const PushNotificationsDialog: FC<PushNotificationsProps> = ({ toggle, uid, ...rest }) => {

    const { allow, supported, message, handleSubscribe, handleUnsubscribe } = usePushNotifications(uid);

    const denyHandler = () => {
        handleUnsubscribe()
            .then(() => console.log('UNSUB SUCCESSFUL'))
            .catch(() => console.log('UNSUB ERROR!'));
    }

    const allowHandler = () => {
        handleSubscribe()
            .then(() => console.log('SUB SUCCESSFUL'))
            .catch(() => console.log('SUB ERROR!'));
    }

    return(
        <SettingsDialog toggle={toggle} title={'Push Notifications'} alert={message}
                        actions={<DialogActions>
                                    <Button color='primary' onClick={denyHandler}>DENY</Button>
                                    <Button color='primary' onClick={allowHandler}>ALLOW</Button>
                                </DialogActions>} {...rest}
        >
            <DialogContentText sx={{ color: 'grey.600', fontSize: '1rem', mb: 1 }}>
                Enable Push Notifications to be notified when:
            </DialogContentText>
            <DialogContentText sx={{ color: 'grey.600', fontSize: '.9rem', mb: .5 }}>
                • Work Orders have been submitted.
            </DialogContentText>
            <DialogContentText sx={{ color: 'grey.600', fontSize: '.9rem', mb: .5 }}>
                • Your Weekly Reports are available.
            </DialogContentText>
            <DialogContentText sx={{ color: 'grey.600', fontSize: '.9rem', mb: 1 }}>
                • New Messages are received.
            </DialogContentText>
        </SettingsDialog>
    )
};

export default PushNotificationsDialog;