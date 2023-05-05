import { NextPage } from "next";
import React, { Fragment } from "react";
import { AuthAction, withAuthUser, useAuthUser } from "next-firebase-auth";
import Loader from "components/Loader";

import {Alert, Avatar, Box, Button, Card, CircularProgress, Container, Divider, Grid, Typography, List, Fab } from "@mui/material";
import Folder from "@mui/icons-material/Folder";
import { H2, H5 } from "components/Typography";
import { NextLinkComposed } from 'components/Link';

import useSWR from "swr";
import axios from "axios";
import { InferType } from "yup";
import { FolderSchema } from "utils/api/yup";

type Folder = InferType<typeof FolderSchema>;
type FoldersPageProps = {}

const FoldersPage: NextPage<FoldersPageProps> = ({}) => {

    const url: string = '/api/folders';
    const AuthUser = useAuthUser(); // according to next-firebase-auth, the user is guaranteed to be authenticated
    const fetched = useSWR(AuthUser ? url : null, (async () => {
        const token = await AuthUser.getIdToken();
        return await axios.get(url, { headers: { Authorization: token, } } )
            .then(res => res.data)
            .catch(e => { console.error(e); throw e });
    }));

    if (fetched.error) return(<Alert severity="error">Error - could not retrieve folders</Alert>);
    if (fetched.isLoading) return(
        <Box height='100%' display='flex' flexDirection='column' p={3}>
            <CircularProgress />
        </Box>
    );

    console.log(fetched.data);

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

                    <Divider sx={{ mb: 1, borderColor: "grey.300" }} />
                </Container>
                <Container>
                    <Box mb={4} >
                        {fetched.data.folders !== null &&
                            <Grid container spacing={3}>
                                {fetched.data.folders.map((i: Folder) => (
                                    <Grid item xs={12} sm={6} md={6} key={i.id} component={NextLinkComposed} to={{pathname: `/folders/${i.id}`}}>
                                        <Card sx={{ display: "flex", p: "14px 32px", height: "100%", alignItems: "center",}}>
                                            <Avatar><Folder/></Avatar>
                                            <Box ml={1.5} flex="1 1 0">
                                                <H5>{i.name}</H5>
                                            </Box>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        }
                        <Fab sx={{ position: 'absolute', bottom: 75, right: 16,}}
                             variant="extended" size="medium" color="primary" aria-label="add"
                        >
                            <Folder sx={{ mr: 1 }} />
                            New Folder
                        </Fab>
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