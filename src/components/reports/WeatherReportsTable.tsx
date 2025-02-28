"use client"

import WeatherReport, {TemperatureUnit} from "@/types/WeatherReport";
import {ChangeEvent, FC, useMemo, useState} from "react";
import {MdDelete, MdEdit} from "react-icons/md";
import {convertTemperature} from "@/lib/temperature";
import {
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Toolbar,
    Typography
} from "@mui/material";
import FiltersPopover from "@/components/reports/FiltersPopover";
import {useRouter} from "next/navigation";

type Order = 'asc' | 'desc';

interface ReportListParams {
    reports: WeatherReport[];
}

interface HeadCell {
    id: keyof WeatherReport;
    label: string;
}

const headCells: HeadCell[] = [
    {id: 'city', label: 'City'},
    {id: 'temperature', label: 'Temperature'},
    {id: 'date', label: 'Date'},
];

export const WeatherReportsTable: FC<ReportListParams> = ({reports}) => {
    //#region State

    const [order, setOrder] = useState<Order>('desc');
    const [orderBy, setOrderBy] = useState<keyof WeatherReport>('date');
    const [cityFilter, setCityFilter] = useState<string | 'all'>('all');
    const [unit, setUnit] = useState<TemperatureUnit | 'default'>('K');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    //#endregion

    //#region Data Mutation

    const cities = Array.from(new Set(reports.map((report) => report.city)));

    const sortedReports = reports.sort((a, b) => {
        if (a[orderBy] === b[orderBy]) {
            return 0;
        }

        if (order === 'asc') {
            if (orderBy === 'temperature') {
                return convertTemperature(a.temperature, a.unit, 'K') > convertTemperature(b.temperature, b.unit, 'K') ? 1 : -1;
            }

            return a[orderBy] > b[orderBy] ? 1 : -1;
        } else {
            if (orderBy === 'temperature') {
                return convertTemperature(a.temperature, a.unit, 'K') < convertTemperature(b.temperature, b.unit, 'K') ? 1 : -1;
            }

            return a[orderBy] < b[orderBy] ? 1 : -1;
        }
    });

    const filteredReports = sortedReports.filter((report) => report.city === cityFilter || cityFilter === 'all');

    const visibleReports = useMemo(
        () => [...filteredReports].slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [filteredReports, page, rowsPerPage],
    );

    //#endregion

    //#region Handlers

    const handleSort = (property: keyof WeatherReport) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    }

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    //#endregion

    const isSorted = (property: keyof WeatherReport) => property === orderBy;

    const renderTemperature = (report: WeatherReport) => {
        if (unit === 'default') {
            return `${report.temperature}°${report.unit}`;
        }

        return `${convertTemperature(report.temperature, report.unit, unit)}°${unit}`;
    }

    const router = useRouter();

    return (
        <Paper variant={'outlined'}>
            <Toolbar
                sx={{pl: {sm: 2}, pr: {xs: 1, sm: 1}}}>
                <Typography
                    sx={{flex: '1 1 100%'}}
                    variant="h6"
                    id="tableTitle"
                    component="div">
                    Weather Reports
                </Typography>
                <FiltersPopover initialFilter={cityFilter} onChange={(filter) => setCityFilter(filter)}
                                cities={cities}/>
            </Toolbar>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {headCells.map((headCell) => (
                                <TableCell
                                    className={'font-semibold'}
                                    key={headCell.id}
                                    sortDirection={orderBy === headCell.id ? order : false}>
                                    <TableSortLabel
                                        active={isSorted(headCell.id)}
                                        direction={orderBy === headCell.id ? order : 'asc'}
                                        onClick={() => handleSort(headCell.id)}>
                                        {headCell.label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                            <TableCell className={'font-semibold'}>
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {visibleReports.map((report) => (
                            <TableRow
                                hover
                                role="link"
                                key={report.id}
                                onClick={() => router.push(`/reports/${report.id}`)}>
                                <TableCell>{report.city}</TableCell>
                                <TableCell>{renderTemperature(report)}</TableCell>
                                <TableCell>{report.date}</TableCell>
                                <TableCell>
                                    <IconButton href={`/reports/${report.id}/edit`}>
                                        <MdEdit/>
                                    </IconButton>
                                    <IconButton color='error'>
                                        <MdDelete/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className={'p-4 flex justify-between'}>
                <div className={'flex items-center gap-2'}>
                    <InputLabel id={'unit-filter-label'}>Temperature Unit</InputLabel>
                    <Select
                        labelId={'unit-filter-label'}
                        id='unit-filter'
                        value={unit}
                        onChange={(e) => setUnit(e.target.value as TemperatureUnit | 'default')}>
                        <MenuItem value='default'>Default</MenuItem>
                        <MenuItem value='C'>Celsius (°C)</MenuItem>
                        <MenuItem value='F'>Fahrenheit (°F)</MenuItem>
                        <MenuItem value='K'>Kelvin (°K)</MenuItem>
                    </Select>
                </div>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredReports.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>
        </Paper>
    )
};

export default WeatherReportsTable;
