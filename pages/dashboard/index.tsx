import { NextPage } from "next";
import React, { useState } from "react";

import { Box, Container, Paper, Stack } from "@mui/material";
import TodayIcon from '@mui/icons-material/Today';

import { useAuthUser, withAuthUser, withAuthUserTokenSSR, AuthAction } from 'next-firebase-auth';

import AuthLayout from "layouts/AuthLayout";
import PropertiesList from "layouts/PropertiesList";

import Loader from "components/Loader";
import { H2 } from "components/Typography";
import useSWR from "swr";
import axios from "axios";

type DashboardPageProps = { }
const DashboardPage: NextPage = () => {

    const propertiesURL = '/api/properties';
    const AuthUser = useAuthUser();

    const fetcher = useSWR(AuthUser.id ? propertiesURL: null, (async () => {
        const token = await AuthUser.getIdToken();
        return await axios.get(propertiesURL, { headers: { Authorization: token, } } )
            .then(res => res.data)
            .catch(e => { console.error(e); throw e });
    }));

    const { data, error, isLoading, isValidating } = fetcher;

    return(
        <AuthLayout signedIn={!!(AuthUser.id)} displayName={AuthUser.displayName} sx={{ backgroundColor: '#c6e4cd' }}>
            <Container maxWidth='md' sx={{ my: 2 }}>
                <Stack spacing={2}>
                    <PropertiesList validating={isValidating} loading={isLoading} error={error} properties={data?.properties}/>

                    <Box component={Paper} pt='1.5rem' pb='2.5rem' px='1.5rem'>
                        <Box sx={{ mb: 2, borderBottom: 1, borderColor: "grey.300", backgroundColor: 'white'}}>
                            <Box display='flex' alignItems='center' my={2}>
                                <TodayIcon color="primary"/>
                                <H2 ml={1.5} my="0px" lineHeight="1" whiteSpace="pre">
                                    Watering Guidelines
                                </H2>
                            </Box>
                        </Box>
                    </Box>

                </Stack>
            </Container>
        </AuthLayout>
    );
}



export default withAuthUser<DashboardPageProps>({
    whenAuthed: AuthAction.RENDER, // Page is rendered, if the user is authenticated
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER, // Shows loader, if the user is not authenticated & the Firebase client JS SDK has not yet initialized.
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN, // Redirect to log-in page, if user is not authenticated
    LoaderComponent: Loader,
})(DashboardPage)