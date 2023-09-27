import { FC } from 'react';

import { IconButton, ListItem, ListItemIcon, ListItemText, Stack } from '@mui/material';
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";

interface AgaveDetailsProps { Icon: any, primary: string, secondary: string, email?: string, phone?: string }

const AgaveDetails: FC<AgaveDetailsProps> = ({Icon, primary, secondary, email, phone}: AgaveDetailsProps) => {

    return(
        <ListItem secondaryAction={
            <Stack direction='row' justifyContent='flex-end' alignItems='center' gap={'0.2em'}>
                { (email) &&
                    <IconButton aria-label={`${email}`} component='a' href={`mailto:${email}`}>
                        <EmailOutlinedIcon />
                    </IconButton>
                }
                { (phone) &&
                    <IconButton aria-label={`${phone}`} component='a' href={`tel:${phone}`}>
                        <LocalPhoneOutlinedIcon />
                    </IconButton>
                }
            </Stack>
        }>
            <ListItemIcon>
                <Icon />
            </ListItemIcon>
            <ListItemText
                primary={primary}
                secondary={secondary}
            />
        </ListItem>
    );
};

export default AgaveDetails;