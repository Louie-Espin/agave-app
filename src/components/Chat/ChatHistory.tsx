import { FC, Fragment } from 'react';

import { Box, Stack, Divider, Typography, Chip } from '@mui/material';
import { List, ListItem, ListItemButton, ListItemAvatar, Avatar, ListItemText } from '@mui/material';
import { Paragraph } from "components/Typography";
import TitleBar from "components/TitleBar";

import ChatIcon from '@mui/icons-material/Chat';
import ReplyIcon from '@mui/icons-material/Reply';
import { Chat } from "@firebaseUtils/client/chatConverter";
import { FirestoreError, Timestamp } from "firebase/firestore";
import {formatRelative} from "date-fns";

type ChatHistoryProps = { chats?: Chat[], isLoading: boolean, error?: FirestoreError, uid: string | null };
const ChatHistory: FC<ChatHistoryProps> = ({ chats = [], uid }) => {

    return(
        <Stack direction='column' flexWrap='nowrap'>
            <Box p={2}>
                <TitleBar TitleIcon={ChatIcon} Title={'Chat'} />
            </Box>
            <Divider />
            <List>
                {
                    chats.map(chat =>
                        <ChatHistoryItem key={chat.id} lastMessage={chat.lastMessage} title={chat.title}
                                         sent={(chat.lastMessage?.sender) === (uid)}
                        />
                    )
                }
            </List>
        </Stack>
    );
}

const ChatHistoryItem: FC<Partial<Chat> & { sent: boolean }> = ({ lastMessage, sent, title }) => {

    return(
        <ListItem>
            <ListItemButton>
                <ListItemAvatar><Avatar alt={'user'}/></ListItemAvatar>
                <ListItemText
                    primary={title ? title : 'Untitled Conversation'}
                    secondary={
                        <Fragment>
                            <Chip size='small' sx={{mr: 1}} icon={sent ? <ReplyIcon/> : <ChatIcon/>}
                                label={
                                    (lastMessage?.timestamp instanceof Timestamp)
                                    && formatRelative(lastMessage.timestamp.toDate(), Date.now())
                                }
                            />
                            <Paragraph color='grey.600' sx={{ display: 'inline-block' }}>
                                {lastMessage?.text}
                            </Paragraph>
                        </Fragment>
                    }
                />
            </ListItemButton>
        </ListItem>
    )
}

export default ChatHistory;