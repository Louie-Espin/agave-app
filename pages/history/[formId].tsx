import React, { Fragment, useState, useEffect, useRef } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import {AuthAction, useAuthUser, withAuthUser} from "next-firebase-auth";
import axios from "axios";
import useSWR from "swr";
import { format } from 'date-fns';

import { Box, Container, Divider, Grid, Paper, Breadcrumbs, Typography, Button, styled } from "@mui/material"
import Link from "components/Link";
import Loader from "components/Loader";
import { H2, H4, H6 } from "components/Typography";

import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import FileOpenIcon from '@mui/icons-material/FileOpen';

const StyledBreadcrumbs = styled(Breadcrumbs)`
  .MuiBreadcrumbs-li {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    max-width: max-content;
  }
`;

type HistoryIdProps = { }
const ViewHistoryPage: NextPage<HistoryIdProps> = ({}) => {

    const router = useRouter()
    const { formId, exportId } = router.query
    const url: string = `api/history/${formId}`;

    const AuthUser = useAuthUser(); // according to next-firebase-auth, the user is guaranteed to be authenticated
    const fetcher = useSWR(AuthUser ? url : null, (async () => {
        const token = await AuthUser.getIdToken();
        return await axios.get(url, { baseURL: '/', headers: { Authorization: token }, params: { exportId: exportId } } )
            .then(res => res.data)
            .catch(e => { console.error(e); throw e });
    }));

    const { data, error, isLoading, isValidating } = fetcher;

    if (isLoading || isValidating) return <Loader/>;

    return(
        <Fragment>
            <Box height='100%' display='flex' flexDirection='column'>
                <Container sx={{ mt: "2rem" }}>
                    <Box display='flex' alignItems='center' my={2}>
                        <WorkHistoryIcon color="primary"/>
                        <H2 ml={1.5} my="0px" lineHeight="1" whiteSpace="pre">
                            History
                        </H2>
                    </Box>

                    <Divider sx={{ borderColor: "grey.300" }} />
                </Container>
                <Container sx={{ overflow: "auto", pb: 12 }}>
                    <StyledBreadcrumbs separator="›" aria-label="breadcrumb" sx={{ my: "1rem" }}>
                        <Link href={'/history'} color="inherit" underline="hover">History</Link>
                        <Typography color="text.primary" noWrap>{(data?.name) ? data.name : "Current File" }</Typography>
                    </StyledBreadcrumbs>

                    <Grid container >
                        <Grid item xs={12}>
                            <Paper variant="outlined" square sx={{ p: 1, display: 'flex', justifyContent: 'space-between'}}>
                                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                                    <FileOpenIcon fontSize={'small'} sx={{ mr: 1 }}/>
                                    <H4 sx={{ whiteSpace: 'nowrap' , textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                        {(data?.name) ? data.name : "File Name Not Found." }
                                    </H4>
                                </Box>

                                <Button disabled={!(data?.pdfLink)} color="primary" variant="text" sx={{ flexShrink: 1 }}>
                                    <a href={data?.pdfLink} target="_blank" download>
                                        DOWNLOAD
                                    </a>
                                </Button>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ height: { xs: "60vh", md: "75vh"} }}>
                            <Paper variant="outlined" square sx={{ height: "100%"}}>
                                <iframe width={"100%"} height={"100%"} allow="fullscreen" title="PDF Preview"
                                        src={(data?.pdfLink) ? `${data?.pdfLink}#toolbar=0&navpanes=0` : undefined}
                                />
                            </Paper>
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <Paper variant="outlined" square sx={{ p: 1, display: 'flex', justifyContent: 'space-between'}}>
                                <H6>Last Updated</H6>
                                <H6>{(data?.lastUpdated) ? format(new Date(data.lastUpdated), 'MM/dd/yyyy') : null}</H6>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Fragment>
    );
};

export default withAuthUser<HistoryIdProps>({
    whenAuthed: AuthAction.RENDER, // Page is rendered, if the user is authenticated
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER, // Shows loader, if the user is not authenticated & the Firebase client JS SDK has not yet initialized.
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN, // Redirect to log-in page, if user is not authenticated
    LoaderComponent: Loader,
})(ViewHistoryPage);