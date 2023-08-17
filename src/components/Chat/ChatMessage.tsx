import { FC } from "react";
import { Box, Stack, styled } from "@mui/material";
import { Small } from "components/Typography";
import { formatRelative } from 'date-fns'
import { Timestamp } from "firebase/firestore";

const MessageBox = styled(Box)(({theme}) => ({

    padding: theme.spacing(1),
    margin: `${theme.spacing(0.25)} 0px`,
    width: 'fit-content', minWidth: '30ch',

    '&.sender': { backgroundColor: theme.palette.primary.light, alignSelf: 'flex-end' },
    '&.recipient': { backgroundColor: theme.palette.grey["400"], alignSelf: 'flex-start' },

    /* Targets a sender element that is NOT preceded by other sender elements */
    '&.sender:not(.sender+.sender)': {
        marginTop: theme.spacing(1.5), borderTopRightRadius: '5px', borderTopLeftRadius: '5px'
    },
    /* Targets a sender element that does NOT precede another sender element */
    '&.sender:not(:has(+ .sender))': {
        marginBottom: theme.spacing(1.5), borderBottomRightRadius: '5px', borderBottomLeftRadius: '5px'
    },

    /* Targets a recipient element that is NOT preceded by other recipient elements */
    '&.recipient:not(.recipient+.recipient)': {
        marginTop: theme.spacing(1.5), borderTopRightRadius: '5px', borderTopLeftRadius: '5px'
    },
    /* Targets a recipient element that does NOT precede another recipient element */
    '&.recipient:not(:has(+ .recipient))': {
        marginBottom: theme.spacing(1.5), borderBottomRightRadius: '5px', borderBottomLeftRadius: '5px'
    },

}));

type ChatMessageProps = { text: string, isSender: boolean, timestamp: Timestamp | null };

const ChatMessage: FC<ChatMessageProps> = ({ text, isSender, timestamp }) => {
    return(
        <MessageBox className={ isSender ? 'sender' : 'recipient'}>
            {/* TODO: add timestamp, sender name, and maybe sender avatar */}

            { text }

            <Stack direction='row' justifyContent='flex-end'>
                <Small color='grey.600' fontSize='smaller'>
                    {timestamp ? formatRelative(timestamp.toDate(), Date.now()) : 'sending...'}
                </Small>
            </Stack>
        </MessageBox>
    )
}

export default ChatMessage;