import { NextPage } from "next";
import React, { Fragment } from "react";
import { AuthAction, withAuthUser, useAuthUser } from "next-firebase-auth";
import Loader from "components/Loader";

import {Avatar, Box, Button, Card, Container, Divider, Grid, Typography} from "@mui/material";
import Folder from "@mui/icons-material/Folder";
import { H2 } from "components/Typography";

type FoldersPageProps = {}

const FoldersPage: NextPage<FoldersPageProps> = ({}) => {

    return(
        <Fragment>
            <Box height='100%' display='flex' flexDirection='column'>
                <Container sx={{ my: "2rem" }}>
                    <Box display='flex' alignItems='center' my={2}>
                        <Folder color="primary"/>
                        <H2 ml={1.5} my="0px" lineHeight="1" whiteSpace="pre">
                            Folders
                        </H2>
                    </Box>

                    <Divider sx={{ mb: 4, borderColor: "grey.300" }} />
                </Container>
                <Container>
                    <Box mb={4}>

                    </Box>
                </Container>
            </Box>
        </Fragment>
    );
}

export default withAuthUser<FoldersPageProps>({
    whenAuthed: AuthAction.RENDER, // Page is rendered, if the user is authenticated
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER, // Shows loader, if the user is not authenticated & the Firebase client JS SDK has not yet initialized.
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN, // Redirect to log-in page, if user is not authenticated
    LoaderComponent: Loader,
})(FoldersPage);