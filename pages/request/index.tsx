import { Build, AutoAwesome, Handyman, Park, WaterDamage } from "@mui/icons-material"; // TODO: use for different request categories

import React, { useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {Container, Box, Card, styled, Tab, Divider} from "@mui/material";

import FeedbackForm from "sections/forms/FeedbackForm";
import ProposalForm from "sections/forms/ProposalForm";
import WorkOrderForm from "sections/forms/WorkOrderForm";

import { H2 } from "components/Typography";


const StyledContainer = styled(Container)(({theme}) => ({
    paddingTop: `${theme.spacing(2)}`,
    paddingBottom: `${theme.spacing(3)}`,
}));

const StyledTabList = styled(TabList)(({theme,}) => ({
    "& .MuiTabs-scrollButtons.Mui-disabled": [ { opacity: 0.3 } ] // sets button opacity to 0.3 when disabled
}));

const RequestPage = () => {
    const [selectTab, setSelectTab] = useState("work-order");
    const handleTab = (event: React.SyntheticEvent, newValue: string) => {
        setSelectTab(newValue);
    };

    return(
        <>
            <Container sx={{ mt: "3rem" }}>
                <Box display='flex' alignItems='center' my={2}>
                    <Build color="primary"/>
                    <H2 ml={1.5} my="0px" lineHeight="1" whiteSpace="pre">
                        Maintenance
                    </H2>
                </Box>

                <Divider sx={{ mb: 1, borderColor: "grey.300" }} />
            </Container>
            <StyledContainer>
                <Card>
                    <Box sx={{ maxWidth: '100%', typography: 'body1' }}>
                        <TabContext value={selectTab}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <StyledTabList onChange={handleTab}
                                               textColor="secondary" indicatorColor="secondary"
                                               allowScrollButtonsMobile variant={"scrollable"}
                                               aria-label={"Request Option Tabs"}
                                >
                                    <Tab label={'New Service Request'} value={'work-order'}/>
                                    <Tab label={'Send Proposal'} value={'proposal'}/>
                                    <Tab label={'Provide Feedback'} value={'feedback'}/>
                                </StyledTabList>
                            </Box>
                            <TabPanel value={'work-order'}>
                                <WorkOrderForm />
                            </TabPanel>
                            <TabPanel value={'proposal'}>
                                <ProposalForm />
                            </TabPanel>
                            <TabPanel value={'feedback'}>
                                <FeedbackForm />
                            </TabPanel>
                        </TabContext>
                    </Box>
                </Card>
            </StyledContainer>
        </>
    );
}

export default RequestPage;
