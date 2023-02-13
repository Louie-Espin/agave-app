import { FC, useState } from 'react';
import { Drawer, DrawerProps, List, ListItem, ListItemButton, ListItemIcon, ListItemText, styled, useMediaQuery, useTheme } from '@mui/material';
import { Home, Build, ChatBubble, Person } from "@mui/icons-material";

type SideBarProps = {
    nav: any[]
}

const SideBar = (

    styled<FC<DrawerProps & SideBarProps>>(({nav, children, ...rest}) => {
        const theme = useTheme();
        const isMobile = useMediaQuery(theme.breakpoints.down('sm')); //

        return(
            <Drawer anchor={isMobile ? 'bottom' : 'left'} variant={'permanent'} {...rest}>
                <List>
                    {nav.map(({key, NavIcon, title}) => (
                        <ListItem key={key} disablePadding>
                            <ListItemButton>
                                <ListItemIcon><NavIcon /></ListItemIcon>
                                <ListItemText className='list-item-txt' primary={title} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        )
    })
    <SideBarProps>(({ theme }) => ({
        [theme.breakpoints.down('sm')]: { display: 'none' }
    }))
)

export default SideBar;