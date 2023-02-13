import { FC } from 'react';
import { Paper, BottomNavigation, BottomNavigationProps, BottomNavigationAction, styled, useMediaQuery, useTheme } from '@mui/material';
import { Home, Build, ChatBubble, Person } from "@mui/icons-material";

type BottomBarProps = {
    nav: any[]
}

const BottomBar = (

    styled<FC<BottomNavigationProps & BottomBarProps>>(({nav, children, ...rest}) => {
        const theme = useTheme();
        const isMobile = useMediaQuery(theme.breakpoints.down('sm')); //

        return(
            <Paper elevation={3}>
                <BottomNavigation showLabels {...rest}>
                    {nav.map(({key, NavIcon, title}) => (
                        <BottomNavigationAction key={key} label={title} icon={<NavIcon />}/>
                    ))}
                </BottomNavigation>
            </Paper>
        )
    })
    <BottomBarProps>(({ theme }) => ({
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        [theme.breakpoints.up('sm')]: { display: 'none' }
    }))
)

export default BottomBar;