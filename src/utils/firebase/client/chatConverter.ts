import {
    DocumentData,
    DocumentReference,
    FirestoreDataConverter,
    QueryDocumentSnapshot, SnapshotOptions,
    Timestamp, FieldValue,
    PartialWithFieldValue
} from "firebase/firestore";


export type Chat = {
    members: string[],
    lastMessage: {
        timestamp: Timestamp | FieldValue,
        text: string,
        sender: string,
    },
    createdBy: string,
    id: string,
    ref: DocumentReference<DocumentData>,
};

export type NewChat = Omit<Chat, 'id' | 'ref'>;

const chatConverter: FirestoreDataConverter<Chat> = {
    toFirestore(chat: PartialWithFieldValue<NewChat>): DocumentData {
        return { members: chat.members, lastMessage: chat.lastMessage, createdBy: chat.createdBy };
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): Chat {
        const data = snapshot.data(options);
        return {
            members: data.members,
            lastMessage: data.lastMessage,
            createdBy: data.createdBy,
            id: snapshot.id,
            ref: snapshot.ref,
        };
    },
};

export default chatConverter;