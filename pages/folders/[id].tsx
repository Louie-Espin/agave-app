import { NextPage } from "next";
import { useRouter } from 'next/router'
import { AuthAction, withAuthUser, useAuthUser } from "next-firebase-auth";
import Loader from "components/Loader";
import useSWR from "swr";
import axios from "axios";
import { Alert, Box, CircularProgress, Container, Divider, List, ListItem, IconButton, ListItemIcon, ListItemText } from "@mui/material";
import React, { Fragment } from "react";
import {H2, H5} from "components/Typography";
import {NextLinkComposed} from "../../src/components/Link";

// MUI Icons
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

type FolderPageProps = { };
const fetcher = (url: string) => axios.get(url).then(res => res.data);
const Folder: NextPage = () => {
    const router = useRouter()
    const { id } = router.query

    // TODO: grab list of template forms from API
    const url: string = `api/go-formz/templates/${id}`;
    const AuthUser = useAuthUser(); // according to next-firebase-auth, the user is guaranteed to be authenticated
    const fetched = useSWR(AuthUser ? url : null, (async () => {
        const token = await AuthUser.getIdToken();
        return await axios.get(url, { headers: { Authorization: token, } } )
            .then(res => res.data)
            .catch(e => { console.error(e); throw e });
    }));

    if (fetched.error) return(<Alert severity="error">Error - could not retrieve this information.</Alert>);
    if (fetched.isLoading) return(
        <Box height='100%' display='flex' flexDirection='column' p={3}>
            <CircularProgress />
        </Box>
    );

    console.log(fetched.data);

    return (
        <Fragment>
            <Box height='100%' display='flex' flexDirection='column'>
                <Container sx={{ my: "2rem" }}>
                    <Box display='flex' alignItems='center' my={2}>
                        <WorkHistoryIcon color="primary"/>
                        <H2 ml={1.5} my="0px" lineHeight="1" whiteSpace="pre">
                            Records
                        </H2>
                    </Box>

                    <Divider sx={{ mb: 1, borderColor: "grey.300" }} />
                </Container>
                <Container>
                    <p>Record Group ID: {id ?? 'Loading'}</p>
                    <Box mb={4}>
                        {dummyList !== null &&
                            <List>
                                {dummyList.map((listItem: templateForm) => (
                                    <ListItem key={listItem.formId}
                                        secondaryAction={<IconButton edge="end" aria-label="download"><PictureAsPdfIcon color="primary"/></IconButton>}
                                    >
                                        <ListItemIcon>
                                            {listItem.status.status == "complete" ? <CheckCircleOutlineIcon/> : <RadioButtonUncheckedIcon />}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={listItem.name}
                                            secondary={`Last Updated: ${new Date(listItem.lastUpdateDate).toDateString()}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        }
                    </Box>
                </Container>
            </Box>
        </Fragment>
    );
}

type templateForm = {
    formId: string;
    url: string;
    name: string;
    status: { status: string; changeDate: string };
    lastUpdateDate: string;
};


const dummyList = [
    {
        "formId": "7ccc9fca-f211-4da7-b9e4-18eb7b358342",
        "url": "https://api.goformz.com/v2/formz/7ccc9fca-f211-4da7-b9e4-18eb7b358342",
        "name": "Anasazi Village HOA - Proposal Request",
        "status": {
            "status": "complete",
            "changeDate": "2023-05-24T12:52:15.0000000+00:00"
        },
        "lastUpdateDate": "2023-05-24T12:54:41.0000000+00:00",
        "assignment": {
            "id": "de0bedf5-f28b-4c79-9c1c-eb0eef052f04",
            "type": "User",
            "url": "https://api.goformz.com/v2/users/de0bedf5-f28b-4c79-9c1c-eb0eef052f04"
        },
        "location": {
            "latitude": 33.46739959716797,
            "longitude": -112.10005187988281,
            "accuracy": null
        },
        "templateId": "04e21b49-f139-4192-b27b-74cc256f9237",
        "templateUrl": "https://api.goformz.com/v2/templates/04e21b49-f139-4192-b27b-74cc256f9237"
    },
    {
        "formId": "6ff94fd0-3fc8-470e-9f35-786716e2b391",
        "url": "https://api.goformz.com/v2/formz/6ff94fd0-3fc8-470e-9f35-786716e2b391",
        "name": "Arlington Estates - Proposal Request",
        "status": {
            "status": "complete",
            "changeDate": "2023-05-10T19:14:16.0000000+00:00"
        },
        "lastUpdateDate": "2023-05-10T19:16:27.0000000+00:00",
        "assignment": {
            "id": "de0bedf5-f28b-4c79-9c1c-eb0eef052f04",
            "type": "User",
            "url": "https://api.goformz.com/v2/users/de0bedf5-f28b-4c79-9c1c-eb0eef052f04"
        },
        "location": {
            "latitude": 33.466915130615234,
            "longitude": -112.10002136230469,
            "accuracy": null
        },
        "templateId": "04e21b49-f139-4192-b27b-74cc256f9237",
        "templateUrl": "https://api.goformz.com/v2/templates/04e21b49-f139-4192-b27b-74cc256f9237"
    },
    {
        "formId": "0a7fd1e2-38fb-4696-87de-e1ae6ad6d6d2",
        "url": "https://api.goformz.com/v2/formz/0a7fd1e2-38fb-4696-87de-e1ae6ad6d6d2",
        "name": "SG Master - Proposal Request",
        "status": {
            "status": "complete",
            "changeDate": "2023-05-09T19:48:30.0000000+00:00"
        },
        "lastUpdateDate": "2023-05-09T19:50:41.0000000+00:00",
        "assignment": {
            "id": "ab33a58e-77ca-4768-8ad0-19f02f9c8f40",
            "type": "User",
            "url": "https://api.goformz.com/v2/users/ab33a58e-77ca-4768-8ad0-19f02f9c8f40"
        },
        "location": {
            "latitude": 33.467193603515625,
            "longitude": -112.10023498535156,
            "accuracy": null
        },
        "templateId": "04e21b49-f139-4192-b27b-74cc256f9237",
        "templateUrl": "https://api.goformz.com/v2/templates/04e21b49-f139-4192-b27b-74cc256f9237"
    },
    {
        "formId": "c8779df4-a96f-46cd-b954-fdaa6206266d",
        "url": "https://api.goformz.com/v2/formz/c8779df4-a96f-46cd-b954-fdaa6206266d",
        "name": "Arlington Estates - Proposal Request",
        "status": {
            "status": "complete",
            "changeDate": "2023-05-09T13:04:52.0000000+00:00"
        },
        "lastUpdateDate": "2023-05-09T13:07:02.0000000+00:00",
        "assignment": {
            "id": "de0bedf5-f28b-4c79-9c1c-eb0eef052f04",
            "type": "User",
            "url": "https://api.goformz.com/v2/users/de0bedf5-f28b-4c79-9c1c-eb0eef052f04"
        },
        "location": {
            "latitude": 33.46712875366211,
            "longitude": -112.10011291503906,
            "accuracy": null
        },
        "templateId": "04e21b49-f139-4192-b27b-74cc256f9237",
        "templateUrl": "https://api.goformz.com/v2/templates/04e21b49-f139-4192-b27b-74cc256f9237"
    },
    {
        "formId": "c0b2d32e-dda2-4f17-b227-3daf00e35a4e",
        "url": "https://api.goformz.com/v2/formz/c0b2d32e-dda2-4f17-b227-3daf00e35a4e",
        "name": "Morning Sun Farms - Proposal Request",
        "status": {
            "status": "complete",
            "changeDate": "2023-05-05T12:38:25.7570000+00:00"
        },
        "lastUpdateDate": "2023-05-05T12:36:36.0000000+00:00",
        "assignment": {
            "id": "28350fd8-f51a-4533-bf06-079581f8507b",
            "type": "User",
            "url": "https://api.goformz.com/v2/users/28350fd8-f51a-4533-bf06-079581f8507b"
        },
        "location": {
            "latitude": 33.468101501464844,
            "longitude": -112.10143280029297,
            "accuracy": null
        },
        "templateId": "04e21b49-f139-4192-b27b-74cc256f9237",
        "templateUrl": "https://api.goformz.com/v2/templates/04e21b49-f139-4192-b27b-74cc256f9237"
    },
    {
        "formId": "a91f418b-468e-4e1c-a0ba-cbbd37ac5956",
        "url": "https://api.goformz.com/v2/formz/a91f418b-468e-4e1c-a0ba-cbbd37ac5956",
        "name": "Arlington Estates - Proposal Request",
        "status": {
            "status": "complete",
            "changeDate": "2023-05-02T19:39:36.0000000+00:00"
        },
        "lastUpdateDate": "2023-05-02T19:41:42.0000000+00:00",
        "assignment": {
            "id": "de0bedf5-f28b-4c79-9c1c-eb0eef052f04",
            "type": "User",
            "url": "https://api.goformz.com/v2/users/de0bedf5-f28b-4c79-9c1c-eb0eef052f04"
        },
        "location": {
            "latitude": 33.46686935424805,
            "longitude": -112.10004425048828,
            "accuracy": null
        },
        "templateId": "04e21b49-f139-4192-b27b-74cc256f9237",
        "templateUrl": "https://api.goformz.com/v2/templates/04e21b49-f139-4192-b27b-74cc256f9237"
    },
    {
        "formId": "00340a8b-b7d0-419a-ade3-5684d009cffb",
        "url": "https://api.goformz.com/v2/formz/00340a8b-b7d0-419a-ade3-5684d009cffb",
        "name": "The HUB Insight Direct - Proposal Request",
        "status": {
            "status": "complete",
            "changeDate": "2023-05-01T13:23:16.0000000+00:00"
        },
        "lastUpdateDate": "2023-05-01T13:25:21.0000000+00:00",
        "assignment": {
            "id": "28350fd8-f51a-4533-bf06-079581f8507b",
            "type": "User",
            "url": "https://api.goformz.com/v2/users/28350fd8-f51a-4533-bf06-079581f8507b"
        },
        "location": {
            "latitude": 33.46766662597656,
            "longitude": -112.10022735595703,
            "accuracy": null
        },
        "templateId": "04e21b49-f139-4192-b27b-74cc256f9237",
        "templateUrl": "https://api.goformz.com/v2/templates/04e21b49-f139-4192-b27b-74cc256f9237"
    },
    {
        "formId": "6efb7e5c-0825-4960-81aa-68a2f1eb9047",
        "url": "https://api.goformz.com/v2/formz/6efb7e5c-0825-4960-81aa-68a2f1eb9047",
        "name": "SG Models Unit N - Proposal Request",
        "status": {
            "status": "complete",
            "changeDate": "2023-04-27T20:10:46.0000000+00:00"
        },
        "lastUpdateDate": "2023-04-27T20:12:49.0000000+00:00",
        "assignment": {
            "id": "ab33a58e-77ca-4768-8ad0-19f02f9c8f40",
            "type": "User",
            "url": "https://api.goformz.com/v2/users/ab33a58e-77ca-4768-8ad0-19f02f9c8f40"
        },
        "location": {
            "latitude": 33.46718215942383,
            "longitude": -112.10023498535156,
            "accuracy": null
        },
        "templateId": "04e21b49-f139-4192-b27b-74cc256f9237",
        "templateUrl": "https://api.goformz.com/v2/templates/04e21b49-f139-4192-b27b-74cc256f9237"
    },
    {
        "formId": "8a410d97-8bf3-4304-9d08-be2ad98868a1",
        "url": "https://api.goformz.com/v2/formz/8a410d97-8bf3-4304-9d08-be2ad98868a1",
        "name": "SG Master - Proposal Request",
        "status": {
            "status": "complete",
            "changeDate": "2023-04-27T00:15:00.7870000+00:00"
        },
        "lastUpdateDate": "2023-04-27T00:15:01.0000000+00:00",
        "assignment": {
            "id": "ab33a58e-77ca-4768-8ad0-19f02f9c8f40",
            "type": "User",
            "url": "https://api.goformz.com/v2/users/ab33a58e-77ca-4768-8ad0-19f02f9c8f40"
        },
        "location": null,
        "templateId": "04e21b49-f139-4192-b27b-74cc256f9237",
        "templateUrl": "https://api.goformz.com/v2/templates/04e21b49-f139-4192-b27b-74cc256f9237"
    },
    {
        "formId": "2c0f9929-d69a-4edf-b32d-909325e6a4a4",
        "url": "https://api.goformz.com/v2/formz/2c0f9929-d69a-4edf-b32d-909325e6a4a4",
        "name": "Doubletree Canyon HOA - Proposal Request",
        "status": {
            "status": "complete",
            "changeDate": "2023-04-26T19:53:30.0000000+00:00"
        },
        "lastUpdateDate": "2023-04-26T19:55:34.0000000+00:00",
        "assignment": {
            "id": "de0bedf5-f28b-4c79-9c1c-eb0eef052f04",
            "type": "User",
            "url": "https://api.goformz.com/v2/users/de0bedf5-f28b-4c79-9c1c-eb0eef052f04"
        },
        "location": {
            "latitude": 33.46686935424805,
            "longitude": -112.10004425048828,
            "accuracy": null
        },
        "templateId": "04e21b49-f139-4192-b27b-74cc256f9237",
        "templateUrl": "https://api.goformz.com/v2/templates/04e21b49-f139-4192-b27b-74cc256f9237"
    },
    {
        "formId": "82a77c4c-b6eb-4825-8c30-15002f7f4a14",
        "url": "https://api.goformz.com/v2/formz/82a77c4c-b6eb-4825-8c30-15002f7f4a14",
        "name": "Doubletree Canyon HOA - Proposal Request",
        "status": {
            "status": "complete",
            "changeDate": "2023-04-26T19:31:41.0000000+00:00"
        },
        "lastUpdateDate": "2023-04-26T19:33:44.0000000+00:00",
        "assignment": {
            "id": "de0bedf5-f28b-4c79-9c1c-eb0eef052f04",
            "type": "User",
            "url": "https://api.goformz.com/v2/users/de0bedf5-f28b-4c79-9c1c-eb0eef052f04"
        },
        "location": {
            "latitude": 33.46686935424805,
            "longitude": -112.10004425048828,
            "accuracy": null
        },
        "templateId": "04e21b49-f139-4192-b27b-74cc256f9237",
        "templateUrl": "https://api.goformz.com/v2/templates/04e21b49-f139-4192-b27b-74cc256f9237"
    },
    {
        "formId": "fe729b58-5ca2-4cff-b9fd-39962591786e",
        "url": "https://api.goformz.com/v2/formz/fe729b58-5ca2-4cff-b9fd-39962591786e",
        "name": "Cotton Center Maintenance - Proposal Request",
        "status": {
            "status": "complete",
            "changeDate": "2023-04-25T20:10:38.0000000+00:00"
        },
        "lastUpdateDate": "2023-04-25T20:12:41.0000000+00:00",
        "assignment": {
            "id": "28350fd8-f51a-4533-bf06-079581f8507b",
            "type": "User",
            "url": "https://api.goformz.com/v2/users/28350fd8-f51a-4533-bf06-079581f8507b"
        },
        "location": {
            "latitude": 33.46739959716797,
            "longitude": -112.10005187988281,
            "accuracy": null
        },
        "templateId": "04e21b49-f139-4192-b27b-74cc256f9237",
        "templateUrl": "https://api.goformz.com/v2/templates/04e21b49-f139-4192-b27b-74cc256f9237"
    },
    {
        "formId": "914e8f08-9f4e-4164-a028-e23f77fad3e3",
        "url": "https://api.goformz.com/v2/formz/914e8f08-9f4e-4164-a028-e23f77fad3e3",
        "name": "Lone Mountain Preserve - Proposal Request",
        "status": {
            "status": "complete",
            "changeDate": "2023-04-21T19:54:33.0400000+00:00"
        },
        "lastUpdateDate": "2023-04-21T19:54:35.0000000+00:00",
        "assignment": {
            "id": "46def28b-4cea-4a5d-8086-58bd38dfc1a7",
            "type": "User",
            "url": "https://api.goformz.com/v2/users/46def28b-4cea-4a5d-8086-58bd38dfc1a7"
        },
        "location": {
            "latitude": 33.46739959716797,
            "longitude": -112.10027313232422,
            "accuracy": null
        },
        "templateId": "04e21b49-f139-4192-b27b-74cc256f9237",
        "templateUrl": "https://api.goformz.com/v2/templates/04e21b49-f139-4192-b27b-74cc256f9237"
    },
    {
        "formId": "a963d788-5c01-44ea-9cc9-4fd3a3842afa",
        "url": "https://api.goformz.com/v2/formz/a963d788-5c01-44ea-9cc9-4fd3a3842afa",
        "name": "Morning Sun Farms - Proposal Request",
        "status": {
            "status": "complete",
            "changeDate": "2023-04-21T13:22:57.0000000+00:00"
        },
        "lastUpdateDate": "2023-04-21T13:24:59.0000000+00:00",
        "assignment": {
            "id": "28350fd8-f51a-4533-bf06-079581f8507b",
            "type": "User",
            "url": "https://api.goformz.com/v2/users/28350fd8-f51a-4533-bf06-079581f8507b"
        },
        "location": {
            "latitude": 33.46739959716797,
            "longitude": -112.10005187988281,
            "accuracy": null
        },
        "templateId": "04e21b49-f139-4192-b27b-74cc256f9237",
        "templateUrl": "https://api.goformz.com/v2/templates/04e21b49-f139-4192-b27b-74cc256f9237"
    },
    {
        "formId": "17998b5e-e292-4588-a274-e6966645f6ab",
        "url": "https://api.goformz.com/v2/formz/17998b5e-e292-4588-a274-e6966645f6ab",
        "name": "SG Master - Proposal Request",
        "status": {
            "status": "complete",
            "changeDate": "2023-04-20T19:08:14.0000000+00:00"
        },
        "lastUpdateDate": "2023-04-20T19:10:14.0000000+00:00",
        "assignment": {
            "id": "d9414e63-c5ed-46ee-ac57-ac6ab650cdf0",
            "type": "User",
            "url": "https://api.goformz.com/v2/users/d9414e63-c5ed-46ee-ac57-ac6ab650cdf0"
        },
        "location": {
            "latitude": 33.46769714355469,
            "longitude": -112.10010528564453,
            "accuracy": null
        },
        "templateId": "04e21b49-f139-4192-b27b-74cc256f9237",
        "templateUrl": "https://api.goformz.com/v2/templates/04e21b49-f139-4192-b27b-74cc256f9237"
    },
    {
        "formId": "2b4a1fec-e719-4023-a30a-84f1d5a01f2b",
        "url": "https://api.goformz.com/v2/formz/2b4a1fec-e719-4023-a30a-84f1d5a01f2b",
        "name": "Morning Sun Farms - Proposal Request",
        "status": {
            "status": "complete",
            "changeDate": "2023-04-19T16:03:03.0000000+00:00"
        },
        "lastUpdateDate": "2023-04-19T16:05:03.0000000+00:00",
        "assignment": {
            "id": "28350fd8-f51a-4533-bf06-079581f8507b",
            "type": "User",
            "url": "https://api.goformz.com/v2/users/28350fd8-f51a-4533-bf06-079581f8507b"
        },
        "location": {
            "latitude": 33.46739959716797,
            "longitude": -112.10005187988281,
            "accuracy": null
        },
        "templateId": "04e21b49-f139-4192-b27b-74cc256f9237",
        "templateUrl": "https://api.goformz.com/v2/templates/04e21b49-f139-4192-b27b-74cc256f9237"
    },
    {
        "formId": "5779746d-9031-4fa9-a1bf-e95dd4141777",
        "url": "https://api.goformz.com/v2/formz/5779746d-9031-4fa9-a1bf-e95dd4141777",
        "name": "Morning Sun Farms - Proposal Request",
        "status": {
            "status": "complete",
            "changeDate": "2023-04-19T15:58:22.0000000+00:00"
        },
        "lastUpdateDate": "2023-04-19T16:00:22.0000000+00:00",
        "assignment": {
            "id": "28350fd8-f51a-4533-bf06-079581f8507b",
            "type": "User",
            "url": "https://api.goformz.com/v2/users/28350fd8-f51a-4533-bf06-079581f8507b"
        },
        "location": {
            "latitude": 33.46739959716797,
            "longitude": -112.10005187988281,
            "accuracy": null
        },
        "templateId": "04e21b49-f139-4192-b27b-74cc256f9237",
        "templateUrl": "https://api.goformz.com/v2/templates/04e21b49-f139-4192-b27b-74cc256f9237"
    },
    {
        "formId": "26270979-8aff-457d-8527-158327022cda",
        "url": "https://api.goformz.com/v2/formz/26270979-8aff-457d-8527-158327022cda",
        "name": "Wentworth Alameda - Proposal Request",
        "status": {
            "status": "complete",
            "changeDate": "2023-04-17T20:50:35.0000000+00:00"
        },
        "lastUpdateDate": "2023-04-17T20:52:34.0000000+00:00",
        "assignment": {
            "id": "28350fd8-f51a-4533-bf06-079581f8507b",
            "type": "User",
            "url": "https://api.goformz.com/v2/users/28350fd8-f51a-4533-bf06-079581f8507b"
        },
        "location": {
            "latitude": 33.46739959716797,
            "longitude": -112.10005187988281,
            "accuracy": null
        },
        "templateId": "04e21b49-f139-4192-b27b-74cc256f9237",
        "templateUrl": "https://api.goformz.com/v2/templates/04e21b49-f139-4192-b27b-74cc256f9237"
    },
    {
        "formId": "236998ac-2818-4c05-882b-a67669082369",
        "url": "https://api.goformz.com/v2/formz/236998ac-2818-4c05-882b-a67669082369",
        "name": "1515 Wentworth - Proposal Request",
        "status": {
            "status": "complete",
            "changeDate": "2023-04-14T16:35:34.0000000+00:00"
        },
        "lastUpdateDate": "2023-04-14T16:37:31.0000000+00:00",
        "assignment": {
            "id": "28350fd8-f51a-4533-bf06-079581f8507b",
            "type": "User",
            "url": "https://api.goformz.com/v2/users/28350fd8-f51a-4533-bf06-079581f8507b"
        },
        "location": {
            "latitude": 33.46738052368164,
            "longitude": -112.10001373291016,
            "accuracy": null
        },
        "templateId": "04e21b49-f139-4192-b27b-74cc256f9237",
        "templateUrl": "https://api.goformz.com/v2/templates/04e21b49-f139-4192-b27b-74cc256f9237"
    },
    {
        "formId": "9e1cab59-3ae8-42bc-bc94-bada1af449d1",
        "url": "https://api.goformz.com/v2/formz/9e1cab59-3ae8-42bc-bc94-bada1af449d1",
        "name": "SG Clubhouse - Proposal Request",
        "status": {
            "status": "complete",
            "changeDate": "2023-04-11T13:02:20.0000000+00:00"
        },
        "lastUpdateDate": "2023-04-11T13:04:16.0000000+00:00",
        "assignment": {
            "id": "ab33a58e-77ca-4768-8ad0-19f02f9c8f40",
            "type": "User",
            "url": "https://api.goformz.com/v2/users/ab33a58e-77ca-4768-8ad0-19f02f9c8f40"
        },
        "location": {
            "latitude": 33.4671745300293,
            "longitude": -112.1002426147461,
            "accuracy": null
        },
        "templateId": "04e21b49-f139-4192-b27b-74cc256f9237",
        "templateUrl": "https://api.goformz.com/v2/templates/04e21b49-f139-4192-b27b-74cc256f9237"
    },
    {
        "formId": "2bf85901-2a75-4ee5-9182-cfe6f1c0efd4",
        "url": "https://api.goformz.com/v2/formz/2bf85901-2a75-4ee5-9182-cfe6f1c0efd4",
        "name": "Cotton Center Maintenance - Proposal Request",
        "status": {
            "status": "complete",
            "changeDate": "2023-03-27T19:50:53.0000000+00:00"
        },
        "lastUpdateDate": "2023-03-27T19:52:42.0000000+00:00",
        "assignment": {
            "id": "de0bedf5-f28b-4c79-9c1c-eb0eef052f04",
            "type": "User",
            "url": "https://api.goformz.com/v2/users/de0bedf5-f28b-4c79-9c1c-eb0eef052f04"
        },
        "location": {
            "latitude": 33.45320129394531,
            "longitude": -112.13089752197266,
            "accuracy": null
        },
        "templateId": "04e21b49-f139-4192-b27b-74cc256f9237",
        "templateUrl": "https://api.goformz.com/v2/templates/04e21b49-f139-4192-b27b-74cc256f9237"
    },
    {
        "formId": "5aa272ef-ea04-4c45-9d7c-ec8fd7bed855",
        "url": "https://api.goformz.com/v2/formz/5aa272ef-ea04-4c45-9d7c-ec8fd7bed855",
        "name": "Morning Sun Farms - Proposal Request",
        "status": {
            "status": "complete",
            "changeDate": "2023-03-22T20:04:15.0000000+00:00"
        },
        "lastUpdateDate": "2023-03-22T20:06:02.0000000+00:00",
        "assignment": {
            "id": "28350fd8-f51a-4533-bf06-079581f8507b",
            "type": "User",
            "url": "https://api.goformz.com/v2/users/28350fd8-f51a-4533-bf06-079581f8507b"
        },
        "location": {
            "latitude": 33.45320129394531,
            "longitude": -112.13089752197266,
            "accuracy": null
        },
        "templateId": "04e21b49-f139-4192-b27b-74cc256f9237",
        "templateUrl": "https://api.goformz.com/v2/templates/04e21b49-f139-4192-b27b-74cc256f9237"
    },
    {
        "formId": "e2d52be4-6691-44d1-be12-277ed4fd6c4d",
        "url": "https://api.goformz.com/v2/formz/e2d52be4-6691-44d1-be12-277ed4fd6c4d",
        "name": "The HUB Insight Direct - Proposal Request",
        "status": {
            "status": "complete",
            "changeDate": "2023-03-22T18:06:58.0470000+00:00"
        },
        "lastUpdateDate": "2023-03-22T19:14:58.0000000+00:00",
        "assignment": {
            "id": "de525cc7-73d5-4afc-a2ee-5e11902d593c",
            "type": "User",
            "url": "https://api.goformz.com/v2/users/de525cc7-73d5-4afc-a2ee-5e11902d593c"
        },
        "location": {
            "latitude": 33.26840591430664,
            "longitude": -111.79676055908203,
            "accuracy": null
        },
        "templateId": "04e21b49-f139-4192-b27b-74cc256f9237",
        "templateUrl": "https://api.goformz.com/v2/templates/04e21b49-f139-4192-b27b-74cc256f9237"
    },
    {
        "formId": "1b43ec4c-0546-43c2-845f-c8682b4e0b6a",
        "url": "https://api.goformz.com/v2/formz/1b43ec4c-0546-43c2-845f-c8682b4e0b6a",
        "name": "Morning Sun Farms - Proposal Request",
        "status": {
            "status": "complete",
            "changeDate": "2023-03-22T13:50:47.0000000+00:00"
        },
        "lastUpdateDate": "2023-03-22T13:52:33.0000000+00:00",
        "assignment": {
            "id": "28350fd8-f51a-4533-bf06-079581f8507b",
            "type": "User",
            "url": "https://api.goformz.com/v2/users/28350fd8-f51a-4533-bf06-079581f8507b"
        },
        "location": {
            "latitude": 33.45320129394531,
            "longitude": -112.13089752197266,
            "accuracy": null
        },
        "templateId": "04e21b49-f139-4192-b27b-74cc256f9237",
        "templateUrl": "https://api.goformz.com/v2/templates/04e21b49-f139-4192-b27b-74cc256f9237"
    },
    {
        "formId": "96c7afcb-39eb-4880-9b3b-af32723024f8",
        "url": "https://api.goformz.com/v2/formz/96c7afcb-39eb-4880-9b3b-af32723024f8",
        "name": "Morning Sun Farms - Proposal Request",
        "status": {
            "status": "complete",
            "changeDate": "2023-03-22T13:17:23.0000000+00:00"
        },
        "lastUpdateDate": "2023-03-22T13:19:09.0000000+00:00",
        "assignment": {
            "id": "28350fd8-f51a-4533-bf06-079581f8507b",
            "type": "User",
            "url": "https://api.goformz.com/v2/users/28350fd8-f51a-4533-bf06-079581f8507b"
        },
        "location": {
            "latitude": 33.45320129394531,
            "longitude": -112.13089752197266,
            "accuracy": null
        },
        "templateId": "04e21b49-f139-4192-b27b-74cc256f9237",
        "templateUrl": "https://api.goformz.com/v2/templates/04e21b49-f139-4192-b27b-74cc256f9237"
    }
]

export default withAuthUser<FolderPageProps>({
    whenAuthed: AuthAction.RENDER, // Page is rendered, if the user is authenticated
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER, // Shows loader, if the user is not authenticated & the Firebase client JS SDK has not yet initialized.
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN, // Redirect to log-in page, if user is not authenticated
    LoaderComponent: Loader,
})(Folder);