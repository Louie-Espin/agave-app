// import { Fragment, FC, useState, useEffect } from 'react';
import { NextPage } from "next";
import { useAuthUser, AuthAction, withAuthUser } from "next-firebase-auth";

import { Box, Typography } from "@mui/material";
import Loader from "components/Loader";

import AuthLayout from "layouts/AuthLayout";
import WhatWeDoGrid from "layouts/Home/WhatWeDoGrid";

type HomePageProps = {

}

const HomePage: NextPage<HomePageProps> = () => {

    const AuthUser = useAuthUser();

    return(
        <AuthLayout signedIn={!!(AuthUser.id)} displayName={AuthUser.displayName}>
            <Box display='block' position='relative' height="75vh" overflow="hidden" >
                <video src={"/assets/videos/homepage-video.mp4"} autoPlay playsInline loop muted
                       style={{ height: '90vh',maxWidth: '100%', objectFit: "cover", zIndex: -1 }}
                />
                <Box sx={{ width: '100%', height: '100%', position: 'absolute', top: '0%', left: '0%', bottom: '0%', right: '0%', }}>

                </Box>
            </Box>
            <Box justifyContent={'center'} alignItems={'center'} alignContent='stretch' display='flex' flexWrap={'wrap'}
                 sx={{ backgroundColor: (theme) => theme.palette.beige['50'] }} py={5} px={{ xs: 3, md: 12 }}
            >
                <Box display='flex' flex={'1 1 0'} flexDirection='column' alignItems='center' justifyContent='center' textAlign='center'>
                    <Typography fontSize='4rem' color={'primary'}>1200</Typography>
                    <Typography fontSize='1.2rem'>Clients</Typography>
                </Box>
                <Box display='flex' flex={'1 1 0'}  flexDirection='column' alignItems='center' justifyContent='center' textAlign='center'>
                    <Typography fontSize='4rem' color={'primary'}>6000</Typography>
                    <Typography fontSize='1.2rem'>Projects</Typography>
                </Box>
                <Box display='flex' flex={'1 1 0'}  flexDirection='column' alignItems='center' justifyContent='center' textAlign='center'>
                    <Typography fontSize='4rem' color={'primary'}>30</Typography>
                    <Typography fontSize='1.2rem'>Years of Experience</Typography>
                </Box>
                <Box display='flex' flex={'1 1 0'} flexDirection='column' alignItems='center' justifyContent='center' textAlign='center'>
                    <Typography fontSize='4rem' color={'primary'}>80</Typography>
                    <Typography fontSize='1.2rem'>Awards</Typography>
                </Box>
            </Box>
            <Box py={4}>
                <WhatWeDoGrid/>
            </Box>
        </AuthLayout>
    );
}

export default withAuthUser<HomePageProps>({
    whenAuthed: AuthAction.REDIRECT_TO_APP, // User is redirected to dashboard page, if the user is authenticated
    whenUnauthedBeforeInit: AuthAction.RENDER, // Renders page, if the user is not authenticated & the Firebase client JS SDK has not yet initialized.
    whenUnauthedAfterInit: AuthAction.RENDER, // Redirect to log-in page, if user is not authenticated
    whenAuthedBeforeRedirect: AuthAction.SHOW_LOADER, // Shows loader while redirecting
    LoaderComponent: Loader,
    appPageURL: '/dashboard', // Dashboard Page
})(HomePage);