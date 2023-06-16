import React, { FC, Fragment, useState, useEffect } from "react";
import { Box, List, ListItem, IconButton, ListItemText, ListItemSecondaryAction, Stack, Skeleton } from "@mui/material"
import ErrorMessage from "components/ErrorMessage";
import DownloadDialog from "components/DownloadDialog";
import axios from "axios";
import useSWR from "swr";

import Download from "@mui/icons-material/Download";
import { useTabContext } from "@mui/lab";

type FormHistoryProps = { templateId: string, idToken: string | null, };
const FormHistory: FC<FormHistoryProps> = ({ templateId, idToken }) => {

    const [dialog, setDialog] = useState(false);
    const [selectedForm, setSelectedFrom] = useState<string | null>(null);

    // On selectedForm state change, open dialog
    useEffect(() => {
        if (selectedForm) setDialog(true);
    }, [selectedForm]);

    const handleCloseDialog = (formId: string | null) => {
        setDialog(false);
        setSelectedFrom(null);
    }

    const handleSelectForm = (formId: string) => {
        setSelectedFrom(formId);
    }

    const url: string = `api/history`;
    const fetcher = useSWR(idToken ? [url, templateId] : null, (async ([url, templateId]) => {
        return await axios.get(url, {
            baseURL: '/',
            params: { templateId: templateId },
            headers: { Authorization: idToken, }
        })
            .then(res => res.data)
            .catch(e => { console.error(e); throw e });
    }));

    const { data, error, isLoading, isValidating } = fetcher;

    if (isLoading) return <LoadingScreen />
    if (isValidating) return <LoadingScreen />
    if (error) return <ErrorMessage code={error?.code}/>

    return(
        <Box sx={{ width: '100%' }}>
            <List disablePadding>
                {data?.forms.map((i: Form) => (
                    <ListItem key={i.formId}>
                        <ListItemText primary={i.name} secondary={i.status.status}/>
                        <ListItemSecondaryAction onClick={() => handleSelectForm(i.formId)}>
                            <IconButton>
                                <Download color="primary"/>
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
            <DownloadDialog formId={selectedForm} open={dialog} onClose={handleCloseDialog} token={idToken}/>
        </Box>
    );
};

const LoadingScreen: FC = () => {
    return(
        <Box sx={{ width: '100%' }}>
            <Stack spacing={2}>
                <Skeleton variant="rectangular" animation="wave" height={60}/>
                <Skeleton variant="rectangular" animation="wave" height={60}/>
                <Skeleton variant="rectangular" animation="wave" height={60}/>
                <Skeleton variant="rectangular" animation="wave" height={60}/>
                <Skeleton variant="rectangular" animation="wave" height={60}/>
                <Skeleton variant="rectangular" animation="wave" height={60}/>
                <Skeleton variant="rectangular" animation="wave" height={60}/>
                <Skeleton variant="rectangular" animation="wave" height={60}/>
                <Skeleton variant="rectangular" animation="wave" height={60}/>
                <Skeleton variant="rectangular" animation="wave" height={60}/>
            </Stack>
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

export default FormHistory;