import { NextPage } from "next";
import { useRouter } from 'next/router'
import { AuthAction, withAuthUser, useAuthUser } from "next-firebase-auth";
import Loader from "components/Loader";
import useSWR from "swr";
import axios from "axios";

type FolderPageProps = { };
const fetcher = (url: string) => axios.get(url).then(res => res.data);
const Folder: NextPage = () => {
    const router = useRouter()
    const { id } = router.query

    // Use a ternary operator to only fetch the data when the ID isn't undefined
    const { data, error } = useSWR(id ? `/api/folders/${id}` : null, fetcher)

    return (
        <p>Folder: {id ?? 'Loading'}</p>
    );
}

export default withAuthUser<FolderPageProps>({
    whenAuthed: AuthAction.RENDER, // Page is rendered, if the user is authenticated
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER, // Shows loader, if the user is not authenticated & the Firebase client JS SDK has not yet initialized.
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN, // Redirect to log-in page, if user is not authenticated
    LoaderComponent: Loader,
})(Folder);