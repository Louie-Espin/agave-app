import { NextPage } from "next";
import React, { Fragment, SyntheticEvent, useEffect, useState } from "react";
import { AuthAction, withAuthUser, useAuthUser } from "next-firebase-auth";
import Loader from "components/Loader";

import { Box, Tab, Container, } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { H2, H5 } from "components/Typography";
import { NextLinkComposed } from 'components/Link';
import FormHistory from "layouts/FormHistory";

/** MUI ICONS **/
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import List from '@mui/icons-material/List';
import CircleNotificationsOutlined from "@mui/icons-material/CircleNotificationsOutlined";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import Build from "@mui/icons-material/Build";

type HistoryPageProps = {}

const HistoryPage: NextPage<HistoryPageProps> = ({}) => {

    const AuthUser = useAuthUser(); // according to next-firebase-auth, the user is guaranteed to be authenticated
    const [token, setToken] = useState<string | null>(null);
    const [tabVal, setTabVal] = useState(TemplateID.PUNCH_LIST);

    const handleChange = (event: SyntheticEvent, eventValue: TemplateID) => {
        setTabVal(eventValue);
    };

    useEffect(() => {
        const getToken = async () => {
            const idToken = await AuthUser.getIdToken();
            console.log(`getToken called; Token: ${!!idToken}`);
            setToken(idToken);
        }

        void getToken();
    }, [AuthUser]);

    return(
        <TabContext value={tabVal}>
            <Box height='100%' display='flex' flexDirection='column'>
                <Container sx={{ mt: "2rem", borderBottom: 1, borderColor: "grey.300"}}>
                    <Box display='flex' alignItems='center' mt={2} mb={1}>
                        <WorkHistoryIcon color="primary"/>
                        <H2 ml={1.5} my="0px" lineHeight="1" whiteSpace="pre">
                            History
                        </H2>
                    </Box>

                    <TabList onChange={handleChange} variant="scrollable" allowScrollButtonsMobile aria-label="History Tabs"
                          sx={{'.MuiTabs-scrollButtons.Mui-disabled': { opacity: 0.3 }}}
                    >
                        <Tab icon={<List/>} iconPosition="start" label="Punch Lists" value={TemplateID.PUNCH_LIST}/>
                        <Tab icon={<CircleNotificationsOutlined/>} iconPosition="start" label="Status Updates" value={TemplateID.STATUS_UPDATE}/>
                        <Tab icon={<AssignmentTurnedInIcon/>} iconPosition="start" label="Service Reports" value={TemplateID.WEEKLY_REPORT}/>
                        <Tab icon={<Build/>} iconPosition="start" label="Work Orders" value={TemplateID.WORK_ORDER}/>
                    </TabList>
                </Container>

                <Container>
                    <TabPanel value={TemplateID.PUNCH_LIST}>
                        <FormHistory templateId={TemplateID.PUNCH_LIST} idToken={token} />
                    </TabPanel>
                    <TabPanel value={TemplateID.STATUS_UPDATE}>
                        <FormHistory templateId={TemplateID.STATUS_UPDATE} idToken={token} />
                    </TabPanel>
                    <TabPanel value={TemplateID.WEEKLY_REPORT}>
                        <FormHistory templateId={TemplateID.WEEKLY_REPORT} idToken={token} />
                    </TabPanel>
                    <TabPanel value={TemplateID.WORK_ORDER}>
                        <FormHistory templateId={TemplateID.WORK_ORDER} idToken={token} />
                    </TabPanel>
                </Container>
            </Box>
        </TabContext>
    );
}

/** FIXME: this should not be static **/
enum TemplateID {
    PUNCH_LIST = 'd131b34f-7bda-482e-8c66-4d39d2005387',
    STATUS_UPDATE = 'f9b58d1a-0101-400c-ab2c-f4f2b1532bb2',
    WEEKLY_REPORT = '6efc08b0-8942-42f0-a7d0-2c19981e1684',
    WORK_ORDER = '68dac9d2-20d9-4ca8-9156-c7158bd85fbe',
}

const templateRec: Record<TemplateID, { name: string , currVersion: string }> = {
    [TemplateID.PUNCH_LIST]: { name: 'Maintenance Punch List', currVersion: 'v.2' },
    [TemplateID.STATUS_UPDATE]: { name: 'Report template V.6 - GoFormz', currVersion: 'v.3' },
    [TemplateID.WEEKLY_REPORT]: { name: 'Service Report Template - 2.0', currVersion: 'v.10' },
    [TemplateID.WORK_ORDER]: { name: 'Work Order - Extra Work 2.0', currVersion: 'v.4' }
}

export default withAuthUser<HistoryPageProps>({
    whenAuthed: AuthAction.RENDER, // Page is rendered, if the user is authenticated
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER, // Shows loader, if the user is not authenticated & the Firebase client JS SDK has not yet initialized.
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN, // Redirect to log-in page, if user is not authenticated
    LoaderComponent: Loader,
})(HistoryPage);