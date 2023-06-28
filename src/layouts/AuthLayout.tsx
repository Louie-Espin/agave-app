import React, { FC, ReactNode, useState } from 'react';

import { Box } from '@mui/material';

import Header from 'components/Header';
import Footer from 'components/Footer';
import AgaveDrawer from "components/AgaveDrawer";

type AuthLayoutProps = {
    signedIn?: boolean,
    displayName?: string | null,
    children?: ReactNode
}

const AuthLayout: FC<AuthLayoutProps> = ({ signedIn = false, displayName = null, children }) => {

    const [drawer, setDrawer] = useState(false);
    const openDrawer = () => { setDrawer(true); }
    const closeDrawer = () => { setDrawer(false); }

    return(
        <Box position={'relative'}>
            <Header hLarge={90} hSmall={75} zIndex={100} action={openDrawer}/>
            <AgaveDrawer open={drawer} closeCallback={closeDrawer} signedIn={signedIn} displayName={displayName}/>
            {children}
            <Footer/>
        </Box>
    );
};

export default AuthLayout;