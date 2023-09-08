'use client'

import { FC } from 'react'
import { Avatar, ListItem, ListItemButton, ListItemAvatar, ListItemText, IconButton } from "@mui/material";
import { NextLinkComposed } from "components/Link";
import Logout from "@mui/icons-material/Logout";
import clientLogOut from "@firebaseUtils/client/logOut";
import PersonOutline from "@mui/icons-material/PersonOutline";

type AuthedButtonProps = { signedIn: boolean, name: string | null, }

const handleLogOut = async () => {
    const { result, error } = await clientLogOut();
    if (error) { return console.error(error); }
    // else successful
    return console.log(result);
};

const AuthedButton: FC<AuthedButtonProps> = ({ signedIn, name }) => {

    if (!signedIn) return(
        <ListItem key={'log-in-button'} disableGutters sx={{ borderRadius: '10px', my: 2 }}>
            <ListItemButton component={NextLinkComposed} to={'/log-in'} sx={{ borderRadius: '10px', bgcolor: 'primary.main' }}>
                <ListItemAvatar>
                    <Avatar><PersonOutline color='primary'/></Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={'Your Account'}
                    secondary={'Log In'}
                    primaryTypographyProps={{sx: {color: 'rgba(0, 0, 0, 0.54)', fontSize: '1rem', fontWeight: 600} }}
                />
            </ListItemButton>
        </ListItem>
    );

    return(
        <ListItem key={'account-button'} disableGutters sx={{ borderRadius: '10px', my: 2 }}
                  secondaryAction={<IconButton onClick={handleLogOut}><Logout/></IconButton>}
        >
            <ListItemButton component={NextLinkComposed} to={'/dashboard'} sx={{ borderRadius: '10px', bgcolor: 'primary.main' }}>
                <ListItemAvatar>
                    <Avatar src={undefined}>{ (name) ? name.charAt(0) : undefined }</Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={name ? name : 'Your account'}
                    secondary={'View Dashboard'}
                    primaryTypographyProps={{sx: {color: 'rgba(0, 0, 0, 0.54)', fontSize: '1rem', fontWeight: 600} }}
                />
            </ListItemButton>
        </ListItem>
    )
}

export default AuthedButton;