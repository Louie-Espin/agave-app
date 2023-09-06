import { FC, ReactNode } from 'react';
import { Box, BoxProps, Stack, Divider, Paper, Theme, List } from '@mui/material';
import TitleBar from "components/TitleBar";
import ChatIcon from '@mui/icons-material/Chat';
import { FirestoreError } from "firebase/firestore";

interface ChatHistoryProps extends BoxProps {
    isLoading: boolean,
    error?: FirestoreError,
    action: ReactNode,
    children?: ReactNode,
}

const ChatListContainer: FC<ChatHistoryProps> = ({ action, children, ...props }: ChatHistoryProps) => {

    return(
        <Box component={Paper} bgcolor={(theme: Theme) => theme.palette.grey[400]} {...props}>
            <Stack direction='column' flexWrap='nowrap' height={'100%'}>
                <Stack direction='row' justifyContent='space-between' alignItems='center' px={2}>
                    <TitleBar TitleIcon={ChatIcon} Title={'Chats'} flexGrow={0}/>
                    { action }
                </Stack>
                <Divider />
                <List disablePadding sx={{ flexGrow: 1 }}>
                    { children }
                </List>
            </Stack>
        </Box>
    );
}

export default ChatListContainer;