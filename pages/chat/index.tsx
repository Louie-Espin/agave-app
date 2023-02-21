import { Box, Container, Divider, TextField, } from "@mui/material";
import { H2, H3 } from "components/Typography";
import { ChatBubble, Sms } from "@mui/icons-material"

const ChatPage = () => {
    return(
        <Box height='100%' display='flex' flexDirection='column' justifyContent='space-between'>
            <Container sx={{ my: "2rem" }}>
                <Box display='flex' alignItems='center' my={2}>
                    <ChatBubble color="primary"/>
                    <H2 ml={1.5} my="0px" lineHeight="1" whiteSpace="pre">
                        Chat
                    </H2>
                </Box>

                <Divider sx={{ mb: 4, borderColor: "grey.300" }} />
            </Container>

            <Box display='flex' flexDirection='column' alignItems='center' px={4}>
                <Sms sx={{color: 'rgba(0, 0, 0, 0.54)', fontSize: '3rem'}}/>
                <H3 textAlign='center' sx={{color: 'rgba(0, 0, 0, 0.54)', fontWeight: 600}} >
                    When you start a conversation, your messages will appear here!
                </H3>
            </Box>

            <Container sx={{ my: "2rem" }}>
                <Divider sx={{ mb: 4, borderColor: "grey.300" }} />

                <TextField
                    rows={8}
                    fullWidth
                    multiline
                    sx={{ mb: 4 }}
                    placeholder="Write your message here..."
                />
            </Container>
        </Box>

    );
}

export default ChatPage;