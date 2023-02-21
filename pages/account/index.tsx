import {Avatar, Box, Card, Container, Divider, Grid, Typography} from "@mui/material";
import { Person } from "@mui/icons-material";
import { Small, H2, H3, H5 } from "components/Typography";
import TableRow from "components/TableRow";
import {format} from "date-fns";

const ProfilePage = () => {
    return(
        <Box height='100%' display='flex' flexDirection='column'>
            <Container sx={{ my: "2rem" }}>
                <Box display='flex' alignItems='center' my={2}>
                    <Person color="primary"/>
                    <H2 ml={1.5} my="0px" lineHeight="1" whiteSpace="pre">
                        Account
                    </H2>
                </Box>

                <Divider sx={{ mb: 4, borderColor: "grey.300" }} />
            </Container>

            <Container>
                <Box mb={4}>
                    <Grid container spacing={3}>
                        <Grid item md={6} xs={12}>
                            <Card
                                sx={{
                                    display: "flex",
                                    p: "14px 32px",
                                    height: "100%",
                                    alignItems: "center",
                                }}
                            >
                                <Avatar src="/assets/images/faces/ralph.png" sx={{ height: 64, width: 64 }} />

                                <Box ml={1.5} flex="1 1 0">
                                    <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                                        <div>
                                            <H5 my="0px">Mike McMahon</H5>
                                            <Box display="flex" alignItems="center">
                                                <Typography color="grey.600">@mike_mcmahon</Typography>
                                            </Box>
                                        </div>

                                        <Typography color="grey.600" letterSpacing="0.2em">
                                            ADMINISTRATOR
                                        </Typography>
                                    </Box>
                                </Box>
                            </Card>
                        </Grid>

                        <Grid item md={6} xs={12}>
                            <Grid container spacing={4}>
                                {infoList.map((item) => (
                                    <Grid item lg={3} sm={6} xs={6} key={item.subtitle}>
                                        <Card
                                            sx={{
                                                height: "100%",
                                                display: "flex",
                                                p: "1rem 1.25rem",
                                                alignItems: "center",
                                                flexDirection: "column",
                                            }}
                                        >
                                            <H3 color="primary.main" my={0} fontWeight={600}>
                                                {item.title}
                                            </H3>

                                            <Small color="grey.600" textAlign="center">
                                                {item.subtitle}
                                            </Small>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Container>

            <Container>
                <TableRow sx={{ p: "0.75rem 1.5rem" }}>
                    <Box display='flex' flexDirection="column" p={1}>
                        <Small color="grey.600" mb={0.5} textAlign="left">
                            First Name
                        </Small>
                        <span>Mike</span>
                    </Box>

                    <Box display='flex' flexDirection="column" p={1}>
                        <Small color="grey.600" mb={0.5} textAlign="left">
                            Last Name
                        </Small>
                        <span>McMahon</span>
                    </Box>

                    <Box display='flex' flexDirection="column" p={1}>
                        <Small color="grey.600" mb={0.5} textAlign="left">
                            Email
                        </Small>
                        <span>mikemcmahon@agave-inc.com</span>
                    </Box>

                    <Box display='flex' flexDirection="column" p={1}>
                        <Small color="grey.600" mb={0.5} textAlign="left">
                            Phone
                        </Small>
                        <span>+1983649392983</span>
                    </Box>

                    <Box display='flex' flexDirection="column" p={1}>
                        <Small color="grey.600" mb={0.5}>
                            Birth date
                        </Small>
                        <span className="pre">{format(new Date(1996 / 11 / 16), "dd MMM, yyyy")}</span>
                    </Box>
                </TableRow>
            </Container>

        </Box>
    );
}

const infoList = [
    { title: '10', subtitle: 'Total Connections' },
    { title: '8', subtitle: 'Requests Fulfilled' },
    { title: '4', subtitle: 'Requests Created' },
    { title: '5', subtitle: 'Feedback Provided' },
];

export default ProfilePage;