import { NextPage } from "next";

import { useState } from 'react';
import { useAuthUser, withAuthUser, AuthAction } from "next-firebase-auth";
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, where } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import messageConverter, { NewMessage } from "@firebaseUtils/client/messageConverter";
// import chatConverter from "@firebaseUtils/client/chatConverter"; FIXME

import { Container, Stack, Box } from '@mui/material';
import AuthLayout from "layouts/AuthLayout";
import Loader from "components/Loader";

import ChatInput from "components/Chat/ChatInput";
import ChatLog from "components/Chat/ChatLog";
// import ChatHistory from "components/Chat/ChatHistory"; FIXME
import LocationDialog from "components/Chat/LocationDialog";

type ChatIndexProps = {}
const ChatIndexPage: NextPage<ChatIndexProps> = () => {

    const AuthUser = useAuthUser();

    const [dialog, setDialog] = useState(false);
    const [chatId, setChatId] = useState<string | null>('ACpeKw8eFLcKOdlpIQv5'); // FIXME set to null

    // const historyRef = collection(getFirestore(), 'chats').withConverter(chatConverter); FIXME
    const ref = collection(getFirestore(), `chats/${chatId}/messages`).withConverter(messageConverter);

    const addMessage = async (m: string) => {

        if (!AuthUser.id) return console.error('No AuthUser found!');

        const messageRef = await addDoc(ref, { sender: AuthUser.id, text: m, timestamp: serverTimestamp() } as NewMessage);

        return console.log(messageRef);
    }

    const openDialog = () => { setDialog(true) }
    const closeDialog = async (latitude: number | null, longitude: number | null, accuracy: number | null) => {

        setDialog(false); // FIXME: Should this be called before anything else?

        if (!AuthUser.id) return console.error('No AuthUser found!');
        if (!latitude || !longitude || !accuracy) return console.error('No location data returned.');

        try {
            await addDoc(ref, {
                sender: AuthUser.id,
                text: `Location sent.`,
                location: { lat: latitude, lng: longitude, acc: accuracy },
                timestamp: serverTimestamp()
            } as NewMessage);
        } catch (e) {
            console.error('An Error occurred while sending geo-location!', e);
        }
    }

    /**
     * queries collection data for the chat history where the current user (AuthUser.id) is a member
     * TODO: Needs Pagination
     **/
    // const [hisValues, hisLoading, hisError ] = useCollectionData(
    //     (AuthUser.id)
    //         ? query(historyRef, where('members', 'array-contains', AuthUser.id))
    //         : undefined
    // );

    /**
     * queries collection data for the messages of currently selected chatId
     * TODO: Needs Pagination
     **/
    const [values, loading, error] = useCollectionData(
        (AuthUser.id && chatId)
            ? query(ref, orderBy('timestamp'))
            : undefined
    );

    return(
        <AuthLayout signedIn={!!(AuthUser.id)} displayName={AuthUser.displayName}>
            <Stack direction='row' flexWrap='nowrap' justifyContent='center' sx={{ gap: '1em' }}>
                {/*<ChatHistory chats={hisValues} isLoading={hisLoading} error={hisError} uid={AuthUser.id}/>*/}
                {/*{ hisValues ? JSON.stringify(hisValues) : null }*/}
                <Box>
                    <ChatLog messages={values} isLoading={loading} error={error} uid={AuthUser.id}/>
                    <ChatInput handler={addMessage} openDialog={openDialog}/>
                    { dialog ? <LocationDialog open={dialog} handleClose={closeDialog} /> : null }
                </Box>
            </Stack>
        </AuthLayout>
    );
}

export default withAuthUser<ChatIndexProps>({
    whenAuthed: AuthAction.RENDER, // Page is rendered, if the user is authenticated
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER, // Shows loader, if the user is not authenticated & the Firebase client JS SDK has not yet initialized.
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN, // Redirect to log-in page, if user is not authenticated
    LoaderComponent: Loader,
})(ChatIndexPage)