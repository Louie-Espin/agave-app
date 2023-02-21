import { FC } from 'react';
import Link from 'next/link';
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
                    {nav.map(({key, NavIcon, title, href}) => (
                        <Link key={key} href={href} passHref>
                            <BottomNavigationAction label={title}
                                icon={ <NavIcon sx={{color: 'rgba(0, 0, 0, 0.54)',}} /> }
                            />
                        </Link>
                    ))}
                </BottomNavigation>
            </Paper>
        )
    })
    <BottomBarProps>(({ theme }) => ({
        borderTop: '1px solid #dedede',
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        [theme.breakpoints.up('sm')]: { display: 'none' }
    }))
)

export default BottomBar;