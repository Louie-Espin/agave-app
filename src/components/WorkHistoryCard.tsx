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
    user: AuthUserContext,
    searchStr: string,
}

const WorkHistoryCard: FC<WorkHistoryCardProps> = ({ formId, propertyId, lastUpdateDate, action, user, searchStr }: WorkHistoryCardProps) => {

    const url: string = `api/history/${formId}`; // TODO: This does not fetch a PDF, consider decoupling

    const fetcher = useSWR(user.id ? [url, formId] : null, (async () => {
        const token = await user.getIdToken();
        return await axios.get(url, { baseURL: '/', headers: { Authorization: token } } )
            .then(res => res.data)
            .catch(e => { console.error(e); throw e });
    }), swrOptions);

    const { data, error, isLoading, isValidating } = fetcher;

    const { description, locations, images } = useWorkOrder(data?.fields);

    /* FIXME: This search code is awful, refactor
     *
     * searchMatch: returns true if both a search string is given AND the description includes it
     * highlights: if searchMatch, returns the description as substrings split with matching regex, else entire description
     *
     * FIXME [highlights bug] returns single-character substrings when searchStr is empty ''. Added conditional as a Band-Aid fix
     */
    const searchMatch = ((searchStr.length > 0) && (description?.toLowerCase().includes(searchStr.toLowerCase())));
    const highlights = searchMatch ? description?.split(new RegExp(`(${searchStr})`, 'gi')) : [description as string];

    return(
        <Card sx={{
                    borderRadius: (theme) => (theme.spacing(3)),
                    flex: '1 1 auto',
                    width: {xs: '100%', md: '100%'},
                    order: `${(searchMatch) ? -1 : 0}`
                }}
              raised={searchMatch}
        >
            <CardActionArea onClick={(event) => action(event, formId)} sx={{ height: '100%' }}
                            component={NextLinkComposed} to={`/work-history/${propertyId}/${formId}`}
            >
                <Stack direction='row' justifyContent='space-between' alignItems='flex-end' px={2} pt={2} pb={1}>
                    <H4 fontWeight={400}>{lastUpdateDate ? format(new Date(lastUpdateDate), 'MM/dd/yyyy') : '---'}</H4>
                    <Chip icon={<BuildCircleOutlinedIcon />} variant="filled" color='secondary' label={`Work Order`} />
                </Stack>
                <Divider sx={{ mx: 2 }}/>
                <CardContent>
                    <Box maxWidth='70ch'>
                        { /* FIXME: refactor to better display loading state */
                            (description && highlights) ? highlights.map((sub, i) =>
                             <Span bgcolor={(sub?.toLowerCase() === searchStr?.toLowerCase()) ? 'warning.main' : 'inherit'}
                                   key={i} >
                                 { sub }
                             </Span>) : 'loading'
                        }
                    </Box>
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