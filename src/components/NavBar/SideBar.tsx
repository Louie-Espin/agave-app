import { FC, } from 'react';
import Link from 'next/link';
import { Box, BoxProps, Avatar, List, ListItem, ListItemButton, ListItemAvatar, ListItemIcon, ListItemText, styled, useMediaQuery, useTheme } from '@mui/material';
import Image from "components/BazarImage";

type SideBarProps = {
    nav: any[]
}

const SideBar = (

    styled<FC<BoxProps & SideBarProps>>(({nav, children, ...rest}) => {
        const theme = useTheme();
        const isMedium = useMediaQuery(theme.breakpoints.down('sm')); // TODO: shrink sidebar on breakpoint

        return(
            <Box {...rest}>
                <List >
                    <ListItem >
                        <Link href="/" passHref>
                            <a><Image width={225} sx={{margin: '0 auto'}} src="/assets/images/logo-agave.png" alt="logo" /></a>
                        </Link>
                    </ListItem>

                    {nav.map(({key, NavIcon, title}) => (
                        <ListItem key={key} >
                            <ListItemButton sx={{borderRadius: '30px'}} >
                                <ListItemIcon><NavIcon sx={{fontSize: '1.9rem'}} /></ListItemIcon>
                                <ListItemText
                                    primary={title}
                                    primaryTypographyProps={{sx: {color: 'rgba(0, 0, 0, 0.54)', fontSize: '1.3rem', fontWeight: 600} }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                <ListItem >
                    <ListItemButton sx={{borderRadius: '30px'}} >
                        <ListItemAvatar><Avatar alt={'avatar'}/></ListItemAvatar>
                        <ListItemText
                            primary={'Mike McMahon'}
                            secondary={'Administrator'}
                            primaryTypographyProps={{sx: {color: 'rgba(0, 0, 0, 0.54)', fontSize: '1rem', fontWeight: 600} }}
                        />
                    </ListItemButton>
                </ListItem>
            </Box>
        )
    })
    <SideBarProps>(({ theme }) => ({
        /* FOR DEV TODO REMOVE  */
        /* outline: '1px dashed cyan' */

        /* Root Element Styling */
        padding: `${theme.spacing(1)}`,
        width: 275, height: '100%',
        display: 'flex',
        flexFlow: 'column nowrap',
        justifyContent: 'space-between',


        [theme.breakpoints.down('sm')]: { display: 'none' }
    }))
)

export default SideBar;