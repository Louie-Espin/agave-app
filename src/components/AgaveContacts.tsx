import { FC } from 'react';
import Image, { StaticImageData } from "next/image";

import { Box, BoxProps, Avatar, Paper, Stack, IconButton } from '@mui/material';
import { H3, Span, Small } from 'components/Typography';

// MUI ICONS
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';

// STATIC ASSETS
import scottImage from '@public/assets/images/contacts/scottCosgrove.jpeg'
import justinImage from '@public/assets/images/contacts/justinOrdonez.jpeg'
import jasonImage from '@public/assets/images/contacts/jasonRichard.jpg'
import johnImage from '@public/assets/images/contacts/johnNesteruck.jpeg'
import alexImage from '@public/assets/images/contacts/alexRosales.jpeg'
import kendraImage from '@public/assets/images/contacts/kendraGray.jpg'

interface AgaveContactsProps extends BoxProps { }

const contactsList = [
    {
        name: 'Scott Cosgrove', title: 'Director Of Maintenance, East',
        email: 'scott.cosgrove@agave-inc.com', tel: 6029193353, img: scottImage,
    },
    {
        name: 'Justin Ordonez', title: 'Director Of Maintenance, West',
        email: 'justin.ordonez@agave-inc.com', tel: 6025500293, img: justinImage,
    },
    {
        name: 'Jason Richard', title: 'Director of Arbor',
        email: 'jason.richard@agave-inc.com', tel: 6025508076, img: jasonImage,
    },
    {
        name: 'John Nesteruck', title: 'Director of Enhancements',
        email: 'john.nesteruck@agave-inc.com', tel: 6028097482, img: johnImage,
    },
    {
        name: 'Alexandra Rosales', title: 'Accounts Payable/Billing',
        email: 'Alexandra.rosales@agave-inc.com', tel: 6022541464, img: alexImage,
    },
    {
        name: 'Kendra Gray', title: 'Director of Business Development',
        email: 'kendra.gray@agave-inc.com', tel: 6027392126, img: kendraImage,
    },
]

const AgaveContacts: FC<AgaveContactsProps> = ({ ...rest }) => {

    return(
        <Box overflow='hidden' {...rest}>
            <H3 fontWeight={400} mb={2}>Agave Contacts</H3>
            <Box borderRadius={(theme) => (theme.spacing(3))}
                sx={{
                    display: 'flex', overflow: 'auto', width: '100%', gap: 1,
                    height: { xs: 'auto', md: '40vh' }, flexDirection: {xs: 'row', md: 'column'},
                    scrollSnapType: {xs: 'x mandatory', md: 'y mandatory' },
                    '& > *': { scrollSnapAlign: 'center', cursor: { xs: 'ew-resize', md: 'ns-resize' } },
                    '::-webkit-scrollbar': { display: 'none' }, /* Hide scrollbar for Chrome, Safari and Opera */
                    msOverflowStyle: 'none',  /* IE and Edge */
                    scrollbarWidth: 'none',  /* Firefox */
                }}
            >
                {contactsList.map(({name, title, email, tel, img}) =>
                    <ContactBox key={name} name={name} title={title} email={email} phone={tel} img={img} />
                )}
            </Box>
        </Box>
    );
};

const ContactBox: FC<{name: string, title: string, phone?: number, email?: string, img: StaticImageData}> = (props) => {

    return(
        <Stack direction='column' component={Paper} variant='outlined' borderRadius={(theme) => (theme.spacing(3))} sx={{ p: 2, gap: '1em' }}>
            <Stack direction='row' sx={{ gap: '1em' }} minWidth={'38ch'}>
                <Avatar sx={{ bgcolor: 'primary.main', width: '50px', height: '50px' }}>
                    <Image src={props.img} alt={props.name} fill placeholder='blur' sizes='100px' style={{objectFit: 'cover', objectPosition: 'top'}}/>
                </Avatar>
                <Stack direction='column' justifyContent='flex-start' alignItems='flex-start' gap={'0.2em'}>
                    <Span fontSize={'1rem'} lineHeight={'1.6rem'}>{props.name}</Span>
                    <Small>{props.title}</Small>
                </Stack>
            </Stack>
            <Stack direction='row' justifyContent='flex-end' alignItems='center' gap={'0.2em'}>
                <IconButton aria-label={props.email ?? 'Email Unavailable'} disabled={!props.email}
                            component='a' href={ props.email ? `mailto:${props.email}` : '#'}
                >
                    <EmailOutlinedIcon />
                </IconButton>
                <IconButton aria-label={props.phone ? `${props.phone}` : 'Phone Unavailable'} disabled={!props.phone}
                            component='a' href={ props.phone ? `tel:${props.phone}` : '#'}
                >
                    <LocalPhoneOutlinedIcon />
                </IconButton>
            </Stack>
        </Stack>
    );
}

export default AgaveContacts;