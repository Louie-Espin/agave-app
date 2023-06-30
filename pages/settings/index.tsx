import { NextPage } from 'next';
import AuthLayout from "layouts/AuthLayout";
import { useAuthUser, withAuthUser, withAuthUserTokenSSR, AuthAction } from 'next-firebase-auth';

import {Container, Box, Stack, Paper, Grid, Card, IconButton, Button} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";

import {H1, H2, H6} from "components/Typography";
import Loader from "components/Loader";
import UserCard from "components/UserCard";
import { NextLinkComposed } from "components/Link";

import Settings from "@mui/icons-material/Settings";
import React from "react";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";

import clientLogOut from "@firebaseUtils/client/logOut";
import TitleBar from "../../src/components/TitleBar";

type SettingsPageProps = { }
const SettingsPage: NextPage<SettingsPageProps> = () => {

    const AuthUser = useAuthUser();

    // handling log out onClick
    const handleLogOut = async () => {
        const { result, error } = await clientLogOut();
        if (error) { return console.error(error); }
        // else successful
        return console.log(result);
    };

    return(
        <AuthLayout signedIn={!!(AuthUser.id)} displayName={AuthUser.displayName} >
            <Container maxWidth='md' sx={{ mt: 3, mb: 6, minHeight: '50vh' }}>
                <TitleBar TitleIcon={Settings} Title={'Settings'}/>
                <Stack direction='row' flexWrap='wrap' position='relative' width='100%' sx={{ gap: '1em' }}>
                    <Stack direction='column' spacing={2} flex={'1 1 100%'} maxWidth={{ xs: '100%', sm: 'calc(50% - 1em)' }}>
                        <UserCard displayName={AuthUser?.displayName} phoneNumber={AuthUser?.phoneNumber}
                                  photoURL={AuthUser?.photoURL} email={AuthUser?.email}
                        />
                    </Stack>
                    <Stack direction='column' spacing={2} flex={'1 1 100%'} maxWidth={{ xs: '100%', sm: 'calc(50% - 1em)' }}>
                        {/* TODO: refactor */}
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Card sx={{ display: "flex", p: "14px 14px", height: "100%", alignItems: "center",}}>
                                    <Box ml={1.5} flex="1 1 0">
                                        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                                            <H6 my="0px" color="grey.700">ACCOUNT SETTINGS</H6>
                                            <IconButton aria-label="Manage Account Settings" color="primary">
                                                <ArrowForwardIos />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </Card>
                            </Grid>
                            <Grid item xs={12}>
                                <Card  component={NextLinkComposed} to={'/settings/verify-email'}
                                       sx={{ display: "flex", p: "14px 14px", height: "100%", alignItems: "center",}}
                                >
                                    <Box ml={1.5} flex="1 1 0">
                                        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                                            <H6 my="0px" color="grey.700">VERIFY E-MAIL</H6>
                                            <IconButton aria-label="Verify your E-mail" color="primary">
                                                <ArrowForwardIos />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </Card>
                            </Grid>
                            <Grid item xs={12}>
                                <Card component={NextLinkComposed} to={'/settings/admin-dashboard'}
                                      sx={{ display: "flex", p: "14px 14px", height: "100%", alignItems: "center",}}
                                >
                                    <Box ml={1.5} flex="1 1 0">
                                        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                                            <H6 my="0px" color="grey.700">MANAGE USERS</H6>
                                            <IconButton aria-label="Manage app users" color="primary">
                                                <ArrowForwardIos />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </Card>
                            </Grid>
                        </Grid>

                        <Button fullWidth color="secondary" variant="contained" sx={{ mb: "1.65rem", height: 44 }} onClick={handleLogOut}
                        >
                            SIGN OUT
                        </Button>
                    </Stack>
                </Stack>
            </Container>
        </AuthLayout>
    )
}

export default withAuthUser<SettingsPageProps>({
    whenAuthed: AuthAction.RENDER, // Page is rendered, if the user is authenticated
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER, // Shows loader, if the user is not authenticated & the Firebase client JS SDK has not yet initialized.
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN, // Redirect to log-in page, if user is not authenticated
    LoaderComponent: Loader,
})(SettingsPage)