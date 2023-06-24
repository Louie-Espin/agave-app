import React, { FC } from "react";
import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    CardProps,
    styled
} from "@mui/material";
import ImageWithFallback from "components/ImageFallback";

const HoverBox = styled(Box)(({ theme }) => ({

    position: 'relative',
    overflow: 'hidden',
    borderBottom: '1px solid',
    borderColor: `${theme.palette.grey["300"]}`,

    '> img': {
        transitionProperty: 'transform',
        transitionDuration: '200ms',
        transitionTimingFunction: 'ease',

        ':hover': {
            transform: 'scale(1.05, 1.05)',
        },
    },
}));

interface PropertyCardProps extends CardProps {
    propertyName: string,
    propertyContent: string,
    imageUrl?: string,
}

const PropertyCard = ({ propertyName, propertyContent, imageUrl = "", ...props }: PropertyCardProps ) => {
    return(
        <Card sx={{ minWidth: { md: 350 } }} { ...props }>
            <CardActionArea>
                <CardMedia>
                    <HoverBox height={{ xs: 200, md: 180 }} >
                        <ImageWithFallback src={imageUrl} fill imgObjectFit={"cover"} alt={"Image for [PROPERTY]"}/>
                    </HoverBox>
                </CardMedia>
                <CardHeader titleTypographyProps={{ color: "#96772c" }} title={propertyName}></CardHeader>
                <CardContent>{propertyContent}</CardContent>
            </CardActionArea>
        </Card>
    );
}

export default PropertyCard;