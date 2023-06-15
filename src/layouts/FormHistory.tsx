import React, { FC, Fragment, useState } from "react";
import { Box, List, ListItem, IconButton, ListItemText, ListItemSecondaryAction, CircularProgress } from "@mui/material"
import ErrorMessage from "components/ErrorMessage";
import axios from "axios";
import useSWR from "swr";

import Download from "@mui/icons-material/Download";

/** Download Component Declaration **/
type DownLoadActionProps = { formId: string };
const DownLoadAction: FC<DownLoadActionProps> = ({ formId }) => {
    const handleDownload = async () => { console.log('download!', formId) }

    return(
        <ListItemSecondaryAction onClick={handleDownload}>
            <IconButton>
                <Download color="primary"/>
            </IconButton>
        </ListItemSecondaryAction>
    );
}
/** Download Component Declaration END **/

type FormHistoryProps = { title: string, templateId: string, idToken: string | null };
const FormHistory: FC<FormHistoryProps> = ({ title, templateId, idToken }) => {

    const url: string = `api/history`;

    const fetched = useSWR(idToken ? url : null, (async () => {
        return await axios.get(url, {
            baseURL: '/',
            params: { templateId: templateId },
            headers: { Authorization: idToken, }
        })
            .then(res => res.data)
            .catch(e => { console.error(e); throw e });
    }));
    const { data, error, isLoading, isValidating } = fetched;

    if (isLoading) return <CircularProgress />
    if (isValidating) return <CircularProgress />
    if (error) return <ErrorMessage code={error?.code}/>

    return(
        <Box sx={{ width: '100%' }}>
            <List>
                {data?.forms.map((i: Form) => (
                    <ListItem key={i.formId}>
                        <ListItemText primary={i.name} secondary={i.status.status}/>
                        <DownLoadAction formId={i.formId}/>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}

type Form = {
    assignment: { id: string, type: string, url: string }
    formId: string
    lastUpdateDate: string
    location?: { latitude: number, longitude: number, accuracy?: any }
    name: string
    status: { status: string, changeDate: string }
    templateId: string
    templateUrl: string
    url: string
}
const dummyList = [
    { id: 'id-1234-sdhdskfh', title: 'Sample Title', owner: 'Owner' },
    { id: 'id-1234-sdhdskf1', title: 'Sample Title 2', owner: 'Owner 2' },
]

export default FormHistory;