import { GetServerSideProps, NextPage } from "next";
import { useState, SyntheticEvent } from "react";
import { useAuthUser, withAuthUser, withAuthUserTokenSSR, AuthAction } from 'next-firebase-auth';

import { getPropertyData } from "@firebaseUtils/firebaseSSR";
import { PropertySchema } from "utils/api/yup";
import * as yup from "yup";

import { Container, Stack, Box } from "@mui/material";

import AuthLayout from "layouts/AuthLayout";
import WorkHistoryPanel from "layouts/Templates/WorkHistoryPanel";
import PropertyDetails from "components/PropertyDetails";
import Loader from "components/Loader";
import TitleBar from "components/TitleBar";
import DownloadDialog from "components/DownloadDialog"; // FIXME
import useSWR from "swr";
import axios, { AxiosError } from "axios";

import TabContext from '@mui/lab/TabContext';
import Tab from '@mui/material/Tab';
import TabList from '@mui/lab/TabList';

import { useRouter } from "next/router"; // FIXME: ROLL THIS BACK!
import { useEffect } from "react"; // FIXME: ROLL THIS BACK!

// Icons
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import CircleNotificationsOutlined from "@mui/icons-material/CircleNotificationsOutlined";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import Build from "@mui/icons-material/Build";

type PropertiesPageProps = { property: yup.InferType<typeof PropertySchema> }

/** FIXME: this should not be static **/
enum TemplateID {
    STATUS_UPDATE = 'f9b58d1a-0101-400c-ab2c-f4f2b1532bb2',
    WEEKLY_REPORT = '6efc08b0-8942-42f0-a7d0-2c19981e1684',
    WORK_ORDER = '68dac9d2-20d9-4ca8-9156-c7158bd85fbe',
}

const PropertiesPage: NextPage<PropertiesPageProps> = ({ property }) => {

    const historyURL = 'api/history';

    const AuthUser = useAuthUser();

    const [template, setTemplate] = useState<TemplateID>(TemplateID.STATUS_UPDATE);
    const [form, setForm] = useState<string | null>(null); // FIXME

    const changeTemplate = (event: SyntheticEvent, newValue: TemplateID) => {
        setTemplate(newValue);
    }

    const selectForm = (event: SyntheticEvent, formId: string) => { setForm(formId); } // FIXME
    const closeDialog = () => { setForm(null); } // FIXME

    const router = useRouter(); // FIXME: ROLL THIS BACK!
    useEffect(() => { // FIXME: ROLL THIS ALL BACK!
        if (property && form && template == TemplateID.WORK_ORDER)
            router.push(`/work-history/${property.id}/${form}`);
    }, [router, property, form, template])

    const formsFetcher = useSWR(AuthUser.id && property.id && template ? [historyURL, property.id, template] : null,
        (async ([historyURL, property, template]) => {
            const token = await AuthUser.getIdToken();
            return await axios.get(historyURL, {
                baseURL: '/',
                headers: { Authorization: token, },
                params: { templateId: template, propertyName: property }, // TODO: API does not recognize propertyName param yet
            })
                .then(res => res.data)
                .catch(e => { console.error(e); throw e })
        })
    );

    const { data: fData, error: fError, isLoading: fLoading, isValidating: fValidating } = formsFetcher;

    return(
        <AuthLayout signedIn={!!(AuthUser.id)} displayName={AuthUser.displayName}>
            <Container maxWidth='md' sx={{ mt: 3, mb: 6, minHeight: '50vh' }}>

                <TitleBar TitleIcon={WorkHistoryIcon} Title={'Work History'} />

                <Stack direction='row' flexWrap='wrap' position='relative' width='100%' sx={{ gap: '1em' }}>

                    <Box flex={'1 1 100%'} maxWidth={{ xs: '100%', sm: 'calc(40% - 1em)' }}>
                        <PropertyDetails pName={property.name} pAddress={property.address} mName={property.manager.name}
                                         imageUrl={property.displayImage}
                        />
                    </Box>

                    <TabContext value={template}>
                        <Stack direction='column' spacing={2} flex={'1 1 100%'} maxWidth={{ xs: '100%', sm: 'calc(60% - 1em)' }}>

                            <TabList variant='fullWidth' indicatorColor='secondary' aria-label="History Tabs" onChange={changeTemplate} >
                                <Tab label="Status Updates" value={TemplateID.STATUS_UPDATE}/>
                                <Tab label="Weekly Reports" value={TemplateID.WEEKLY_REPORT}/>
                                <Tab label="Work Orders" value={TemplateID.WORK_ORDER}/>
                            </TabList>

                            <WorkHistoryPanel value={TemplateID.STATUS_UPDATE} pName={property.id} Icon={CircleNotificationsOutlined}
                                forms={fData?.forms} validating={fValidating} loading={fLoading} error={fError} label='Status Update' action={selectForm} // FIXME
                            />
                            <WorkHistoryPanel value={TemplateID.WEEKLY_REPORT} pName={property.id} Icon={AssignmentTurnedInIcon}
                                forms={fData?.forms} validating={fValidating} loading={fLoading} error={fError} label='Weekly Report' action={selectForm} // FIXME
                            />
                            <WorkHistoryPanel value={TemplateID.WORK_ORDER} forms={fData?.forms} Icon={Build}
                                pName={property.id} validating={fValidating} loading={fLoading} error={fError} label='Work Order' action={selectForm} // FIXME
                            />
                        </Stack>
                    </TabContext>

                </Stack>
                <DownloadDialog formId={form} onClose={closeDialog} authUser={AuthUser}/>{/* FIXME */}
            </Container>
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