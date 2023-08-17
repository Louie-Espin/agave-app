import { NextPage } from "next";

import { FC, useState } from 'react';
import { useAuthUser, withAuthUser, AuthAction } from "next-firebase-auth";
import { getFirestore, collection, addDoc, Timestamp, query, orderBy } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import messageConverter from "@firebaseUtils/client/messageConverter";

import { Container, Stack, Box } from '@mui/material';
import AuthLayout from "layouts/AuthLayout";
import Loader from "components/Loader";

import ChatInput from "components/Chat/ChatInput";
import ChatLog from "components/Chat/ChatLog";

type ChatIndexProps = {}
const ChatIndexPage: NextPage<ChatIndexProps> = () => {

    const AuthUser = useAuthUser();

    const [chatId, setChatId] = useState<string | null>('ACpeKw8eFLcKOdlpIQv5'); // FIXME set to null


    const ref = collection(getFirestore(), `chats/${chatId}/messages`).withConverter(messageConverter);

    const addMessage = async (m: string) => {

        if (!AuthUser.id) return console.error('No AuthUser found!');

        const messageRef = await addDoc(ref, { sender: AuthUser.id, text: m, timestamp: Timestamp.now() });

        return console.log(messageRef);
    }

    const [values, loading, error] = useCollectionData((AuthUser.id && chatId) ? query(ref, orderBy('timestamp')) : undefined);

    return(
        <AuthLayout signedIn={!!(AuthUser.id)} displayName={AuthUser.displayName}>
            <Container maxWidth='sm'>
                {error && (<strong>Error: {JSON.stringify(error)}</strong>)}
                {loading && (<div>loading</div>) }
                <ChatLog messages={values} isLoading={loading} error={error} uid={AuthUser.id}/>
                <ChatInput handler={addMessage}/>
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