import Image from "next/image";
import { FC, ReactNode, useEffect, useState } from "react";
import { alpha, Box, BoxProps, Button, styled } from "@mui/material";
import Home from "@mui/icons-material/Home";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import Settings from "@mui/icons-material/Settings";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import { NextLinkComposed } from "components/Link";
import agaveLogo from '@public/assets/images/logo-agave.png'


// FIXME: dev, remove later
const AgaveNavigations: { key: number, title: string, NavIcon: any, href: string }[] = [
    { key: 1, title: 'Home', NavIcon: Home, href: '/' },
    { key: 2, title: 'History', NavIcon: WorkHistoryIcon, href: '/history/' },
    { key: 3, title: 'Settings', NavIcon: Settings, href: '/settings/' },
    // { key: 2, title: 'Forms', NavIcon: Assignment, href: '/forms' },
    // { key: 3, title: 'Folders', NavIcon: Folder, href: '/folders' },
    { key: 4, title: 'Properties', NavIcon: HomeWorkIcon, href: '/properties/' },
]

interface HeaderProps extends BoxProps {
    hLarge: number,
    hSmall: number,
    children?: ReactNode
}

export function useScrollDirection() {
    const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const updateScrollDirection = () => {
            const scrollY = window.scrollY;
            const direction = scrollY > lastScrollY ? "down" : "up";
            if (direction !== scrollDirection && (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)) {
                setScrollDirection(direction);
            }
            lastScrollY = scrollY > 0 ? scrollY : 0;
        };
        window.addEventListener("scroll", updateScrollDirection); // add event listener
        return () => {
            window.removeEventListener("scroll", updateScrollDirection); // clean up
        }
    }, [scrollDirection]);

    return scrollDirection;
}

const SmoothHeader = styled(Box, {
    shouldForwardProp: (props) => props !== "scrollDir" && props !== 'hLarge' && props !== 'hSmall',
})<{ scrollDir: 'down' | 'up', hLarge: number, hSmall: number }>

(({ theme, scrollDir, hLarge, hSmall, ...props }) => ({

    position: 'fixed',
    height: hLarge,
    width: '100%',
    backgroundColor: alpha(theme.palette.grey['500'], .5),
    backdropFilter: 'blur(5px)',
    top: 0,
    padding: theme.spacing(2),

    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',

    borderBottom: '1px solid',
    borderColor: theme.palette.grey["500"],

    transitionProperty: 'all',
    transitionDuration: '200ms',
    transitionTimingFunction: 'ease',

    ...((scrollDir == 'down') && { // the overrides added when the 'scrollDir' prop == 'down'
        height: hSmall,
        backgroundColor: alpha(theme.palette.grey['500'], .7),
        backdropFilter: 'blur(7px)',
    })
}));

const Header: FC<HeaderProps> = ({ hLarge, hSmall, children, ...props }) => {

    const scrollDir = useScrollDirection();

    return(
        <SmoothHeader scrollDir={scrollDir} hLarge={hLarge} hSmall={hSmall} {...props} >
            <Box position='relative' height='100%' minWidth={150} component={NextLinkComposed} to={{pathname: '/'}} >
                <Image src={agaveLogo} alt='Agave Logo' fill loading='lazy' sizes={'150px'} style={{ objectFit: 'contain'}}/>
            </Box>
            <Box flex='1 1 auto' justifyContent='space-evenly' display={{ xs: 'none', md: 'flex' }} maxWidth='50%'>
                {AgaveNavigations.map((nav) => (
                    <Button
                        key={nav.key}
                        color={'inherit'}
                        sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                        {nav.title}
                    </Button>
                ))}
            </Box>
        </SmoothHeader>
    );
}

export default Header;