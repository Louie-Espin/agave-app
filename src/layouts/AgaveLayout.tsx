import { FC, ReactNode } from 'react';
import { usePathname } from 'next/navigation'

import { AuthUser } from "next-firebase-auth";
import { Box, Stack, Button, ButtonProps, styled } from '@mui/material';
import { Span } from 'components/Typography';
import { NextLinkComposed } from "components/Link";

import Home from "@mui/icons-material/Home";
import WorkHistoryOutlinedIcon from '@mui/icons-material/WorkHistoryOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';

import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

const NavigationRail = styled(Stack, {shouldForwardProp: (prop) => prop !== 'lWidth'})<{ lWidth: number }>
    (({ theme, lWidth }) => ({
        height: '100%', padding: theme.spacing(1),
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'space-between',
        transitionProperty: 'width', transitionDuration: '200ms', transitionTimingFunction: 'ease',
        '&:hover': { width: lWidth, }
    })
);

const RailButton = styled(Button, {shouldForwardProp: (prop) => prop !== 'emphasis'})<{ emphasis: boolean }>
    (({ theme, emphasis }) => ({
        display: 'inline-flex', flexDirection: 'column', justifyContent: 'center', px: 2,

        ...((emphasis) && { // the overrides added when 'emphasis' == true
            color: '#871a78',
            '& svg': {
                color: '#871a78',
                // fontSize: '1.9rem',
            },
        })
    })
);

const AgaveNavigations: { key: number, title: string, NavIcon: any, href: string }[] = [
    { key: 1, title: 'Home', NavIcon: Home, href: '/' },
    { key: 2, title: 'History', NavIcon: WorkHistoryOutlinedIcon, href: '/work-history' },
    { key: 3, title: 'Chat', NavIcon: MailOutlineOutlinedIcon, href: '/chat' },
    { key: 4, title: 'Settings', NavIcon: SettingsOutlinedIcon, href: '/settings' },
    { key: 5, title: 'Contact', NavIcon: PhoneOutlinedIcon, href: '/contact' },
]

interface AgaveLayoutProps { user?: AuthUser, children?: ReactNode }
const AgaveLayout: FC<AgaveLayoutProps> = ({ user, children }: AgaveLayoutProps) => {

    const pathname = usePathname();
    const drawerWidth = 80, lWidth = 100;

    return(
        <Stack height='100dvh' flexDirection='row' bgcolor={'primary.600'} pl={1} sx={{ gap: (theme) => theme.spacing(1) }}>

            {/* FIXME: must add mobile nav */}
            <NavigationRail width={drawerWidth} lWidth={lWidth}>
                <Stack flexDirection='column' alignItems='center' justifyContent='flex-start'
                       sx={{ gap: (theme) => theme.spacing(1) }}
                >
                    {
                        AgaveNavigations.map(({key, NavIcon, title, href}) => (
                            <NavButton key={key} icon={<NavIcon fontSize='large'/>} label={title}
                                       curr={href === pathname} href={href} />
                        ))
                    }
                </Stack>

                <Stack flexDirection='column' alignItems='center' justifyContent='flex-start'
                       sx={{ gap: (theme) => theme.spacing(1) }}
                >
                    <NavButton icon={<AccountCircleOutlinedIcon fontSize='large'/>} label={'Dashboard'}
                               curr={'dashboard' === pathname} href={"/dashboard"} />
                </Stack>
            </NavigationRail>

            <Box component='main' flexGrow={1} position='relative' p={3} bgcolor={'primary.main'}
                 borderRadius={(theme) => `${theme.spacing(3)} 0 0 ${theme.spacing(3)}`}
            >
                { children }
            </Box>
        </Stack>
    );
};

const NavButton: FC<{ icon: any, label: string, curr: boolean, href: string } & ButtonProps> = ({ icon, label , curr, href, ...props}) => {

    return(
        <NextLinkComposed to={href} style={{ width: '100%' }}>
            <RailButton emphasis={curr} fullWidth {...props}>
                    { icon }
                    <Span fontWeight={400}>{label}</Span>
            </RailButton>
        </NextLinkComposed>
    );
}

export default AgaveLayout;