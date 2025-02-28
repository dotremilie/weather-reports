"use client";

import React, {FC, useActionState, useEffect, useState} from "react";
import WeatherReport, {TemperatureUnit} from "@/types/WeatherReport";
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Paper,
    Select,
    SelectChangeEvent,
    Typography
} from "@mui/material";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, {Dayjs} from "dayjs";
import {postReport, putReport} from "@/actions/reports";
import toast from "react-hot-toast";
import {convertTemperature} from "@/lib/temperature";

interface WeatherReportFormProps {
    report?: WeatherReport;
}

const WeatherReportForm: FC<WeatherReportFormProps> = ({report}) => {
    const [city, setCity] = useState(report?.city ?? "");
    const [temperature, setTemperature] = useState(report?.temperature.toString() ?? "");
    const [unit, setUnit] = useState<TemperatureUnit>(report?.unit ?? "K");
    const [date, setDate] = useState<Dayjs | null>(dayjs(report?.date));

    const handleTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Prevent values below absolute zero
        if (unit === "K" && value.startsWith("-")) {
            return;
        } else if (unit === "C" && parseFloat(value) < -273.15) {
            setTemperature("-273.15");
            return;
        } else if (unit === "F" && parseFloat(value) < -459.67) {
            setTemperature("-459.67");
            return;
        }

        // Prevent values above 1000
        if (parseInt(value) > 1000) {
            setTemperature("1000");
            return;
        }

        if (value === "") {
            setTemperature("");
            return;
        }

        if (!(/^(-?\d*\.?\d*)?$/.test(value))) {
            return;
        }

        setTemperature(value);
    }

    const handleBlur = () => {
        if (temperature.endsWith(".")) {
            setTemperature(temperature.slice(0, -1));
        }
    };

    const handleUnitChange = (e: SelectChangeEvent<TemperatureUnit>) => {
        const value = e.target.value as TemperatureUnit;

        setUnit(value);

        if (!temperature) {
            return;
        }

        const newTemperature = convertTemperature(parseFloat(temperature), unit, value);

        setTemperature(newTemperature.toString());
    }

    const [state, dispatch, isPending] = useActionState(async () => {
        // Simulate a delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        try {
            if (temperature === "") {
                throw new Error("Temperature is required");
            }

            if (!date) {
                throw new Error("Date is required");
            }

            if (report?.id) {
                await putReport({id: report.id, city, temperature: parseFloat(temperature), unit, date: date.format("YYYY-MM-DD")});
            } else {
                await postReport({city, temperature: parseFloat(temperature), unit, date: date.format("YYYY-MM-DD")});

                setCity("");
                setTemperature("");
                setDate(dayjs());
            }

            return {
                error: false,
                message: "Report saved successfully!",
            }
        } catch (e) {
            if (typeof e === "string") {
                return {error: true, message: e};
            } else if (e instanceof Error) {
                return {error: true, message: e.message};
            }
        }
    }, null);

    useEffect(() => {
        if (state) {
            if (state.error) {
                toast.error(state.message);
            } else {
                toast.success(state.message);
            }
        }
    }, [state]);

    return (
        <Box>
            <Paper variant="outlined" sx={{padding: 2}}>
                <Typography
                    variant="h6"
                    sx={{mb: 2}}>
                    {report ? "Edit" : "Create"} Weather Report
                </Typography>
                <form className="flex flex-col gap-4" action={dispatch}>
                    <FormControl>
                        <InputLabel htmlFor="city">City</InputLabel>
                        <OutlinedInput
                            label="City"
                            id="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}/>
                    </FormControl>
                    <FormControl>
                        <InputLabel htmlFor="temperature">Temperature</InputLabel>
                        <OutlinedInput
                            label="Temperature"
                            id="temperature"
                            value={temperature}
                            onChange={handleTemperatureChange}
                            onBlur={handleBlur}
                        />
                    </FormControl>
                    <FormControl>
                        <InputLabel id="unit-label">Temperature Unit</InputLabel>
                        <Select
                            labelId="unit-label"
                            label="Temperature Unit"
                            id="unit"
                            value={unit}
                            onChange={handleUnitChange}>
                            <MenuItem value="C">Celsius (°C)</MenuItem>
                            <MenuItem value="F">Fahrenheit (°F)</MenuItem>
                            <MenuItem value="K">Kelvin (°K)</MenuItem>
                        </Select>
                    </FormControl>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker label="Date" value={date} onChange={(value) => setDate(value)}/>
                    </LocalizationProvider>
                    <Button type="submit" variant="contained"
                            disabled={!city || !temperature || !date || isPending}>{isPending ? "Loading" : "Submit"}</Button>
                </form>
            </Paper>
        </Box>
    );
};

export default WeatherReportForm;
