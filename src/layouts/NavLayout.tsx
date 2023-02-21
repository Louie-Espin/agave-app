import { Box, styled } from '@mui/material';
import SideBar from "components/NavBar/SideBar";
import BottomBar from "components/NavBar/BottomBar";
import {Build, ChatBubble, Home, Person} from "@mui/icons-material";

export const AgaveNavigations: AgaveNav[] = [
    { key: 1, title: 'Home', NavIcon: Home, href: '/' },
    { key: 2, title: 'Request', NavIcon: Build, href: '/request' },
    { key: 3, title: 'Chat', NavIcon: ChatBubble, href: '/chat' },
    { key: 4, title: 'Account', NavIcon: Person, href: '/account' },
]

export interface AgaveNav {
    key: number,
    title: string,
    NavIcon: any,
    href: string
}

const MainContainer = styled(Box)(({theme}) => ({
    backgroundColor: '#fff',

    flex: '3 1 0',
}));

const AppContainer = styled(Box)(({theme}) => ({
    height: '100vh',
    margin: 0, padding: 0,
    position: 'relative',
    display: 'flex', flexFlow: 'row nowrap', alignItems: 'stretch',
}));

/* TODO: move HeaderContainer component to 'SideBar.tsx' */
const HeaderContainer = styled(Box)(({ theme }) => ({
    backgroundColor: '#fff',
    borderRight: '1px solid #dedede',

    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'flex-end',

    flex: '1 1 0',

    [theme.breakpoints.down('sm')]: {
        display: 'none'
    }
}))
const NavLayout = ({ children }) => {
    return(
        <AppContainer>
            <BottomBar nav={AgaveNavigations} />
            <HeaderContainer>
                <SideBar nav={AgaveNavigations} />
            </HeaderContainer>
            <MainContainer>
                {children}
            </MainContainer>
        </AppContainer>
    );
}

export default NavLayout;