import {GetServerSideProps, GetStaticProps, NextPage} from "next";
import React, {Fragment} from "react";
import {Box, Button, Container, Divider, List, ListItem, ListItemAvatar, ListItemText, Paper} from "@mui/material";
import BackgroundVideo from "components/BackgroundVideo";
import {H2, H3, H4, Paragraph,} from "components/Typography";
import {Build, ChatBubble, Home, Phone, Person} from "@mui/icons-material";
import Image from "next/image";
import axios from "axios";
import {AnnouncementSchema, } from "utils/api/yup";
import * as yup from "yup";

import {AuthAction, withAuthUser} from 'next-firebase-auth';
import Loader from 'components/Loader';

type Announcement = yup.InferType<typeof AnnouncementSchema>;

export const getStaticProps: GetStaticProps = async (context) => {
    let data:any[] = []

    try {
        const response = await axios.get("http://localhost:3000/api/announcements");
        data = response.data.announcements;
        console.log(response.data);

    } catch (e: unknown) {
        console.error(e);
    }

    return {
        props: {
            announcements: data,
        }, revalidate: 1000,
    }
}

type HomePageProps = {
    announcements: Announcement[] | null;
}

const HomePage: NextPage<HomePageProps> = ({ announcements }) => {

    return(
        <Fragment>
            <Container sx={{ mt: "3rem" }}>
                <Box display='flex' alignItems='center' my={2}>
                    <Home color="primary"/>
                    <H2 ml={1.5} my="0px" lineHeight="1" whiteSpace="pre">
                        Home
                    </H2>
                </Box>

                <Divider sx={{ mb: 1, borderColor: "grey.300" }} />
            </Container>
            <BackgroundVideo source={"/assets/videos/homepage-video.mp4"} coverAlpha={0.5} gradient>
                <Box height='100%' display='flex' flexDirection='column' justifyContent='center' alignItems='center' mx={4} position={'relative'}>
                    <Image src={"/assets/images/logo-agave.png"} fill style={{objectFit: 'contain'}} alt={'agave logo'}/>
                </Box>
            </BackgroundVideo>
            <Container sx={{ py: 1, pb: 8 } }>
                <Box textAlign={'center'}>
                    <Button variant='outlined' color='primary' size='medium' endIcon={<Phone/>} sx={{mr: 2, borderRadius: '25px', my: 2}}>
                        Contact Us
                    </Button>
                    <Button variant='contained' color='primary' size='medium' endIcon={<Build/>} sx={{borderRadius: '25px', my: 2}}>
                        Request Service
                    </Button>
                </Box>
                <H3>Latest Activity</H3>
                <Paper elevation={0} variant={'outlined'}>
                    {announcements !== null &&
                        <List disablePadding>
                            {announcements.map((i) => (
                                <Fragment key={i.id}>
                                    <ListItem>
                                        <ListItemAvatar>
                                            {<Person/>}
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={<H4>{i.title}</H4>}
                                            secondary={
                                                <>
                                                    <Paragraph
                                                        sx={{ display: 'block' }}
                                                        component="span"
                                                        color="text.primary"
                                                        mb={1}
                                                    >
                                                        {i.description}
                                                    </Paragraph>
                                                    {" — "}{`${new Date(i.created._seconds * 1000 + i.created._nanoseconds / 1000000,)}`}
                                                </>
                                            }
                                        />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                </Fragment>
                            ))}
                        </List>
                    }
                </Paper>
            </Container>
        </Fragment>
    );
}

/* TODO: dummy data */
const latestActivity = [
    { id: 1, primary: "Repair Request Closed", Avatar: <Build/>, date: "March 1, 2023", secondary: "Your maintenance request has been closed by Luis Espinoza" },
    { id: 2, primary: "New message received", Avatar: <ChatBubble/>, date: "January 20, 2023", secondary: "From Braulio Antonio" },
    { id: 3, primary: "New message received", Avatar: <ChatBubble/>, date: "January 19, 2023", secondary: "From Esteban Rodriguez" },
    { id: 4, primary: "Consultation Request Received", Avatar: <Build/>, date: "January 1, 2023", secondary: "New consultation request from Luis Espinoza" },
    { id: 5, primary: "Feedback Received", Avatar: <Build/>, date: "December 20, 2022", secondary: "Feedback from Carol Escobar" },
    { id: 6, primary: "New message received", Avatar: <ChatBubble/>, date: "December 20, 2022", secondary: "From Carol Escobar" },
]

export default withAuthUser<HomePageProps>({
    whenAuthed: AuthAction.RENDER, // Page is rendered, if the user is authenticated
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER, // Shows loader, if the user is not authenticated & the Firebase client JS SDK has not yet initialized.
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN, // Redirect to log-in page, if user is not authenticated
    LoaderComponent: Loader,
})(HomePage);