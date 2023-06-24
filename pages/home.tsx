import { Fragment, FC, useState, useEffect } from 'react';
import { NextPage } from "next";
import BackgroundVideo from "../src/components/BackgroundVideo";
import {Box, BoxProps, Container, styled, Theme, Typography, withTheme} from "@mui/material";
import Header, { useScrollDirection } from "../src/components/Header";
import Grid2 from "@mui/material/Unstable_Grid2";

type HomePageProps = {

}

const HomePage: NextPage<HomePageProps> = () => {


    return(
        <Box position="relative">
            <Header hLarge={100} hSmall={75} zIndex={100}/>
            <Box display='block' position='relative' height="90vh" overflow="hidden" >
                <video src={"/assets/videos/homepage-video.mp4"} style={{ height: '90vh',maxWidth: '100%', objectFit: "cover", zIndex: -1 }} autoPlay playsInline loop muted/>
                <Box sx={
                    {
                        width: '100%', height: '100%',
                        position: 'absolute',
                        top: '0%', left: '0%', bottom: '0%', right: '0%',
                    }
                }>
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
            <Box p={4} height={'50vh'}>
                What We Do
            </Box>
            <Box p={4} height={'50vh'} sx={{ backgroundColor: (theme) => theme.palette.primary.main }}>
                Footer
            </Box>
        </Box>
    );
}

export default HomePage;