import React, {FC} from 'react';
import WeatherReport from "@/types/WeatherReport";
import WeatherReportsTable from "@/components/reports/WeatherReportsTable";

const WeatherReports: FC = async () => {
    const data = await fetch('http://localhost:8000/api/reports');
    const reports: WeatherReport[] = await data.json();

    return (
        <WeatherReportsTable reports={reports} />
    );
};

export default WeatherReports;
