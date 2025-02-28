import React, {FC} from "react";
import WeatherReport from "@/types/WeatherReport";
import {Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography} from "@mui/material";
import {MdDelete, MdEdit} from "react-icons/md";

interface WeatherReportViewProps {
    report: WeatherReport;
}

const WeatherReportView: FC<WeatherReportViewProps> = ({report}) => {
    return (
        <Box>
            <Paper variant="outlined">
                <Typography
                    variant="h6"
                    sx={{padding: 2}}>
                    Weather Report Details
                </Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className={"font-semibold"}>
                                    City
                                </TableCell>
                                <TableCell>
                                    {report.city}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={"font-semibold"}>
                                    Temperature
                                </TableCell>
                                <TableCell>
                                    {report.temperature}&#176;{report.unit}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={"font-semibold"}>
                                    Date
                                </TableCell>
                                <TableCell>
                                    {report.date}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <div className={"flex gap-2 w-full justify-end p-4"}>
                    <Button variant={"contained"} color={"primary"} href={`/reports/${report.id}/edit`} className={"flex gap-2"}>
                        <MdEdit/>
                        Edit
                    </Button>
                    <Button variant={"contained"} color={"error"} className={"flex gap-2"}>
                        <MdDelete/>
                        Delete
                    </Button>
                </div>
            </Paper>
        </Box>
    );
};

export default WeatherReportView;
