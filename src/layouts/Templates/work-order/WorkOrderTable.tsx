import {FC, useMemo } from 'react';
import { Stack, Box, Paper, styled } from '@mui/material';
import { DataGrid, GridColDef, GridColTypeDef } from '@mui/x-data-grid';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    borderColor: theme.palette.grey["400"],
    '& .MuiDataGrid-columnHeader': { backgroundColor: theme.palette.primary.light },
    '& .MuiDataGrid-withBorderColor': { borderColor: theme.palette.grey["400"] }
}))

const usdPrice: GridColTypeDef = {
    type: 'number', flex: 1,
    sortComparator: (v1, v2) => parseInt(v1.replace(/[^0-9.-]+/g,"")) - parseInt(v2.replace(/[^0-9.-]+/g,"")),
};

const matCols: GridColDef[] = [
    { field: 'material', headerName: 'Materials Or Service', flex: 2, sortable: false },
    { field: 'costCode', headerName: 'Cost Code', flex: 1, sortable: false },
    { field: 'unitType', headerName: 'Unit Type', flex: 1, sortable: false, align: 'center' },
    { field: 'quantity', headerName: 'Quantity', type: 'number', flex: 1 },
    { field: 'unitCost', headerName: 'Unit Cost', ...usdPrice },
    { field: 'extension', headerName: 'Extension', ...usdPrice },
];

const labCols: GridColDef[] = [
    { field: 'techName', headerName: 'Technician', flex: 1 },
    { field: 'hours', headerName: 'Hours', flex: 1 },
    { field: 'type', headerName: 'Type', flex: 1 },
    { field: 'rate', headerName: 'Rate', flex: 1 },
    { field: 'total', headerName: 'Total', flex: 1 },
]

type WorkOrderProps = { fields: any }
const WorkOrderTable: FC<WorkOrderProps> = ({ fields }) => {

    if (!fields) return null;

    const matTable = fields?.['Materials Table']?.rows;
    const labTable = fields?.['Labor Table']?.rows;

    const grandTotal = fields?.['Grand Total']?.value;

    const matEntries = Object.entries(matTable).map((i: Record<string, any>) => (
        {
            id: i[0],
            material: i[1].columns['Materials or Service']?.value,
            costCode: i[1].columns['Cost Code']?.text,
            unitType: i[1].columns['Unit Type']?.text,
            quantity: i[1].columns['Quantity']?.value,
            unitCost: i[1].columns['Unit Cost']?.text,
            extension: i[1].columns['Extension']?.text,
        }
    )).filter((i) => (i.extension !== "$0.00"));

    const labEntries = Object.entries(labTable).map((i: Record<string, any>) => (
        {
            id: i[0],
            techName: i[1].columns['Technician Name']?.value,
            hours: i[1].columns['Hours']?.text,
            type: i[1].columns['Type']?.text,
            rate: i[1].columns['Rate']?.value,
            total: i[1].columns['Total']?.text,
        }
    )).filter((i) => (i.total !== "$0.00"))

    return(
        <Stack direction='row' flexWrap='wrap' position='relative' width='100%' sx={{ gap: '1em', my: '1em' }}>

            <StyledDataGrid columns={matCols} rows={matEntries} showColumnVerticalBorder showCellVerticalBorder disableColumnMenu={true} />

            <Stack direction='row' flexWrap='wrap' position='relative' width='100%' sx={{ gap: '1em' }}>

                <StyledDataGrid columns={labCols} rows={labEntries} showColumnVerticalBorder showCellVerticalBorder />

                <Box minWidth={{ xs: '100%', sm: 'calc(33% - 1em)' }} maxWidth={'100%'} position='relative'>
                    {grandTotal}
                </Box>

            </Stack>
        </Stack>
    )
}

export default WorkOrderTable;