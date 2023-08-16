import {
    DocumentData,
    DocumentReference,
    FirestoreDataConverter,
    WithFieldValue,
    QueryDocumentSnapshot,
    SnapshotOptions,
    Timestamp
} from "firebase/firestore";

export type Message = {
    sender: string,
    text: string,
    timestamp: Timestamp,
    id?: string, // FIXME: ?
    ref?: DocumentReference<DocumentData>, // FIXME: ?
};

const messageConverter: FirestoreDataConverter<Message> = {
    toFirestore(message: WithFieldValue<Message>): DocumentData {
        return { sender: message.sender, text: message.text, timestamp: message.timestamp };
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): Message {
        const data = snapshot.data(options);
        return {
            sender: data.sender,
            text: data.text,
            timestamp: data.timestamp,
            id: snapshot.id,
            ref: snapshot.ref,
        };
    },
};

export default messageConverter;