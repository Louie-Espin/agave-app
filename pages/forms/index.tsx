import { NextPage } from "next";
import React, { Fragment } from "react";
import { AuthAction, withAuthUser, useAuthUser } from "next-firebase-auth";
import Loader from "components/Loader";

import { Avatar, Box, Button, Card, Container, Divider, Grid, Typography } from "@mui/material";
import Assignment from "@mui/icons-material/Assignment";
import { H2 } from "components/Typography";

import ProposalForm from "layouts/ProposalForm";

type FormsPageProps = {}

const FormsPage: NextPage<FormsPageProps> = ({}) => {

    return(
        <Fragment>
            <Box height='100%' display='flex' flexDirection='column'>
                <Container sx={{ my: "2rem" }}>
                    <Box display='flex' alignItems='center' my={2}>
                        <Assignment color="primary"/>
                        <H2 ml={1.5} my="0px" lineHeight="1" whiteSpace="pre">
                            Forms
                        </H2>
                    </Box>

                    <Divider sx={{ mb: 4, borderColor: "grey.300" }} />
                </Container>
                <Container>
                    <Box mb={4}>
                        <ProposalForm/>
                    </Box>
                </Container>
            </Box>
        </Fragment>
    );
}

export default withAuthUser<FormsPageProps>({
    whenAuthed: AuthAction.RENDER, // Page is rendered, if the user is authenticated
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER, // Shows loader, if the user is not authenticated & the Firebase client JS SDK has not yet initialized.
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN, // Redirect to log-in page, if user is not authenticated
    LoaderComponent: Loader,
})(FormsPage);