import { FC, useRef } from 'react';
import {Box, Paper, ImageList, ImageListItem, Stack, styled, Container} from '@mui/material';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import Image from "next/image";

import arborServices from '@public/assets/images/home/arbor-services.jpg';
import enhancementServices from '@public/assets/images/home/enhancement-services.jpeg';
import landscapeConstruction from '@public/assets/images/home/landscape-construction.jpg';
import landscapeMaintenance from '@public/assets/images/home/landscape-maintenance.jpg';
import nativePlantsSalvage from '@public/assets/images/home/native-plants-salvage.jpg';
import waterManagement from '@public/assets/images/home/water-management.jpg';


const WhatWeDo = styled(ImageList, {})(({ theme }) => ({

}))

const ListItem = styled(Paper, {}) (({theme}) => ({
    width: '100%',
    height: '200px',
    backgroundColor: theme.palette.primary.main,
})) as typeof Paper;

const WhatWeDoSection: FC = () => {
    const containerRef = useRef(null);

    // @ts-ignore
    return(
        <Container>
            <Stack direction='row' spacing={2} justifyContent='center'>
                <Stack spacing={2}>
                    <Image width={400} src={landscapeMaintenance} alt={'Landscape Maintenance'} style={{ objectFit: 'none' }} placeholder='blur'/>
                    <Image width={400} src={landscapeConstruction} alt={'Landscape Construction'} style={{ objectFit: 'cover' }} placeholder='blur'/>
                    <Image width={400} src={nativePlantsSalvage} alt={'Native Plants Salvage'} style={{ objectFit: 'cover' }} placeholder='blur'/>
                </Stack>
                <Stack spacing={2}>
                    <Image width={400} src={waterManagement} alt={'Water Management'} style={{ objectFit: 'none' }} placeholder='blur'/>
                    <Image width={400} src={arborServices} alt={'Arbor Services'} style={{ objectFit: 'none' }} placeholder='blur'/>
                    <Image width={400} src={enhancementServices} alt={'Enhancement Services'} style={{ objectFit: 'none' }} placeholder='blur'/>
                </Stack>
            </Stack>
        </Container>
    );
}

export default WhatWeDoSection;