import { NextPage } from "next";

import { useState } from 'react';
import { useAuthUser, withAuthUser, AuthAction } from "next-firebase-auth";
import { getFirestore, collection, doc, addDoc, updateDoc, serverTimestamp, Timestamp, query, orderBy, where, CollectionReference, DocumentReference } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import messageConverter, { NewMessage } from "@firebaseUtils/client/messageConverter";
import chatConverter from "@firebaseUtils/client/chatConverter";

import { Container, Stack, Box } from '@mui/material';
import AuthLayout from "layouts/AuthLayout";
import Loader from "components/Loader";

import ChatInput from "components/Chat/ChatInput";
import ChatLog from "components/Chat/ChatLog";
import ChatHistory from "components/Chat/ChatHistory";
import LocationDialog from "components/Chat/LocationDialog";

type ChatIndexProps = {}
const ChatIndexPage: NextPage<ChatIndexProps> = () => {

    const AuthUser = useAuthUser();

    const [dialog, setDialog] = useState(false);
    const [chatId, setChatId] = useState<string | null>('ACpeKw8eFLcKOdlpIQv5'); // FIXME set to null

    const chatsCol = collection(getFirestore(), 'chats').withConverter(chatConverter);
    const messagesCol = collection(getFirestore(), `chats/${chatId}/messages`).withConverter(messageConverter);

    const toggleConversation = (chatId: string) => { setChatId(chatId) };
    const toggleDialog = (toggle: boolean) => { setDialog(toggle) };
    const handleSend = async (text: string, lat?: number, lng?: number, acc?: number) => {

        if (!AuthUser.id) return console.error('No AuthUser found!');
        if (!chatId) return console.error('No Chat has been selected!');

        const currChatDoc = doc(getFirestore(), 'chats', chatId).withConverter(chatConverter);

        await addMessage({
            sender: AuthUser.id,
            text: text,
            location: (lat && lng && acc) ? { lat: lat, lng: lng, acc: acc } : null,
            timestamp: serverTimestamp(),
        }, messagesCol, currChatDoc);
    }
    const addMessage = async (message: NewMessage, msgCol: CollectionReference, chatDoc: DocumentReference) => {
        try {
            const messageRef = await addDoc(msgCol, {
                ...message,
                timestamp: serverTimestamp()
            } as NewMessage);

            /* FIXME: This should be a Cloud Function, triggered whenever a new Message doc is added */
            await updateDoc(chatDoc, {
                lastMessage: { sender: message.sender, text: message.text, timestamp: Timestamp.now() }
            });
        } catch (e) {
            console.error('An Error occurred while sending message!', e);
        }
    }

    /**
     * queries collection data for the chat history where the current user (AuthUser.id) is a member
     * TODO: Needs Pagination
     **/
    const [chatsData, chatsLoading, chatsError] = useCollectionData(
        (AuthUser.id)
            ? query(chatsCol, where('members', 'array-contains', AuthUser.id))
            : undefined
    );

    /**
     * queries collection data for the messages of currently selected chatId
     * TODO: Needs Pagination
     **/
    const [chatMessages, chatMessagesLoading, chatMessagesError] = useCollectionData(
        (AuthUser.id && chatId)
            ? query(messagesCol, orderBy('timestamp'))
            : undefined
    );

    return(
        <AuthLayout signedIn={!!(AuthUser.id)} displayName={AuthUser.displayName}>
            <Container sx={{ my: 2 }}>
                <Stack direction='row' flexWrap='nowrap' justifyContent='center' sx={{ gap: '1em' }}>
                    <Box flex={'1 0 auto'}>
                        <ChatHistory chats={chatsData} isLoading={chatsLoading} error={chatsError} uid={AuthUser.id}/>
                    </Box>
                    <Box flex={'1 0 auto'}>
                        <ChatLog messages={chatMessages} isLoading={chatMessagesLoading} error={chatMessagesError} uid={AuthUser.id}/>
                        <ChatInput send={handleSend} toggleDialog={toggleDialog} />
                        { dialog && <LocationDialog send={handleSend} toggleDialog={toggleDialog} open={dialog} /> }
                    </Box>
                </Stack>
            </Container>
        </AuthLayout>
    );
}

export default withAuthUser<ChatIndexProps>({
    whenAuthed: AuthAction.RENDER, // Page is rendered, if the user is authenticated
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER, // Shows loader, if the user is not authenticated & the Firebase client JS SDK has not yet initialized.
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN, // Redirect to log-in page, if user is not authenticated
    LoaderComponent: Loader,
})(ChatIndexPage)