import React, { FC } from 'react';

import {Box, CircularProgress, Paper, Skeleton} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import { H2 } from "components/Typography";

import { PropertySchema } from "utils/api/yup";
import * as yup from "yup";
import PropertyCard from "../components/PropertyCard";

type PropertiesListProps = {
    properties?: yup.InferType<typeof PropertySchema>[],
    validating: boolean,
    loading: boolean,
    error: any,
}
const PropertiesList: FC<PropertiesListProps> = ({ properties = [], validating, loading, error }) => {

    if (loading) return(
        <Skeleton variant='rounded' height={470} width={'100%'}/>
    );

    return(
        <Box component={Paper} pt='1.5rem' pb='2.5rem' px='1.5rem'>
            <Box display='flex' alignItems='center' my={2}>
                <HomeWorkIcon color="primary"/>
                <H2 ml={1.5} my="0px" lineHeight="1" whiteSpace="pre">
                    Your Properties
                </H2>
                <CircularProgress size='1rem' sx={{ ml: 2, display: (validating ? 'flex' : 'none') }}/>
            </Box>
            <Grid container spacing={2}>
                {
                    (properties.length) ? properties.map((p) =>
                        <Grid xs={12} md={6} lg={6} key={p.id}>
                            <PropertyCard propertyName={p.name} propertyContent={JSON.stringify(p)}/>
                        </Grid>
                    ) : <div>No Properties!</div>
                }
            </Grid>
        </Box>
    );
}

export default PropertiesList;