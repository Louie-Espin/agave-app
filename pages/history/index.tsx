import { NextPage } from "next";
import React, { Fragment, SyntheticEvent, useEffect, useState } from "react";
import { AuthAction, withAuthUser, useAuthUser } from "next-firebase-auth";
import Loader from "components/Loader";

import { Box, Tabs, Tab, Container, Divider, } from "@mui/material";
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

/** Tab Panel DECLARATION**/
interface TabPanelProps { children?: React.ReactNode; index: number; value: number; }
function a11yProps(index: number) { return { id: `simple-tab-${index}`, 'aria-controls': `simple-tabpanel-${index}`, }; }
function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index} aria-labelledby={`simple-tab-${index}`}
            id={`simple-tabpanel-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}
/** Tab Panel END **/

const HistoryPage: NextPage<HistoryPageProps> = ({}) => {

    const AuthUser = useAuthUser(); // according to next-firebase-auth, the user is guaranteed to be authenticated
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const getToken = async () => {
            const idToken = await AuthUser.getIdToken();
            console.warn(`getToken effect was called! Token: ${idToken}`)
            setToken(idToken);
        }

        void getToken();
    }, [AuthUser]);

    const [value, setValue] = React.useState(0);
    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return(
        <Fragment>
            <Box height='100%' display='flex' flexDirection='column'>
                <Container sx={{ mt: "2rem", borderBottom: 1, borderColor: "grey.300"}}>
                    <Box display='flex' alignItems='center' mt={2} mb={1}>
                        <WorkHistoryIcon color="primary"/>
                        <H2 ml={1.5} my="0px" lineHeight="1" whiteSpace="pre">
                            History
                        </H2>
                    </Box>

                    <Tabs value={value} onChange={handleChange} variant={"scrollable"} allowScrollButtonsMobile
                          sx={{'.MuiTabs-scrollButtons.Mui-disabled': { opacity: 0.3 }}}
                    >
                        <Tab icon={<List/>} iconPosition="start" label="Punch Lists" {...a11yProps(0)}/>
                        <Tab icon={<CircleNotificationsOutlined/>} iconPosition="start" label="Status Updates" {...a11yProps(1)}/>
                        <Tab icon={<AssignmentTurnedInIcon/>} iconPosition="start" label="Service Reports" {...a11yProps(2)}/>
                        <Tab icon={<Build/>} iconPosition="start" label="Work Orders" {...a11yProps(3)}/>
                    </Tabs>
                </Container>

                {/* FIXME */}
                <Container>
                    <TabPanel index={0} value={value}>
                        <FormHistory title="Punch Lists" idToken={token} templateId={templateInfo[0].id}/>
                    </TabPanel>
                    <TabPanel index={1} value={value}>
                        <FormHistory title="Status Updates" idToken={token} templateId={templateInfo[1].id}/>
                    </TabPanel>
                    <TabPanel index={2} value={value}>
                        <FormHistory title="Service Reports" idToken={token} templateId={templateInfo[2].id}/>
                    </TabPanel>
                    <TabPanel index={3} value={value}>
                        <FormHistory title="Work Orders" idToken={token} templateId={templateInfo[3].id}/>
                    </TabPanel>
                </Container>
            </Box>
        </Fragment>
    );
}

/** FIXME: this should not be a static list. PLEASE fix later! **/
const templateInfo = [
    {
        id: 'd131b34f-7bda-482e-8c66-4d39d2005387',
        name: 'Maintenance Punch List',
        curr_version: 'v.2',
    },
    {
        id: 'f9b58d1a-0101-400c-ab2c-f4f2b1532bb2',
        name: 'Report template V.6 - GoFormz',
        curr_version: 'v.3',
    },
    {
        id: '6efc08b0-8942-42f0-a7d0-2c19981e1684',
        name: 'Service Report Template - 2.0',
        curr_version: 'v.10',
    },
    {
        id: '68dac9d2-20d9-4ca8-9156-c7158bd85fbe',
        name: 'Work Order - Extra Work 2.0',
        curr_version: 'v.4',
    }
]

export default withAuthUser<HistoryPageProps>({
    whenAuthed: AuthAction.RENDER, // Page is rendered, if the user is authenticated
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER, // Shows loader, if the user is not authenticated & the Firebase client JS SDK has not yet initialized.
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN, // Redirect to log-in page, if user is not authenticated
    LoaderComponent: Loader,
})(HistoryPage);