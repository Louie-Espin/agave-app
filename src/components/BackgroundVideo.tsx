import { FC } from "react";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material"

const FullScreenVideo = styled('video')({
    width: '100%',
    objectFit: 'contain'
});

type BackgroundVideoProps = {
    source: string;
    coverAlpha?: number;
    elementId?: string;
}

const BackgroundVideo: FC<BackgroundVideoProps> = (props, context) => {
    const { elementId, source, coverAlpha = 0, children} = props;

    return (
        <Box id={elementId ?? ""} sx={{ display: 'block', position: 'relative' }}>
            <FullScreenVideo src={source} autoPlay playsInline loop muted/>
            <Box sx={
                {
                    width: '100%', height: '100%',
                    position: 'absolute',
                    top: '0%', left: '0%', bottom: '0%', right: '0%',
                    backgroundColor: `rgba(0, 0, 0, ${coverAlpha})`
                }
            }>
                {children}
            </Box>
        </Box>
    );
}

export default BackgroundVideo;