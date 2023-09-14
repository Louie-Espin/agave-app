import { NextPage } from "next";
import { useRouter } from "next/router";
import useSWR from "swr";
import axios from "axios";
import { format } from "date-fns";

import { useWorkOrder } from "hooks/useWorkOrder";
import { useAuthUser, withAuthUser, AuthAction } from 'next-firebase-auth';

import {Container, Chip, Stack, Box, styled, ImageList, Divider, Button, useTheme, useMediaQuery } from "@mui/material";

import AuthLayout from "layouts/AuthLayout";
import Loader from "components/Loader";
import TitleBar from "components/TitleBar";

import WorkOrderTable from "layouts/Templates/work-order/WorkOrderTable";
import WorkOrderMap from "layouts/Templates/work-order/WorkOrderMap";
import WorkOrderImage from "layouts/Templates/work-order/WorkOrderImage";
import TechnicianNotes from "layouts/Templates/work-order/TechnicianNotes";

import WorkHistoryOutlinedIcon from '@mui/icons-material/WorkHistoryOutlined';
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined';

import SignpostOutlinedIcon from '@mui/icons-material/SignpostOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined';

const PreStyled = styled('pre')({
    outline: '1px solid #ccc', padding: '5px', margin: '5px',
    '& .string': { color: 'green' },
    '& .number': { color: 'darkorange' },
    '& .boolean': { color: 'blue' },
    '& .null': { color: 'magenta' },
    '& .key': { color: 'red' }
})

/** FIXME: THIS IS ALL BAD!!! REFACTOR TO CORRECTLY USE SWR LOADING STATE **/

type PropertyFormProps = {}
const PropertyFormPage: NextPage<PropertyFormProps> = () => {

    const router = useRouter();
    const AuthUser = useAuthUser();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const formId = router.query.formId;
    const url: string = `api/history/${formId}`; // FIXME: this fetch DOES NOT request a form PDF

    const fetcher = useSWR(AuthUser ? url : null, (async () => {
        const token = await AuthUser.getIdToken();
        return await axios.get(url, { baseURL: '/', headers: { Authorization: token } } )
            .then(res => res.data)
            .catch(e => { console.error(e); throw e });
    }));

    const { data: formData, error, isLoading, isValidating } = fetcher;

    const { description, completedBy, crossStreets, completionDate, jobNumber, locations, images } = useWorkOrder(formData?.fields);

    if (!formData) return(<div>Loading!</div>); // TODO: handle loading state within inner components!!!

    return(
        <AuthLayout signedIn={!!(AuthUser.id)} displayName={AuthUser.displayName}>
            <Box p={1}>
                <Stack direction='row' flexWrap='wrap' justifyContent='center' sx={{ gap: '1em' }}>
                    <Box flex='1 0' maxWidth={{ xs: '100%', md: 'calc(50% - 1em)' }}>
                        <Stack direction='row' justifyContent='space-between' alignItems='center' px={2}>
                            <TitleBar TitleIcon={WorkHistoryOutlinedIcon} Title={'Work Order'} flexGrow={0}/>
                            <Button color='secondary' variant='outlined' startIcon={<IosShareOutlinedIcon/>}>
                                Share
                            </Button>
                        </Stack>
                        <Divider />
                        <Stack direction='row' justifyContent='flex-start' p={2} sx={{ gap: '1em' }}>
                            { crossStreets && <Chip icon={<SignpostOutlinedIcon />} label={crossStreets} variant="outlined"  /> }
                            { completionDate && <Chip icon={<EventAvailableOutlinedIcon />} label={format(new Date(completionDate), 'MM/dd/yyyy')} variant="outlined" /> }
                            { jobNumber && <Chip icon={<NumbersOutlinedIcon />} label={jobNumber} variant="outlined"  /> }
                        </Stack>
                        <WorkOrderTable fields={formData?.fields}/>
                    </Box>
                    <WorkOrderMap flex='1 0' position='relative' minHeight={'50vh'} locations={locations}>
                        <Box position='absolute' p={1}>
                            <TechnicianNotes completedBy={completedBy} description={description} variant='outlined' />
                        </Box>
                    </WorkOrderMap>
                </Stack>
                <Box p={2}>
                    <ImageList cols={isMobile ? 3 : 6} >
                        {images.map(({ id, imageFile }) =>
                            imageFile && <WorkOrderImage imgId={id} key={id} imageFile={imageFile} user={AuthUser}/>
                        )}
                    </ImageList>
                </Box>
            </Box>
        </AuthLayout>
    );
}

export default withAuthUser<PropertyFormProps>({
    whenAuthed: AuthAction.RENDER, // Page is rendered, if the user is authenticated
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER, // Shows loader, if the user is not authenticated & the Firebase client JS SDK has not yet initialized.
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN, // Redirect to log-in page, if user is not authenticated
    LoaderComponent: Loader,
})(PropertyFormPage)