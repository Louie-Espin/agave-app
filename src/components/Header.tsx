import Image from "next/image";
import { FC, ReactNode, useEffect, useState } from "react";
import { alpha, Box, BoxProps, Button, styled } from "@mui/material";
import { NextLinkComposed } from "components/Link";
import agaveLogo from '@public/assets/images/logo-agave.png'

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

    backgroundImage: `linear-gradient(to right, ${alpha(theme.palette.grey['500'], .4)}, ${alpha(theme.palette.grey['300'], 1)})`,

    position: 'fixed',
    height: hLarge,
    width: '100%',
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
        backgroundColor: alpha(theme.palette.grey['500'], .5),
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
            <Box flex='1 1 auto' justifyContent='flex-end' display='flex'>
                <Button variant='contained' color='primary' sx={{ mr: 2, borderRadius: '20px' }}>Sign Up</Button>
                <Button variant='outlined' color='secondary' sx={{ borderRadius: '20px' }}>Log In</Button>
            </Box>
        </SmoothHeader>
    );
}

export default Header;