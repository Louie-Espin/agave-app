import { FC, Fragment } from "react";
import { Chat } from "@firebaseUtils/client/chatConverter";
import { Avatar, Chip, ListItem, ListItemAvatar, ListItemButton, ListItemText, ListItemButtonProps } from "@mui/material";
import ReplyIcon from "@mui/icons-material/Reply";
import ChatIcon from "@mui/icons-material/Chat";
import GroupIcon from '@mui/icons-material/Group';
import { Timestamp } from "firebase/firestore";
import { formatRelative } from "date-fns";
import { Paragraph } from "components/Typography";

type ChatListItemProps = {
    chat: Partial<Chat>,
    sent: boolean,
    selected: ListItemButtonProps['selected'],
    onClick: ListItemButtonProps['onClick']
}

const ChatListItem: FC<ChatListItemProps> = ({ chat, sent, selected, onClick }) => {

    return(
        <ListItem disablePadding>
            <ListItemButton selected={selected} onClick={onClick}>
                <ListItemAvatar><Avatar sx={{ bgcolor: 'secondary.main' }}><GroupIcon /></Avatar></ListItemAvatar>
                <ListItemText
                    primary={chat?.title ? chat.title : 'Untitled Conversation'}
                    secondary={
                        <Fragment>
                            <Chip size='small' sx={{mr: 1}} icon={sent ? <ReplyIcon/> : <ChatIcon/>}
                                  label={
                                      (chat?.lastMessage?.timestamp instanceof Timestamp)
                                      && formatRelative(chat.lastMessage.timestamp.toDate(), Date.now())
                                  }
                            />
                            <Paragraph color='grey.600' sx={{ display: 'inline-block' }}>
                                {chat?.lastMessage?.text}
                            </Paragraph>
                        </Fragment>
                    }
                />
            </ListItemButton>
        </ListItem>
    )
};

export default ChatListItem;