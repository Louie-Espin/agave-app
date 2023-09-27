import { FC, ChangeEvent } from 'react';

import { Box, TextField, InputAdornment, FormControl, InputLabel, OutlinedInput } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

interface WorkHistorySettingsProps {
    search: string,
    searchControl: (event: ChangeEvent<HTMLInputElement>) => void,
}

const WorkHistorySettings: FC<WorkHistorySettingsProps> = ({search, searchControl}) => {

    return(
        <Box mb={3}>
            <FormControl fullWidth>
                <InputLabel htmlFor="outlined-search">Search</InputLabel>
                <OutlinedInput label='Search' id="outlined-search" sx={{borderRadius: (theme) => theme.spacing(3)}}
                               endAdornment={<InputAdornment position='end'><SearchOutlinedIcon/></InputAdornment>}
                               value={search} onChange={searchControl}
                />
            </FormControl>
        </Box>
    );
}

export default WorkHistorySettings;