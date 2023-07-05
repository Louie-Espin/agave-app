import { NextPage } from "next";
import { useState, SyntheticEvent } from "react";
import { useAuthUser, withAuthUser, withAuthUserTokenSSR, AuthAction } from 'next-firebase-auth';

import { Container, Stack, Box, Paper } from "@mui/material";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import AuthLayout from "layouts/AuthLayout";
import PropertiesTabs from "layouts/PropertiesTabs";
import WorkHistoryPanel from "layouts/Templates/WorkHistoryPanel";
import Loader from "components/Loader";
import TitleBar from "components/TitleBar";
import useSWR from "swr";
import axios from "axios";

import TabContext from '@mui/lab/TabContext';
import Tab from '@mui/material/Tab';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import CircleNotificationsOutlined from "@mui/icons-material/CircleNotificationsOutlined";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import Build from "@mui/icons-material/Build";


type PropertiesPageProps = { }

/** FIXME: this should not be static **/
enum TemplateID {
    STATUS_UPDATE = 'f9b58d1a-0101-400c-ab2c-f4f2b1532bb2',
    WEEKLY_REPORT = '6efc08b0-8942-42f0-a7d0-2c19981e1684',
    WORK_ORDER = '68dac9d2-20d9-4ca8-9156-c7158bd85fbe',
}

const PropertiesPage: NextPage<PropertiesPageProps> = () => {

    const propertiesURL = '/api/properties';
    const historyURL = 'api/history';

    const AuthUser = useAuthUser();

    const [property, setProperty] = useState('');
    const [template, setTemplate] = useState<TemplateID>(TemplateID.STATUS_UPDATE);

    const changeProperty = (event: SyntheticEvent, newValue: string) => {
        setProperty(newValue);
    };

    const changeTemplate = (event: SyntheticEvent, newValue: TemplateID) => {
        setTemplate(newValue);
    }

    const propertiesFetcher = useSWR(AuthUser.id ? propertiesURL: null, (async () => {
        const token = await AuthUser.getIdToken();
        return await axios.get(propertiesURL, { headers: { Authorization: token, } } )
            .then(res => res.data)
            .catch(e => { console.error(e); throw e });
    }));

    const formsFetcher = useSWR(AuthUser.id && property && template ? [historyURL, property, template] : null,
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

    const { data: pData, error: pError, isLoading: pLoading, isValidating: pValidating } = propertiesFetcher;
    const { data: fData, error: fError, isLoading: fLoading, isValidating: fValidating } = formsFetcher;

    return(
        <AuthLayout signedIn={!!(AuthUser.id)} displayName={AuthUser.displayName}>
            <Container maxWidth='md' sx={{ mt: 3, mb: 6, minHeight: '50vh' }}>
                <TabContext value={property}>
                    <TitleBar TitleIcon={HomeWorkIcon} Title={"Your Properties"} />
                    <Stack direction='row' flexWrap='wrap' position='relative' width='100%' sx={{ gap: '1em' }}>

                        <PropertiesTabs overviewValue={''} onChange={changeProperty} properties={pData?.properties}
                                        loading={pLoading} validating={pValidating} error={pError}
                        />

                        <TabContext value={template}>
                            <Stack direction='column' spacing={2} flex={'1 1 100%'} maxWidth={{ xs: '100%', sm: 'calc(70% - 1em)' }}>

                                <TabList onChange={changeTemplate} variant={'fullWidth'} indicatorColor='secondary' aria-label="History Tabs">
                                    <Tab icon={<CircleNotificationsOutlined/>} iconPosition="start" label="Status Updates" value={TemplateID.STATUS_UPDATE}/>
                                    <Tab icon={<AssignmentTurnedInIcon/>} iconPosition="start" label="Weekly Reports" value={TemplateID.WEEKLY_REPORT}/>
                                    <Tab icon={<Build/>} iconPosition="start" label="Work Orders" value={TemplateID.WORK_ORDER}/>
                                </TabList>

                                <WorkHistoryPanel value={TemplateID.STATUS_UPDATE} forms={fData?.forms} pName={property}
                                                  validating={fValidating} loading={fLoading} error={fError} Icon={CircleNotificationsOutlined}
                                />
                                <WorkHistoryPanel value={TemplateID.WEEKLY_REPORT} forms={fData?.forms} pName={property}
                                                  validating={fValidating} loading={fLoading} error={fError} Icon={AssignmentTurnedInIcon}
                                />
                                <WorkHistoryPanel value={TemplateID.WORK_ORDER} forms={fData?.forms} pName={property}
                                                  validating={fValidating} loading={fLoading} error={fError} Icon={Build}
                                />
                            </Stack>
                        </TabContext>

                    </Stack>
                </TabContext>
            </Container>
        </AuthLayout>
    );
}

export default withAuthUser<PropertiesPageProps>({
    whenAuthed: AuthAction.RENDER, // Page is rendered, if the user is authenticated
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER, // Shows loader, if the user is not authenticated & the Firebase client JS SDK has not yet initialized.
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN, // Redirect to log-in page, if user is not authenticated
    LoaderComponent: Loader,
})(PropertiesPage)