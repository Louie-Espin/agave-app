import { FC, ReactNode } from 'react';
import { Dialog, DialogProps, DialogTitle, IconButton, DialogContent, DialogActions } from "@mui/material";
import { Close } from "@mui/icons-material";

export interface SettingsDialogProps extends DialogProps {
    toggle: (value?: boolean) => void;
    title?: string;
    children?: ReactNode;
    actions?: ReactNode;
}

const SettingsDialog: FC<SettingsDialogProps> = ({ toggle, title, children, actions, ...rest }) => {

    const handleClose = () => toggle(false);

    return(
        <Dialog onClose={handleClose} fullWidth maxWidth='xs' {...rest}>
            <DialogTitle sx={{ fontWeight: 700, mt: 1, position: 'relative' }}>
                {title ?? 'Settings Dialog'}
                <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 0 }}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
            <DialogActions>
                {actions}
            </DialogActions>
        </Dialog>
    );
};

export default SettingsDialog;