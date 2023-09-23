import { FC } from 'react';

import { useToggle } from "hooks/useToggle";
import { Box, BoxProps, Divider, Paper, List } from '@mui/material';
import { Chip, ListItemButton, ListItemAvatar, Avatar, ListItemText, ListItemIcon, Collapse, Stack } from '@mui/material';

import { IconButton } from '@mui/material';

import { H3, Span, Small } from 'components/Typography';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';

interface AgaveContactsProps extends BoxProps {

}

const contactsList = [
    {
        name: 'Scott Cosgrove', title: 'Director Of Maintenance, East',
        email: 'scott.cosgrove@agave-inc.com', tel: 6029193353,
    },
    {
        name: 'Justin Ordonez', title: 'Director Of Maintenance, West',
        email: 'justin.ordonez@agave-inc.com', tel: 6025500293,
    },
    {
        name: 'Jason Richard', title: 'Director of Arbor',
        email: 'jason.richard@agave-inc.com', tel: 6025508076,
    },
    {
        name: 'John Nesteruck', title: 'Director of Enhancements',
        email: 'john.nesteruck@agave-inc.com', tel: 6028097482,
    },
    {
        name: 'Alexandra Rosales', title: 'Accounts Payable/Billing',
        email: 'Alexandra.rosales@agave-inc.com', tel: 6022541464,
    },
    {
        name: 'Kendra Gray', title: 'Director of Business Development',
        email: 'kendra.gray@agave-inc.com', tel: 6027392126,
    },
]

const AgaveContacts: FC<AgaveContactsProps> = ({ ...rest }) => {

    return(
        <Box overflow='hidden' {...rest}>
            <H3 fontWeight={400} mb={2}>Get In Touch</H3>
            <ContactBox name={'Henry Hall'} title={'Account Manager'} email={'henry.hall@agave-inc.com'} phone={6029193353} />
            <Divider sx={{ mt: 3, mb: 2 }}/>
            <H3 fontWeight={400} mb={2}>Agave Contacts</H3>
            <Box borderRadius={(theme) => (theme.spacing(3))} mb={2}
                sx={{
                    display: 'flex', overflow: 'auto', width: '100%', gap: 1,
                    scrollSnapType: 'x mandatory',
                    '& > *': { scrollSnapAlign: 'center', cursor: 'ew-resize' },
                    '::-webkit-scrollbar': { display: 'none' }, /* Hide scrollbar for Chrome, Safari and Opera */
                    '-ms-overflow-style': 'none',  /* IE and Edge */
                    'scrollbar-width': 'none',  /* Firefox */
                }}
            >
                {contactsList.map(({name, title, email, tel}) =>
                    <ContactBox key={name} name={name} title={title} email={email} phone={tel} />
                )}
            </Box>
        </Box>
    );
};

const ContactBox: FC<{name: string, title: string, phone?: number, email?: string}> = (props) => {

    return(
        <Stack direction='column' component={Paper} variant='outlined' borderRadius={(theme) => (theme.spacing(3))} sx={{ p: 2, gap: '1em' }}>
            <Stack direction='row' sx={{ gap: '1em' }} minWidth={'38ch'}>
                <Avatar sx={{ bgcolor: 'primary.main', width: '50px', height: '50px' }}>{props.name.charAt(0)}</Avatar>
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