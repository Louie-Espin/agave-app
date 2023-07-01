import { getStorage, ref, getDownloadURL } from "firebase/storage";

// Create a reference to the file we want to download
const storage = getStorage();

// Get the download URL
export default async function downloadImage(imgPath: string) {
    let result = null, error = null;

    try {
        
        const imgRef = ref(storage, imgPath)
        result = await getDownloadURL(imgRef);

    } catch (e: any) {

        let errorCode = '???';
        let errorName = 'unknown';
        let errorMessage = 'Unknown Error occurred!';

        if (e?.code) errorCode = e.code;
        if (e?.message) errorMessage = e.message;
        if (e.name) errorName = e.name;

        error = { code: errorCode, name: errorName, message: errorMessage, error: e };
    }

    return { result, error }
}