import firebaseClient from "@firebaseUtils/firebaseClient";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";

const auth = getAuth(firebaseClient);

export default async function signIn(email: string, password: string) {
    let result = null, error = null;

    try {
        result = await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
        error = e;
    }

    return { result, error };
}
