import { FC, useState, useEffect } from 'react';
import { ImageListItem } from '@mui/material';
import axios from "axios";

import { AuthUserContext } from "next-firebase-auth";

import Loading from '@public/assets/images/loading.gif';

type WorkOrderImageProps = {
    imgId: string,
    imageFile: { id: string, link: string },
    user: AuthUserContext
}


const WorkOrderImage: FC<WorkOrderImageProps> = ({ imgId, imageFile, user }) => {

    const url = `api/history/image`;
    const [imgUrl, setImgUrl] = useState<string | null>(null);

    useEffect(() => {
        if (imgUrl || !user.id) return;

        const fetchLink = async () => {
            try {
                const token = await user.getIdToken();
                const { data: res } = await axios.get(url, {
                    baseURL: '/', headers: { Authorization: token }, params: { imgId: imageFile.id }
                });
                console.log(res);
                setImgUrl(res['imgLink'] as string ?? '');
            } catch (error) {
                console.error(error)
            }
        };

        if (!imgUrl) fetchLink();

    }, [url, user, imgUrl, imageFile]);

    return(
        <ImageListItem>
            <img src={imgUrl ? imgUrl : Loading.src} alt={`Work Order Image ID: ${imgId}`} />
        </ImageListItem>
    );
}

export default WorkOrderImage;