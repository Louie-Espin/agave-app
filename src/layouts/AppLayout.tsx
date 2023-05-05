import { ReactNode } from 'react';
import { Box, styled } from '@mui/material';
import NavBar from "components/NavBar/index";

import Person from "@mui/icons-material/Person";
import Home from "@mui/icons-material/Home";
import Assignment from "@mui/icons-material/Assignment";
import Folder from "@mui/icons-material/Folder";

const AgaveNavigations: { key: number, title: string, NavIcon: any, href: string }[] = [
    { key: 1, title: 'Home', NavIcon: Home, href: '/' },
    { key: 2, title: 'Forms', NavIcon: Assignment, href: '/forms' },
    { key: 3, title: 'Folders', NavIcon: Folder, href: '/folders' },
    { key: 4, title: 'Account', NavIcon: Person, href: '/account' },
]

type LayoutProps = { children?: ReactNode }

const AppContainer = styled(Box)(({theme}) => ({
    height: '100vh',
    margin: 0, padding: 0,
    position: 'relative',
    display: 'flex', flexFlow: 'row nowrap', alignItems: 'stretch',
}));

const MainContainer = styled('main')(({theme}) => ({
    backgroundColor: '#fff',
    overflow: 'auto',
    flex: '3 1 0',
    [theme.breakpoints.down('sm')]: {
        maxWidth: '100%'
    }
}));

export default function AppLayout({ children }: LayoutProps) {
    return(
        <AppContainer id={'app-container'}>
            <NavBar nav={AgaveNavigations}></NavBar>
            <MainContainer id={'main-content'}>
                {children}
            </MainContainer>
        </AppContainer>
    );
}