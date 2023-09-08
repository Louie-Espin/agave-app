'use client'

import { FC } from 'react'
import {
    Drawer,
    Divider,
    Box,
    Avatar,
    List,
    ListItem,
    ListItemButton,
    ListItemAvatar,
    ListItemIcon,
    ListItemText,
    Button,
    styled, IconButton, Typography,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from 'next/navigation'
import { NextLinkComposed } from "components/Link";
import Image from "next/image";
import Home from "@mui/icons-material/Home";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import Settings from "@mui/icons-material/Settings";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import PhoneIcon from '@mui/icons-material/Phone';
import Logout from "@mui/icons-material/Logout";
import clientLogOut from "@firebaseUtils/client/logOut";
import agaveLogo from "@public/assets/images/logo-agave.png";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";

const DrawerContent = styled(Box, {})(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    paddingTop: `env(safe-area-inset-top, ${theme.spacing(2)})`,
    paddingRight: `max(env(safe-area-inset-right, ${theme.spacing(2)}), ${theme.spacing(2)})`,
    paddingLeft: `max(env(safe-area-inset-left, ${theme.spacing(2)}), ${theme.spacing(2)})`,
    paddingBottom: `max(env(safe-area-inset-bottom, ${theme.spacing(2)}), ${theme.spacing(2)})`,
    height: '100%',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
})) as typeof Box;

const DrawerLinkButton = styled(ListItemButton, {})(({ theme, selected }) => ({
    borderRadius: '10px',
    color: theme.palette.grey['100'],

    '& svg': {
        color: theme.palette.grey['100'],
        fontSize: '1.9rem',
    },

    ...((selected) && { // the overrides added when 'selected'
        color: '#871a78',
        '& svg': {
            color: '#871a78',
            fontSize: '1.9rem',
        },
    })

})) as typeof ListItemButton;

type AgaveDrawerProps = {
    open: boolean,
    closeCallback: () => void,
    signedIn: boolean,
    displayName: string | null,
}

const handleLogOut = async () => {
    const { result, error } = await clientLogOut();
    if (error) { return console.error(error); }
    // else successful
    return console.log(result);
};

const AgaveDrawer: FC<AgaveDrawerProps> = ({ open, closeCallback, signedIn, displayName }) => {
    const pathname = usePathname();

    return(
        <Drawer anchor='left' variant='temporary' open={open} onClose={closeCallback} >
            <DrawerContent>
                <List >
                    <ListItem key={'logo-button'} divider sx={{ mb: 2 }}>
                        <Box position='relative' height='100%' minHeight={100} minWidth={225} component={NextLinkComposed} to={{pathname: '/'}} >
                            <Image src={agaveLogo} alt='Agave Logo' fill loading='lazy' placeholder='blur' style={{ objectFit: 'cover'}}/>
                        </Box>
                    </ListItem>

                    {AgaveNavigations.map(({key, NavIcon, title, href}) => (
                        <ListItem key={key} disableGutters>
                            <DrawerLinkButton component={NextLinkComposed} to={href} selected={href === pathname}>
                                <ListItemIcon><NavIcon/></ListItemIcon>
                                <ListItemText
                                    primary={title}
                                    primaryTypographyProps={{sx: { fontSize: '1.3rem', fontWeight: 600} }}
                                />
                            </DrawerLinkButton>
                        </ListItem>
                    ))}
                </List>

                <Box minHeight={125}>
                    <Divider sx={{ mb: 2}}/>
                    <AuthedItem signedIn={signedIn} name={displayName}/>
                </Box>
            </DrawerContent>
        </Drawer>
    );
}

const AuthedItem: FC<{ signedIn: boolean, name: string | null  }> = ({ signedIn, name }) => {
    if (!signedIn) return (
        <Box key={'unauthed-item'} display='flex' flexDirection='column' alignItems='center'>
            <Typography sx={{ my: '1rem', fontSize: '1.3rem', fontWeight: 600, color: '#871a78'}}>Join Our Community!</Typography>
            <Box>
                <Button component={NextLinkComposed} to={'/sign-up'} variant='contained' color='secondary'
                        sx={{ mr: 2, borderRadius: '20px' }}>Sign Up</Button>
                <Button component={NextLinkComposed} to={'/log-in'}  variant='contained' color='primary'
                        sx={{ borderRadius: '20px' }}>Log In</Button>
            </Box>
        </Box>
    );

    return(
        <ListItem key={'account-button'} disableGutters sx={{ borderRadius: '10px', my: 2 }}
                  secondaryAction={<IconButton onClick={handleLogOut}><Logout/></IconButton>}
        >
            <ListItemButton component={NextLinkComposed} to={'/dashboard'} sx={{ borderRadius: '10px' }}>
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

const AgaveNavigations: { key: number, title: string, NavIcon: any, href: string }[] = [
    { key: 1, title: 'Home', NavIcon: Home, href: '/' },
    { key: 2, title: 'Work History', NavIcon: WorkHistoryIcon, href: '/work-history' },
    { key: 3, title: 'Settings', NavIcon: Settings, href: '/settings' },
    { key: 4, title: 'Contact', NavIcon: PhoneIcon, href: '/contact' },
    { key: 5, title: 'Chat', NavIcon: PhoneOutlinedIcon, href: '/chat' },
]

export default AgaveDrawer;