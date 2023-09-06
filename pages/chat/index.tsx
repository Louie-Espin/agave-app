import { NextPage } from "next";

import { useState } from 'react';
import { useAuthUser, withAuthUser, AuthAction } from "next-firebase-auth";
import {
    getFirestore,
    collection,
    doc,
    addDoc,
    updateDoc,
    serverTimestamp,
    Timestamp,
    query,
    orderBy,
    limit,
    where,
    CollectionReference,
    DocumentReference,
    getDocs
} from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import messageConverter, { NewMessage } from "@firebaseUtils/client/messageConverter";
import chatConverter, { NewChat } from "@firebaseUtils/client/chatConverter";
import profileConverter, { Profile } from "@firebaseUtils/client/profileConverter";

import {Container, Stack, Box, IconButton} from '@mui/material';
import AuthLayout from "layouts/AuthLayout";
import Loader from "components/Loader";

import ChatInput from "components/Chat/ChatInput";
import ChatLog from "components/Chat/ChatLog";
import ChatHistory from "components/Chat/ChatHistory";
import LocationDialog from "components/Chat/LocationDialog";
import CreateDialog from "components/Chat/CreateDialog";

import AddIcon from '@mui/icons-material/Add';

type ChatIndexProps = {}
const ChatIndexPage: NextPage<ChatIndexProps> = () => {

    const AuthUser = useAuthUser();

    // Limit state, for pagination
    const [profLimit, setProfLimit] = useState(true);

    const [createDialog, setCreateDialog] = useState(false);
    const [locationDialog, setLocationDialog] = useState(false);
    const [chatId, setChatId] = useState<string | null>('ACpeKw8eFLcKOdlpIQv5'); // FIXME set to null

    const chatsCol = collection(getFirestore(), 'chats').withConverter(chatConverter);
    const messagesCol = collection(getFirestore(), `chats/${chatId}/messages`).withConverter(messageConverter);
    const profilesCol = collection(getFirestore(), 'users').withConverter(profileConverter);

    const toggleNewChat = (toggle: boolean) => { setCreateDialog(toggle) };
    const toggleConversation = (chatId: string) => { setChatId(chatId) };
    const toggleDialog = (toggle: boolean) => { setLocationDialog(toggle) };
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

    /** addMessage: creates a message document **/
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

    /** addChat: creates new Firebase Chat Doc with the given Profile, AuthUser, chatsCol **/
    const addChat = async (prof: Profile): Promise<{ref?: DocumentReference, err?: Error }> => {

        let resObj: {ref?: DocumentReference, err?: Error } = { }

        if (!AuthUser.id) return { ...resObj, err: new Error('Not logged in: No user found!') };
        if (!prof.id) return { ...resObj, err: new Error('No Profile found!') };
        if (prof.id === AuthUser.id) return { ...resObj, err: new Error('That\'s you!') };

        const q = query(chatsCol,
            where('createdBy', '==', AuthUser.id),
            where('members', 'array-contains', prof.id)
        );

        try {
            const prevChats = await getDocs(q);
            if (!prevChats.empty) resObj = { ...resObj, err: new Error('Previous chats found; Creating new chat anyway.') };

            const chat: NewChat = {
                createdBy: AuthUser.id, members: [AuthUser.id, prof.id],
                title: `${AuthUser.displayName} & ${prof.displayName}`, icon: null,
                lastMessage: {
                    sender: AuthUser.id, timestamp: serverTimestamp(),
                    text: `${AuthUser.displayName} started a new chat.`,
                }
            }

            const chatRef = await addDoc(chatsCol, chat);
            resObj = { ...resObj, ref: chatRef }

            toggleConversation(chatRef.id);

        } catch (e: any) {
            if (e instanceof Error) resObj = { ...resObj, err: e }
            else resObj = { ...resObj, err: new Error('Unknown Error occurred!') }
        }

        return resObj;
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

    /** querying data from 'users' collection FIXME: is using ugly conditional limit instead of pagination */
    const [profiles, pLoading, pError] = useCollectionData(
        (AuthUser.id) ? (profLimit) ? query(profilesCol, limit(5)) : query(profilesCol) : undefined
    );

    return(
        <AuthLayout signedIn={!!(AuthUser.id)} displayName={AuthUser.displayName}>
            <Container sx={{ my: 2 }}>
                <Stack direction='row' flexWrap='nowrap' justifyContent='center' sx={{ gap: '1em' }}>
                    <Box flex={'1 0 auto'}>
                        <IconButton onClick={() => toggleNewChat(true)}><AddIcon /></IconButton>
                        <ChatHistory chats={chatsData} isLoading={chatsLoading} error={chatsError} uid={AuthUser.id}/>
                    </Box>
                    <Box flex={'1 0 auto'}>
                        <ChatLog messages={chatMessages} isLoading={chatMessagesLoading} error={chatMessagesError} uid={AuthUser.id}/>
                        <ChatInput send={handleSend} toggleDialog={toggleDialog} />
                        { locationDialog && <LocationDialog send={handleSend} toggleDialog={toggleDialog} open={locationDialog} /> }
                    </Box>
                </Stack>
                <CreateDialog list={profiles} load={pLoading} err={pError} open={createDialog} toggle={toggleNewChat}
                              handleAdd={addChat} limit={profLimit} handleLimit={() => setProfLimit(false)}
                />
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