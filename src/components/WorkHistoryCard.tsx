import { FC, SyntheticEvent } from 'react';
import useSWR from "swr";
import axios from "axios";
import { AuthUserContext } from "next-firebase-auth";
import { format } from "date-fns";

import { Skeleton, Stack, Box, Card, CardContent, CardActionArea, Divider, Chip } from '@mui/material';
import { H4, Span } from 'components/Typography';
import { NextLinkComposed } from "components/Link";

import { useFormParser, useWorkOrder } from "hooks/useWorkOrder";
import BuildCircleOutlinedIcon from '@mui/icons-material/BuildCircleOutlined';
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";

const swrOptions = {
    revalidateOnFocus: false,
    revalidateOnMount: true, // https://swr.vercel.app/docs/api
    revalidateOnReconnect: false,
    refreshWhenOffline: false,
    refreshWhenHidden: false,
    refreshInterval: 3600000, // one hour in milliseconds
};

interface WorkHistoryCardProps {
    formId: string, propertyId: string, templateId: string, lastUpdateDate: string,
    action: (event: SyntheticEvent, formId: string) => void,
    user: AuthUserContext
}

const WorkHistoryCard: FC<WorkHistoryCardProps> = ({ formId, propertyId, lastUpdateDate, action, user }: WorkHistoryCardProps) => {

    const url: string = `api/history/${formId}`; // TODO: This does not fetch a PDF, consider decoupling

    const fetcher = useSWR(user.id ? [url, formId] : null, (async () => {
        const token = await user.getIdToken();
        return await axios.get(url, { baseURL: '/', headers: { Authorization: token } } )
            .then(res => res.data)
            .catch(e => { console.error(e); throw e });
    }), swrOptions);

    const { data, error, isLoading, isValidating } = fetcher;

    const { description, locations, images } = useWorkOrder(data?.fields);

    return(
        <Card sx={{ borderRadius: (theme) => (theme.spacing(3)), flex: '1 1 auto', width: {xs: '100%', md: '100%'} }}>
            <CardActionArea onClick={(event) => action(event, formId)} sx={{ height: '100%' }}
                            component={NextLinkComposed} to={`/work-history/${propertyId}/${formId}`}
            >
                <Stack direction='row' justifyContent='space-between' alignItems='flex-end' px={2} pt={2} pb={1}>
                    <H4 fontWeight={400}>{lastUpdateDate ? format(new Date(lastUpdateDate), 'MM/dd/yyyy') : '---'}</H4>
                    <Chip icon={<BuildCircleOutlinedIcon />} variant="filled" color='secondary' label={`Work Order`} />
                </Stack>
                <Divider sx={{ mx: 2 }}/>
                <CardContent>
                    <Box maxWidth='70ch'>{description ?? 'loading'}</Box>
                </CardContent>
                <Stack direction='row' flexWrap='wrap' justifyContent='flex-end' p={2} pt={0} sx={{ gap: '1em' }}>
                    <Chip icon={<LocationOnOutlinedIcon />} variant="outlined"
                          label={`${locations.length} Location${locations.length == 1 ? '' : 's'}`} />
                    <Chip icon={<ImageOutlinedIcon />} variant="outlined"
                          label={`${images.length} Image${images.length == 1 ? '' : 's'}`} />
                </Stack>
            </CardActionArea>
        </Card>
    );
}

export default WorkHistoryCard;