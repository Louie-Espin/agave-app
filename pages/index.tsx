import { NextPage } from "next";
import React, { Fragment } from "react";
import { Box, Button, Container, Divider, Paper, List, ListItem, ListItemText, ListItemAvatar, ListSubheader } from "@mui/material";
import BackgroundVideo from "components/BackgroundVideo";
import {H1, H2, H3, Paragraph,} from "components/Typography";
import { Home, Build, Phone, ChatBubble } from "@mui/icons-material";
import Image from "next/image";

const HomePage: NextPage = () => {
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
                    <List disablePadding>
                        {latestActivity.map((i) => (
                            <Fragment key={i.id}>
                                <ListItem>
                                    <ListItemAvatar>
                                        {i.Avatar}
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={i.primary}
                                        secondary={
                                            <>
                                                <Paragraph
                                                    sx={{ display: 'inline' }}
                                                    component="span"
                                                    color="text.primary"
                                                >
                                                    {i.date}
                                                </Paragraph>
                                                {" — "}{i.secondary}
                                            </>
                                        }
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                            </Fragment>
                        ))}
                    </List>
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

export default HomePage;