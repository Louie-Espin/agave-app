import { NextPage } from "next";
import React, { Fragment } from "react";
import { AuthAction, withAuthUser, useAuthUser } from "next-firebase-auth";
import Loader from "components/Loader";

import { styled } from "@mui/material/styles";
import {Avatar, Box, Button, Card, Container, Divider, Grid, Typography, IconButton} from "@mui/material";
import Settings from "@mui/icons-material/Settings";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import { H2, H5, H6 } from "components/Typography";
import clientLogOut from "@firebaseUtils/client/logOut";

const TableRow = styled(Card)({
    display: "flex", flexWrap: "wrap", alignItems: "center", borderRadius: "10px", cursor: "pointer",
    "& > *": { flex: "1 1 0", },
    "& .pre": { whiteSpace: "pre", },
});

type SettingsPageProps = {
}

const SettingsPage: NextPage<SettingsPageProps> = ({ }) => {
    const AuthUser = useAuthUser();

    // handling log out onClick
    const handleLogOut = async () => {
        const { result, error } = await clientLogOut();
        if (error) { return console.error(error); }
        // else successful
        return console.log(result);
    };

    return(
        <Fragment>
            <Box height='100%' display='flex' flexDirection='column'>
                <Container sx={{ my: "2rem" }}>
                    <Box display='flex' alignItems='center' my={2}>
                        <Settings color="primary"/>
                        <H2 ml={1.5} my="0px" lineHeight="1" whiteSpace="pre">
                            Settings
                        </H2>
                    </Box>

                    <Divider sx={{ mb: 1, borderColor: "grey.300" }} />
                </Container>
                <Container>
                    <Box mb={4}>
                        <Grid container spacing={3}>
                            <Grid item md={6} xs={12}>
                                <Card sx={{ display: "flex", p: "14px 32px", height: "100%", alignItems: "center",}}>
                                    <Avatar src={AuthUser.photoURL ?? undefined} sx={{ height: 64, width: 64 }} />

                                    <Box ml={1.5} flex="1 1 0">
                                        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                                            <Box>
                                                <H5 my="0px">{AuthUser.displayName ?? "Your Account"}</H5>
                                                <Box display="flex" alignItems="center">
                                                    <Typography color="grey.600">{AuthUser.email ?? "E-mail not found."}</Typography>
                                                </Box>
                                            </Box>

                                            <Typography color="grey.600" letterSpacing="0.1em">
                                                USER
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Card>
                            </Grid>

                            <Grid item md={6} xs={12}>
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
                                        <Card sx={{ display: "flex", p: "14px 14px", height: "100%", alignItems: "center",}}>
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
                                        <Card sx={{ display: "flex", p: "14px 14px", height: "100%", alignItems: "center",}}>
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
                            </Grid>

                            <Grid item md={6} xs={12}>
                                <Button fullWidth color="primary" variant="contained" sx={{ mb: "1.65rem", height: 44 }} onClick={handleLogOut}
                                >
                                    SIGN OUT
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>

            </Box>
        </Fragment>
    );
};

export default withAuthUser<SettingsPageProps>({
    whenAuthed: AuthAction.RENDER, // Page is rendered, if the user is authenticated
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER, // Shows loader, if the user is not authenticated & the Firebase client JS SDK has not yet initialized.
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN, // Redirect to log-in page, if user is not authenticated
    LoaderComponent: Loader,
})(SettingsPage);