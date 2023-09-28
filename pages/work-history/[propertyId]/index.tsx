import { GetServerSideProps, NextPage } from "next";
import React, { useState, SyntheticEvent, ChangeEvent } from "react";
import { useAuthUser, withAuthUser, withAuthUserTokenSSR, AuthAction } from 'next-firebase-auth';

import { getStorage, ref } from "firebase/storage";
import { useDownloadURL } from 'react-firebase-hooks/storage';
import loadingGif from "@public/assets/images/loading.gif";
import { getPropertyData } from "@firebaseUtils/firebaseSSR";
import { subDays, formatISO } from "date-fns";
import { PropertySchema } from "utils/api/yup";
import * as yup from "yup";

import { Divider, Stack, Box, List} from "@mui/material";

import AuthLayout from "layouts/AuthLayout";
import Loader from "components/Loader";
import TitleBar from "components/TitleBar";
import DownloadDialog from "components/DownloadDialog"; // FIXME
import { H2, H3 } from 'components/Typography';
import WorkHistoryCard from "components/WorkHistoryCard";
import WorkHistoryFilters from "components/WorkHistoryFilters";

import AgaveContacts from "components/AgaveContacts";
import AgaveDetails from "components/AgaveDetails";
import ImageWithFallback from "components/ImageFallback";

import useSWR from "swr";
import axios, { AxiosError } from "axios";
import { useToggle } from "hooks/useToggle";
import Calendar from "components/Calendar";

// Icons
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
// import CircleNotificationsOutlined from "@mui/icons-material/CircleNotificationsOutlined";
// import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
// import Build from "@mui/icons-material/Build";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";

type PropertiesPageProps = { property: yup.InferType<typeof PropertySchema> }
type DateRange = { start: Date, end: Date }

/** FIXME: this should not be static **/
enum TemplateID {
    STATUS_UPDATE = 'f9b58d1a-0101-400c-ab2c-f4f2b1532bb2',
    WEEKLY_REPORT = '6efc08b0-8942-42f0-a7d0-2c19981e1684',
    WORK_ORDER = '68dac9d2-20d9-4ca8-9156-c7158bd85fbe',
}

const PropertiesPage: NextPage<PropertiesPageProps> = ({ property }) => {

    const historyURL = 'api/history';
    const storage = getStorage();
    const imgRef = ref(storage, property.displayImage);

    const AuthUser = useAuthUser();

    const [downloadUrl, downloadLoading, downloadError] = useDownloadURL(imgRef);
    const [template, setTemplate] = useState<TemplateID>(TemplateID.WORK_ORDER); // FIXME & REMOVE

    const [dateRange, setRange] = useState<DateRange>({ start: subDays(new Date(), 30), end: new Date() });
    const [search, setSearch] = useState<string>('');
    const [calendar, toggleCalendar] = useToggle(false);

    const searchControl = (event: ChangeEvent<HTMLInputElement>) => { setSearch(event.target.value) };
    const rangeControl = (nRange: DateRange) => {
        setRange({ start: nRange.start, end: nRange.end });
        toggleCalendar(false);
    };

    const formsFetcher = useSWR(AuthUser.id && property.id && template && dateRange.start && dateRange.end ?
            [
                historyURL, property.id, template,
                formatISO(dateRange.start, {representation: 'date'}),
                formatISO(dateRange.end, { representation: 'date' })
            ] : null,
        (async ([historyURL, property, template, startDate, endDate]) => {
            const filterStr = `lastupdateddate gt ${startDate} and lastupdateddate lt ${endDate}`;
            const token = await AuthUser.getIdToken();
            return await axios.get(historyURL, {
                baseURL: '/',
                headers: { Authorization: token, },
                params: { templateId: template, propertyName: property, filter: filterStr },
            })
                .then(res => res.data)
                .catch(e => { console.error(e); throw e })
        })
    );

    const { data: fData, error: fError, isLoading: fLoading, isValidating: fValidating } = formsFetcher;

    return(
        <AuthLayout signedIn={!!(AuthUser.id)} displayName={AuthUser.displayName}>
            <Box px={2} mb={4}>
                <TitleBar TitleIcon={WorkHistoryIcon} Title={`${property.name ?? 'Property'} - Work History`} />
                <Stack direction='row' flexWrap='wrap' sx={{ gap: '2em' }}>
                    <Stack flex='3 0' sx={{ gap: '2em' }}>
                        <Box bgcolor={'grey.400'} minHeight={400} borderRadius={4} position='relative' overflow='hidden'>
                            <ImageWithFallback src={downloadUrl ?? loadingGif.src} fill imgObjectFit={"cover"}
                                               alt={`Image for ${property.name}`}/>
                        </Box>
                        <Box>
                            <WorkHistoryFilters search={search} searchControl={searchControl}
                                                from={dateRange.start} to={dateRange.end}  calendarControl={toggleCalendar}
                            />
                            <Stack direction='row' flexWrap='wrap' sx={{ gap: '1em'}}>
                                {fData?.forms.map((i: any) =>
                                    <WorkHistoryCard key={i?.formId} user={AuthUser} propertyId={property.id}
                                                     templateId={i?.templateId} formId={i?.formId} lastUpdateDate={i?.lastUpdateDate}
                                                     action={() => {}} searchStr={search}/>
                                )}
                            </Stack>
                        </Box>
                    </Stack>
                    <Stack flex='2 0' position='relative' maxWidth={'100%'}
                           minWidth={{ xs: '100%', md: 'calc(25% - 1em)' }} >
                        <Box position='sticky' top={0}>
                            <Box overflow='hidden'>
                                <H3 fontWeight={400} mb={1}>{`${property.name ?? 'Property'} Details`}</H3>
                                <List disablePadding>
                                    <AgaveDetails Icon={PersonOutlineOutlinedIcon} primary={'Property Manager'}
                                                  secondary={property.manager?.name ?? 'Unassigned'}
                                                  email={property.manager?.email} />
                                    <AgaveDetails Icon={BadgeOutlinedIcon} primary={'Account Operator(s)'}
                                                  secondary={property.operator ?? 'Unassigned'} />
                                    <AgaveDetails Icon={NumbersOutlinedIcon} primary={'Job Number'}
                                                  secondary={property.jobNumber ?? 'Unassigned'} />
                                </List>
                            </Box>
                            <Divider sx={{ mt: 3, mb: 2 }}/>
                            <AgaveContacts />
                        </Box>
                    </Stack>
                </Stack>
                <Calendar open={calendar} onClose={() => toggleCalendar(false)} range={dateRange} onConfirm={rangeControl}/>
            </Box>
        </AuthLayout>
    );
}

export const getServerSideProps: GetServerSideProps<PropertiesPageProps> = withAuthUserTokenSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN
})(async ({ AuthUser, query, res }) => {

    res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=86400') // FIXME: sure about this?

    const { propertyId } = query;
    // const propertyId = (params && params['propertyId']) ? params['propertyId'].toString() : null

    try {

        const token = await AuthUser.getIdToken();
        const res = await getPropertyData(token, propertyId as string);

        return { props: { property: res } };

        } catch (err: any | AxiosError) {
            if (!!(err?.message)) console.error(err.message);
            return { redirect: { permanent: false, destination: "/work-history" }, props: { property: undefined } };
        }
    }
);

export default withAuthUser<PropertiesPageProps>({
    whenAuthed: AuthAction.RENDER, // Page is rendered, if the user is authenticated
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER, // Shows loader, if the user is not authenticated & the Firebase client JS SDK has not yet initialized.
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN, // Redirect to log-in page, if user is not authenticated
    LoaderComponent: Loader,
})(PropertiesPage)