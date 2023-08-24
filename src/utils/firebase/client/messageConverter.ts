import {
    DocumentData,
    DocumentReference,
    FirestoreDataConverter,
    PartialWithFieldValue,
    QueryDocumentSnapshot,
    SnapshotOptions,
    Timestamp
} from "firebase/firestore";

export type Message = {
    sender: string,
    text: string,
    location?: { lat: number, lng: number, acc: number }
    timestamp: Timestamp | null,
    id: string,
    ref: DocumentReference<DocumentData>,
};

export type NewMessage = Omit<Message, 'id' | 'ref'>;

const messageConverter: FirestoreDataConverter<Message> = {
    toFirestore(message: PartialWithFieldValue<NewMessage>): DocumentData {
        return { sender: message.sender, text: message.text, location: message.location, timestamp: message.timestamp };
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): Message {
        const data = snapshot.data(options);
        return {
            sender: data.sender,
            text: data.text,
            location: data.location,
            timestamp: data.timestamp,
            id: snapshot.id,
            ref: snapshot.ref,
        };
    },
};

export default messageConverter;